


import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Session } from 'meteor/session';
import { UserGroup } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { GroupRequest } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { FriendRequest }  from './../../../import/collections/insert.js';
import { Discussion }  from './../../../import/collections/insert.js';

// Template.grpdetail.onCreated(function(){
//   Session.set("friendsCounter",0);

//   this.connections_you_may_know=  new ReactiveVar(0);
//   this.show_all_group_members_count =  new ReactiveVar(0);

//   // document.body.scrollTop = document.documentElement.scrollTop = 0;
// });

    
   Template.grpdetail.onDestroyed(function(){
    /*setTimeout(function(){
      alert(window.history.back + "");
    },100);*/
      all_friends_users.stop();
     });

var all_friends_users;
    Template.grpdetail.onRendered(function(){
       var url = window.location.href;
       var new_url = url.split("/");
       var url = new_url[new_url.length-1];
        
      var decoded = Base64.decode(url);
      Session.set("show_grp_id",decoded);

       var g1 = Session.get("show_grp_id");
      Meteor.subscribe("group_information_based_on_group_id",g1);
      all_friends_users = Meteor.subscribe("all_friend_users");

      var logged_in_User =  Session.get("userId");
      Meteor.call("fetch_group_details",decoded,function(error,result){
        if(result){
          var img = result[0].grp_image;
    var default_value = 'Default_group.png';
    if(img ==  default_value)
    {
    var display_image = '/uploads/default/'+ img;
    }
    else{
       var display_image = img;
      }
      $("#group_banner_image").attr("src",display_image);
      $("#group_title").text(result[0].grp_title);
      Session.set("current_post_admin",result[0].admin);
      $("#group_description").text(result[0].grp_discription);

    }else{

    }
      });

      Meteor.call('FetchUserData',logged_in_User,function(error,result){
    if(error)
      {
         console.log('Error');
      }
      else{

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
  }});



   });
   

Template.grpdetail.helpers({

  show_group_details(){
    var g1 = Session.get("show_grp_id");
    Meteor.subscribe("group_information_based_on_group_id",g1);
    var head = UserGroup.find({grp_id: g1}).fetch();
    return head;
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

  Show_grp_image(){
  var img = this.grp_image;
    // alert(img);
    var default_value = 'Default_group.png';
    if(img ==  default_value)
    {
    var display_image = '/uploads/default/'+ img;
    }
    else{
       var display_image = img;
      }
        return display_image;
    },
      show_admin_details(){
      var user_id = Session.get("current_post_admin");
         Meteor.subscribe("user_info_based_on_id",user_id);
      var head = UserInfo.find({user_id: user_id});
      return head;
  },

  Show_admin_image(){
  var img = this.profile_pic;
    var default_value = 'default-profile-pic.png';
    if(img ==  default_value)
    {
    var display_image = '/uploads/default/'+ img;
    }
    else{
  var display_image = img;
    }
    return display_image;
    },

    activity_status(){
    var activity_status  = this.activity_status;
    if(activity_status == 1){
      return true;
    }
    else{
      return false;
    }
    },

    current_user_admin(){
      var userId = Session.get("userId");
      var group_admin = Session.get("current_post_admin");
      if(userId == group_admin)
      {
        return true;
      }
      else{
        return false;
      }
    },


    join_status_check_array(){  
    var sent_by = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    var Group_array = UserGroup.find({grp_id: grp_id }).fetch();
    // alert(count);
    if( sent_by == Group_array[0].admin ){
      return false;
  }
  else{
     return Group_array;
  }
    },

    leave_status(){
          
          var grp_type = this.grp_type;        
          var invite_list = this.invite_list;        
          var invite_accepted = this.invite_accepted;
          var requestee_list = this.requestee_list;

    var userid = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    // var GroupRequest_array = UserGroup.find({sent_by: sent_by,grp_id: grp_id , admin: sent_by}).fetch();
    // alert( 'invite_list: '+invite_list+' invite_accepted: '+invite_accepted+' grp_type:'+grp_type );

if(grp_type == "Open" && invite_accepted.includes(userid)){
    // alert('case 1');
    return true;
}
else if(grp_type == "Private" && invite_accepted.includes(userid) && invite_list.includes(userid) ){     
    // alert('case 3');
    return true;
}
else if(grp_type == "Public" &&  invite_accepted.includes(userid)){
    // alert('case 4');
    return true;
}   
else{
  // alert('case 2');
  return false;
}
//      if(grp_type == 'Private' && invited_list.includes(userid)){ 
//         alert('case 1');
//       if(invite_accepted.includes(userid)){
//         alert('case 2');
//         return true;
// }
// else{
//         alert('case 3');
//               return false;
//          } }
//          else if(grp_type == 'Public' && invite_accepted.includes(userid)){
//             return true;
//           }
//           else{
//             return false;
//           }
    },    

  join_status(){

         var grp_type = this.grp_type;        
         var invite_list = this.invite_list;       

         var invite_accepted = this.invite_accepted;
         var requestee_list = this.requestee_list;
         var admin = Session.get("current_post_admin");

         var userid = Session.get("userId");
         var grp_id = Session.get("show_grp_id");

// alert(' grp_type: '+grp_type+' invite_list: '+invite_list+' invite_accepted: '+invite_accepted+' requestee_list: '+requestee_list+' admin: '+admin+' userid: '+userid);

   if(userid == admin ){
     return true;
   }

   // var GroupRequest_array = UserGroup.find({sent_by: sent_by,grp_id: grp_id , admin: sent_by}).fetch();

if(grp_type == "Open" && !invite_accepted.includes(userid)){
   // alert('case 5');
   return true;
}
else if(grp_type == "Private" && !invite_accepted.includes(userid) && invite_list.includes(userid) ){     
   // alert('case 6');
   return true;
}
// else if(grp_type == "Public" &&  !invite_accepted.includes(userid) && !requestee_list.includes(userid) ){
//    // alert('case 7');
//    return true;
// }   

else{
 // alert('case 8');
 return false;
}

   },

     join_status_Show_discussion_btn(){

         var grp_type = this.grp_type;        
         var invite_list = this.invite_list;       

         var invite_accepted = this.invite_accepted;
         var requestee_list = this.requestee_list;
         var admin = Session.get("current_post_admin");

         var userid = Session.get("userId");
         var grp_id = Session.get("show_grp_id");

// alert(' grp_type: '+grp_type+' invite_list: '+invite_list+' invite_accepted: '+invite_accepted+' requestee_list: '+requestee_list+' admin: '+admin+' userid: '+userid);

   if(userid == admin ){
     return true;
   }

   // var GroupRequest_array = UserGroup.find({sent_by: sent_by,grp_id: grp_id , admin: sent_by}).fetch();

if(grp_type == "Open" && invite_accepted.includes(userid)){
   // alert('case 5');
   return true;
}
else if(grp_type == "Private" && invite_accepted.includes(userid) ){     
   // alert('case 6');
   return true;
}

else if(grp_type == "Public" && invite_accepted.includes(userid) ){     
   // alert('case 6');
   return true;
}
// else if(grp_type == "Public" &&  !invite_accepted.includes(userid) && !requestee_list.includes(userid) ){
//    // alert('case 7');
//    return true;
// }   

else{
 // alert('case 8');
 return false;
}

   },

    Send_invitee_request(){
          
          var grp_type = this.grp_type;        
          var invite_list = this.invite_list;        
          var invite_accepted = this.invite_accepted;
          var requestee_list = this.requestee_list;

    var userid = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    // var GroupRequest_array = UserGroup.find({sent_by: sent_by,grp_id: grp_id , admin: sent_by}).fetch();
    // alert( 'invite_list: '+invite_list+' invite_accepted: '+invite_accepted+' grp_type:'+grp_type );

if(grp_type == "Public" && !requestee_list.includes(userid) && !invite_accepted.includes(userid)){
    // alert('case 1');
    return true;
}
else{
  // alert('case 2');
  return false;
}
//      if(grp_type == 'Private' && invited_list.includes(userid)){ 
//         alert('case 1');
//       if(invite_accepted.includes(userid)){
//         alert('case 2');
//         return true;
// }
// else{
//         alert('case 3');
//               return false;
//          } }
//          else if(grp_type == 'Public' && invite_accepted.includes(userid)){
//             return true;
//           }
//           else{
//             return false;
//           }
    },    

     check_invitee_request_status(){
          
          var grp_type = this.grp_type;        
          var invite_list = this.invite_list;        
          var invite_accepted = this.invite_accepted;
          var requestee_list = this.requestee_list;

    var userid = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    // var GroupRequest_array = UserGroup.find({sent_by: sent_by,grp_id: grp_id , admin: sent_by}).fetch();
    // alert( 'invite_list: '+invite_list+' invite_accepted: '+invite_accepted+' grp_type:'+grp_type );

if(grp_type == "Public" && requestee_list.includes(userid) && !invite_accepted.includes(userid)){
    // alert('case 1');
    return true;
}
else{
  // alert('case 2');
  return false;
}
//      if(grp_type == 'Private' && invited_list.includes(userid)){ 
//         alert('case 1');
//       if(invite_accepted.includes(userid)){
//         alert('case 2');
//         return true;
// }
// else{
//         alert('case 3');
//               return false;
//          } }
//          else if(grp_type == 'Public' && invite_accepted.includes(userid)){
//             return true;
//           }
//           else{
//             return false;
//           }
    },    


   all_memeber(){   
   var grp_id = Session.get("show_grp_id");
   
   // var grp_id = Session.get("grp_id_for_Group_member");
   var head = UserGroup.find({grp_id: grp_id}).fetch();
   var accepted_users = head[0].invite_accepted;
   // var accepted_users = head[0].requestee_list;
     if(accepted_users != "" && accepted_users != null && accepted_users != undefined){
            var users_array = accepted_users.split(",");   
     var all_users= new Array();
     for(var i=0;i<users_array.length;i++){
      var users = UserInfo.find({"user_id":users_array[i]}).fetch();
      all_users.push(users[0]);
     }  
     // const t =Template.instance();
     Session.set("show_all_group_members_count",all_users.length);

     if(all_users.length == 0){
      return false;
     }

     return all_users;
     }
   },

    // all_memeber_2(){
    // var sent_by = this.sent_by;
    // // var grp_id = this.grp_id;
    // // alert(sent_by);

    // var user_pic = UserInfo.find({user_id: sent_by}).fetch();
    // // alert(user_pic[0]);
    // console.log(user_pic[0]);
    // return user_pic;
    // },

    show_all_group_members_count(){
     // const t =Template.instance();//
     return Session.get("show_all_group_members_count");
    },

    Show_members_count(){
      var get_count = Session.get("show_member_count");
      return get_count;
    },

     get_discussion_count(){
       var grp_id= Session.get("show_grp_id");
       return Discussion.find({"grp_id":this.grp_id}).count();
    },

    connections_you_may_know(){
     // const t =Template.instance();
     return Session.get("connections_you_may_know");
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


     Session.set("allFriends",friends.length);

   var grp_id = Session.get("show_grp_id");
   var head = UserGroup.find({grp_id: grp_id}).fetch();
   
   var invite_accepted = head[0].invite_accepted;
   var all_members_and_friends_users = new Array();
   // alert('friends: '+friends.length);
   for(var i=0; i < friends.length; i++ ){

    var sent_to = friends[i].sent_to;
    var sent_by = friends[i].sent_by;

    if(userid!= sent_to)
    {
      var user_id_to_check = sent_to;
    }
    if(userid != sent_by)
    {
      var user_id_to_check = sent_by;
    }  

      if(invite_accepted.includes(user_id_to_check)){
        all_members_and_friends_users.push( UserInfo.find({user_id:user_id_to_check} ).fetch()[0]);
      }
   }
     // const t =Template.instance();
     Session.set("connections_you_may_know",all_members_and_friends_users.length);
     // t.connections_you_may_know.set(all_members_and_friends_users.length);
   // alert("all_members_and_friends_users: "+all_members_and_friends_users);
   // console.log(all_members_and_friends_users);
   // document.getElementById("connection_you_know_count").textContent=all_members_and_friends_users;
   return all_members_and_friends_users;
  },



      frientlist_for_invite_modal:function()
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
    
     // const t =Template.instance();
     // t.connections_you_may_know.set(friends.length);
     // Session.set("allFriends",friends.length);
     return friends;
  },

    userinfo_for_invite_modal:function()
  {
    var userid=Session.get('userId');
    var sent_to=this.sent_to;
    var sent_by=this.sent_by;
    
    //alert(sent_to);
    if(userid!=sent_to)
    {
      var sent_too=this.sent_to;
    }
    if(userid!=sent_by)
    {
      var sent_too=this.sent_by;
    }
    //alert(sent_too);
    return UserInfo.find({user_id:sent_too}).fetch();
  },

  check_group_visibility(){
      var grp_type = this.grp_type;
      var group_admin = Session.get("current_post_admin");
      var logged_in_user = Session.get('userId');
      // alert('grp_visibility'+grp_visibility+' group_admin: '+group_admin +'logged_in_user: '+logged_in_user);
      if(grp_type == 'Private' && logged_in_user == group_admin){
          return true;
      }
      else{
        return false;
      }
  },

    check_if_checked:function(){

    var userid=this.user_id;
    var grp_id= Session.get("show_grp_id");
    // alert(userid+' & '+grp_id);
    //console.log(Emembers.find({e_user_id:userid,event_id:event_id}).fetch());
    var result =UserGroup.find({grp_id: grp_id}).fetch();
    if(result){
    if(result[0].grp_type == 'Private'){
    var invite_list = result[0].invite_list;
     if(invite_list.includes(userid)){
        Session.set("friendsCounter",Session.get("friendsCounter")+1);
          return false;
        }else{
          return true;  
       }  
    }
    
}
  },

  check_if_all_users_already_invited(){
    if(Session.get("friendsCounter") == Session.get("allFriends")){
      return "All Friends are already invited :)";
    } 
  },
  check_if_in_no_list:function(){

    var userid=this.user_id;
    var grp_id= Session.get("show_grp_id");
    // alert(userid+' & '+grp_id);
    //console.log(Emembers.find({e_user_id:userid,event_id:event_id}).fetch());
    var result = UserGroup.find({grp_id: grp_id}).fetch();
    if(result[0].grp_visibility == 'Private'){
    var invite_list = result[0].invite_list;
    var invite_accepted = result[0].invite_accepted;
    // var new_array = invite_list.split(',');

    console.log(result);
    if(!invite_list.includes(userid) && !invite_accepted.includes(userid)){
      
      return true;
    }else{
    return false;
  }
}
  },

       all_group_list(){
        // var logged_in_user = Session.get("userId");
        // alert(logged_in_user);
        var UserGroup2 = UserGroup.find({}).fetch();
        // alert(UserGroup2);
        // console.log(UserGroup2);
        return UserGroup2;
     },

     check_if_member(){

              var userid=this.user_id;
              var grp_id= Session.get("show_grp_id");

              var result = UserGroup.find({grp_id: grp_id}).fetch();
              },

  });

Template.grpdetail.events({
'click .redirect_click_1': function(event){
    event.preventDefault();
    var show_collection = this.user_id;
    // var head = UserInfo.find({user_id: user_id}).fetch();

    // Session.setPersistent("show_connection",user_id);
    // var show_collection = Session.get("show_connection");
    var user_id = Session.get("userId");
    if(show_collection == user_id)
    {
      Router.go('/profile');    
    }
    else{
    var show_collection =Base64.encode(show_collection);
    var url = '/view_profile/'+ show_collection;
    Router.go(url);
    }
},

// 'click .profile_page_redirect':function(event)
// {
// alert("Click Captured");
// },

'click .activity_status': function(){
   var grp_id = this.grp_id;
   // var activity_status = $('.activity_status').attr('newvalue');
   // alert(activity_status+' & '+grp_id);
   var activity_status =  this.activity_status;
   // activity_status= !activity_status;
   if(activity_status == 1){
    activity_status= 0;
   }else{
    activity_status= 1;
   }
   // alert(activity_status);
   Meteor.call("update_Group_activity",grp_id,activity_status,function(error,result){
     if(error){ 
      alert('Failure in updating activity status');
     } 
     else{  
      alert('activity status successfully updated');   
     }
   });   
},

'click #edit_group_3': function(){
  // alert('here');
    var grp_id = this.grp_id;
    grp_id= Base64.encode(grp_id); 
    var url = "/editgroup/"+ grp_id;
    // alert(url);
    Router.go(url);    
},

'click .redirect_to_discusiion': function(){
    var grp_id = this.grp_id;
    grp_id= Base64.encode(grp_id); 
    var url = '/group_discussion_listing/'+ grp_id;
    // alert(url);
    Router.go(url);    
},

'click #Join_group': function(){
    var userId = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    var result = UserGroup.find({grp_id: grp_id}).fetch();

        var grp_type = result[0].grp_type;
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;

        var invite_rejected = result[0].invite_rejected;
        var requestee_list = result[0].requestee_list;
        var grp_admin = result[0].admin;
          
         if(grp_type == "Open"){

          if(invite_accepted == ""){ 
            invite_accepted = userId; 
           } 
           else{ 

              invite_accepted = invite_accepted + ',' +userId;  
          } 

         }

         else if(grp_type == "Private"){

          if(invite_accepted == ""){ 
            invite_accepted = userId; 
           } 
           else{ 
              invite_accepted = invite_accepted + ',' +userId;  
          } 

         } 
         // alert(invite_accepted);

        var logged_in_user = Session.get("userId");
        Meteor.call('update_group_request',invite_accepted,grp_id,grp_admin,logged_in_user,function(error,result){
          if(error){
            console.log('error');
          }
          else{
            console.log('Sucess');
          }
        });   
},

'click #leave_group': function(){
  // alert('fg');
    var answer = confirm("Are you sure, you want to Leave this group")
    
    // var sent_by = Session.get("userId");
    
    if(answer){

    var userId = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    // invite_accepted,grp_id
        var result = UserGroup.find({grp_id: grp_id}).fetch();
    // var admin = get_admin_id[0].admin;

        // alert(event_id+' '+result[0].invite_accepted);

        // console.log(result[0]);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var grp_admin = result[0].admin;
// alert('invite_accepted: '+invite_accepted+' & invite_rejected: '+invite_rejected);
          if(invite_accepted.includes(userId) ){   
            // alert('1');
            // var a1 = userId ;
            // alert(a1);   

            if(invite_accepted.includes(","+userId+",") ){
              // alert('2');
               invite_accepted =  invite_accepted.replace(","+userId+"," , "");
            }

            else if(invite_accepted.includes(userId+",")){
              // alert('3');
                invite_accepted = invite_accepted.replace(userId+"," , "");
            } 

            else if(invite_accepted.includes(userId+",")){
              // alert('4');
                invite_accepted = invite_accepted.replace(","+userId , "");
            }
            else{
              // alert('5');
                invite_accepted = invite_accepted.replace(userId , "");
            }

            
            }

            if(invite_accepted.includes(",")){
                invite_accepted = invite_accepted.split(",");
                 var new_invite_accepted =  new Array();
                for(var i=0;i<invite_accepted.length;i++){
                    if(invite_accepted[i] != ""){
                        new_invite_accepted.push(invite_accepted[i]);
                    }
                }
                // alert(new_invite_accepted);
                invite_accepted = new_invite_accepted.toString();
            }
          
            // alert(invite_accepted); 
            var logged_in_user = Session.get("userId");  
            
Meteor.call('update_group_request',invite_accepted,grp_id,grp_admin,logged_in_user,function(error,result){
          if(error){
            console.log('error');
          }
          else{
            console.log('Sucess');
          }
        });
}
else {
    return false;
}
},     

'click #agreeto':function(){
    var name=$(".inviteuser:checked");
    // alert(name);
    // console.log(name);

    var c=name.length || 0
    // alert(c);
    // console.log(c);
    //alert(c);
    // $("#emembers").val(name);
     var array = _.map(name, function(item) {
         return item.defaultValue;
       });

     var invite_list_new = array.toString();
     // alert(invite_list);
     // return false;
    // var userid=this.user_id;
    var grp_id= Session.get("show_grp_id");
    // alert(userid+' & '+grp_id);
    //console.log(Emembers.find({e_user_id:userid,event_id:event_id}).fetch());
    var result =UserGroup.find({grp_id: grp_id}).fetch();

     var invite_list = result[0].invite_list;
     // $("#emembers").val(array);     

           if(invite_list == ""){ 
                  invite_list = invite_list_new; 
           } 
           else{ 
                  invite_list = invite_list + ',' +invite_list_new;  
              } 
              
     // alert(invite_list);
    // var g1 = Session.get("show_grp_id");
    // var head = UserGroup.find({grp_id: grp_id}).fetch();
    var logged_in_user = Session.get("userId");
    // var grp_visibility = head[0].grp_visibility;
         var logged_in_user = Session.get("userId");
         Meteor.call('update_group_request_invite',invite_list,grp_id,logged_in_user,function(error,result){
          if(error){
            console.log('Failure in inviting people to group');
          }
          else{
            console.log('Sucessfully invited');
          }
        }); 
// alert("going to reload");
location.reload();
    
  },

  'click #show_group_details': function(){
    var grp_id = this.grp_id;
  // if(this.grp_type!="Private"){
      grp_id= Base64.encode(grp_id);  
      var url = '/group_detail/'+ grp_id;  
      Router.go(url);       
      // }else{
      //   alert("You could view only via invitation ");
      // }
    return false;  
},


  'click #route_to_member': function(){
    // alert('akhilesh');
    var userId = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    var admin = Session.get("current_post_admin");
      
      grp_id= Base64.encode(grp_id); 
      if(admin == userId){
      // if(this.grp_type!="Private" && admin == userId){
      var url = "/Group_member/"+ grp_id;  
      Router.go(url);       
      }else{
        alert("Only admin is allowed to visit members page");
      }
},

  'click #send_Join_group_request': function(){

    var userId = Session.get("userId");
    var logged_in_user = Session.get("userId");
    var grp_id = Session.get("show_grp_id");
    // invite_accepted,grp_id
        var result = UserGroup.find({grp_id: grp_id}).fetch();
        var grp_type = result[0].grp_type;

        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;

        var invite_rejected = result[0].invite_rejected;
        var requestee_list = result[0].requestee_list;

// alert('invite_accepted: '+invite_accepted+' & invite_rejected: '+invite_rejected);
           if(grp_type == "Public"){

          if(requestee_list == ""){ 
            requestee_list = userId; 
           } 
           else{ 

              requestee_list = requestee_list + ',' +userId;  
          } 
        Meteor.call('update_group_request_for_approval',requestee_list,grp_id,logged_in_user,function(error,result){
          if(error){
            console.log('error');
          }
          else{
            console.log('Sucess');
          }
        });
         } 

},

      'click .closed_modal_window': function(){
          $('.modal').modal('close');
      }, 



});


