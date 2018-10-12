
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { UserGroup } from './../../../import/collections/insert.js';
import { GroupRequest } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest } from './../../../import/collections/insert.js';
import { Discussion } from './../../../import/collections/insert.js';
import { Notifications } from './../../../import/collections/insert.js';

import { UserInfo } from './../../../import/collections/insert.js';
//   Template.grouplisting.onRendered(function() {
//   if (!localStorage.getItem("reload")) {
//     /* set reload locally and then reload the page */
//     localStorage.setItem("reload", "true");
//     location.reload();
// }
// /* after reload clear the localStorage */
// else {
//     localStorage.removeItem("reload");
//  }
// })
    
Template.grouplisting.onCreated(function grouplistingOnCreated() {
  this.search = new ReactiveVar("");
  this.search_admin = new ReactiveVar("");
  this.search_pending = new ReactiveVar("");
  this.fetch_count_where_user_is_member_or_admin = new ReactiveVar(0);
  this.fetch_created_by_me_counter = new ReactiveVar(0);
  this.fetch_count_where_invitation_is_pending=  new ReactiveVar(0);
  this.fetch_count_from_where_invitation_arrived=  new ReactiveVar(0);
});

   var all_groups;     
   var all_friends;     
   var all_group_requests;     
   
   Template.grouplisting.onDestroyed(function(){
    all_groups.stop();
    all_friends.stop();
    all_group_requests.stop();
   });

   Template.grouplisting.onRendered(function(){
    all_groups = Meteor.subscribe("all_groups");
    all_friends = Meteor.subscribe("all_friend_users");
    all_group_requests = Meteor.subscribe("all_group_requests_for_logged_in_user",Session.get("userId"));
  
    setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    var result = UserInfo.find({user_id: logged_in_User}).fetch();
if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("body_bg");
       $('#group_container').addClass("pink_background");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("body_bg");
     $('#group_container').addClass("blue_background");
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("body_bg");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("body_bg");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");
 $('#group_container').addClass("default_background");
      $('.page_wh').addClass("body_bg");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");
             
     } 
  }
}, 1000);
   });

Template.grouplisting.helpers({

   check_group_inactive_or_not(){
    // alert('hi');
    var grp_id = this.grp_id;
    // alert(grp_id);
    var result = UserGroup.find({ grp_id: grp_id }).fetch();
    var status = result[0].status;
    // alert(grp_id+''+status);
    if( status == "" || status  == null || status == undefined ){
      return true;
    }
    else{
      return false;
    }
   },

  grp_title(){
   var grp_title = this.grp_title;
   var grp_title_length = grp_title.length;

   if(grp_title_length > 22){
    var new_grp_title = grp_title.slice(0,21)+'...';
    return new_grp_title;
   }
   else{
    return grp_title;
   }
  },

    grp_list(){

     const t = Template.instance();
     const query = new RegExp(t.search.get(),'i');   
     if(t.search.get() == ""){
     var listing = UserGroup.find({},{sort: {createdAt: -1}}).fetch();
     }else{
     var listing =UserGroup.find({grp_title:{$regex:query}}).fetch();
     }
     return listing;
    },

    fetch_count_where_user_is_member_or_admin(){
    const t = Template.instance();
    return t.fetch_count_where_user_is_member_or_admin.get();
    },

    fetch_where_user_is_member_or_admin(){

    var fetch_where_user_is_member_or_admin = new Array();
    var user_id = Session.get("userId");
   
    const t = Template.instance();
     const query = new RegExp(t.search.get(),'i');   
     if(t.search.get() == ""){
      var listing = UserGroup.find({'admin': user_id,  status: {$ne: 'Inactive'} }).fetch();
//   Check 1: where_user_is_member  
   var where_I_am_member = UserGroup.find({'invite_accepted': {$regex : user_id}, 'admin': { $ne: user_id } , "activity_status":1,  status: {$ne: 'Inactive'} }).fetch();
//   Check 1: where_user_is_admin  
    var combined_data =  listing.concat(where_I_am_member);   
     }else{
   var listing = UserGroup.find({'admin': user_id,grp_title:{$regex:query} ,  status: {$ne: 'Inactive'} }).fetch();
//   Check 1: where_user_is_member  
   var where_I_am_member = UserGroup.find({'invite_accepted': {$regex : user_id}, grp_title:{$regex:query}, "activity_status":1,'admin': { $ne: user_id },  status: {$ne: 'Inactive'} }).fetch();
//   Check 1: where_user_is_admin  
    var combined_data =  listing.concat(where_I_am_member);
     }
    t.fetch_count_where_user_is_member_or_admin.set(combined_data.length);
    // console.log(combined_data);
    return combined_data;

 },

    fetch_count_where_user_is_member_or_admin_for_admin(){

    const t = Template.instance();
    return t.fetch_count_where_user_is_member_or_admin.get();
    
    },

    fetch_where_user_is_member_or_admin_for_admin(){

    var fetch_where_user_is_member_or_admin = new Array();
    var user_id = Session.get("userId");
   
    const t = Template.instance();
     const query = new RegExp(t.search.get(),'i');   
     if(t.search.get() == ""){
      var listing = UserGroup.find({}).fetch();
//   Check 1: where_user_is_member  
//    var where_I_am_member = UserGroup.find({'invite_accepted': {$regex : user_id}, 'admin': { $ne: user_id } , "activity_status":1}).fetch();
// //   Check 1: where_user_is_admin  
//     var combined_data =  listing.concat(where_I_am_member);   
     }else{
   var listing = UserGroup.find({grp_title:{$regex:query}}).fetch();
//   Check 1: where_user_is_member  
//    var where_I_am_member = UserGroup.find({'invite_accepted': {$regex : user_id}, grp_title:{$regex:query}, "activity_status":1,'admin': { $ne: user_id }}).fetch();
// //   Check 1: where_user_is_admin  
//     var combined_data =  listing.concat(where_I_am_member);
     }
    t.fetch_count_where_user_is_member_or_admin.set(listing.length);
    // console.log(combined_data);
    return listing;

 },


      user_is_admin(){
      var logged_in_user = Session.get("userId");
      // alert('logged_in_user: '+logged_in_user);
      if(logged_in_user == 'user_admin'){
        return true;
      }
      else{
        return false;
      }
  },



show_where_invitation_is_pending(){

   var user_id = Session.get("userId");
   const t = Template.instance();
     const query = new RegExp(t.search.get(),'i');   
     var  user_group ;
     if(t.search.get() == ""){
       user_group = UserGroup.find({ $or: [ { grp_type: "Public" },{ grp_type: "Private" }],"activity_status":1,'admin': { $ne: user_id }}).fetch();
    }else{
       user_group = UserGroup.find({ $or: [ { grp_type: "Public" },{ grp_type: "Private" }],grp_title:{$regex:query} ,"activity_status":1,'admin': { $ne: user_id }}).fetch();
    }
   var where_usr_invitation_is_pending = new Array();

   for(var i =0 ;i<user_group.length;i++){
    var invite_list = user_group[i].invite_list;

    var invite_accepted = user_group[i].invite_accepted;
    var requestee_list = user_group[i].requestee_list;

    if(user_group[i].grp_type == "Public"){
        if(requestee_list.includes(user_id)){
        // if(requestee_list.includes(user_id) && invite_accepted.includes(user_id)){
          where_usr_invitation_is_pending.push(user_group[i]);
        }
    }else {
      if(invite_list.includes(user_id) && invite_accepted.includes(user_id)){
          // where_usr_invitation_is_pending.push(user_group[i]);
        }
    } 
}

t.fetch_count_where_invitation_is_pending.set(where_usr_invitation_is_pending.length);
return where_usr_invitation_is_pending; 
 },



 fetch_count_where_invitation_is_pending(){
    const t = Template.instance();
    return t.fetch_count_where_invitation_is_pending.get(); 
 },

where_i_am_invited_to_join_a_group(){
var where_i_am_invited_to_join_a_group = new Array();
var user_id = Session.get("userId");
   const t = Template.instance();
     const query = new RegExp(t.search.get(),'i');   
var  user_group ;
 if(t.search.get() == ""){
    user_group = UserGroup.find({ grp_type: "Private","activity_status":1,'invite_list': {$regex : user_id}}).fetch();
  }else{
    user_group = UserGroup.find({ grp_type: "Private","activity_status":1,grp_title:{$regex:query},'invite_list': {$regex : user_id}}).fetch();
}
for(var i=0;i<user_group.length;i++){
    var invite_accepted = user_group[i].invite_accepted;
      if(!invite_accepted.includes(user_id)){
        where_i_am_invited_to_join_a_group.push(user_group[i]);
      }
}
  t.fetch_count_from_where_invitation_arrived.set(where_i_am_invited_to_join_a_group.length);
return where_i_am_invited_to_join_a_group;
},
fetch_count_from_where_invitation_arrived(){
  const t = Template.instance();
    return t.fetch_count_from_where_invitation_arrived.get();   
},
check_if_invited(){
   var sent_to = Session.get("userId");
   var sent_by = this.admin;
   // var show_pending = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ sent_by: sent_by },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ sent_to: sent_by },{ req_status: 1 } ] } ] }).fetch();
   // // var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 1}).fetch();
   // var length = show_pending.length;

   // if(length > 0 || Session.get("userId") == this.admin ){

    var grp_visibility = this.grp_visibility;
    if(grp_visibility == 'Public'){
        return true;
    }else if(grp_visibility == 'Private'){
        var invited_list = this.invited_list;
        var userid=Session.get('userId');
        if(invited_list.includes(userid) || sent_by == sent_to){
          return true;
        }
          return false;
    }
  // }
  // else{
  //   return false;
  // }
},

pending_list(){
    const t3 = Template.instance();
     // alert(t[0]);
     const query = new RegExp(t3.search_pending.get())   
     // const query = new RegExp('^' + t.search.get())
     if(t3.search_pending.get() == ""){
     var listing = UserGroup.find({},{sort: {createdAt: -1}}).fetch();
     }else{
        // query = query + '^/';
        // alert(query);
   var listing =UserGroup.find({grp_title:{$regex:query}}).fetch();
     // alert(listing.le)
     }
     return listing;
},

check_join_status(){
  var sent_to = Session.get("userId");
   var sent_by = this.admin;
   var show_pending = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ sent_by: sent_by },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ sent_to: sent_by },{ req_status: 1 } ] } ] }).fetch();
   // var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 1}).fetch();
   var length = show_pending.length;

   if(length > 0){

    var grp_visibility = this.grp_visibility;
    if(grp_visibility == 'Public'){

        var grp_id = this.grp_id;
             var userId = Session.get("userId");
             var admin = this.admin;
             // return true;
             if(userId == admin){
                return false;
             }
             var count = GroupRequest.find({grp_id: grp_id,sent_by: userId}).count();
             if(count == 0)
             {
              return true;
             }
             else{
              return false;
             }

    }else if(grp_visibility == 'Private'){
        var invited_list = this.invited_list;
        var userid=Session.get('userId');
        if(invited_list.includes(userid) ){
          
          var grp_id = this.grp_id;
             var userId = Session.get("userId");
             var admin = this.admin;
             // return true;
             if(userId == admin){
                return false;
             }
             var count = GroupRequest.find({grp_id: grp_id,sent_by: userId}).count();
             if(count == 0)
             {
              return true;
             }
             else{
              return false;
             }

        }
          return false;
    }
  }
  else{
    return false;
  }

},

Show_grp_image(){
	var img = this.grp_image;
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

show_whereadmin_count(){
   var user_id = Session.get("userId");
   var listing = UserGroup.find({'admin': user_id}).count();
     return listing;      
},

show_whereadmin__admin_count(){
   var user_id = Session.get("userId");
   var listing = UserGroup.find({'admin': user_id}).count();
     return listing;      
},
fetch_created_by_me_counter(){
  const t= Template.instance();
return t.fetch_created_by_me_counter.get();
},

show_whereadmin(){
  const t2 = Template.instance();
  var user_id = Session.get("userId");
     // alert(t[0]);
     const query = new RegExp(t2.search.get())   
     // const query = new RegExp('^' + t.search.get())
     if(t2.search.get() == ""){
     var listing = UserGroup.find({'admin': user_id,  status: {$ne: 'Inactive'} },{sort: {createdAt: -1}}).fetch();
     }else{
        // query = query + '^/';
        // alert(query);
   var listing =UserGroup.find({grp_title:{$regex:query},'admin': user_id,  status: {$ne: 'Inactive'} }).fetch();
     // alert(listing.le)
     }
          t2.fetch_created_by_me_counter.set(listing.length);
     return listing;
     // var user_id = Session.get("userId");
     // var listing = UserGroup.find({'admin': user_id}).fetch();
     // return listing;  
},

show_whereadmin_admin(){
  const t2 = Template.instance();
  var user_id = Session.get("userId");
     // alert(t[0]);
     const query = new RegExp(t2.search.get())   
     // const query = new RegExp('^' + t.search.get())
     if(t2.search.get() == ""){
     var listing = UserGroup.find({'admin': user_id},{sort: {createdAt: -1} } ).fetch();
     }else{
        // query = query + '^/';
        // alert(query);
   var listing =UserGroup.find({grp_title:{$regex:query},'admin': user_id }).fetch();
     // alert(listing.le)
     }
          t2.fetch_created_by_me_counter.set(listing.length);
     return listing;
     // var user_id = Session.get("userId");
     // var listing = UserGroup.find({'admin': user_id}).fetch();
     // return listing;  
},

group_join_status(){
   var grp_id = this.grp_id;
   var userId = Session.get("userId");
   var admin = this.admin;
   // alert(' userId: '+userId+' & '+'Admin: '+admin+' & grp_title'+this.grp_title)

   if(userId == admin){
    // alert('case 1');
      return 'admin';
   }
   // alert(grp_id+' '+userId);
  /* var count = GroupRequest.find({grp_id: grp_id,sent_by: userId,status: '1'}).count();
   // alert(count);
   if(count == 1)
   {
    return 'Member';
   }
   else{
    return 'Pending';
   }*/
    // alert('case 2');
    var invite_list = this.invite_list;
    var invite_accepted = this.invite_accepted;
    var requestee_list = this.requestee_list;
    if(this.grp_type == "Private"){
      // alert('case 3');
    if(invite_list.includes(userId) &&  invite_accepted.includes(userId)){
      return "Member";
    }else if(invite_list.includes(userId) &&  !invite_accepted.includes(userId)){
      return "Pending";
    }  
  }else if(this.grp_type == "Public"){
    // alert('case 4');
    if(!requestee_list.includes(userId) &&  invite_accepted.includes(userId)){
      // alert('case 5');
      return "Member";
    }else if(requestee_list.includes(userId) &&  !invite_accepted.includes(userId)){
      // alert('case 6');
      return "Pending";
    }
  }else if(this.grp_type == "Open"){
    if(invite_accepted.includes(userId)){
      return "Member";
    }else{
      return "Pending";
    }
  }
    
},
get_total_discussions(){
  Meteor.subscribe("all_discussions_based_on_group",this.grp_id);
  return Discussion.find({"grp_id":this.grp_id}).count();
},
get_total_members(){
  var total_accepted= this.invite_accepted;
  if(total_accepted==""){
    return 1;
  }else{
    var array = total_accepted.split(",");
    return array.length;
  }
}
});

Template.grouplisting.events({
  'click #allgrp':function(){
  $("#allgrp").show();
  $("#byme").hide();
  $("#Pending").hide();
  $("#invite").hide();
},
'click #byme':function(){

  $("#allgrp").hide();
  $("#byme").show();
  $("#Pending").hide();
  $("#invite").hide();
},
'click #Pending':function(){

   $("#allgrp").hide();
  $("#byme").hide();
  $("#Pending").show();
  $("#invite").hide();
},
'click #invite':function(){

   $("#allgrp").hide();
  $("#byme").hide();
  $("#Pending").hide();
  $("#invite").show();
},
'click #search_grp_all': function(e,t){
      t.search.set($('#search_all_text').val());
      // Template.grouplisting.__helpers["show_whereadmin"]();
},

'click #search_grp_admin': function(e,t2){
      t2.search_admin.set($('#search_all_admin_text').val());
},

'click #search_grp_pending': function(e,t3){
      t3.search_pending.set($('#search_all_pending_text').val());
}

});
        
Template.grouplisting.events({ 

'click #creategroup': function(){ 
    Router.go("/creategroup");
  },

  'keypress input': function(e){

    const t = Template.instance();
    t.search.set($('#search_all_text').val());

    t2.search_admin.set($('#search_all_admin_text').val());
    t3.search_pending.set($('#search_all_pending_text').val());
  },

    'click #activate':function()
  { 

    var confirmation = confirm("Are you sure you want to deactivate this group ?");

    if(confirmation == true){

    var grp_id =this.grp_id;
    // alert('event_id '+event_id);
    var grp_status = 'Inactive';
// alert(grp_id+' ' +grp_status);
    Meteor.call('change_group_activation_status',grp_status,grp_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('Group is inactive and cant be found');
      }
      
     });
  }

  },

  'click #in_activate':function()
  {

    var confirmation = confirm("Are you sure you want to activate this group again ?");

    if(confirmation == true){

    var grp_id =this.grp_id;
    // alert('event_id '+event_id);
    var grp_status = "";

    Meteor.call('change_group_activation_status',grp_status,grp_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('Group is Active');
      }
     });
  }

  },


'click .go_inside_group': function(){

var grp_id = this.grp_id;
var grp_type = this.grp_type;
var logged_in_user = Session.get("userId");
Meteor.call("fetch_group_details",grp_id,function(error,result){
  if(result){
    var invite_accepted = result[0].invite_accepted;
    grp_id= Base64.encode(grp_id); 
    if( invite_accepted.includes(logged_in_user) ){
       var url = '/group_discussion_listing/'+ grp_id;
    }
    else{
      var url = '/group_detail/'+ grp_id; 
    }
 Router.go(url);       
  }
})

},
 // return false;    
/*if(grp_type == 'Private'){
  history.pushState(null, null, url);
}*/


// 'click #show_group_details': function(){
// var grp_id = this.grp_id;
// grp_id= Base64.encode(grp_id);  
// var url = '/group_detail/'+ grp_id;  

//   Router.go(url);       

// return false;  
// },

// 'click #show_pending_details': function(){
// var grp_id = this.grp_id;
// grp_id= Base64.encode(grp_id);  
// var url = '/group_detail/'+ grp_id;  

//   Router.go(url);       

// return false;  
// },

// 'click #show_whereadmin': function(){
// var grp_id = this.grp_id;
// grp_id= Base64.encode(grp_id);  
// var url = '/group_detail/'+ grp_id;  

//   Router.go(url);       

// return false;  
// }

});         
         
















