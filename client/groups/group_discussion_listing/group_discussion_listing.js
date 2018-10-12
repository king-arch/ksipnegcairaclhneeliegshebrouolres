
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import { UserInfo } from './../../../import/collections/insert.js';
import { UserSkill } from './../../../import/collections/insert.js';
import { UserProfJr } from './../../../import/collections/insert.js';

import { UserEdu } from './../../../import/collections/insert.js';
import { UserAward } from './../../../import/collections/insert.js';
import { UserMedical } from './../../../import/collections/insert.js';

import { FriendRequest } from './../../../import/collections/insert.js';
import { UserGroup } from './../../../import/collections/insert.js';
import { Discussion } from './../../../import/collections/insert.js';

import { Comment } from './../../../import/collections/insert.js';
import { Like } from './../../../import/collections/insert.js';

import { Notifications } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

Template.group_discussion_listing.onCreated(function group_discussion_listingOnCreated() {
  // this.search_conn = new ReactiveVar("");
  this.update_discussion_totalcount = new ReactiveVar("");
  this.total_group_members_count = new ReactiveVar(0);
    this.show_all_group_members_count =  new ReactiveVar(0);
});

   var all_comments;
   var all_likes;
   var all_discussions;
   var all_friends;

Template.group_discussion_listing.onDestroyed(function(){
    all_likes.stop();
    all_comments.stop();
   all_discussions.stop();
        all_friends.stop();

});
Template.group_discussion_listing.onRendered(function(){
  all_comments =  Meteor.subscribe("all_comments");
   all_likes =  Meteor.subscribe("all_likes");
   all_discussions =  Meteor.subscribe("all_discussions");
   all_friends =  Meteor.subscribe("all_friend_users");
    Meteor.subscribe("group_information_based_on_group_id",Session.get("show_grp_id_for_discussion"));


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

Template.group_discussion_listing.onRendered(function() {
//   alert("On Rednered");

// document.getElementById("discussion_detail").addEventListener("paste", function(){
// alert('hero');
// });


// $('#discussion_detail').onpaste(function(){
//       // alert('ggg');  

// });

// var textarea = document.getElementById("discussion_detail");
// detectPaste(textarea, function(pasteInfo) {
//     alert(pasteInfo.text);
// });



});




Template.group_discussion_listing.helpers({

    calculate_time_difference(a){
      if(a){
          var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);

   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's ';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + 'm ';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + 'h ';
        }else{ 
        return Math.floor(hours) + 'h ';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +"d ";
    }else{
    return Math.floor(days) +"d ";
    }
  }
  else{    
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds /*"  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] "*/;
      }
  }
      }
  ,

show_group_details(){
  var grp_id = Session.get("show_grp_id_for_discussion");
     var result = UserGroup.find({ grp_id: grp_id }).fetch();
     return result;
},

admin_info(){


  var admin = this.admin;

  Meteor.subscribe("user_info_based_on_id",admin);
  var result = UserInfo.find({ user_id: admin }).fetch();
     return result;

},

logged_in_user(){

  var userId = Session.get("userId");
  
  Meteor.subscribe("user_info_based_on_id",userId);
  
  var result = UserInfo.find({ user_id: userId }).fetch();
  return result;

},

show_discussion_total_count(){
  const ta1 = Template.instance();
  if(ta1.update_discussion_totalcount.get()<=1){
  return 'Discussion ('+ta1.update_discussion_totalcount.get()+')';
  }else{
  return 'Discussions ('+ta1.update_discussion_totalcount.get()+')';
  }
},

show_discussion(){
  var grp_id = Session.get("show_grp_id_for_discussion");

  var result = Discussion.find({grp_id: grp_id , discussionActivityStatus: {$ne: 0} },{sort: {created_at: -1} }).fetch();
  var total_discussion_count = result.length;
  
  const ta1 = Template.instance();
  ta1.update_discussion_totalcount.set(total_discussion_count);

  // update_discussion_totalcount
  // alert(total_discussion_count);
  return result;

},

show_discussion_creator(){
    var userId = this.discussion_creator;

      Meteor.subscribe("user_info_based_on_id",userId);
  var result = UserInfo.find({ user_id: userId }).fetch();
  return result;
},

  show_comment_lvl0(){
    // var comment_txt = $('#comment').val();
      // alert(comment_txt);
     var  comment_by = Session.get("userId");
      var discussion_id = this.discussion_id;
      // alert(' comment_by: '+comment_by+' discussion_id: '+discussion_id);
      var result = Comment.find({discussion_id: discussion_id, comment_type: 'Discussion',commentActivityStatus: 0} ,{sort: {createdAt: -1}, limit: 3}).fetch().reverse();
      // console.log(result);
      return result;
     },

    show_commenter_info(){
      var user_id = this.discussion_creator;
      // alert('a');

      Meteor.subscribe("user_info_based_on_id",user_id);
       var result = UserInfo.find({user_id: user_id}).fetch();
       return result;
     },

    show_commenter_info_2(){
      var user_id = this.comment_by;
      // alert('a');
      Meteor.subscribe("user_info_based_on_id",user_id);
       var result = UserInfo.find({user_id: user_id}).fetch();
       return result;
     },

    show_count(){
      var comment_by = Session.get("userId");
      var discussion_id = this.discussion_id;

      var result_count = Comment.find({discussion_id: discussion_id, comment_type: 'Discussion',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).count()
     // alert(result_count);
      return result_count;
     },

    show_reply_count(){
      var comment_by = Session.get("userId");
      var c1 = JSON.stringify(this);
      // alert(c1);
      var discussion_id = this.discussion_id;
      var comment_id = this.comment_id;
      // alert(comment_id+' array: '+c1);
      var result_count = Comment.find({comment_id: comment_id,discussion_id: discussion_id, comment_type: 'Discussion_reply',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).count()
     
     // alert(result_count);
      return result_count;
     },

     lets_see(l1,l2){  
          var l1 = l1;
          var l2 = l2;
          // alert(l1+' & '+l2);
          console.log('noe : ');
          console.log(l1);
     },  

    grp_discription_txt(){
      var grp_discription = this.grp_discription;
      return grp_discription.slice(0,65);
    },


    check_grp_discription_length(){
      var grp_discription = this.grp_discription;
      if(grp_discription.length > 50){
           return true;
      }
      else{
        return false;
      }
    },

    show_like_count(){
      var liked_by = Session.get("userId");
        // var comment_id = this.comment_id;
        // var event_id = this.event_id;
         // alert(comment_id+' '+event_id+' '+like_id+ ' ' +parent);
      // var liked_by = Session.get("userId");
      var event_id = Session.get("show_event_id");
      var result_count = Like.find({event_id: event_id,like_type: 'main_event'}).count();
      // alert(result_count);
        return result_count;

     },

     Like_unlike_txt(){
      var comment_id = this.comment_id;
        var discussion_id = this.discussion_id;
        var liked_by = Session.get("userId");
        // var like_id = this.like_id;

      // alert(comment_id+' '+event_id+' '+like_id+ ' ' +parent);
      var result_count = Like.find({like_type: 'discussion_comment_like',discussion_id: discussion_id,comment_id: comment_id,liked_by: liked_by}).count();
      if(result_count == 0){
        return 'Like';  
      }else{
        return 'Liked';
      }
    },

     show_like_count_comment(){
      // alert('here');
      // var liked_by = Session.get("userId");
        var comment_id = this.comment_id;
        var discussion_id = this.discussion_id;
        // var like_id = this.like_id;
        var parent = this.parent;
        
      // alert(comment_id+' '+discussion_id+' ' +parent);
      var result_count = Like.find({like_type: 'discussion_comment_like',discussion_id: discussion_id,comment_id: comment_id}).count();
      // alert(result_count);
        return result_count;
     },

     Like_unlike_txt_discussion(){
      // var comment_id = this.comment_id;
        var discussion_id = this.discussion_id;
        var liked_by = Session.get("userId");
        // var like_id = this.like_id;

      // alert(comment_id+' '+event_id+' '+like_id+ ' ' +parent);
      var result_count = Like.find({like_type: 'Discussion_like',discussion_id: discussion_id,liked_by: liked_by}).count();
      if(result_count == 0){
        return 'Like';  
      }else{
        return 'Liked';
      }
    },

     show_like_count_discussion(){
      // alert('here');
      // var liked_by = Session.get("userId");
        // var comment_id = this.comment_id;
        var discussion_id = this.discussion_id;
        // var like_id = this.like_id;
        // var parent = this.parent;
        
      // alert(comment_id+' '+discussion_id+' ' +parent);
      var result_count = Like.find({like_type: 'Discussion_like',discussion_id: discussion_id}).count();
      // alert(result_count);
        return result_count;
     },


 

      show_like_list:function()
  {

    var userid = Session.get('userId');
     var discussion_id = this.discussion_id;
     // alert(discussion_id);
     // return false;
      var result = Like.find({like_type: 'Discussion_like',discussion_id: discussion_id}).fetch();
      // console.log('result');                                 
      // console.log(result); 
      // alert(' discussion_id: '+discussion_id+' result: '+result.length);                                
      return result;  

  },                                                        
                                                            
        frientlist:function()
  {
    var userid=Session.get('userId');
     var friends=FriendRequest.find({ 
                $and: [ { $or: 
                  [ { 
                    sent_to: userid 
                  }, { 
                    sent_by: userid 
                     } 
                  ] }, 
                  { $and: 
                    [ { req_status: 1 }] 
                     } ] }).fetch();
     return friends;
  },

    userinfo_from_frientlist:function(){ 
 
    var userid = Session.get('userId');

    if(this.sent_to == userid){

      Meteor.subscribe("user_info_based_on_id",this.sent_by);
      return UserInfo.find({user_id: this.sent_by}).fetch();    
    }
    else if(this.sent_by == userid){
      Meteor.subscribe("user_info_based_on_id",this.sent_to);
      return UserInfo.find({user_id: this.sent_to}).fetch();
    }
  },                                              
                                                            
  userinfo:function(){ 

    // var userid = Session.get('userId');
    var liked_by= this.liked_by;
    Meteor.subscribe("user_info_based_on_id",liked_by);
    // alert(' liked_by: '+liked_by);
    return UserInfo.find({user_id:liked_by}).fetch();

  },


  check_group_visibility(){

      var grp_visibility = this.grp_visibility;
      var group_admin = this.admin;
      var logged_in_user = Session.get('userId');
      // alert(' grp_visibility: '+ grp_visibility+' logged_in_user : '+logged_in_user +'group_admin: '+ group_admin);
      
      if(grp_visibility == 'Public' || logged_in_user != group_admin){
          return false;
      }
      else{
        return true;
      }
  },

   check_if_checked:function()
  {
    var userid=this.user_id;
    var grp_id = Session.get("show_grp_id_for_discussion");
      // alert(grp_id);
    // var grp_id = this.grp_id;
    // alert(userid+'  '+grp_id);
    //console.log(Emembers.find({e_user_id:userid,event_id:event_id}).fetch());
    var result =UserGroup.find({grp_id: grp_id}).fetch();
    if(result[0].grp_type == 'Private'){
    var invite_accepted = result[0].invite_accepted;
    // var new_array = invite_list.split(',');

    console.log(result);
    if(invite_accepted.includes(userid)){
      return false;
    }
    else{
      return true;
    }        
  }          
  },



  show_all_memeber(){   
   var grp_id = Session.get("show_grp_id_for_discussion");
   
   // var grp_id = Session.get("grp_id_for_Group_member");
   var head = UserGroup.find({grp_id: grp_id}).fetch();
   var accepted_users = head[0].invite_accepted;
   // var accepted_users = head[0].requestee_list;
     if(accepted_users != "" && accepted_users != null && accepted_users != undefined){
            var users_array = accepted_users.split(",");   
     var all_users= new Array();
     for(var i=0;i<users_array.length;i++){
      Meteor.subscribe("user_info_based_on_id",users_array[i]);
     }
     for(var i=0;i<users_array.length;i++){
      var users = UserInfo.find({"user_id":users_array[i]}).fetch();
      all_users.push(users[0]);
     }  
       const t = Template.instance(); 
      t.total_group_members_count.set(all_users.length);
     if(all_users.length == 0){
      return false;
     }

     // $(".display_member_count2").text("Members ("+all_users.length+")");
     return all_users;
     }
   },
   
group_members_count(){
    const t = Template.instance(); 
    return t.total_group_members_count.get() ;
},

    show_all_group_members_count(){
     const t =Template.instance();
     return t.show_all_group_members_count.get();
    },

       all_memeber(){   
   //       alert('all_memeber');
   var grp_id = Session.get("show_grp_id_for_discussion");

   // alert('all_memeber:' +grp_id);

   // var grp_id = Session.get("grp_id_for_Group_member");
   var head = UserGroup.find({grp_id: grp_id}).fetch();
   var accepted_users = head[0].invite_accepted;
   // var accepted_users = head[0].requestee_list;
     if(accepted_users != "" && accepted_users != null && accepted_users != undefined){
            var users_array = accepted_users.split(",");   
     var all_users= new Array();
      for(var i=0;i<users_array.length;i++){
      Meteor.subscribe("user_info_based_on_id",users_array[i]);
     }

     for(var i=0;i<users_array.length;i++){
      var users = UserInfo.find({"user_id":users_array[i]}).fetch();
      all_users.push(users[0]);
     }  
     const t =Template.instance();
     t.show_all_group_members_count.set(all_users.length);

     if(all_users.length == 0){
      return false;
     }

     return all_users;
     }
   },

       show_liked_list(){
            return Like.find({comment_id: Session.get("save_comment_id")}).fetch();  
       },

       fetch_user_information(){
           Meteor.subscribe("user_info_based_on_id",this.liked_by);
          return UserInfo.find({"user_id": this.liked_by}).fetch();  
       },

       Show_liked_list_for_discussion(){
      // alert('hi');
      // return "asd";
        // alert('save_discussion_id_for_discussion: '+Session.get("save_discussion_id_for_discussion"));
            return Like.find({discussion_id: Session.get("save_discussion_id_for_discussion"), like_type: 'Discussion_like'}).fetch();  
       },

       fetch_user_information_for_discussion(){
          Meteor.subscribe("user_info_based_on_id",this.liked_by);
            return UserInfo.find({"user_id": this.liked_by}).fetch();  
       },

    headline(){
          var headline = this.headline;
          if(headline.length > 35){
            headline = headline.substr(0,35);
            return headline+'...';
          }
          else{
            return headline;
          }
  },

  // discussion_detail(){

  //   var discussion_detail = this.discussion_detail;
  //   // alert(discussion_detail);
  //   if(discussion_detail.includes("<br/>") ){

  //   discussion_detail2 = discussion_detail.replace(/<br\s*[\/]?>/gi, ".\r\n");
  //   alert(discussion_detail2);

  //   return discussion_detail2;

  //   }
  // },

  check_discussion_detail_for_br_tag(){
      var discussion_detail =this.discussion_detail;
      if(discussion_detail.includes('<br/>') ){
          return true;
      }
      else{
        return false; 
      }
  },

  BreakAsArray(){
    var discussion_detail = this.discussion_detail;
    var new_discussion_detail = discussion_detail.split("<br/>");
    console.log('new_discussion_detail: ');
    console.log(new_discussion_detail);
    var discussion_detail_array =new Array();
    for(var i=0;i<new_discussion_detail.length;i++){

     discussion_detail_array.push({tag:new_discussion_detail[i]})
    }
    return discussion_detail_array;
  },

    
   check_for_edited(comment_id){
    var commentedComment = Comment.find({comment_id: comment_id, commentActivityStatus: 0}).fetch()
    if(commentedComment[0].editedAt)
    {
      return true;
    }
  },


  check_if_commented_by_is_user(comment_by){
// alert('here')
  if(Session.get("userId") == comment_by){
    return true;
  }
},

    check_if_post_by_is_user(discussion_creator){
      // alert('cool');
    if(Session.get("userId") == discussion_creator){
      return true;
    }
    },


});

Template.group_discussion_listing.events({



  'click .remove_post':function(event){
    // alert(this.comment_id);
    // return false;
    var discussion_id = event.target.id;
    // var c2 = $(post_id).attr('con');
    // alert(discussion_id);
    if(confirm("Sure, You want to remove this Comment")){
      Meteor.call('remove_discussion_from_group',Session.get("userId"),discussion_id,function(error,result){
      if(error){
          alert("Error");    
      }else{
        
      }
    });  
    }
  },


  'mouseover .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).show();
  },

 'mouseout .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).hide();
  },

 'mouseover .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).show();
  },

 'mouseout .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).hide();
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

  'click .edit_comment':function(){
    $("#hidden_comment_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_"+this.comment_id).addClass("loader_visiblity_block ");
  },
  'click .remove_comment':function(){
    // alert(this.comment_id);
    // return false;
    if(confirm("Sure, You want to remove this Comment")){
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
    //     alert(this.comment_id);
    // return false;
    if(confirm("Sure, You want to remove this Comment")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"), this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },

'click #submit_discussion': function(){

  var discussion_title = $('#discussion_title').val();
  var discussion_detail = $('#discussion_detail').val().replace(/\r?\n/g,'<br/>');

// alert(' discussion_title: '+discussion_title+' & discussion_detail: '+discussion_detail);
var post_type = Session.get("post_type");

// alert(Session.get("post_type"));
  if(discussion_title == null || discussion_title == "")
        {
          $('#discussion_title').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#discussion_title').removeClass('emptyfield');
        }

if(Session.get("post_type")=="text"){

       if(discussion_detail == null || discussion_detail == "")
        {
          $('#discussion_detail').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#discussion_detail').removeClass('emptyfield');
        }
      }

 if(post_type!="metadata_url"){
        var discussion_creator = Session.get("userId");
        var grp_admin = $('#get_hidden_admin').val();
        var grp_id = $('#get_hidden_grp_id').val();

          var discussion_id = 'discussion_'+ Math.floor((Math.random() * 2465789) + 1);
       Meteor.call('create_discussion',discussion_id,discussion_title,discussion_detail,discussion_creator,grp_id,grp_admin,function(error,result){
          if(error){
          console.log('error creting discussion');            
          }
          else{
            console.log('discussion successfully created');
          }
       });

    $('#discussion_title').val('');
  $('#discussion_detail').val('');
}
else{
        var discussion_id = 'discussion_'+ Math.floor((Math.random() * 2465789) + 1);
        var discussion_creator = Session.get("userId");
        var grp_admin = $('#get_hidden_admin').val();
        var grp_id = $('#get_hidden_grp_id').val();

         Meteor.call('save_metadata_post_group_discussion',discussion_id,discussion_title,Session.get("metadata_image"),Session.get("metadata_title"),Session.get("metadata_source")
        ,Session.get("metadata_url"),discussion_creator,grp_id,grp_admin,function(error,result){
        if(error){
          console.log("error");
        }else{
           $("#discussion_detail").val("");
           $("#discussion_title").val("");
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

'click submit_comment_lvl1_discussion': function(){
var comment_id_from_btn = this.comment_id;
        // alert(' & '+ comment_id_from_btn);
        var get_val = 'commentlvl1_'+comment_id_from_btn;
        var comment_txt = $('#'+get_val).val();
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
      
      // alert('check_1:comment_id_from_btn: ' + comment_id_from_btn);
      // var commentcount = Comment.find({}).count();
      // var comment_id_from_btn_array = comment_id_from_btn.split('_');
      var k12 = comment_id_from_btn;
      // alert('check_2: k12: ' + k12);
        // var new_count = add_count%10000;
       // var k12 = event.target.comment_1.value;
      //alert(new RegExp('/^' + k12 + '/'))
      //check if there is existing comments in same post
      // const count3 = Comment.find({comment_id:{$regex:new RegExp('^' + k12 +'_')},commentActivityStatus: 0}).count(); //like 'pa%'
      //alert('Post id is '+k12+' comment text is '+k14+' and the total post and comment count is '+count3);
      // alert('reply_count: '+count3);
      // return false;
      // alert('check_3:count3: ' + count3);
      /*var a = 0;
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
        var count5 = Comment.find({comment_id: {$regex:new RegExp('^' + k12)},commentActivityStatus: 0},{sort: {createdAt: 1}}).fetch(); //like 'pa%'
        // console.log(count5);
        // alert('just checkin: count5: '+count5);
        var old_id = count5[count5.length-1].comment_id;
        // alert('check_4:old_id: ' + old_id);
        var comment_id_for_reply = old_id.split('_');
        // console.log(comment_id_for_reply);
        var k123 = comment_id_for_reply[comment_id_for_reply.length-1];
        // var k123 = parseInt(k123);
        var k123_1 = parseInt(k123)+1;
        a = '_';
        var comment_id = comment_id_from_btn + a + k123_1;  
       }*/
  var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;

    var event_id = Session.get("show_event_id");
    var parent = comment_id_from_btn;

    // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);

      Meteor.call('event_comments_lvl_1',comment_id,event_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');
          }else{
              // sAlert.success('Sucessfully commented',"123");
              console.log('sucessfully commented');
              }
      });
 // $('#'+get_val).val('');       
$('#'+get_val).val('');
     },

     'click .go_to_discussion_detail_page': function(){
        var discussion_id = this.discussion_id;
        // alert(discussion_id);
        discussion_id= Base64.encode(discussion_id);  
        var url = '/grp_discussion_detail/'+ discussion_id;  

        Router.go(url);   
     },


'click .submit_comment_discussion_details': function(){
        // alert('cxzs');
      var grp_id = this.grp_id;
      var discussion_creator = this.discussion_creator;
      var grp_admin = this.grp_admin;
      var discussion_id = this.discussion_id;
      // alert(' discussion_creator: '+discussion_creator+' grp_id: '+grp_id+' grp_admin: '+grp_admin);
      // return false;
      // alert('1');
      // "commentlvl0_discussion_{{discussion_id}}"
        
        var get_val = 'commentlvl0_discussion_'+discussion_id;       
        var comment_txt = $('#'+get_val).val();        
        // alert(comment_txt);          
      // return false;
      // var comment_txt = $('#comment_discussion_detailed').val();
      // alert('1.2 comment_txt: '+comment_txt);

      if(comment_txt == null || comment_txt == "")
        {
          $('#comment_discussion_detailed').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#comment_discussion_detailed').removeClass('emptyfield');
        }
      // alert('2');
    var comment_by = Session.get("userId");
      // alert('3');
    /*  var commentcount =  Comment.find({comment_type: 'Discussion'}, { sort: {createdAt: 1 }}).fetch();
      // alert(commentcount);
      if(commentcount != '' && commentcount != null && commentcount != undefined ){
        // alert(commentcount);
      var last_comment_id = commentcount[commentcount.length-1].comment_id;
      // if(last_comment_id){
      //   var comment_id_array = last_comment_id.split('_');
      // }


      // var add_count = comment_id_array[1];
      var actual_count = last_comment_id%20000;
      var a1 = actual_count + 1;
      var comment_id = 20000+ a1;

      }
      else{
        // alert(2);
        comment_id = 20001;
      }*/
        var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;

      var discussion_id = this.discussion_id;
      var parent = 0;
      // alert('comment_id: '+comment_id+'discussion_id: '+discussion_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);
      // return false;

      Meteor.call('discussion_comments',comment_id,discussion_id,grp_id,discussion_creator,grp_admin,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');
              }else{

              // sAlert.success('Sucessfully commented',"123");
              console.log('succesfully commented');
              }
      });
       $('#'+get_val).val('');
     },     

     'click .like_button_comments': function(){
        // var comment_id = this.comment_id;

        var liked_by = Session.get("userId");
        var comment_id = this.comment_id;
        var discussion_id = this.discussion_id;   
        
        var comment_txt = this.comment_txt;
        var comment_by = this.comment_by;
        var comment_type = this.comment_type;
        
        var parent = this.parent;
        

        var check_ifliked_before = Like.find({comment_id: comment_id, discussion_id: discussion_id, liked_by: liked_by}).fetch();  
        
        if(check_ifliked_before.length > 0){
          // alert('already liked');
          var like_id = check_ifliked_before[0].like_id;
              Meteor.call('remove_discussion_comment_likes',like_id, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('Like sucessfully removed');
                    }
              });
        }
        else{
          var like_id = 'like_comment_'+ Math.floor((Math.random() * 2465789) + 1);
              
              // alert(' like_id: '+like_id+' comment_id: '+comment_id+' comment_type: '+comment_type +' discussion_id: '+discussion_id+' comment_txt: '+comment_txt+' comment_by: '+comment_by+' liked_by: '+liked_by+' parent: '+parent);
              
              // return false;

              Meteor.call('discussion_comment_likes',like_id,comment_id,discussion_id,comment_type,comment_txt,comment_by,liked_by,parent, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('sucessfully liked');
                    }
              });
            }
          },

      'click .like_button_discussion': function(){
        // var comment_id = this.comment_id;
        // alert('1');
        var liked_by = Session.get("userId");
        // var comment_id = this.comment_id;
        var discussion_id = this.discussion_id;   
        
        var discussion_title = this.discussion_title;
        var discussion_detail = this.discussion_detail;
        var discussion_creator = this.discussion_creator;
        // var comment_type = this.comment_type;
        // alert('2');
        // var parent = this.parent;
        var check_ifliked_before = Like.find({discussion_id: discussion_id, liked_by: liked_by, like_type: 'Discussion_like'}).fetch();  
        // alert('3');
        if(check_ifliked_before.length > 0){
          // alert('4');
          var like_id = check_ifliked_before[0].like_id;

          var newUser = Notifications.find({
                                  notification_by: liked_by,
                                  notification_for: discussion_creator, 
                                  discussion_id: discussion_id,
                                }).fetch();

          var notification_id = newUser[0].notification_id;
              Meteor.call('remove_discussion_likes',like_id,notification_id, function(error,result){
              if(error){
                    console.log('error');
                }else{
                    console.log('Like sucessfully removed');
                    }
              });
        }
        else{
          // alert('5');
          var like_id = 'like_comment_'+ Math.floor((Math.random() * 2465789) + 1);
              like_id,discussion_id,discussion_title,discussion_detail,discussion_creator,liked_by
              // alert(' like_id: '+like_id+' discussion_id: '+discussion_id+' discussion_title: '+discussion_title +' discussion_detail: '+discussion_detail+' discussion_creator: '+discussion_creator+' liked_by: '+liked_by);
              // return false;
              
              Meteor.call('discussion_likes',like_id,discussion_id,discussion_title,discussion_detail,discussion_creator,liked_by, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('sucessfully liked');
                    }
              });
            }
          },

          'click .focus_on_click': function(){
               var get_val = 'commentlvl0_discussion_'+this.discussion_id;       
               var comment_txt = $('#'+get_val).focus(); 
          },

          'click #agreeto':function(){
               var name=$(".inviteuser:checked");
               var c=name.length || 0
               var array = _.map(name, function(item) {
                   return item.defaultValue;
                 });

               var invited_list = array.toString();
               $("#emembers").val(array);
               var grp_id = this.grp_id;
               Meteor.call('add_invites_group',grp_id,invited_list,function(error, result){
                  if(error){
                      console.log('Failure in inviting people to group');
                  }else{
                    console.log('Sucessfully invited');
                  }
               });
  },

  'click .redirect_click_1': function(event){
    // alert('a1');
    var user_id = this.user_id;
    var logged_in_user = Session.get('userId');
    // alert( user_id +' & '+ logged_in_user) ;
    if(user_id == logged_in_user){
         var url = '/profile'; 
    }
    else{
      user_id= Base64.encode(user_id);
    var url = '/view_profile/'+user_id;
    }
    // alert(url);
    Router.go(url);
    },

    'click .close_modal': function(){

        $('.modal').modal('close');

    },

              'click .show_group_details': function(){
              var grp_id = this.grp_id;
              grp_id= Base64.encode(grp_id);  
              var url = '/group_detail/'+ grp_id;  

                Router.go(url);       

              return false;  
          },

      'click .Show_liked_list': function(){
          // alert(this.comment_id);
          Session.set("save_comment_id",this.comment_id);
          Template.group_discussion_listing.__helpers(["show_liked_list"]);          
      },

      'click .Show_liked_list_for_discussion': function(){
          // alert("sdsdadsd" + this.discussion_id);
          Session.set("save_discussion_id_for_discussion",this.discussion_id);
         
        // alert('save_discussion_id_for_discussion: '+Session.get("save_discussion_id_for_discussion"));
          Template.group_discussion_listing.__helpers(["Show_liked_list_for_discussion"]);          
      },

      'click .closed_modal_window': function(){
          $('.modal').modal('close');
      }, 

                 'keyup input': function(event) {
                 if (event.ctrlKey && event.which == 13) {
                      // Ctrl-Enter pressed
                       $(".submit_comment_discussion_details").click();
                       }
                 else if (event.which === 13) {
                           $(".submit_comment_discussion_details").click();
                         }
        },

          'click #route_to_member': function(){
    // alert('akhilesh');
    var userId = Session.get("userId");
    var grp_id = this.grp_id;
    var admin = this.admin;
    // alert(grp_id+' '+admin+' '+userId);
    grp_id= Base64.encode(grp_id); 
      // if(this.grp_type!="Private" && admin == userId){
      if(admin == userId){
      var url = "/Group_member/"+ grp_id;  
      Router.go(url);       
      // console.log(url);
      }else{
        alert("Only admin is allowed to visit members page");
      }

    // }else{
    //   alert("A");
    // }
     
},

'paste #discussion_detail' : function() {
     // e.preventDefault();
     
     // alert('pasted ');
     Session.set("post_type","text");

  // end by a pace \s or \s$
  var url = /(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\s)/gi; 
  //var url = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;


    // $("#discussion_detail").on('paste', function(e) {
      $('#discussion_detail').keyup();
    // });

  //$("#textarea").on("change keyup input", function(e) {
  //$("#textarea").on("keyup paste", function(e) {
  $("#discussion_detail").on("keyup", function(e) {

    var urls, lastURL,
      checkURL = "",
      output = "";

    //if (urls.data('curr_val') == urls) //if it still has same value
    // return false; //returns false

    //8 = backspace
    //46 = delete

    if (e.keyCode == 8 && e.keyCode !== 9 && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 46) {
      // Return is backspace, tab, enter, space or delete was not pressed.
        if($("#discussion_detail").val()==""){
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
      // Return is backspace, tab, enter, space or delete was not pressed.
      return;
    }
    Session.set("request_send","false");
    while ((urls = url.exec(this.value)) !== null) {
      output += urls[0];
      $("#result").html(output);

      console.log("URLS: " + output.substring(0, output.length - 2));
       if($("#discussion_detail").val().trim()==""){
            if(Session.get("post_type")=="metadata_url"){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
                   return false;
            }
        };

     fetch_meta_information_in_url(output);
      //$("#result").html("").addClass("loaded");

    }
    //console.log("URLS: " + output.substring(0, output.length - 2));

    //setTimeout(function() {
    //var lastURL = output;
    //checklastHover(lastURL);

    //}, 100);

  });

  },



});






function getTextAreaSelection(textarea) {
    var start = textarea.selectionStart, end = textarea.selectionEnd;
    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}



function fetch_meta_information_in_url(output){

 $("#loader_class").removeClass("div_hide_class");
      Meteor.call('fetch_url_information',output,function(error,result){
        if(error){
          console.log("Error");
        }else{

         if($("#discussion_detail").val().trim()==""){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
                   return false;
        };

          if(Session.get("request_send")=="false"){
          $("#loader_class").addClass("div_hide_class");
          $("#url_metadata_div").removeClass("div_hide_class");
          Session.set("request_send","true");
          console.log(JSON.stringify(result));
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
  console.log('lastURL ' + lastURL);
  console.log("Last hover");
}
