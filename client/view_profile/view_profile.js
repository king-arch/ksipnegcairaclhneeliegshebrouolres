
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import { UserInfo } from './../../import/collections/insert.js';
import { UserSkill } from './../../import/collections/insert.js';
import { UserProfJr } from './../../import/collections/insert.js';
import { UserEdu } from './../../import/collections/insert.js';

import { UserAward } from './../../import/collections/insert.js';
import { UserMedical } from './../../import/collections/insert.js';
import { FriendRequest } from './../../import/collections/insert.js';
import { UserGroup } from './../../import/collections/insert.js';
import { Blog } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

     




   Template.view_profile.onDestroyed(function(){
    user_info_based_on_id.stop();
    user_skills_other_user.stop();
    user_professional_journey_other_user.stop();
    user_education_other_user.stop();
    user_award_other_user.stop();
    user_medical_other_user.stop();
    all_user_friends.stop();
   });


    let user_info_based_on_id;
    let  user_skills_other_user;
    let user_professional_journey_other_user;
    let user_education_other_user;
    let user_award_other_user;
    let user_medical_other_user;
    let all_user_friends;

 
   Template.view_profile.onRendered(function(){
 var logged_in_User =  Session.get("userId");
    var url = window.location.href;

        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        if(url !='profile'){
        var user_id_by_url = Base64.decode(url); 
          var other_user_profile = user_id_by_url;
        }else{
          
          var other_user_profile = Session.get("userId");
        }
        Session.set("other_user_profile",other_user_profile);
   user_info_based_on_id =   Meteor.subscribe("user_info_based_on_id",Session.get("other_user_profile"));
     user_skills_other_user =  Meteor.subscribe("user_skills_other_user",Session.get("other_user_profile"));
     user_professional_journey_other_user = Meteor.subscribe("user_professional_journey_other_user",Session.get("other_user_profile"));
    user_education_other_user = Meteor.subscribe("user_education_other_user",Session.get("other_user_profile"));
   user_award_other_user =   Meteor.subscribe("user_award_other_user",Session.get("other_user_profile"));
     user_medical_other_user = Meteor.subscribe("user_medical_other_user",Session.get("other_user_profile"));
     all_user_friends =   Meteor.subscribe("all_friend_users");
     Meteor.subscribe("group_count_for_current_user",Session.get("other_user_profile"));
     Meteor.subscribe("blog_count_for_current_user",Session.get("other_user_profile"));
     Meteor.subscribe("connection_count_for_current_user",Session.get("other_user_profile"));

   
  Meteor.call('FetchUserData',other_user_profile,function(error,result){
    if(error)
      {
         console.log('Error');
      }
      else{
        Session.set("other_user_profile",other_user_profile);
       $("#loading_div").hide();
 
        // alert("Result for"+ other_user_profile );

        // console.log(result);
        // UI._globalHelpers['display_summary']();
        // UI._globalHelpers['show_profjr']();
        // UI._globalHelpers['display_award']();
        // UI._globalHelpers['show_education']();
        // UI._globalHelpers['show_skills']();

    // Template.view_profile.__helpers["summery_helper_2"]();
        var result = result;

setTimeout(function(){
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
},3000);  
  }
});

   });






Template.view_profile.helpers({

  profilepic_image:function(){
 // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var user_id =  Session.get("other_user_profile");
     var head = UserInfo.find({user_id: user_id}).fetch();
  // alert(head[0].cover_image);

  if(head[0]){


  var image_Name = head[0].profile_pic;
  if(image_Name){
  var display_image = image_Name;
    return display_image;
  }
}
  },

    uploaded_image:function(){
    // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var user_id =  Session.get("other_user_profile");
  var head = UserInfo.find({user_id: user_id}).fetch();
  // alert(head[0].cover_image);

  if(head[0]){


  var image_Name = head[0].cover_image;
  if(image_Name){
  var display_image = image_Name;
  // alert(display_image);
    return display_image;
  }
  else{
           var display_image = '/uploads/default/cover.jpg';
           // alert(display_image);
           return display_image;
     }

   }
  },

    display_leftpanel_info(){
      // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var user_id =  Session.get("other_user_profile");
    var head = UserInfo.find({user_id: user_id}).fetch();
    // postCreatorName[0].name
    return head; 
},

  passion_list: function(){
   // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var head = UserInfo.find({user_id: Session.get("other_user_profile")}).fetch();   
   if(head[0]){
   if(!head[0].passion){
    return "";
   }



    if(head[0].passion){
      var new_passion = head[0].passion;
      new_passion = new_passion.split(",");
   }

   
      var content = [];
      for(var i=0;i<new_passion.length;i++){
        content.push({tag:new_passion[i]})
      }


    return content;  
  }
   
  },

  display_heading: function(){
        // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var user_id =  Session.get("other_user_profile");
    var head = UserInfo.find({user_id: user_id}).fetch();
    return head[0].headline;
  },

   display_summary: function(){
     // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var user_id =  Session.get("other_user_profile");
    var summary_1 = UserInfo.find({user_id: user_id}).fetch();
    if(summary_1[0]){
      if(!summary_1[0].summary){
      return false;
    }
    return summary_1;  
    }
    
  },

  summery_helper_2(summary){
    // alert(summary);
    var summary_text = summary;
    var count = summary_text.length;
    if(count > 460){
          var summary_text = summary_text.slice(0,460);
    }
  
    return summary_text;
  },

  show_Readless(){
    var summ = this.summary;
    var count = summ.length;
    if(count > 460){
          return true;
    }
  },

  show_education(){
       // const t2 = Template.instance();
       //  var user_id =  t2.show_connection.get();
       var user_id =  Session.get("other_user_profile");
       var result =  UserEdu.find({user_id: user_id}).fetch();
       return result;
    },

     show_score(score){
      var score = score;
      if (isValid(score)) {
        return 'Score(%):';
       }
       else{
       return 'Score(CGPA):';
       }
    },

     display_award(){
        // const t2 = Template.instance();
        // var user_id =  t2.show_connection.get();
        var user_id =  Session.get("other_user_profile");    
      var result =  UserAward.find({user_id: user_id}).fetch();
      return result;
    },

    show_skills(){
      // const t2 = Template.instance();
        // var user_id =  t2.show_connection.get();
var user_id =  Session.get("other_user_profile");
       var result =  UserSkill.find({user_id: user_id}).fetch();
       return result;
    },

   skill_gif(awd_expert){
   var awd_expert = awd_expert;
      if(awd_expert == 'Beginner'){
         return '/uploads/skill/beginner.gif';
      }
      else if(awd_expert == 'Middle'){
        return '/uploads/skill/middle.gif';
      }
      else if(awd_expert == 'Expert'){
        return '/uploads/skill/expert.gif';
      }
    },
     show_display_heading: function(){ 
      // const t2 = Template.instance();
      // var show_connection = t2.show_connection.get();  
    var head = UserInfo.find({user_id: Session.get("other_user_profile")});  
    return head;  
  },

  
  user_is_admin(){
      var logged_in_user = Session.get("userId");
      // var user_id_by_url = Session.get("user_id_by_url");
      const t2 = Template.instance();
        var user_id_by_url = Session.get("other_user_profile");


      // alert('logged_in_user:'+logged_in_user+'user_id_by_url'+user_id_by_url);
      if( logged_in_user == 'user_admin' || user_id_by_url == 'user_admin' ){
        return true;
      }
      else{
        return false;
      }
  },

 show_display_name(){

    // const t2 = Template.instance();
    // var show_connection = t2.show_connection.get();

    var head = UserInfo.find({user_id: Session.get("other_user_profile")}).fetch();
    Session.setPersistent('show_con_id',Session.get("other_user_profile"));
    return head;

 },

  Pending_msg(){

      var sent_by = this.sent_by;
      var logged_in_user = Session.get("userId");

      if(logged_in_user == sent_by){
          return 'pending request';
      }
      else{
          return 'you have request of this user in your pending list';
      }

  },

   show_display_summary: function(){

    // const t2 = Template.instance();
    // var show_connection = t2.show_connection.get();
    var show_connection = Session.get("other_user_profile");
    var summary_1 = UserInfo.find({user_id: show_connection}).fetch();
    return summary_1;

  },

  show_display_info(){

      // const t2 = Template.instance();
      // var show_connection = t2.show_connection.get();
      return UserInfo.find({user_id: Session.get("other_user_profile")}).fetch();
  },
   show_profjr(){
     // const t2 = Template.instance();
    // var user_id =  t2.show_connection.get();
    var user_id =  Session.get("other_user_profile");
    // alert("Show Prof");
  var result =  UserProfJr.find({user_id: user_id}).fetch();
       return result;
    }, 
    show_show_profjr(){
      // //alert('coolz');
      // alert("Show Prof JR");
        const t2 = Template.instance();
        var show_connection = t2.show_connection.get();
        // var show_connection = Session.get("other_user_profile");
       var result =  UserProfJr.find({user_id: show_connection}).fetch();
       console.log(result);
       // //alert(result);
       return result;
    },

        show_show_education(){
      // //alert('coolz');
        // const t2 = Template.instance();
        // var show_connection = t2.show_connection.get();
        var show_connection = t2.show_connection.get();
       var result =  UserEdu.find({user_id: Session.get("other_user_profile")}).fetch();
       // console.log(result);
       // //alert(result);
       return result;
    },

    show_score(score){
        var score = score.split('/');

        var length = score.length;
        if(length == 2)
        {
          return 'Score(CGPA):';
        }
        else if(length == 1)
        {
          return 'Score(%):';
        }
    },

        show_display_award(){
        // const t2 = Template.instance();
        // var show_connection = t2.show_connection.get();
       var result =  UserAward.find({user_id: Session.get("other_user_profile")});
       return result;
    },

        show_show_skills(){
        // const t2 = Template.instance();
        // var show_connection = t2.show_connection.get();

       var result =  UserSkill.find({user_id: Session.get("other_user_profile")});
       return result;
    },

    show_display_health(){
        // const t2 = Template.instance();
        // var show_connection = t2.show_connection.get();
       var result =  UserMedical.find({user_id:Session.get("other_user_profile")}).fetch();
       // //alert(result);
       return result;
    },

    check_status(){
      // const t2 = Template.instance();
      // var sent_to = t2.show_connection.get();
      var sent_to = Session.get("other_user_profile");
      var sent_by = Session.get("userId");

      // alert('sent_to:'+sent_to+' sent_by:'+sent_by);

      var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);

      var show_button = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to }, { sent_by: sent_by } ] }, { $and: [ { sent_to: sent_by }, { sent_by: sent_to } ] } ] },{sort: {requestedAt: -1},limit: 1 } ).fetch();
      // var length = show_button.length;
      console.log(show_button);
      return show_button;
    },

    show_blog_count(){
        // const t2 = Template.instance();
        // var logged_in_user = t2.show_connection.get();
        var logged_in_user = Session.get("other_user_profile");
        // var logged_in_user = Session.get("userId");
          var mydate=new Date();         
          var str=moment(mydate).format('YYYY-MM-DD');
          var c1 =Blog.find({ $and:[
          {is_draft: 0},
          {is_active: 1},
         {blog_creator_id:logged_in_user}
        ,{Blog_publish_date:{$lte:str}}]}).count();
      // console.log(c1);
      return c1;
    
},

  show_connection_count(){
  const t2 = Template.instance();
        // var sent_to = t2.show_connection.get();
        var sent_to = Session.get("other_user_profile");
       // var sent_to = Session.get("userId");
       var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).count();
       return count3;   
  },

  show_group_count(){
      // const t2 = Template.instance();
        // var logged_in_user = t2.show_connection.get();
        var logged_in_user =Session.get("other_user_profile");
       // var logged_in_user = Session.get("userId");
       var count3 = UserGroup.find({ admin: logged_in_user }).count();     
       return count3;   
  },

  headline_trim(){
          var headline = this.headline;
          if(headline.length > 20){
            headline = headline.substr(0,20);
            return headline+'...';
          }
          else{
            return headline;
          }
  },

  check_logged_in_user(){
   var sent_by = this.sent_by;
   var logged_in_user = Session.get("userId");
   // alert('sent_by: '+sent_by+' logged_in_user: '+logged_in_user);
     if( logged_in_user == sent_by ){
         return true;
     }
     else{
        return false;
     }
  },
  show_disablity(){
        // const t2 = Template.instance();
        // var show_connection = t2.show_connection.get();
        var show_connection = Session.get("other_user_profile");
        var result =  UserMedical.find({user_id:show_connection}).fetch();
        if(result[0]){
        if(    result[0].hearing == 'No'
            && result[0].speech  =='No' 
            && result[0].speech == 'No' 
            && result[0].physical == 'No' ){
          return [];
        }else{
          return result;
        }
      }
  }



});


function isValid(str)
{
 return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
  }


Template.view_profile.events({

   'click .request_accept_status': function(){
   
   var sent_by = this.sent_by;
   var sent_to = Session.get("userId");
  
   var show_button = FriendRequest.find({ sent_to: sent_to , sent_by: sent_by }).fetch();
  
      var length = show_button.length;
      if(length > 1){
        var req_id = show_button[length-1].req_id;
      }
      else{
        var req_id = show_button[0].req_id;
      } 

   var request_type = 1;
   Meteor.call('con_req_update',req_id,sent_by,sent_to,request_type,function(error,result){
    if(error)
      {
         console.log('Error');
      }
      else{
        console.log('sucess: '+result);
      }
   });
   
  },

   'click #read_more_summary': function(){
          var ww = this.summary;
          // alert("sum: "+ww);
          $('#summary_display_3').text(ww);

          $('#read_more_summary').addClass('hide_redmore');
          $('#read_less_summary').removeClass('hide_redmore');
        },

       'click #read_less_summary': function(){
         var summary_text = this.summary;
         var count = summary_text.length;
         if(count > 440){
          var summary_text = summary_text.slice(0,440);
         }
        $('#summary_display_3').text(summary_text);
          $('#read_less_summary').addClass('hide_redmore');
          $('#read_more_summary').removeClass('hide_redmore');
        },

    'click #connect_now':function(event){
      // const t2 = Template.instance();
      // var sent_to = t2.show_connection.get();
      var sent_to = Session.get("other_user_profile");
      var sent_by = Session.get("userId");

      Meteor.call('con_req_insert',sent_to,sent_by,function(error,result){
      if(error){
        console.log('Error in sending request !!!');
      }else{
              console.log('Request Successfully Sent.');
           }
      });      

      Session.clear("current_req_id");  // here  
    },

});