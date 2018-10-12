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

Template.header.onCreated(function(){
this.notification_visibility = new ReactiveVar("");
var logged_in_User =  Session.get("userId");
if(logged_in_User == null || logged_in_User == undefined || logged_in_User == ""){
    Router.go("/"); 
}
});
Template.header.onRendered(function(){
    Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
    Meteor.subscribe("all_user_related_notifications",Session.get("userId"));
  Meteor.subscribe("check_for_new_connection_requests",Session.get("userId"));
  Meteor.subscribe("notification_observer",Session.get("userId"));
 $('#hereiam').click();

 var url = window.location.href+"";
 var active_panel = "";
      if(url.includes("feed") || url.includes("post_detail_page"))
        {
           active_panel = "feed";
        }else if(url.includes("blog")){
          active_panel = "blog";         
        }else if(url.includes("event")){
          active_panel = "event";         
        }else if(url.includes("group") || url.includes("grp")){
          active_panel = "group"
        }else if(url.includes("messag") || url.includes("Messag") ){
          active_panel = "message";
        }else if(url.includes("connection")){
          active_panel = "connection"
        }else if(url.includes("users_map")){
          active_panel ="map";
        }else if(url.includes("notification")){
          active_panel ="notification";
        }else if(url.includes("ads")){
          active_panel = "ads";
        }
       Session.set("active_panel",active_panel);

    var logged_in_User =  Session.get("userId");

    Meteor.call("update_last_activity",logged_in_User,function(error,result){
      if(result){
        console.log(result);
      }else{ 
        console.log("Update while Last activity" + ERROR);
      }
    });
   
    var result = UserInfo.find({user_id: logged_in_User}).fetch();

if(result[0]){

   if(result[0].status == 'Blocked' ){
        Session.setPersistent("userId","");
        // Session.get("userId");
        // Router.go("/"); 
    }

if(result[0].font_increase_status){
if(result[0].font_increase_status == 'plus'){

$('html, body').addClass('increase_font');
$('html, div').addClass('increase_font');
$('html, p').addClass('increase_font');
$('html, a').addClass('increase_font');
$('html, a').removeClass('increase_font');
$('html, span').addClass('increase_font');
$('html, button').addClass('increase_font');
$('html, ul').addClass('increase_font');
$('html, label').addClass('increase_font');

}
}
 
}





  $("#loader").show();
  setTimeout(function(){
    $("#loader").hide();
  },1500);

     
   
    var sent_by = Session.get("userId");
    var userHandle =  Chatroom.find({
            $or:
             [
              {
               user1: sent_by
              },
              {
               user2: sent_by
              }
             ]
           },{sort: {last_msg_time: -1}}).observe({
            added: function(newDoc) {
    },
      removed: function(oldDoc) {
    },
      changed: function(newDoc, oldDoc) {
      if(newDoc.total_messages != oldDoc.total_messages){   
        // display the icons
        if(newDoc.last_msg_sent_by != Session.get("userId")){
            $("#hide_notification_dot").removeClass("loader_visiblity_block");
        }
          // alert("Display");
          // Session.set("visibleHeaderDot","true");
           // var instance = Template.instance();
           // instance.notification_visibility.set("true");
        }
    }


  });

   var logged_in_user = Session.get("userId");
   var friendrequest_status =  FriendRequest.find({
               req_status: 0,
               sent_to: logged_in_user
           }).observe({
            added: function(newDoc) {
       $("#hide_notification_dot_connection").removeClass("loader_visiblity_block");
    },
      removed: function(oldDoc) {
    },
      changed: function(newDoc, oldDoc) {
     
    }
  });

      Meteor.autorun(function () {
         // $(".internet_connectivity").addClass("loader_visiblity_block");
    var stat;
    if (Meteor.status().status === "connected") {
        stat = 'connected'
        $(".internet_connectivity").addClass("loader_visiblity_block");
        $("#alert_success").addClass("loader_visiblity_block");
    }
    else if (Meteor.status().status === "connecting") {
        stat = 'connecting'
       // alert("connecting");
        $("#alert_danger").addClass("loader_visiblity_block");
        $("#alert_success").removeClass("loader_visiblity_block");
        // $(".internet_connectivity1").removeClass("loader_visiblity_block");
    }
    else {
          
        $("#alert_success").removeClass("loader_visiblity_block");
        $(".internet_connectivity").removeClass("loader_visiblity_block");
      }
    Session.set('status',stat);
});


});

// function takeOverConsole(){
//     var console = window.console
//     if (!console) return
//     function intercept(method){
//         // alert(method);
//         var original = console[method]
//         console[method] = function(){
//             // do sneaky stuff
//               location.reload();
//             if (original.apply){
//                 // Do this for normal browsers
//                 original.apply(console, arguments);
//             }else{
//                 // Do this for IE
//                 var message = Array.prototype.slice.apply(arguments).join(' ');
//                 original(message);
//             }
//         }
//     }
//     // var methods = ['log', 'warn', 'error']
//     var methods = ['error']
//     for (var i = 0; i < methods.length; i++)
//         intercept(methods[i])
// }


Template.header.helpers({
    active_panel(){
      return Session.get("active_panel");
/*        var url = window.location.href+"";
      if(url.includes("feed") || url.includes("post_detail_page"))
        {
          return "feed";
        }else if(url.includes("blog")){
          return "blog";         
        }else if(url.includes("event")){
          return "event";         
        }else if(url.includes("group") || url.includes("grp")){
          return "group"
        }

        else if(url.includes("messag") || url.includes("Messag") ){
          return "message";
        }else if(url.includes("connection")){
          return "connection"
        }else if(url.includes("users_map")){
          return "map";
        }else if(url.includes("notification")){
          return "notification";
        }else if(url.includes("ads")){
          return "ads";
        }
*/        // alert("Url");

    },
  fetch_username(){
    var name = UserInfo.find({"user_id":Session.get("userId")}).fetch();
      var first_name = name[0].name;
      return first_name.split(" ")[0];
  },
     check_notification_status(){
    var userId = Session.get("userId");
    var result = Notifications.find({ "notification_for":userId,is_read: 0 }).count();
    if(result > 0){
      return true;
    }
 },notification_visibility(){
  /* var instance = Template.instance();
    return instance.notification_visibility.get();*/
    if(Session.get("visibleHeaderDot")=="true"){
      return true;
    }
 },
 user_profile_pic(){
   var profile_pic = UserInfo.find({"user_id":Session.get("userId")}).fetch();
   if(profile_pic[0]){
    return profile_pic[0].profile_pic;
   }
 },

  logged_in_user_isadmin(){
    var logged_in_User = Session.get("userId");
    if(logged_in_User == 'user_admin'){
          return true;
    }
    else{
      return false;
    }
 },

});


Template.header.events({

    'click #hereiam': function(){
    // alert('cool');
    $('.modal').modal();

  },
  
  "click .feed_redirect":function(event){
    event.preventDefault();
    Router.go("/feed");
  },
  'keyup input': function(event) {
      if (event.which === 13) {
            var search_text = $("#search_text").val();

             if(search_text == null || search_text == "")
                {
                  $('#search_text').addClass('emptyfield').focus();
                  return false; 
                }
                else{
                  $('#search_text').removeClass('emptyfield');
                }
            
all_users =   Meteor.subscribe("all_users_with_searched_keyword",Session.get("userId"),search_text);
all_groups =   Meteor.subscribe("all_groups_with_searched_keyword",search_text);
all_events =   Meteor.subscribe("all_events_with_searched_keyword",search_text);
all_blogs =   Meteor.subscribe("all_blogs_with_searched_keyword",search_text);
            Router.go("/search/"+search_text); 
            Session.setPersistent("searched_text",search_text);
          }
        },
      'click #messages_icon':function(){
            $("#hide_notification_dot").addClass("loader_visiblity_block");
          },

      'click #connections_click':function(){
            $("#hide_notification_dot_connection").addClass("loader_visiblity_block");
          },

'click #logout': function(){
            var login_status = 0;
              var userId = Session.get("userId");
              

                              var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    
              Meteor.call("update_login_status",login_status,userId,function(error,result){
              if(error){
                 alert('user login status updation error');
                 console.log('error');
              }
              else{
                 console.log('result');
                 Meteor.logout();
                var t1 = Session.get("check_onlyonce");
                if(t1 == 0){
                  Session.setPersistent("check_onlyonce",1);
                     document.getElementById("logout").click();
                }
                Session.clear("userId");

                 var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

                Session.clear("check_source");
                Router.go('/logout');
              }
            });
      },
 
'click #increase_font': function(){
          // alert('increase');
$('html, body').addClass('increase_font');
$('html, div').addClass('increase_font');
$('html, p').addClass('increase_font');
$('html, a').addClass('increase_font');
$('html, a').removeClass('increase_font');
$('html, span').addClass('increase_font');
$('html, button').addClass('increase_font');
$('html, ul').addClass('increase_font');
$('html, label').addClass('increase_font');

    var font_increase_status = 'plus';
    var logged_in_User =  Session.get("userId");
    // var result = UserInfo.find({ user_id: logged_in_User });

  Meteor.call('save_font_increase_status',font_increase_status,logged_in_User,function(error,result){
   var userId = Session.get("userId");
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');

          }else{
              // sAlert.success('Sucessfully commented',"123");
              console.log('Font increase setting Sucessfully saved');
              }
      });

      },

'click #decrease_font': function(){
          // alert('decrease');/
$('html, body').removeClass('increase_font');
$('html, div').removeClass('increase_font');
$('html, p').removeClass('increase_font');
$('html, a').removeClass('increase_font');
$('html, a').removeClass('increase_font');
$('html, span').removeClass('increase_font');
$('html, button').removeClass('increase_font');
$('html, ul').removeClass('increase_font');
$('html, label').removeClass('increase_font');

    var font_increase_status = 'minus';
    var logged_in_User =  Session.get("userId");
    // var result = UserInfo.find({ user_id: logged_in_User });

  Meteor.call('save_font_increase_status',font_increase_status,logged_in_User,function(error,result){
   var userId = Session.get("userId");
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');
          }else{
              // sAlert.success('Sucessfully commented',"123");
              console.log('Font increase setting Sucessfully saved');
              }
      });

      },
});

Template.header.onDestroyed(function(){
 
  // setTimeout(function(){
  //    location.reload();
  // },80);

Session.setPersistent("searched_text","");
  var url = window.location.href;

        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        if(url == 'notification'){

   var logged_in_User =  Session.get("userId");
   Meteor.call('update_notification_read_status',logged_in_User,function(error,result){
         if(error){
              console.log('error');
          }else{
              console.log('Notification status Sucessfully Updated');
              }
      });
    }
});