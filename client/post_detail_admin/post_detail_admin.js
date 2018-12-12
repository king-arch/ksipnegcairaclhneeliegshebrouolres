
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Base64 } from 'meteor/ostrio:base64';

import { Hub } from './../../import/collections/insert.js';
import { UserInfo } from './../../import/collections/insert.js';
import { Like } from './../../import/collections/insert.js';
import { Blog } from './../../import/collections/insert.js';

import { Comment } from './../../import/collections/insert.js';
import { FriendRequest } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';
import { UserGroup } from './../../import/collections/insert.js';
import { PollOption } from './../../import/collections/insert.js';
import { AbusiveContent } from './../../import/collections/insert.js';



Template.post_detail_admin_center.onRendered(function() {
  Meteor.subscribe("fetch_abusive_content");

  // setTimeout(function(){
		// highlight(document.getElementById(Session.get("current_post_id")));
  // },4000);

});

function highlight(el, durationMs) { 
  console.log("starting highlighting " +Session.get("current_post_id"));
  el = $(el);
  el.addClass('highlighted');
  setTimeout(function() {
    el.removeClass('highlighted')
  }, durationMs || 1000);
}


Template.registerHelper("check_for_abusive_comment_id_with_comment_id",function(comment_id){

	if(comment_id == Session.get("current_post_id")){
		console.log("inside");
		var abusiveContent = AbusiveContent.find({post_id:Session.get("current_post_id")}).count()
		return  abusiveContent != 0;		
	}

	//var abusiveContent = AbusiveContent.find({post_id:comment_id}).count()
		// return  abusiveContent != 0;
})


Template.post_detail_admin_center.helpers({
  post_deleted(){
    return Session.get("post_deleted");
  },
	current_post_id(){
		return Session.get("current_post_id");
	},
    check_summary_for_br_tag(){
      var discussion_detail =this.post_text;
      if(discussion_detail.includes('<br/>') ){
          return true;
      }
      else{
        return false; 
      }
  },

  BreakAsArray(){
    var discussion_detail = this.post_text;
    discussion_detail = discussion_detail.substring(0,400);
    var new_discussion_detail = discussion_detail.split("<br/>");
    console.log('new_discussion_detail: ');
    console.log(new_discussion_detail);
    var discussion_detail_array =new Array();
    for(var i=0;i<new_discussion_detail.length;i++){

     discussion_detail_array.push({tag:new_discussion_detail[i]})
    }
    return discussion_detail_array;
  },

  BreakAsArrayfull(){
    var discussion_detail = this.post_text;
    // discussion_detail = discussion_detail.substring(0,400);
    var new_discussion_detail = discussion_detail.split("<br/>");
    console.log('new_discussion_detail: ');
    console.log(new_discussion_detail);
    var discussion_detail_array =new Array();
    for(var i=0;i<new_discussion_detail.length;i++){

     discussion_detail_array.push({tag:new_discussion_detail[i]})
    }
    return discussion_detail_array;
  },
  

  featured_title_truncated(featured_title){
    var title = featured_title;
    if(title.length>30){ 
    return title.substring(0,30)+ " ...";
    }else{
      return title;
    }
  },

  fetch_blog_information(){
        var mydate=new Date();         
        var str=moment(mydate).format('YYYY-MM-DD');   
        var all_friends_array= new Array();
        var currentUser = Session.get("userId");
        var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();
           for(var i=0;i<allFriends.length;i++){
            if(allFriends[i].sent_to == currentUser){
                all_friends_array.push(allFriends[i].sent_by);
            }else{
                all_friends_array.push(allFriends[i].sent_to);
            } 
            }
          all_friends_array.push(currentUser);
          var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }} ,{Blog_publish_date:{$lte:str}}]}).fetch();
          // var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }}]}).fetch();
          // console.log(published_by_me);
          return published_by_me;
  },

       show_more_comment_reply(){
      var comment_by = Session.get("userId");
      var discussion_id = Session.get("show_discussion_id");

      Meteor.subscribe("comments_based_on_discussions",discussion_id,this.comment_id);
      var result_count = Comment.find({discussion_id: discussion_id, comment_type: 'Discussion_reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: 1}}).count()
      // console.log(result_count);
      // return result_count;

      if(result_count > 3){
        return true;
      }     
      else{
        return false;
      }
     },

           show_limit_comment_reply(){
      const t = Template.instance();
     

      if( t.reply_comment_show_limit.get() == ""){
        return true;
      }     
      else{
        return false;
      }
     },


       fetch_hub_posting(){
      var post_id = Session.get("post_id");
       /* var hubdata = Hub.find({post_creator_id: { $in:  Session.get("user_friends_data")  } , 
                  postActivityStatus: {$ne: 0} },{sort: {post_created_time: -1},limit: post_show_limit*5  }).fetch()*/  
          var   hubdata=Hub.find({"post_id":post_id},{sort: {post_created_time: -1}}).fetch()
          if(hubdata[0]!=null) {
            Session.set("post_deleted",hubdata[0].postActivityStatus == 0)
          }
// POst type Blog
var mydate=new Date();  
 var str=moment(mydate).format('YYYY-MM-DD');   
       
          

     var final_data = new Array();   

    for(var i=0;i<hubdata.length;i++){

     if(hubdata[i].post_type == "new_blog"){
          Meteor.subscribe("blog_information_based_on_blog_id",hubdata[i].post_id);
          var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:hubdata[i].post_id},{blog_creator_id:{ $in:  Session.get("user_friends_data")  }} ,{Blog_publish_date:{$lte:str}}]}).fetch();
          
            var complete_blog_data = new Array();
          if(published_by_me[0]){
            var userId = published_by_me[0].blog_creator_id;
             Meteor.subscribe("user_info_based_on_id",userId);
             var userInfo = UserInfo.find({"user_id":userId}).fetch();
             if(userInfo[0]){
                  complete_blog_data.push({
                  blog_id : published_by_me[0].blog_id,
                  blog_title : published_by_me[0].blog_title,
                  blog_image : published_by_me[0].blog_image,
                  Blog_publish_date : published_by_me[0].Blog_publish_date,
                  name : userInfo[0].name,
                  user_id : userInfo[0].user_id,
                  headline : userInfo[0].headline,
                  profile_pic : userInfo[0].profile_pic,
                })    
             }
           }
      }
      else if(hubdata[i].post_type == "new_event"){
           Meteor.subscribe("event_based_on_event_id",hubdata[i].post_id);
          var published_by_me = Event.find({ event_id:hubdata[i].post_id, event_admin: {$in:  Session.get("user_friends_data")  } }, {event_start_date:{$lte:str} }).fetch();
          
          var complete_event_data = new Array();
          if(published_by_me[0]){
            var userId = published_by_me[0].event_admin;
             Meteor.subscribe("user_info_based_on_id",userId);
             var userInfo = UserInfo.find({"user_id":userId}).fetch();
             if(userInfo[0]){
                  complete_event_data.push({
                  event_name: published_by_me[0].event_name,
                  event_id : published_by_me[0].event_id,
                  event_cover_image : published_by_me[0].event_cover_image,
                  event_start_date : published_by_me[0].event_start_date,
                  name : userInfo[0].name,
                  user_id : userInfo[0].user_id,
                  headline : userInfo[0].headline,
                  profile_pic : userInfo[0].profile_pic,
                })    
             }
          
            }
          }
       var userId= hubdata[i].post_creator_id;
       Meteor.subscribe("user_info_based_on_id",userId);
        var get_user_information = UserInfo.find({"user_id":userId}).fetch();
     
      // }/=
      if(get_user_information[0]){
      final_data.push({
              post_id:hubdata[i].post_id,
              post_text:hubdata[i].post_text,
              post_image_url:hubdata[i].post_image_url,
              featured_image:hubdata[i].featured_image,
              featured_title:hubdata[i].featured_title,
              source:hubdata[i].source,
              posted_url:hubdata[i].posted_url,
              post_creator_id:hubdata[i].post_creator_id,
              post_type:hubdata[i].post_type,
              all_commentators:hubdata[i].all_commentators,
              post_status:hubdata[i].post_status,
              postActivityStatus:hubdata[i].postActivityStatus,
              commenting_status: hubdata[i].commenting_status,
              post_created_time: hubdata[i].post_created_time,
              post_commentators:hubdata[i].post_commentators,
              fetch_blog_information: complete_blog_data,
              fetch_event_information: complete_event_data,
              user_information:get_user_information
      });
  
      }
      
    }
            
   // console.log(hubdata);

 

    return final_data; 
  
  },

  // fetch_hub_posting(){
  //   const post_show_limit = Session.get("pagination"); 
  //   var all_friends_array= new Array();
  //   var currentUser = Session.get("userId");
  //  var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();

  //  for(var i=0;i<allFriends.length;i++){
  //   if(allFriends[i].sent_to == currentUser){
  //       all_friends_array.push(allFriends[i].sent_by);
  //   }else{
  //       all_friends_array.push(allFriends[i].sent_to);
  //   }
  //  }
  //  all_friends_array.push(currentUser);
  
  //   if(currentUser != 'user_admin'){

  //  var include_admin = 'user_admin';
  //  all_friends_array.push(include_admin);
  //  }

  //  // console.log(all_friends_array);
  //   var hubdata = Hub.find({post_creator_id: { $in:  all_friends_array  } , 
  //                 postActivityStatus: {$ne: 0} },{sort: {post_created_time: -1},limit: post_show_limit*20  }).fetch()
  //  // console.log(hubdata);


  //     $("#show_more_"+this.post_id).removeClass("loader_visiblity_block");


  //   return hubdata; 
  // },
  /*formatted_post_text(){
    return post_text;
    var post_text = this.post_text;
   
      var all_posts =  post_text.split("<br>"); 
      var post_array = new Array();
      for(var i=0;i<all_posts.length;i++){
        post_array.push({tag:all_posts[i]});
      }
    return post_array;
     // return html(post_text);
  },post_length_less_than_400(post_text){
     if(post_text.length > 400){
        return true;
     }else{
        return false;
     }
  },read_more_character_length(){
    var all_posts =  this.post_text.substring(0,400);
     
     var all_posts =  all_posts.split("<br>"); 
      
      var post_array = new Array();
      for(var i=0;i<all_posts.length;i++){
        post_array.push({tag:all_posts[i]});
      }

    return post_array;
  },*/
  formatted(post_text){
    // return post_text;
 return post_text.replace('', '');
 // return html(post_text);
  },post_length_less_than_400(post_text){
     if(post_text.length > 400){
        return true;
     }else{
        return false;
     }
  },

  read_more_character_length(post_text){
    return post_text.substring(0,400);
  },

  get_user_information(){
      var userId= this.post_creator_id;
      Meteor.subscribe("user_info_based_on_id",userId);
     var userInfo = UserInfo.find({"user_id":userId}).fetch();
     return userInfo;
  },

  get_blog_creator_information(){
      var userId= this.blog_creator_id;
      // var data = JSON.stringify(this);
      // console.log(data);
      Meteor.subscribe("user_info_based_on_id",userId);
     var userInfo = UserInfo.find({"user_id":userId}).fetch();
     return userInfo;
  },

  get_event_creator_information(){
    // alert('inside helper');
      var userId= this.event_admin;
      // var data = JSON.stringify(this);
      // console.log(data);
      // alert(userId);
      Meteor.subscribe("user_info_based_on_id",userId);
     var userInfo = UserInfo.find({"user_id":userId}).fetch();
     return userInfo;
  },
  
  fetch_event_information(){
         var mydate=new Date();         
        var str=moment(mydate).format('YYYY MM DD');   
        var all_friends_array= new Array();
        var currentUser = Session.get("userId");
        var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] },
         { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();

        // alert(JSON.stringify(allFriends));
           for(var i=0;i<allFriends.length;i++){
            if(allFriends[i].sent_to == currentUser){
                all_friends_array.push(allFriends[i].sent_by);
            }else{
                all_friends_array.push(allFriends[i].sent_to);
            } 
            }
          all_friends_array.push(currentUser);
          // all_friends_array = all_friends_array.toString();
           // alert(JSON.stringify(all_friends_array));
          var published_by_me = Event.find({ event_id:this.post_id, event_admin: {$in:  all_friends_array  } }, {event_start_date:{$lte:str} }).fetch();
          // var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }} ,{Blog_publish_date:{$lte:str}}]}).fetch();
          
          // console.log(published_by_me);
           // alert(JSON.stringify(published_by_me));
          return published_by_me;
  },

    changeDateFormat(Blog_publish_date){
    var date = new Date(Blog_publish_date);
    var formatted = moment(date).format('MMM D,  YYYY');
    return formatted;
  },
  check(data){
    var data = JSON.stringifyaa(data);
    // console.log(data);
  },
   calculate_time_difference(a){
    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);
   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + 'm';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + 'h';
        }else{ 
        return Math.floor(hours) + 'h';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +"d";
    }else{
    return Math.floor(days) +"d";
    }
  }
  else{    
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
  }
  // return "Ankit";
},
check_for_user_already_liked(){
      var liked_by = Session.get("userId");
      Meteor.subscribe("like_based_on_post_id",this.post_id)
        var result = Like.find({post_id: this.post_id, liked_by: liked_by}).count();
        if(result > 0){
              return 'Liked';
        }
        else{
            return 'Like';
        }
},
total_liked_on_post(post_id){
      Meteor.subscribe("like_based_on_post_id",post_id)
var result = Like.find({post_id: post_id}).count();
return result;  
},
check_for_edited(comment_id){
  Meteor.subscribe("comment_based_comment_id",comment_id);
    var commentedComment = Comment.find({comment_id: comment_id,commentActivityStatus: 0}).fetch()
    if(commentedComment[0] && commentedComment[0].editedAt)
    {
      return true;
    }
  },
check_if_commented_by_is_user(comment_by){
    if(Session.get("userId") == comment_by){
      return true;
    }

},
    check_if_post_by_is_user(user_id){
      // alert('cool');
    if(Session.get("userId") == user_id){
      return true;
    }
  },




get_all_commented_users_information(){
  Meteor.subscribe("comment_based_on_post_id",this.post_id);
    var result = Comment.find({post_id: this.post_id, comment_type: 'hub_orignal',commentActivityStatus: 0},{sort: {createdAt:-1} , limit: 5}).fetch().reverse();
      return result;
},
get_all_commented_users_information_count(){
  Meteor.subscribe("comment_based_on_post_id",this.post_id);
    var result = Comment.find({post_id: this.post_id, comment_type: 'hub_orignal',commentActivityStatus: 0}).fetch();
      return result.length;
},
check_for_load_more_comments(){
  Meteor.subscribe("comment_based_on_post_id",this.post_id);
  var result = Comment.find({post_id: this.post_id, comment_type: 'hub_orignal',commentActivityStatus: 0}).fetch();
      if(result.length>5){
      return "Previous comments";  
      }
},
get_commentator_information(){
     var userId= this.comment_by;
     Meteor.subscribe("user_info_based_on_id",userId);
     var userInfo = UserInfo.find({"user_id":userId}).fetch();
     return userInfo;
},
get_commentator_profile_pic(user_id){
  Meteor.subscribe("user_info_based_on_id",user_id);
   var userInfo = UserInfo.find({"user_id":user_id}).fetch();
   if(userInfo[0]){
    return userInfo[0].profile_pic;
  }  
},
get_commentator_user_name(user_id){
  Meteor.subscribe("user_info_based_on_id",user_id);
   var userInfo = UserInfo.find({"user_id":user_id}).fetch();
   if(userInfo[0]){
    return userInfo[0].name;  
   }
},
show_comment_reply(){
      // var data = JSON.stringify(this);
      // console.log(data)
       Meteor.subscribe("comment_reply_based_on_post_id",this.post_id, this.comment_id);
      var result = Comment.find({post_id: this.post_id, comment_type: 'hub_reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch().reverse();
      return result;
     },
     show_comment_reply_count(){
        Meteor.subscribe("comment_reply_based_on_post_id",this.post_id, this.comment_id);
      var result = Comment.find({post_id: this.post_id, comment_type: 'hub_reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch()
      return result.length;

     },
     fetch_count_total_level_zero_comments(post_id){
       Meteor.subscribe("comment_based_on_post_id",post_id);
      var result = Comment.find({post_id: post_id, comment_type: 'hub_orignal',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch();
      return result.length; 
     },
     check_for_user_liked_on_level_one_comments(){
      var post_id="like_child_1_"+this.comment_id;
    var liked_by = Session.get("userId");
         Meteor.subscribe("like_based_on_post_id",post_id)
     var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
      if(result==0){
      return "Like";  
      }else{
      return "Liked";  
      }
    },
      count_for_user_liked_on_level_one_comments(){
      var post_id="like_child_1_"+this.comment_id;
       // var liked_by = Session.get("userId");
            Meteor.subscribe("like_based_on_post_id",post_id)
      var result = Like.find({post_id: post_id}).count();
      return result;        
      },check_for_user_liked_on_level_two_comments(){
      var post_id="like_child_2_"+this.comment_id;
       var liked_by = Session.get("userId");
            Meteor.subscribe("like_based_on_post_id",post_id)
      var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
      if(result==0){
      return "Like";  
      }else{
      return "Liked";  
      }
      },count_for_user_liked_on_level_two_comments(){
      var post_id="like_child_2_"+this.comment_id;
      // var liked_by = Session.get("userId");
           Meteor.subscribe("like_based_on_post_id",post_id)
      var result = Like.find({post_id: post_id}).count();
      return result;        
      },
      fetch_all_liked_users(){
        var postId = Session.get("currentPostId");
             Meteor.subscribe("like_based_on_post_id",postId)
      var result = Like.find({post_id: postId}).fetch();
      Session.set("total_likes_count_on_post",result.length);
      // var t = Template.instance();
      // t.total_likes_count_on_post.set(result.length);
      return result;        
      },
       trim_content(content){
       if(content.length > 55){
         return content.substr(0, 55)+"...";
        }
        else{
        return content;
        }
    },

  total_likes_count_on_post(){
      // var t = Template.instance();
      return Session.get("total_likes_count_on_post");
      },

  fetch_user_information(){
    Meteor.subscribe("user_info_based_on_id",this.liked_by);
     var userInfo = UserInfo.find({"user_id":this.liked_by}).fetch();
     return userInfo;
      },

  convert_event_post_id_to_base_64(post_id){
      // console.log(this.post_id);
    var post_id =post_id;
    post_id= Base64.encode(post_id);
    var url = '/event_detail/'+post_id;
    return url;
      }, 

  convert_blog_post_id_to_base_64(post_id){
      // console.log(this.post_id);
    var post_id =post_id;
    post_id= Base64.encode(post_id);
    var url = '/blog_detail/'+post_id;
    return url;
      },

      disableCommentBox(){
        var  post_type =  this.post_type;
        var  commenting_status =  this.commenting_status;
        var  post_id =  this.post_id;

        if(post_type == 'text'){
          $('#commentBoxForText_'+this.post_id).addClass('hide_redmore');
        }

        else if(post_type == 'image'){
          $('#commentBoxForPicture_'+this.post_id).addClass('hide_redmore');
        }

        else if(post_type == 'url_metadata'){
          $('#commentBoxForUrl_'+this.post_id).addClass('hide_redmore');
        }
        // commentBoxForText
        // commentBoxForPicture
        // commentBoxForUrl

        // text
        // image
        // url_metadata
        // if(post_type == 'text'){
        //    console.log('commentBoxForText_'+post_id);
        // }

        // else if(post_type == 'image'){
        //    console.log('commentBoxForPicture_'+post_id);
        // }

        // else if(post_type == 'url_metadata'){
        //   console.log('commentBoxForUrl_'+post_id);
        // }


        if(commenting_status){
          if(commenting_status == ""){

              return true;
          }else{
              return false;
          }
        }else{

          return true;
        }
      },

      displayPollingOptions(){
        // alert(JSON.stringify(this));
        var  poll_Option =  this.poll_Option;
        if(poll_Option){
            var newOptionArray = poll_Option.split(",");
            // alert(newOptionArray);
            var returnArray = new Array();
            for(var i=0; i < newOptionArray.length; i++){
                returnArray.push({option:newOptionArray[i], index:this.post_id, option_count:this.option_count});
            }  
            // alert(JSON.stringify(returnArray));
            console.log(returnArray);
            // console.log(returnArray);
            return returnArray;
        }
      },

      checkAlreadyVoted(){
        // var option = this.option;
        // alert(JSON.stringify(this));
        var post_id = this.post_id;
        // alert(Session.get("userId")+' '+post_id);
        var result = PollOption.find({vote_by: Session.get("userId") , vote_post: post_id}).fetch();
        // alert();
        if(result[0]){
          return false;
        }else{
          return true;
        }
      },

      calculatePercentage(){
         var option = this.option;
         var vote_id = this.index;
         var option_count = this.option_count;
         // alert('hero: ');
         var result = PollOption.find({ vote_post: vote_id }).fetch();
         // alert('option_count '+option_count+' resultCount: '+resultCount);
         console.log('result: ');
         console.log(result);
         var final_count = 0;
         var resultCount = result.length;
       

         for(var i=0; i<resultCount; i++){ 

            // alert(' option_count: '+option_count+' resultCount: '+resultCount+ ' vote_id: '+ vote_id +' option_count: '+option_count +'result[i].vote_to: '+result[i].vote_to);

            if(result[i].vote_to == option){
              final_count = final_count + 1;
            } 
         }

         ReturnPercentage = (final_count/resultCount)*100;
         // alert(' final_count: '+final_count);
         return ReturnPercentage;
      },

      // option_count(){
      //    var option = this.option;
      //    var vote_id = this.vote_id;
      //    // var vote_id = this.vote_id;
      //    var result = PollOption.find({ vote_id: vote_id }).fetch();

      //    var final_count = 0;
      //    return false;
      // },

});



Template.post_detail_admin_center.events({
	"click .clicked_cancel":function(event){
		event.preventDefault();
		window.history.go(-1);
	},
	"click #delete_post":function(event){
		event.preventDefault();
		Meteor.call("mark_content_as_abused",Session.get("current_post_id"),Session.get("post_id"),function(error,result){
			if(error){

			}else{
			 	alert("content Deleted Successfully");	
				window.history.go(-1);
			}
		})

	},
  'click .remove_post':function(event){
    // alert(this.comment_id);
    // return false;
    var post_id = event.target.id;
    // var c2 = $(post_id).attr('con');
    // alert(post_id);
    if(confirm("Sure, You want to remove this post ?")){
      Meteor.call('remove_post_from_hub',Session.get("userId"),post_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },

    'click .PollOptionSeletion':function(){

    var optionSelected = this.option;
    var post_id = this.index;
    var option_count = this.option_count;

    alert("optionSelected: "+optionSelected+" post_id: "+post_id);

    Meteor.call('saveOption',Session.get("userId"),optionSelected,post_id,option_count,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  

    // }
    // var optionSelected = $('#optionId').attr('value2');
    alert(optionSelected);
  },
  

  'click .cancelHideModal': function(){
    
    $('.modal').modal('close');
  },


  'mouseover .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).show();
  },
  'mouseout .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).hide();
  },
  'mouseover .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).show();
  },
   'mouseout .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).hide();
  },

  'keypress .hidden_comment':function(e){
    var key = e.keyCode;

    // If the user has pressed enter
    if (key == 13) {

       if($("#hidden_comment_"+this.comment_id).is(':focus')){
        var comment_txt = $("#hidden_comment_"+this.comment_id).val();
        var comment_id = this.comment_id;
        Meteor.call("update_commented_text",Session.get("userId"),this.comment_id,comment_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_"+comment_id).addClass("loader_visiblity_block");
             $("#show_comment_"+comment_id).removeClass("loader_visiblity_block");
          }
        })
        return false;
      }else if($("#hidden_comment_level_2_"+this.comment_id).is(':focus')){
        var comment_txt = $("#hidden_comment_level_2_"+this.comment_id).val();
        var comment_id = this.comment_id;
        Meteor.call("update_commented_text",Session.get("userId"),this.comment_id,comment_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_level_2_"+comment_id).addClass("loader_visiblity_block");
             $("#show_comment_level_2_"+comment_id).removeClass("loader_visiblity_block");
          }
        })
        return false;

      }
    }
    else {
        return true;
    }
  },

    'keypress .updateHiddenPost':function(e){
    var key = e.keyCode;

    // If the user has pressed enter
    if (key == 13) {
// hidden_hub_post_{{post_id}}
       if($("#hidden_hub_post_"+this.post_id).is(':focus')){
        var post_txt = $("#hidden_hub_post_"+this.post_id).val();
        var post_id = this.post_id;
        // alert(' post_id: '+this.post_id+' post_txt:  '+post_txt);
        Meteor.call("update_hub_post",Session.get("userId"),this.post_id,post_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_hub_post_"+post_id).addClass("loader_visiblity_block");
             $("#visible_hub_post_"+post_id).removeClass("loader_visiblity_block");

                 $("#show_less_"+post_id).removeClass("loader_visiblity_block ");
                 // $("#show_more_"+post_id).removeClass("loader_visiblity_block ");
          }
        })
        return false;
      }else if($("#hidden_comment_level_2_"+this.post_id).is(':focus')){
        var post_txt = $("#hidden_comment_level_2_"+this.post_id).val();
        var post_id = this.post_id;
        // alert(this.post_id,post_txt);
        Meteor.call("update_hub_post",Session.get("userId"),this.post_id,post_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_level_2_"+post_id).addClass("loader_visiblity_block");
             $("#show_comment_level_2_"+post_id).removeClass("loader_visiblity_block");

    $("#show_less_"+post_id).removeClass("loader_visiblity_block ");
    $("#show_more_"+post_id).removeClass("loader_visiblity_block ");
          }
        })
        return false;

      }
    }
    else {
        return true;
    }
  },

      'click #show_more_comment_reply': function(){
        const t = Template.instance();
        t.reply_comment_show_limit.set("3");
      },

      'click #show_less_comment_reply': function(){
        const t = Template.instance();
        t.reply_comment_show_limit.set("");
      },

      // 'click #show_replies': function(){
      //   // const t = Template.instance();
      //   // t.reply_comment_show_limit.set("");
      //   $('#show_replies').removeClass('div_hide_class');
      // },



  'click .edit_comment':function(){
    $("#hidden_comment_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_"+this.comment_id).addClass("loader_visiblity_block ");

  },

    'click .editHubPost':function(event){
      var post_id = event.target.id;
      // alert(post_id);
    $("#hidden_hub_post_"+ post_id).removeClass("loader_visiblity_block");
    $("#visible_hub_post_"+ post_id).addClass("loader_visiblity_block ");

    $("#show_less_"+post_id).addClass("loader_visiblity_block ");
    $("#show_more_"+post_id).addClass("loader_visiblity_block ");
  },

  'click .remove_comment':function(){
    if(confirm("Sure, You want to remove this Comment ?")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"),this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
      
      }
    });  
    }
  },

  'click .level_2_edit_comment':function(){
    $("#hidden_comment_level_2_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_level_2_"+this.comment_id).addClass("loader_visiblity_block ");
  },
  'click .level_2_remove_comment':function(){
    if(confirm("Sure, You want to remove this Comment")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"), this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },
  'click .modal3':function(){
    /*$('#modal3').modal({ show: false})
    $("#modal3").hide(); 
    $(".modal-backdrop").hide(); 
    $('#modal3').modal('hide');*/
    // alert()
     $('#modal3').modal().hide();

  },'click .modal2':function(){
    // $('#modal2').modal('hide');

    // $('#modal2').modal({ show: false})
    // $("#modal2").hide(); 
    // $(".modal-backdrop").hide(); 
    $('#modal2').modal().hide();
  },'click .modal1':function(){
   // $('#modal1').modal('hide');
     // $('#modal1').modal({ show: false})
     // $("#modal1").hide(); 
  $('#modal1').modal().hide();
     // $(".modal-backdrop").hide(); 
  },
  'click .redirect_to_profile':function(){
    var user_id = Session.get("userId");
    user_id= Base64.encode(this.user_id);
    var url = '/view_profile/'+user_id;
    if(Session.get("userId") == this.user_id)
    {
      Router.go('/profile');    
    }
    else{
      Router.go(url);
    }
    }, 
    'click .redirect_to_profile_on_nested_comments':function(){
    var user_id = Session.get("userId");
    user_id= Base64.encode(this.comment_by);
    var url = '/view_profile/'+user_id;
    if(Session.get("userId") == this.comment_by)
    {
      Router.go('/profile');    
    }
    else{
      Router.go(url);
    }
    },    
  'keyup input': function(event) {
      if (event.which === 13) {
        
        $(".insert_comment_level_1").click();
        $(".last_commenting_level_button").click();
      }
    },
  
    'click #image_picker': function() {
        var hub_posting_text = $("#hub_posting_text").val();
        $("#fileInput").click();
    },

    'click #vedio_upload': function() { 
        var hub_posting_text = $("#hub_posting_text").val();
        $("#fileInput").click();
    },

    'change #fileInput': function(e, template) {
        upload_image(e, template);
    },

    'click .like_event':function(){
      var data= JSON.stringify(this);
      var data=JSON.parse(data);    
      handle_like_event(data.post_id);
    },

    'click .insert_comment_level_1':function(){


          var data =JSON.stringify(this)
        var data = JSON.parse(data);
        // alert(data);
        if($("#commented_text_"+this.post_id).is(':focus')){
          

      var comment_txt = $("#commented_text_"+this.post_id).val();
       
      if(comment_txt == null || comment_txt == "")
        {
          $('#commented_text').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#commented_text').removeClass('emptyfield');
        }

      var comment_by = Session.get("userId");
      
      var commentcount =  Comment.find({comment_type: 'hub_orignal'}, { sort: {createdAt: 1 }}).fetch();
      if(commentcount != '' && commentcount != null && commentcount != undefined &&  commentcount.length!=0){
      var last_comment_id = commentcount[commentcount.length-1].comment_id;
      var actual_count = last_comment_id%40000;
      var a1 = actual_count + 1;
      var comment_id = 40000+ a1;
      }
      else{
       var comment_id = 40001;
      }
      // alert(data.post_id);
      var post_id =data.post_id;
      var parent = 0;
      // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);
      Meteor.call('hub_post_comments',comment_id,post_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              alert('error');
                // console.log("Errorr");
          }else{
              // console.log('succesfully commented');
              }
      });
      $("#commented_text_"+this.post_id).val("");
     } 
    },
    'click .like_comment_level_1':function(){
      var comment_id =this.comment_id;
       var data = $("#like_child_1_"+comment_id).attr("id"); 
      handle_like_event(data);

    },

    'click .read_more_text':function(){
      // alert(this.post_id);

      $("#show_less_"+this.post_id).hide();
      $("#show_more_"+this.post_id).removeClass("loader_visiblity_block");
      Meteor.call("update_last_activity",Session.get("userId"),function(error,result){
        if(result){
          // console.log(result);
        }else{
          alert("Update while Last activity" + ERROR);
        }
      });

    },

    'click .comment_on_post_lvl_0':function(){

           if(Session.get("openDiv00")){
        $("#"+Session.get("openDiv00")).addClass("div_hide_class");
        $("#"+Session.get("openDiv01")).addClass("div_hide_class");
       }
        $("#commented_text_"+this.post_id).removeClass("div_hide_class");
         Session.set("openDiv00","commented_text_"+this.post_id);
         Session.set("openDiv01","commented_text_btn_"+this.post_id);
        $("#commented_text_"+this.post_id).focus();
      return false;
    },  
    'click .reply_on_comment':function(){

       if(Session.get("openDiv")){
        $("#"+Session.get("openDiv")).addClass("div_hide_class");
       }
       $("#last_commenting_level_"+this.comment_id).removeClass("div_hide_class");
       Session.set("openDiv","last_commenting_level_"+this.comment_id);
       $("#last_commenting_level_text_area_"+this.comment_id).focus();
      return false;

    },
    'click .like_for_last_level':function(){
      var comment_id ="like_child_2_"+this.comment_id;
      handle_like_event(comment_id);
    },
    'click .last_commenting_level_button':function(){
      var data= JSON.stringify(this);

      var comment_id_from_btn = this.comment_id;
        // alert(' & '+ comment_id_from_btn);
        var get_val = 'last_commenting_level_text_area_'+comment_id_from_btn;
        var comment_txt = $('#'+get_val).val();
      
         if($("#last_commenting_level_text_area_"+comment_id_from_btn).is(':focus')){
     
       // alert(get_val+' & '+comment_txt);

      if(comment_txt == null || comment_txt == "")
        {
          $('#'+get_val).addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#'+get_val).removeClass('emptyfield');
        }

      comment_by = Session.get("userId");

      var k12 = comment_id_from_btn;
      const count3 = Comment.find({comment_id:{$regex:new RegExp('^' + k12 +'_')},commentActivityStatus: 0}).count(); //like 'pa%'
      var a = 0;
      var count4 = 0;
      if(count3 == 0)
      {
       a = '_1';
       comment_id = k12+a;
      }
      else
       {
        // alert('just checkin: k12: '+k12);
        var count_4 = count3+1;
        a = '_';
        count4 = k12+a+count_4;
        var count5 = Comment.find({comment_id: {$regex:new RegExp('^' + k12)},commentActivityStatus: 0},{sort: {createdAt: 1}}).fetch();   
        var old_id = count5[count5.length-1].comment_id;
        var comment_id_for_reply = old_id.split('_');
        var k123 = comment_id_for_reply[comment_id_for_reply.length-1];
        var k123_1 = parseInt(k123)+1;
        a = '_';
        var comment_id = comment_id_from_btn + a + k123_1;  
       }

    // var post_id = Session.get("detailed_blog_id");
    var post_id = this.post_id;
    
    var parent = comment_id_from_btn;

    // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);

      Meteor.call('hub_last_level_comments',comment_id,post_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              alert('error');
          }else{
              // sAlert.success('Sucessfully commented',"123");
              // console.log('sucessfully commented');
              // alert("sucessfully Commented");
              }
      });
      $('#'+get_val).val('');


    }

},
'click #load_more_comments':function(event){
       event.preventDefault();
    var post_id = this.post_id;
    post_id= Base64.encode(post_id);
    var url = '/post_detail_page/'+post_id;
    Router.go(url);    
},
'click .post_detail_page':function(){
       event.preventDefault();
    var post_id = this.post_id;
    post_id= Base64.encode(post_id);
    var url = '/post_detail_page/'+post_id;
    Router.go(url);    
},

'click .show_all_reply_comments':function(event){
    event.preventDefault();
   // alert(Session.get('DisplyLvl2Commenting'));
    if( Session.get('DisplyLvl2Commenting') == false )
    {
       $('.show_replies').removeClass("div_hide_class");
       Session.set('DisplyLvl2Commenting',true);
    }
    else{
       $('.show_replies').addClass("div_hide_class");
       Session.set('DisplyLvl2Commenting',false);
    }
},
'click .modal_kholo':function(){
  // alert('here');
  // alert(this.post_id);
  // document.getElementById('abb_khulja').click();
   var result = Like.find({post_id: this.post_id}).count();
   if(result>=0){
      Session.set("currentPostId",this.post_id);
       document.getElementById('abb_khulja').click();

      // Template.post_detail_admin_center.__helpers["fetch_all_liked_users"]();  
   }
  
},

'click .modal_kholo2':function(){
  var data =JSON.stringify(this);
  // alert(data);
  // document.getElementById('abb_khulja2').click();
   var result = Like.find({post_id:"like_child_1_"+ this.comment_id}).count();
   if(result>=0){
      Session.set("currentPostId","like_child_1_" + this.comment_id);
       document.getElementById('abb_khulja2').click();
      // Template.post_detail_admin_center.__helpers["fetch_all_liked_users"]();  
   }
  
},

'click .modal_kholo3':function(){
  var data =JSON.stringify(this);
  // alert(data);
  // document.getElementById('abb_khulja2').click();
   var result = Like.find({post_id:"like_child_2_"+ this.comment_id}).count();
   if(result>=0){
      Session.set("currentPostId","like_child_2_" + this.comment_id);
       document.getElementById('abb_khulja3').click();
      Template.post_detail_admin_center.__helpers["fetch_all_liked_users"]();  
   }
  
},

'click .redirect_to_blog':function(event){
  event.preventDefault();
  var url = $(".redirect_to_blog").attr("ank");
  Router.go(url);
},

'click .redirect_to_event':function(event){
  event.preventDefault();
  var url = $(".redirect_to_event").attr("ank");
  Router.go(url);
},

});

Template.post_detail_page.rendered = function () {
Meteor.call("fetch_all_user_friends",Session.get("userId"),function(error,result){
  if(error){
  }else{
    Session.setPersistent("user_friends_data",result);
  }
})
}

Template.post_detail_admin_center.onRendered(function(){


//        var url = window.location.href;
//        var new_url = url.split("/");
//        url = new_url[new_url.length-1];
//      if(url == 'feed'){

//   // window.onload = function() {
//     if(!window.location.hash) {
//         window.location = window.location + '#loaded';
//         window.location.reload();
//     }
// }

 // $.getScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', function(){})
  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
  Meteor.subscribe("feed_data_based_on_feed_id",Session.get("post_id"));

setInterval(function(){ 
    var result = UserInfo.find({user_id: Session.get("userId")}).fetch();
if(result[0] && result[0].firstTimeUser && result[0].firstTimeUser == 1){

        Meteor.call("firstTimeUser",Session.get("userId"),function(error,result){

        if(error){
          alert("Error");
        }else{
         // alert('cools');
         // console.log("sucessfull update for first time user");

        }
         
    });
}
},5000);



Session.set('DisplyLvl2Commenting',false);

setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    var result = UserInfo.find({user_id: logged_in_User}).fetch();
if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("body_bg");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("body_bg");
    
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("body_bg");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("body_bg");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");

      $('.page_wh').addClass("body_bg");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");
             
     } 
  }
}, 3000);
});


// Template.post_detail.onCreated(function(){
//   this.total_likes_count_on_post = new ReactiveVar(0);
// // Session.set("pagination",1);
// })

// Template.post_detail.helpers({
//   featured_title_truncated(featured_title){
//     var title = featured_title;
//     if(title.length>30){ 
//     return title.substring(0,30)+ " ...";
//     }else{
//       return title;
//     }
//   },
//   fetch_hub_posting(){
//       var post_id = Session.get("post_id");
//       return Hub.find({"post_id":post_id},{sort: {post_created_time: -1}}).fetch();
//   },
//    get_user_information(){
//       var userId= this.post_creator_id;
//      var userInfo = UserInfo.find({"user_id":userId}).fetch();
//      return userInfo;
//   },get_blog_creator_information(){
//       var userId= this.blog_creator_id;
//       // var data = JSON.stringify(this);
//       // console.log(data);
//      var userInfo = UserInfo.find({"user_id":userId}).fetch();
//      return userInfo;
//   },
//     changeDateFormat(Blog_publish_date){
//     var date = new Date(Blog_publish_date);
//     var formatted = moment(date).format('MMM D,  YYYY');
//     return formatted;
//   },
//   check(data){
//     var data = JSON.stringifyaa(data);
//     console.log(data);
//   },
//    calculate_time_difference(a){
//     var dt = new Date(a);
//    var millis =    new Date().getTime() - dt.getTime() ;
//       var minutes = Math.floor(millis / 60000);
//   var seconds = ((millis % 60000) / 1000).toFixed(0);

//    var hours = (millis / (1000 * 60 * 60)).toFixed(1);

//  var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);
//    if(minutes<1 && seconds<10){
//     return 'now';
//   }else if(minutes <1 && seconds<59 ){
//     return seconds + 's';
//    } else if(minutes>= 1 && minutes<=59) {
//     return minutes + 'm';
//   }else if(minutes>=60 && hours<24){
//         if(Math.floor(hours)==1 || minutes==60){
//         return Math.floor(hours) + 'h';
//         }else{ 
//         return Math.floor(hours) + 'h';
//         }
//   }else if(hours>24){
//     if(Math.floor(days) == 1){
//     return Math.floor(days) +"d";
//     }else{
//     return Math.floor(days) +"d";
//     }
//   }
//   else{    
//   return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
//   }
//   // return "Ankit";
// },
// check_for_user_already_liked(){
//       var liked_by = Session.get("userId");
//         var result = Like.find({post_id: this.post_id, liked_by: liked_by}).count();
//         if(result > 0){
//               return 'Liked';
//         }
//         else{
//             return 'Like';
//         }
// },
// formatted(post_text){
//     // return post_text;
//  return post_text.replace('', '');
//  // return html(post_text);
//   },
// total_liked_on_post(post_id){
// var result = Like.find({post_id: post_id}).count();
// return result;  
// },
// get_all_commented_users_information(){
//     var result = Comment.find({post_id: this.post_id, comment_type: 'orignal'},{sort: {createdAt:-1}}).fetch().reverse();
//       return result;
// },
// get_all_commented_users_information_count(){
//     var result = Comment.find({post_id: this.post_id, comment_type: 'orignal'}).fetch();
//       return result.length;
// },
// check_for_load_more_comments(){
//   var result = Comment.find({post_id: this.post_id, comment_type: 'orignal'}).fetch();
//   // return result;
//       if(result.length>5){
//       return "Load more1 comments";  
//       }
// },
// get_commentator_information(){
//      var userId= this.comment_by;
//      var userInfo = UserInfo.find({"user_id":userId}).fetch();
//      return userInfo;
// },
// get_commentator_profile_pic(user_id){
//    var userInfo = UserInfo.find({"user_id":user_id}).fetch();
//     return userInfo[0].profile_pic;  
// },
// get_commentator_user_name(user_id){
//    var userInfo = UserInfo.find({"user_id":user_id}).fetch();
//     return userInfo[0].name;  
// },
// show_comment_reply(){
//       // var data = JSON.stringify(this);
//       // console.log(data)
//       var result = Comment.find({post_id: this.post_id, comment_type: 'reply',parent: this.comment_id} ,{sort: {createdAt: -1}}).fetch()
//       return result;
//      },
//      show_comment_reply_count(){
//       var result = Comment.find({post_id: this.post_id, comment_type: 'reply',parent: this.comment_id} ,{sort: {createdAt: -1}}).fetch()
//       return result.length;

//      },
//      fetch_count_total_level_zero_comments(post_id){
//       var result = Comment.find({post_id: post_id, comment_type: 'orignal'} ,{sort: {createdAt: -1}}).fetch();
//       return result.length; 
//      },
//      check_for_user_liked_on_level_one_comments(){
//       var post_id="like_child_1_"+this.comment_id;
//     var liked_by = Session.get("userId");
//      var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
//       if(result==0){
//       return "Like";  
//       }else{
//       return "Liked";  
//       }
//     },
//       count_for_user_liked_on_level_one_comments(){
//       var post_id="like_child_1_"+this.comment_id;
//        var liked_by = Session.get("userId");
//       var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
//       return result;        
//       },check_for_user_liked_on_level_two_comments(){
//       var post_id="like_child_2_"+this.comment_id;
//        var liked_by = Session.get("userId");
//       var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
//       if(result==0){
//       return "Like";  
//       }else{
//       return "Liked";  
//       }
//       },count_for_user_liked_on_level_two_comments(){
//       var post_id="like_child_2_"+this.comment_id;
//       var liked_by = Session.get("userId");
//       var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
//       return result;        
//       },
//       fetch_all_liked_users(){
//         var postId = Session.get("currentPostId");
//       var result = Like.find({post_id: postId}).fetch();
//       var t = Template.instance();
//       t.total_likes_count_on_post.set(result.length);
//       return result;        

//       return result;        
//       },
//       fetch_user_information(){
//      var userInfo = UserInfo.find({"user_id":this.liked_by}).fetch();
//      return userInfo;
//       },
//         convert_post_id_to_base_64(post_id){
//       // console.log(this.post_id);
//     var post_id =post_id;
//     post_id= Base64.encode(post_id);
//     var url = '/blog_detail/'+post_id;
//     return url;
//       },
//        trim_content(content){
//        if(content.length > 55){
//          return content.substr(0, 55)+"...";
//         }
//         else{
//         return content;
//         }
//       },total_likes_count_on_post(){
//       var t = Template.instance();
//       return t.total_likes_count_on_post.get();
//       }
// });


// Template.post_detail.onRendered(function() {


// Session.set("post_type","text");
// $(function() {
//   "use strict";
//   // end by a pace \s or \s$
//   var url = /(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\s)/gi; 
//   //var url = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

//     $("#hub_posting_text").on('paste', function(e) {
//       $(e.target).keyup();
//       //setTimeout(function(){ $(e.target).keyup(); }, 100);
//     });


//   //$("#textarea").on("change keyup input", function(e) {
//   //$("#textarea").on("keyup paste", function(e) {
//   $("#hub_posting_text").on("keyup", function(e) {

//     var urls, lastURL,
//       checkURL = "",
//       output = "";

//     //if (urls.data('curr_val') == urls) //if it still has same value
//     // return false; //returns false

//     //8 = backspace
//     //46 = delete

//     if (e.keyCode == 8 && e.keyCode !== 9 && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 46) {
//       // Return is backspace, tab, enter, space or delete was not pressed.
//         if($("#hub_posting_text").val()==""){
//             if(Session.get("post_type")=="metadata_url"){
//                    $("#url_metadata_div").addClass("div_hide_class");
//                    $("#loader_class").addClass("div_hide_class");
//                    Session.set("post_type","text");
//             }
//         };
//       return;
//     }

//   // GC keyCodes
//     if (e.keyCode == 17) {
//       // Return is backspace, tab, enter, space or delete was not pressed.
//       return;
//     }
//     Session.set("request_send","false");
//     while ((urls = url.exec(this.value)) !== null) {
//       output += urls[0];
//       $("#result").html(output);

//       console.log("URLS: " + output.substring(0, output.length - 2));
//        if($("#hub_posting_text").val().trim()==""){
//             if(Session.get("post_type")=="metadata_url"){
//                    $("#url_metadata_div").addClass("div_hide_class");
//                    $("#loader_class").addClass("div_hide_class");
//                    Session.set("post_type","text");
//                    return false;
//             }
//         };

//       $("#loader_class").removeClass("div_hide_class");
//       Meteor.call('fetch_url_information',output,function(error,result){
//         if(error){
//           alert("Error");
//         }else{

//          if($("#hub_posting_text").val().trim()==""){
//                    $("#url_metadata_div").addClass("div_hide_class");
//                    $("#loader_class").addClass("div_hide_class");
//                    Session.set("post_type","text");
//                    return false;
//         };

//           if(Session.get("request_send")=="false"){
//           $("#loader_class").addClass("div_hide_class");
//           $("#url_metadata_div").removeClass("div_hide_class");
//           Session.set("request_send","true");
//           console.log(JSON.stringify(result));
//           var result_string=JSON.stringify(result);
//           var title=JSON.parse(result_string);          
//           if(result_string.includes("code")){
//             alert("Check your internet");
//             return false;
//           }
//           if(title.image!=""){
//             $("#metadata_info_image").attr("src",title.image);
//             Session.set("metadata_image",title.image);
//           }else{
//             $("#metadata_info_image").attr("src","http://www.specialneighborhood.com/beta/feed/blog/logo.png");
//             Session.set("metadata_image","http://www.specialneighborhood.com/beta/feed/blog/logo.png");
//           }
//             Session.set("metadata_url",title.url);
//             $("#metadata_info_heading").text(title.title);
//             $("#metadata_info_sub_heading").text(title.source);
//             Session.set("post_type","metadata_url")
//             Session.set("metadata_title",title.title);
//             Session.set("metadata_source",title.source);  
//           }
//         }
//       })

//     }

//   });
// });

// function checklastHover(response) {
//   lastURL = response;
//   console.log('lastURL ' + lastURL);
//   // alert("Last hover");
// }
// });


// Template.post_detail.events({
//    'click .modal3':function(){
//     $("#modal3").hide(); $(".modal-backdrop").hide(); $('#modal3').modal('hide');
// $('#modal3').modal({ show: false})
//   },'click .modal2':function(){
//     // $('#modal2').modal('hide');

//  $('#modal2').modal({ show: false})
//     $("#modal2").hide(); $(".modal-backdrop").hide(); 
//   },'click .modal1':function(){
//    // $('#modal1').modal('hide');
//  $("#modal1").hide(); 
//  $('#modal1').modal({ show: false})

//  $(".modal-backdrop").hide(); 
//   },
//   'keyup input': function(event) {
//       if (event.which === 13) {
        
//         $(".insert_comment_level_1").click();
//         $(".last_commenting_level_button").click();
//       }
//     },
//     'click #hub_posting_form': function(e) {
//         e.preventDefault();
//         var hub_posting_text = $("#hub_posting_text").val();

//         if(Session.get("post_type")=="text"){
//           // alert("text");
//           if(hub_posting_text==""){
//             alert("Posting Text could not be empty");
//             return false;
//           }
//         }/*else if(Session.get("post_type")=="metadata_url"){
//           alert("metadata");
//         }else if(Session.get("post_type")=="image"){
//           alert("image");
//         }*/

//       var postId = Session.get("userId")+ "_post"+Math.floor((Math.random() * 2465789) + 1);
//       var postText=hub_posting_text;
//       var post_image_url =Session.get("post_image_url");
//       var userId= Session.get("userId");
//       var post_type= Session.get("post_type");
//       if(post_type!="metadata_url"){
//         if(!post_image_url){
//           post_image_url="";
//         }
//         Meteor.call('save_post',postId,hub_posting_text,post_image_url,post_type,userId,function(error,result){
//         if(error){
//           alert("error");
//         }else{
//           // alert("success");
//            $("#hub_posting_text").val("");
//           Session.clear("post_image_url");
//           Session.set("post_type","text");
//           $("#image_div").addClass("div_hide_class");
//         }
//         });  
//       }else{

//          Meteor.call('save_metadata_post',postId,hub_posting_text,Session.get("metadata_image"),Session.get("metadata_title"),Session.get("metadata_source")
//         ,Session.get("metadata_url"),userId,function(error,result){
//         if(error){
//           alert("error");
//         }else{
//            $("#hub_posting_text").val("");
//           $("#url_metadata_div").addClass("div_hide_class");
//           // alert("success");
//           Session.clear("metadata_image");
//           Session.clear("metadata_url");
//           Session.clear("metadata_title");
//           Session.clear("metadata_source");
//           Session.set("post_type","text");
//         }
//         });
//       }
      
//     },
//     'click #image_picker': function() {
//         var hub_posting_text = $("#hub_posting_text").val();
//         $("#fileInput").click();
//     },
//     'change #fileInput': function(e, template) {
//         upload_image(e, template);
//     },
//     'click .like_event':function(){
//       var data= JSON.stringify(this);
//       var data=JSON.parse(data);    
//       handle_like_event(data.post_id);
//     },

//     'click .insert_comment_level_1':function(){


         
//           var data =JSON.stringify(this)
//         var data = JSON.parse(data);
//         // alert(data);
//         if($("#commented_text_"+this.post_id).is(':focus')){
          

//       var comment_txt = $("#commented_text_"+this.post_id).val();
       
//       if(comment_txt == null || comment_txt == "")
//         {
//           $('#commented_text').addClass('emptyfield').focus();
//           return false;
//         }
//         else{
//           $('#commented_text').removeClass('emptyfield');
//         }

//       var comment_by = Session.get("userId");
      
//       var commentcount =  Comment.find({comment_type: 'orignal'}, { sort: {createdAt: 1 }}).fetch();
//       if(commentcount != '' && commentcount != null && commentcount != undefined &&  commentcount.length!=0){
//       var last_comment_id = commentcount[commentcount.length-1].comment_id;
//       var actual_count = last_comment_id%10000;
//       var a1 = actual_count + 1;
//       var comment_id = 10000+ a1;
//       }
//       else{
//        var comment_id = 10001;
//       }
//       // alert(data.post_id);
//       var post_id =data.post_id;
//       var parent = 0;
//       // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);
//       Meteor.call('hub_post_comments',comment_id,post_id,comment_txt,comment_by,parent,function(error,result){
//          if(error){
//               // sAlert.error(' Error in submitting Commenting ',"123");
//               console.log('error');
//                 alert("Errorr");
//           }else{
//               console.log('succesfully commented');
//               }
//       });
//       $("#commented_text_"+this.post_id).val("");
//      } 
//     },
//     'click .like_comment_level_1':function(){
//       var comment_id =this.comment_id;
//        var data = $("#like_child_1_"+comment_id).attr("id"); 
//       // alert(data);
//       // var data= JSON.stringify(this);
//       // var data=JSON.parse(data);    

//       handle_like_event(data);

//     },
//     'click .comment_on_post_lvl_0':function(){
//       // alert("Captured");
//       /* if(Session.get("openDiv00")){
//         $("#"+Session.get("openDiv00")).addClass("div_hide_class");
//         $("#"+Session.get("openDiv01")).addClass("div_hide_class");
//        }
//         $("#commented_text").removeClass("div_hide_class");
//         $("#commented_text_btn").removeClass("div_hide_class");
//        Session.set("openDiv00","commented_text");
//        Session.set("openDiv01","commented_text_btn");
//         $("#commented_text").focus();*/

//            if(Session.get("openDiv00")){
//         $("#"+Session.get("openDiv00")).addClass("div_hide_class");
//         $("#"+Session.get("openDiv01")).addClass("div_hide_class");
//        }
//         $("#commented_text_"+this.post_id).removeClass("div_hide_class");
//         // $("#commented_text_btn_"+this.post_id ).removeClass("div_hide_class");
//          Session.set("openDiv00","commented_text_"+this.post_id);
//          Session.set("openDiv01","commented_text_btn_"+this.post_id);
//         $("#commented_text_"+this.post_id).focus();
//              // var comment_id = $(".comment_txt").val();
//       return false;
//     },  
//     'click .reply_on_comment':function(){
//       // $("#last_commenting_level").removeClass("div_hide_class");        
//       // var data = JSON.stringify(this); 
//        // var data = $(".last_commenting_level").attr("id"); 
//        // var a1 = this.comment_id;
//        // var d1 = this.a1;
//        // var d1 = JSON.stringify();
       
//        // var comment_id = JSON.stringify(this);
//        // var comment_id = JSON.stringify(this);
//        if(Session.get("openDiv")){
//         $("#"+Session.get("openDiv")).addClass("div_hide_class");
//        }
//        $("#last_commenting_level_"+this.comment_id).removeClass("div_hide_class");
//        Session.set("openDiv","last_commenting_level_"+this.comment_id);
//              // var comment_id = $(".comment_txt").val();
//       return false;

//     },
//     'click .like_for_last_level':function(){
//       var comment_id ="like_child_2_"+this.comment_id;
//       handle_like_event(comment_id);
//     },
//     'click .last_commenting_level_button':function(){
//       var data= JSON.stringify(this);

//       var comment_id_from_btn = this.comment_id;
//         // alert(' & '+ comment_id_from_btn);
//         var get_val = 'last_commenting_level_text_area_'+comment_id_from_btn;
//         var comment_txt = $('#'+get_val).val();
      
//          if($("#last_commenting_level_text_area_"+comment_id_from_btn).is(':focus')){
     
//        // alert(get_val+' & '+comment_txt);

//       if(comment_txt == null || comment_txt == "")
//         {
//           $('#'+get_val).addClass('emptyfield').focus();
//           return false;
//         }
//         else{
//           $('#'+get_val).removeClass('emptyfield');
//         }

//       comment_by = Session.get("userId");

//       var k12 = comment_id_from_btn;
//       const count3 = Comment.find({comment_id:{$regex:new RegExp('^' + k12 +'_')}}).count(); //like 'pa%'
//       var a = 0;
//       var count4 = 0;
//       if(count3 == 0)
//       {
//        a = '_1';
//        comment_id = k12+a;
//       }
//       else
//        {
//         // alert('just checkin: k12: '+k12);
//         var count_4 = count3+1;
//         a = '_';
//         count4 = k12+a+count_4;
//         var count5 = Comment.find({comment_id: {$regex:new RegExp('^' + k12)}},{sort: {createdAt: 1}}).fetch();   
//         var old_id = count5[count5.length-1].comment_id;
//         var comment_id_for_reply = old_id.split('_');
//         var k123 = comment_id_for_reply[comment_id_for_reply.length-1];
//         var k123_1 = parseInt(k123)+1;
//         a = '_';
//         var comment_id = comment_id_from_btn + a + k123_1;  
//        }

//     // var post_id = Session.get("detailed_blog_id");
//     var post_id = this.post_id;
    
//     var parent = comment_id_from_btn;

//     // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);

//       Meteor.call('hub_last_level_comments',comment_id,post_id,comment_txt,comment_by,parent,function(error,result){
//          if(error){
//               // sAlert.error(' Error in submitting Commenting ',"123");
//               console.log('error');
//           }else{
//               // sAlert.success('Sucessfully commented',"123");
//               console.log('sucessfully commented');
//               // alert("sucessfully Commented");
//               }
//       });
//       $('#'+get_val).val('');


//     }

// },
// 'click #load_more_comments':function(event){
//        event.preventDefault();
//     var post_id = this.post_id;
//     post_id= Base64.encode(post_id);
//     var url = '/post_detail_page/'+post_id;
//     Router.go(url);    
// },
// 'click .modal_kholo':function(){
//   // alert('here');
//   // alert(this.post_id);
//   // document.getElementById('abb_khulja').click();
//    var result = Like.find({post_id: this.post_id}).count();
//    if(result>=0){
//       Session.set("currentPostId",this.post_id);
//        document.getElementById('abb_khulja').click();
//       Template.post_detail_admin_center.__helpers["fetch_all_liked_users"]();  
//    }
  
// },

// 'click .modal_kholo2':function(){
//   var data =JSON.stringify(this);
//   // alert(data);
//   // document.getElementById('abb_khulja2').click();
//    var result = Like.find({post_id:"like_child_1_"+ this.comment_id}).count();
//    if(result>=0){
//       Session.set("currentPostId","like_child_1_" + this.comment_id);
//        document.getElementById('abb_khulja2').click();
//       Template.post_detail_admin_center.__helpers["fetch_all_liked_users"]();  
//    }
  
// },
// 'click .modal_kholo3':function(){
//   var data =JSON.stringify(this);
//   // alert(data);
//   // document.getElementById('abb_khulja2').click();
//    var result = Like.find({post_id:"like_child_2_"+ this.comment_id}).count();
//    if(result>=0){
//       Session.set("currentPostId","like_child_2_" + this.comment_id);
//        document.getElementById('abb_khulja3').click();
//       Template.post_detail_admin_center.__helpers["fetch_all_liked_users"]();  
//    }
  
// },
// 'click .redirect_to_profile':function(){
//     var user_id = Session.get("userId");
//     user_id= Base64.encode(this.user_id);
//     var url = '/view_profile/'+user_id;
//     if(Session.get("userId") == this.user_id)
//     {
//       Router.go('/profile');    
//     }
//     else{
//       Router.go(url);
//     }
//  },
//  'click .redirect_to_profile_on_nested_comments':function(){
//     var user_id = Session.get("userId");
//     user_id= Base64.encode(this.comment_by);
//     var url = '/view_profile/'+user_id;
//     if(Session.get("userId") == this.comment_by)
//     {
//       Router.go('/profile');    
//     }
//     else{
//       Router.go(url);
//     }
//     },  
     
// });

function handle_like_event(post_id){
      var liked_by = Session.get("userId");
      // var post_id=data.post_id;        

      var check_ifliked_before = Like.find({post_id: post_id, liked_by: liked_by}).fetch();     
        if(check_ifliked_before.length > 0){
          var like_id = check_ifliked_before[0].like_id;
             remove_like(like_id);
        }
        else{
              var like_id = 'like_hub_'+ Math.floor((Math.random() * 2465789) + 1);
              add_like(like_id,post_id,liked_by);
            }
}


function remove_like(like_id){
   Meteor.call('remove_blog_likes',like_id, function(error,result){
              if(error){
                    console.log('error');
                }else{
                    console.log('Like sucessfully removed');
                    }
              });
}


function add_like(like_id,post_id,liked_by)
{
  Meteor.call('add_hub_like',like_id,post_id,liked_by, function(error,result){
              if(error){
                    console.log('error');
                }else{
                    console.log('hub post sucessfully liked');
                    }
              });
}
