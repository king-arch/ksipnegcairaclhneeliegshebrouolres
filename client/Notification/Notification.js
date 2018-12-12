import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Base64 } from 'meteor/ostrio:base64';

import { Meteor } from 'meteor/meteor';
import { UserInfo }  from './../../import/collections/insert.js';
import { UserSkill } from './../../import/collections/insert.js';

import { UserProfJr } from './../../import/collections/insert.js';
import { UserEdu } from './../../import/collections/insert.js';

import { UserAward } from './../../import/collections/insert.js';
import { UserMedical } from './../../import/collections/insert.js';
import { FriendRequest } from './../../import/collections/insert.js';

import { Message } from './../../import/collections/insert.js';
import { UserGroup } from './../../import/collections/insert.js';
import { Email } from 'meteor/email';
import { GroupRequest } from './../../import/collections/insert.js';
import { Chatroom } from './../../import/collections/insert.js';
import { VideoSession } from './../../import/collections/insert.js';
import { AudioSession } from './../../import/collections/insert.js';

import { ServiceConfiguration } from 'meteor/service-configuration';

import { Emembers } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';
import { Blog } from './../../import/collections/insert.js';

import { Comment } from './../../import/collections/insert.js';
import { Like } from './../../import/collections/insert.js';
import { Followers } from './../../import/collections/insert.js';
import { Hub } from './../../import/collections/insert.js';
import { Discussion } from './../../import/collections/insert.js';

import { Notifications } from './../../import/collections/insert.js';
    Template.registerHelper('equals', function (a, b) {
      return a === b;
    });

Template.notifi.onRendered(function(){
  Meteor.subscribe("all_user_related_notifications",Session.get("userId"));
  Meteor.subscribe("notification_observer",Session.get("userId"));
        $('#loading_div').removeClass("loader_visiblity_block");

    setTimeout(function(){
      $('#loading_div').addClass("loader_visiblity_block");
      },3000);

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



    var logged_in_User =  Session.get("userId");

    var userHandle =  Notifications.find({notification_by: logged_in_User }, {sort: {created_at: -1}, limit: 1}).observe({
            addedAt: function(newDoc) {
              
              // Meteor.call('PushNotifcationForApp',newDoc,logged_in_User,function(error,result){
              //   if(error){
              //       console.log('Error');
              //     }else{
              //       console.log('Sucessfull');
              //     }
              //   });
// ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
//                     var name = newUser[0].name;
      
//       if(newUser[0].user_token){
//       Push.send({
//             title: name,
//             text: msg_text,
//             from: 'server',
//             badge: 1,
//         query: {
//                 token: newUser[0].user_token
//             }             
//         }); 
//       }
      
//       }
//       ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss

    },
      removed: function(oldDoc) {
    },
      changed: function(newDoc, oldDoc) {
        }
      });
      
   });



Template.notifi.helpers({

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
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds   /*"  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] "*/;
      }
    }else{
      return "NaN"
    }
   
  },

  all_notifications:function(){

    var userId = Session.get("userId");
    console.log(userId);
    var all_notifications =  Notifications.find({"notification_for":userId , "notification_by" :  {$ne:userId} },{sort: {created_at: -1} }).fetch();
    // return Notifications.find({"notification_for":userId, is_read: 0},{sort: {created_at: -1} }).fetch();
    console.log("all_notificationsall_notifications");
    console.log(all_notifications);
    return all_notifications;
  },

  fetch_user_information:function(){

    var userId = this.notification_by;
    Meteor.subscribe("user_info_based_on_id",userId);
    return UserInfo.find({"user_id":userId}).fetch();

  },

  show_event_name(){ 
          var event_id = this.event_id;
          Meteor.subscribe("event_based_on_event_id",event_id);
          return Event.find({event_id: event_id}).fetch();
  },

show_discussion_name(){
    var discussion_id = this.discussion_id;
    Meteor.subscribe("discussions_based_on_discussion_ids",discussion_id);
    return Discussion.find({ discussion_id: discussion_id }).fetch()
},

 show_group_name(){
    var grp_id = this.grp_id;
    Meteor.subscribe("group_information_based_on_group_id",grp_id);
    return UserGroup.find({ grp_id: grp_id }).fetch()
 },

 show_blog_name(){
    var blog_id = this.redirect_page;
    Meteor.subscribe("blog_information_based_on_blog_id",blog_id);
    return Blog.find({ blog_id: blog_id }).fetch()
 },

 show_hub_post_name(){
    var post_id = this.redirect_page;
    Meteor.subscribe("hub_post_information",post_id)
    return Hub.find({ post_id: post_id }).fetch()
 },

});


Template.notifi.events({

  'click .go_inside_event': function(){
    // alert('hero');
    var event_id = this.event_id;
    var logged_in_user = Session.get("userId");

    event_id= Base64.encode(event_id); 
    var url = '/event_detail/'+ event_id;   
    // alert('url: '+url);
    Router.go(url);       
    return false;  
    },

'click .redirect_click_1': function(event){ 
    event.preventDefault();
    var user_id = this.user_id;
    var logged_in_user = Session.get("userId");
    if(user_id == logged_in_user)
    {
      Router.go('/profile');    
    }
    else{
    user_id = Base64.encode(user_id); 
    var url = '/view_profile/'+ user_id;
    Router.go(url); 
    }
},


'click .go_inside_discussion': function(){ 
    var discussion_id = this.discussion_id;
    var logged_in_user = Session.get("userId");

    discussion_id= Base64.encode(discussion_id); 
    var url = '/grp_discussion_detail/'+ discussion_id;   
    Router.go(url);       
    return false;  
},

'click .go_inside_group': function(event){
    event.preventDefault(); 
    var grp_id = this.grp_id;
    var logged_in_user = Session.get("userId");
    grp_id= Base64.encode(grp_id); 
    var url = '/group_detail/'+ grp_id;   
    Router.go(url);       
    // return false;  
},

'click .go_inside_group_members': function(){ 
    var grp_id = this.grp_id;
    var logged_in_user = Session.get("userId");

    grp_id= Base64.encode(grp_id); 
    var url = '/Group_member/'+ grp_id;   
    Router.go(url);       
    return false;  
},

'click .go_inside_blog': function(){ 
  // alert('hero: ');
    var blog_id = this.blog_id;
    // var userId = Session.get("userId");
    // alert(blog_id);

    blog_id = Base64.encode(blog_id); 
    var url = '/blog_detail/'+ blog_id;   
// alert(url); 
    Router.go(url);       
    return false;   
},

'click .go_inside_connections': function(){ 

    var url = '/connection/';   
    Router.go(url);       
    return false;     

},

'click .go_inside_hub_post': function(){ 
    var post_id = this.post_id;
    // alert(post_id); 
    post_id = Base64.encode(post_id); 
    var url = '/post_detail_page/'+ post_id;   
    Router.go(url);       
    return false;     
},

});

