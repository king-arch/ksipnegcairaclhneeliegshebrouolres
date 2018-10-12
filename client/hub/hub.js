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


 // $(document).ready(function(){
 //    $('.modal').modal();
 //  });


// Template.hub_center.onCreated(function(){
// Session.set("pagination",1);
// })

// Template.hub_center.onDestroyed(function(){
//         // Session.setPersistent("firstTimeUser",false);
// setInterval(function(){ 
//         Meteor.call("firstTimeUser",Session.get("userId"),function(error,result){

//         if(error){
//           alert("Error");
//         }else{
//          // alert('cools');
//          console.log("sucessfull update for first time user");
//         }
         
//     });

// },5000);

// });
Template.hub_right.helpers({

  headline_logged_in(){

          var headline = this.headline;
          if(headline.length > 20){
            headline = headline.substr(0,20);
            return headline+'...';
          }
          else{
            return headline;
          }

  },



   fetch_blog_creator(user_id){
    Meteor.subscribe("user_info_based_on_id",user_id);
    var user_information = UserInfo.find({user_id:user_id}).fetch();
    if(user_information[0]){ 
      return user_information[0].name;
    }
  },

  todays_date(){
     var  mydate=new Date();
    var str=moment(mydate).format('DD MMM');
    return str;
  },

  fetch_events_count(){
     var  mydate=new Date();
    var str=moment(mydate).format('YYYY-MM-DD');
    var all_friends_array= new Array();
     var currentUser = Session.get("userId");
     Meteor.subscribe("all_user_related_friend_data", currentUser);
     var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] },
       { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();

   for(var i=0;i<allFriends.length;i++){
    if(allFriends[i].sent_to == currentUser){
        all_friends_array.push(allFriends[i].sent_by);
    }else{
        all_friends_array.push(allFriends[i].sent_to);
    }
   }
   all_friends_array.push(currentUser);
  

  if(currentUser != 'user_admin'){
   var include_admin = 'user_admin';
   all_friends_array.push(include_admin);
   }

    var query = new RegExp(Session.get("userId"),'i');   

   // var lists = Event.find().count();
    var lists = Event.find({
                               $and: 
                                [ 
                                  {
                                    event_start_date: {
                                                      $lte: str
                                                    }                                                 
                                  },
                                  {
                                       event_end_date: {
                                                      $gte: str
                                                    }
                                  },
                                  {
                                   status: 
                                      {
                                        $ne: 'Inactive'
                                      } 
                                  },
                                    {
                                      invite_accepted : query
                                    }
                                ] 
                              }).count();
     /*var logged_in_user = Session.get('userId');
        var new_list = new Array();
      for(var i = 0; i< lists.length ; i++){

        var invite_type = invite_type;
        var invite_accepted = lists[i].invite_accepted;

        var invite_rejected = lists[i].invite_rejected;
        var invite_list = lists[i].invite_list;
        var invite_type = lists[i].invite_type;

        if(invite_type == 'Private'){
          if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) 
            || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user))
             || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
                   new_list.push(lists[i]);
             }
        }
        else if(invite_type == 'Public'){
           new_list.push(lists[i]);
        }
      }
*/
    return lists;
},
   you_may_like_to_read(){
     // var blog_id =   Session.get("detailed_blog_id");
     // var currentAuthor = Blog.find({blog_id: blog_id}).fetch();
     Meteor.subscribe("blogs_you_may_like_to_read")
       var result = Blog.find( {$and:[{is_draft: 0},{is_active: 1}]},{limit: 5}).fetch();
     return result;
     },

});

Template.hub_left.helpers({
   fetch_user_infromation(){
      var userId= Session.get("userId");
      Meteor.subscribe("user_info_based_on_id",userId);
    var user_information = UserInfo.find({user_id:userId}).fetch();
    return user_information;
  },
  show_blog_count(){
        var logged_in_user = Session.get("userId");
      var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');
      Meteor.subscribe("blog_count_for_current_user",Session.get("userId"));
      var c1 =Blog.find({ $and:[
          {is_draft: 0},
          {is_active: 1},
         {blog_creator_id:Session.get("userId")}
        ,{Blog_publish_date:{$lte:str}}]}).count();
      // console.log(c1);
      return c1;
    
},

  show_connection_count(){
       var sent_to = Session.get("userId");
       Meteor.subscribe("show_connection_count", sent_to);
       var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).count();
       return count3;   
},

  show_group_count(){
       var logged_in_user = Session.get("userId");
       Meteor.subscribe("user_group_count",logged_in_user);
       var count3 = UserGroup.find({ admin: logged_in_user }).count();
       return count3;   
},
  // fetch_user_blogs(){
  //   var userId= Session.get("userId");
  //  var fetch_user_blogs = Blog.find({user_id:userId,is_draft: 0,is_active: 1}).count();
  // return fetch_user_blogs;  
  // },
  // fetch_total_connection(){
  //   var sent_to = Session.get("userId");
  //  var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).count();
  //   return count3;
  // },
  // fetch_user_groups(){
  //   var user_id = Session.get("userId");
  //   var listing = UserGroup.find({'admin': user_id},{sort: {createdAt: -1}}).fetch();
  //   return listing.length;
  // }

});
Template.hub_left.events({
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
})

Template.hub_right.events({
  'click .blog_detail_redirect':function(){
      var blog_id = this.blog_id;
      blog_id= Base64.encode(blog_id);
      var url = '/blog_detailed/'+blog_id;  
      Router.go(url);   
  }
})

Template.hub_center.helpers({

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

  // fetch_blog_information(){
  //       var mydate=new Date();         
  //       var str=moment(mydate).format('YYYY-MM-DD');   
  //       var all_friends_array= new Array();
  //       var currentUser = Session.get("userId");
  //       var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();
  //          for(var i=0;i<allFriends.length;i++){
  //           if(allFriends[i].sent_to == currentUser){
  //               all_friends_array.push(allFriends[i].sent_by);
  //           }else{
  //               all_friends_array.push(allFriends[i].sent_to);
  //           } 
  //           }
  //         all_friends_array.push(currentUser);
  //         Meteor.subscribe("blog_information_based_on_blog_id",this.post_id);
  //         var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }} ,{Blog_publish_date:{$lte:str}}]}).fetch();
  //         // var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }}]}).fetch();
  //         // console.log(published_by_me);
  //         return published_by_me;
  // },

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
    var post_show_limit = Session.get("pagination"); 
    if(Session.get("user_friends_data")!= undefined){

      Meteor.subscribe("get_feed_data_based_on_user_id",Session.get("userId"),Session.get("user_friends_data"), Session.get("pagination"));
      var hubdata = Hub.find({post_creator_id: { $in:  Session.get("user_friends_data")  } , 
                  postActivityStatus: {$ne: 0} },{sort: {post_created_time: -1},limit: post_show_limit*5  }).fetch()  
      $("#show_more_"+this.post_id).removeClass("loader_visiblity_block");


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
    }
        
   // console.log(hubdata);

 

    return final_data; 
  },
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

  // get_user_information(){
  //     var userId= this.post_creator_id;
  //      Meteor.subscribe("user_info_based_on_id",userId);
  //    var userInfo = UserInfo.find({"user_id":userId}).fetch();
  //    return userInfo;
  // },

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
  
  // fetch_event_information(){
  //        var mydate=new Date();         
  //       var str=moment(mydate).format('YYYY MM DD');   
  //       var all_friends_array= new Array();
  //       var currentUser = Session.get("userId");
  //       var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] },
  //        { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();

  //       // alert(JSON.stringify(allFriends));
  //          for(var i=0;i<allFriends.length;i++){
  //           if(allFriends[i].sent_to == currentUser){
  //               all_friends_array.push(allFriends[i].sent_by);
  //           }else{
  //               all_friends_array.push(allFriends[i].sent_to);
  //           } 
  //           }
  //         all_friends_array.push(currentUser);
  //         // all_friends_array = all_friends_array.toString();
  //          // alert(JSON.stringify(all_friends_array));
  //          Meteor.subscribe("event_based_on_event_id",this.post_id);
  //         var published_by_me = Event.find({ event_id:this.post_id, event_admin: {$in:  all_friends_array  } }, {event_start_date:{$lte:str} }).fetch();
  //         // var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }} ,{Blog_publish_date:{$lte:str}}]}).fetch();
          
  //         // console.log(published_by_me);
  //          // alert(JSON.stringify(published_by_me));
  //         return published_by_me;
  // },

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
      Meteor.subscribe("like_based_on_post_id",this.post_id);
        var result = Like.find({post_id: this.post_id, liked_by: liked_by}).count();
        if(result > 0){
              return 'Liked';
        }
        else{
            return 'Like';
        }
},
total_liked_on_post(post_id){
  Meteor.subscribe("like_based_on_post_id",post_id);
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
      Meteor.subscribe("like_based_on_post_id",post_id);
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
       
      Meteor.subscribe("like_based_on_post_id",post_id);
      var result = Like.find({post_id: post_id}).count();
      return result;        
      },check_for_user_liked_on_level_two_comments(){
      var post_id="like_child_2_"+this.comment_id;
       var liked_by = Session.get("userId");
       Meteor.subscribe("like_based_on_post_id",post_id);
      var result = Like.find({post_id: post_id,liked_by: liked_by}).count();
      if(result==0){
      return "Like";  
      }else{
      return "Liked";  
      }
      },count_for_user_liked_on_level_two_comments(){
      var post_id="like_child_2_"+this.comment_id;
      // var liked_by = Session.get("userId");
      Meteor.subscribe("like_based_on_post_id",post_id);      
      var result = Like.find({post_id: post_id}).count();
      return result;        
      },
      fetch_all_liked_users(){
        var postId = Session.get("currentPostId");
        Meteor.subscribe("like_based_on_post_id",postId);
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
    var post_id = post_id;
    post_id= Base64.encode(post_id);
    var url = '/event_detail/'+post_id;
    return url;
      }, 

  convert_blog_post_id_to_base_64(post_id){
      // console.log(this.post_id);
    var post_id = post_id;
    post_id= Base64.encode(post_id);
    var url = '/blog_detail/'+post_id;
    return url;
      },

      // disableCommentBox(){
      //   var  post_type =  this.post_type;
      //   var  commenting_status =  this.commenting_status;
      //   var  post_id =  this.post_id;

      //   if(post_type == 'text'){
      //     $('#commentBoxForText_'+this.post_id).addClass('hide_redmore');
      //   }

      //   else if(post_type == 'image'){
      //     $('#commentBoxForPicture_'+this.post_id).addClass('hide_redmore');
      //   }

      //   else if(post_type == 'url_metadata'){
      //     $('#commentBoxForUrl_'+this.post_id).addClass('hide_redmore');
      //   }
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


      //   if(commenting_status){
      //     if(commenting_status == ""){

      //         return true;
      //     }else{
      //         return false;
      //     }
      //   }else{

      //     return true;
      //   }
      // },

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


// let all_feed_data;
// let all_likes;
// let all_comments;
// let blogs_for_hub_section;
// let all_friend_users;

Template.hub_center.onDestroyed(function(){
  // all_feed_data.stop();
  // all_likes.stop();
  // all_comments.stop();
  // blogs_for_hub_section.stop();
  // all_friend_users.stop();
});



function check_for_first_time_user(user_id){
  Meteor.call("check_for_first_time_user",user_id,function(error,result){
    if(error){

    }else{
        if(result == true){
          // Router.go("/users_map")
        }
    }
  })
}

Template.hub.rendered = function () {
console.log(Session.get("user_friends_data"));
Meteor.call("fetch_all_user_friends",Session.get("userId"),function(error,result){
  if(error){
  }else{
    Session.setPersistent("user_friends_data",result);
  }
})
}

Template.hub_center.onRendered(function() {

Session.set("pagination",1);


//  all_friend_users =  Meteor.subscribe("all_friend_users",{
//    onReady: function () { },
//   onError: function () { console.log("Error while subscribing Friends Colleciton"); }  
// });
Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
// Meteor.subscribe("feed_blogs");
// all_likes = Meteor.subscribe("all_likes");
// all_comments = Meteor.subscribe("all_comments");
// blogs_for_hub_section = Meteor.subscribe("blogs_for_hub_section",Session.get("userId"));
Meteor.subscribe("today_s_event",Session.get("userId"));
Meteor.subscribe("group_count_for_current_user",Session.get("userId"));
Meteor.subscribe("connection_count_for_current_user",Session.get("userId"));

check_for_first_time_user(Session.get("userId"));


Session.set('DisplyLvl2Commenting',false);

setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    Meteor.subscribe("user_info_based_on_id",logged_in_User)
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

 
$(document).ready(function() {
  window.onscroll = function() {
    // alert("Scroll");
    var scrollHeight, totalHeight;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;

    if(totalHeight >= scrollHeight)
    {
    Session.set("pagination",Session.get("pagination")+1);
    console.log("pagination value Increased");
    // Template.hub_center.__helpers["fetch_hub_posting"]();
    }
}
});

// jQuery.noConflict();
Session.set("post_type","text");
$(function() {
  "use strict";
  // end by a pace \s or \s$
  var url = /(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\s)/gi; 
  //var url = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;


    $("#hub_posting_text").on('paste', function(e) {
      $(e.target).keyup();
    });


  //$("#textarea").on("change keyup input", function(e) {
  //$("#textarea").on("keyup paste", function(e) {
  $("#hub_posting_text").on("keyup", function(e) {
// alert('here');
    var urls, lastURL,
      checkURL = "",
      output = "";

    //if (urls.data('curr_val') == urls) //if it still has same value
    // return false; //returns false

    //8 = backspace
    //46 = delete

    if (e.keyCode == 8 && e.keyCode !== 9 && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 46) {
      // Return is backspace, tab, enter, space or delete was not pressed.
 // alert('case 1');
        if($("#hub_posting_text").val()==""){
            if(Session.get("post_type")=="metadata_url"){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
            }
        };
      return;
    }

  // GC keyCodes
    if (e.keyCode == 17) {
       // alert('case 2');
      // Return is backspace, tab, enter, space or delete was not pressed.
      return;
    }
// alert('case 3');
    Session.set("request_send","false");
    while ((urls = url.exec(this.value)) !== null) {
      output += urls[0];
      $("#result").html(output);

      // console.log("URLS: " + output.substring(0, output.length - 2));
       if($("#hub_posting_text").val().trim()==""){
            if(Session.get("post_type")=="metadata_url"){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
                   return false;
            }
        };
 // alert('case 4');

 var urlRegex = /(https?:\/\/[^\s]+)/g;
 if(urlRegex.test($("#hub_posting_text").val())){

     fetch_meta_information_in_url(output);
 }
      //$("#result").html("").addClass("loaded");

    }
    //console.log("URLS: " + output.substring(0, output.length - 2));

    //setTimeout(function() {
    //var lastURL = output;
    //checklastHover(lastURL);

    //}, 100);

  });
});
function fetch_meta_information_in_url(output){

 $("#loader_class").removeClass("div_hide_class");
      Meteor.call('fetch_url_information',output,function(error,result){
        if(error){
          // console.log("Error");
          alert(error);
        }else{

         if($("#hub_posting_text").val().trim()==""){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
                   return false;
        };

          if(Session.get("request_send")=="false"){
          $("#loader_class").addClass("div_hide_class");
          $("#url_metadata_div").removeClass("div_hide_class");
          Session.set("request_send","true");
          // console.log(JSON.stringify(result));
          var result_string=JSON.stringify(result);
          var title=JSON.parse(result_string);          
          if(result_string.includes("code")){
            alert("Sorry, Unable to fetch details!!!");
            return false;
          }
          if(title.image!=""){
            $("#metadata_info_image").attr("src",title.image);
            Session.set("metadata_image",title.image);
          }else{
            $("#metadata_info_image").attr("src","http://www.vayuz.com/logo.png");
            Session.set("metadata_image","http://www.vayuz.com/logo.png");
          }
            Session.set("metadata_url",title.url);
            var title1=title.title;
            if(title1.length>38){
            $("#metadata_info_heading").text(title1.substring(0,35));
            }else{
            $("#metadata_info_heading").text(title1);
            }

            $("#metadata_info_sub_heading").text(title.source);
            Session.set("post_type","metadata_url")
            Session.set("metadata_title",title.title);
            Session.set("metadata_source",title.source);  
          }
        }
      })
}

function checklastHover(response) {
  lastURL = response;
  // console.log('lastURL ' + lastURL);
  // console.log("Last hover");
}
});


Template.hub_center.events({

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

    // alert("optionSelected: "+optionSelected+" post_id: "+post_id);

    Meteor.call('saveOption',Session.get("userId"),optionSelected,post_id,option_count,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  

    // }
    // var optionSelected = $('#optionId').attr('value2');
    // alert(optionSelected);
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
    'click #hub_posting_form': function(e) {
        e.preventDefault();
        var hub_posting_text = $("#hub_posting_text").val().replace(/\r?\n/g,'<br/>');

        if(Session.get("post_type")=="text"){
          // alert("text");
          if(hub_posting_text==""){
            alert("Posting Text could not be empty");
            return false;
          }
        }/*else if(Session.get("post_type")=="metadata_url"){
          alert("metadata");
        }else if(Session.get("post_type")=="image"){
          alert("image");
        }*/

          // if(document.getElementById('disableComment').checked){
          //   var commenting_status = 'disable';
          //   // disableComment.toggle();
          //   $('input:checkbox').removeAttr('checked');
          //     }
          // else{
          //   // alert('unchecked');
          //    var commenting_status = "";
          //     }

             var commenting_status = "";
      var postId = Session.get("userId")+ "_post"+Math.floor((Math.random() * 2465789) + 1);
      var postText=hub_posting_text;
      var post_image_url =Session.get("post_image_url");
      var userId= Session.get("userId");
      var post_type= Session.get("post_type");

      if(post_type!="metadata_url"){
        if(!post_image_url){
          post_image_url="";
        }
         // hub_posting_text  = hub_posting_text.replace(/\r?\n/g, '');
         // hub_posting_text  = hub_posting_text.replace(/(?:\r\n|\r|\n)/g, '<br>');
// str.replace(/(?:\r\n|\r|\n)/g, '<br>');
        Meteor.call('save_post',postId,hub_posting_text,post_image_url,post_type,userId,commenting_status,function(error,result){
        if(error){
          alert("error");
        }else{
          // alert("success");
           $("#hub_posting_text").val("");
          Session.clear("post_image_url");
          Session.set("post_type","text");
          $("#image_div").addClass("div_hide_class");
        }
        });  
      }else{

         Meteor.call('save_metadata_post',postId,hub_posting_text,Session.get("metadata_image"),Session.get("metadata_title"),Session.get("metadata_source")
        ,Session.get("metadata_url"),userId,commenting_status,function(error,result){
        if(error){
          alert("error");
        }else{
           $("#hub_posting_text").val("");
          $("#url_metadata_div").addClass("div_hide_class");
          // alert("success");
          Session.clear("metadata_image");
          Session.clear("metadata_url");
          Session.clear("metadata_title");
          Session.clear("metadata_source");
          Session.set("post_type","text");
        }
        });
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
      
      /*var commentcount =  Comment.find({comment_type: 'hub_orignal'}, { sort: {createdAt: 1 }}).fetch();
      if(commentcount != '' && commentcount != null && commentcount != undefined &&  commentcount.length!=0){
      var last_comment_id = commentcount[commentcount.length-1].comment_id;
      var actual_count = last_comment_id%40000;
      var a1 = actual_count + 1;
      var comment_id = 40000+ a1;
      }
      else{
       var comment_id = 40001;
      }*/
      
      var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;
      // alert(data.post_id);
      var post_id =data.post_id;
      var parent = 0;
      // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);
      Meteor.call('hub_post_comments',comment_id,post_id,comment_txt,comment_by,parent,function(error,result){
         if(error){

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

      /*var k12 = comment_id_from_btn;
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
*/
       var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;
    // var post_id = Session.get("detailed_blog_id");
    var post_id = this.post_id;
    
    var parent = comment_id_from_btn;

    // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);

      Meteor.call('hub_last_level_comments',comment_id,post_id,comment_txt,comment_by,parent,function(error,result){
         if(error){

              alert('error');
          }else{

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
      // Template.hub_center.__helpers["fetch_all_liked_users"]();  
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
      // Template.hub_center.__helpers["fetch_all_liked_users"]();  
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
      Template.hub_center.__helpers["fetch_all_liked_users"]();  
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

})

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
                    alert('error');
                }else{
                    // console.log('Like sucessfully removed');
                    }
              });
}

function add_like(like_id,post_id,liked_by)
{
  // alert(post_id);
  Meteor.call('add_hub_like',like_id,post_id,liked_by, function(error,result){
              if(error){
                    alert('error');
                }else{
                    // console.log('hub post sucessfully liked');
                    }
              });
}

function upload_image(e, template) {
    // e.preventDefault();
    // var files = e.currentTarget.files;
    $("#loader_class").removeClass("div_hide_class");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
        var file = e.currentTarget.files[0];
        if (file) {
            var reader = new FileReader();
            var base64data = "";
            reader.readAsDataURL(file);
            reader.onload = function() {
                // console.log(reader.result);
                base64data = reader.result;
                // Session.set("post_image_url",base64data);
                // $("#loader_class").hide();
                // $("#post_image").attr("src",base64data);
                
            $("#image_div").removeClass("div_hide_class");
            Session.set("post_type","image");
            Session.set("post_image_url",base64data);
         $("#loader_class").hide();
            $("#post_image").attr("src",base64data);
            // var imagePath = Session.get("new_image_url");

    //             var settings = {
    //                 "async": true,
    //                 "crossDomain": true,
    //                 "url": "https://www.vayuz.com/testing/image_upload.php",
    //                 "method": "POST",
    //                 "headers": {
    //                     "content-type": "application/x-www-form-urlencoded"
    //                 },
    //                 "data": {
    //                     "image": base64data,
    //                 }
    //             }
    //             $.ajax(settings).done(function (response) {
        //   // console.log(response);
        //   $("#image_div").removeClass("div_hide_class");
        //    var post_image_url = 'https://www.vayuz.com/testing/' + response.substr(1, response.length);
        //    Session.set("post_type","image");
    //         Session.set("post_image_url",post_image_url);
        //  $("#loader_class").hide();
        //     $("#post_image").attr("src",post_image_url);
        //     var imagePath = Session.get("new_image_url");
        //   var user_id = Session.get("userId");
        // });
        };


          
        }

    }
}



function sendWelcomeEmail(){

        userId= Base64.encode(Session.get("userId"));
      // alert(userId);  
      
var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();
      var userEmail = c1[0].email;


var name = c1[0].name;
var div_style= "width:600px;height:auto;margin:auto;font-family:sans-serif;font-weight:normal;font-size:12px; border:10px solid red";
var div_style2= "width:600px;height:auto;float:left;background-color:#efefef;border:10px solid red !important";
var div_style3= "background-color:#fff;border-spacing:0px;width:100%";
var div_style4= "width:100%;height:50px;float:left;background-color:#fff";
var div_style5= "background-color:#fff;width:100%";
var div_style6= "background-color:#fff;width:100%";
var div_style7= "width:150px;height:auto;float:left;vertical-align: middle;";
var div_style8= "height: 50px";
var div_style9= "height: 50px";
var div_style10= "float: right; margin-right: 15px; color: #666";
var div_style11= "width:96%;height:auto;float:left;padding:10px";
var div_style12= "width:100%; border:0";
var div_style13= "color:#414850;line-height:30px";
var div_style14= "color:#414850;line-height:30px";
var div_style15= "width:100%;float:left;background-color:#fff;;margin-top:6px";
var image_url="http://specialneighborhood.com/uploads/icons/sn_logo.png";
var style="width:150px; height:150px";
var spacing="2";
var email = "specialneighborhoodteam@gmail.com";
var htmlCode="<html><head><title>Email</title></head><body><div style="+div_style+"><div style="+div_style2 +"><table style="+div_style3+"><tbody><tr><td><div style="+div_style4+"><table style="+div_style6+"><tbody><tr><td><div style="+div_style7+"><a> <img src="+image_url+" style="+style+"/></a></div></td><td><p style="+div_style10+"><p></td>"+
"</tr></tbody></table></div><div style="+div_style11+"><table style ="+div_style12 +" cellspacing="+spacing+" cellpadding="+spacing+"><tbody><tr><td "+
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Welcome to the Special"+
" Neighborhood Family!</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for special neighborhood, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Special Neighborhood Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Special Neighborhood, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: userEmail,
            from: 'specialneighborhoodteam@gmail.com',
            subject: "Special Neighborhood | Welcome email",
            html: htmlCode,
        };

        Meteor.call('sendEmail', "", email,function(error,result){
        if(error){
          // $("#spinnerimg").hide();
          // toastr.error("Some error occured");
        }else{
           toastr.success("Welcome to Special neighborhood");
          // document.getElementById("sent_text").textContent="Please check your email "+userEmail+".";
          // $(".email_sub_heading_two").hide() q
          // $("#spinnerimg").hide();
          // $("#sent_text").val("Sent");
          //$("#edit_grp_discription").text("We have sent an activeation email to your registered email address.");
          // toastr.success("We have sent an activation email to your registered email address.");
          // document.getElementById("edit_grp_discription").className += " email_sub_heading_two";
          // $("#send_mail").text("Resend");
          //alert("Send");
        }
    });
}









