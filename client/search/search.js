import { Template } from 'meteor/templating';
import { UserInfo } from './../../import/collections/insert.js';
import { Session } from 'meteor/session';
import { Discussion } from './../../import/collections/insert.js';
import { UserGroup } from './../../import/collections/insert.js';
import { Followers } from './../../import/collections/insert.js';
import { Blog } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest } from './../../import/collections/insert.js';

//document.title = "Special Neighbourhood | Login | search";  

Template.header.onRendered(function(){
var url = window.location.href+"";
 if(url.includes("search"))
     {
    var new_url = url.split("/");
    url = new_url[new_url.length-1];
    $("#search_text").val(url);
  }
});

Template.search_content.onDestroyed(function(){
  setTimeout(function(){
     location.reload();
  },80);

  all_users.stop();
  all_groups.stop();
  all_events.stop();
  all_blog.stop();
  all_user_friends.stop();
}); 

let all_users;
let all_groups;
let all_events;
let all_blogs;
let all_user_friends;

Template.search_content.onRendered(function(){ 
all_users =   Meteor.subscribe("all_users_with_searched_keyword",Session.get("userId"),Session.get("search_keyword"));
// all_groups =   Meteor.subscribe("all_groups_with_searched_keyword",Session.get("search_keyword"));
all_groups =   Meteor.subscribe("all_groups");
all_events =   Meteor.subscribe("all_events_with_searched_keyword",Session.get("search_keyword"));
all_blogs =   Meteor.subscribe("all_blogs_with_searched_keyword",Session.get("search_keyword"));
all_user_friends =   Meteor.subscribe("all_friend_users");

  // alert('hi');
  // document.getElementById("all_people_tab").click();
   // $("#all_people_tab").click();  
   // $("#search_text").val(Session.get("searched_text"));
  var url = window.location.href+"";
 if(url.includes("search"))
     {
    var new_url = url.split("/");
    url = new_url[new_url.length-1];
    $("#search_text").val(url);
  }


        // var user_id_by_url = Base64.decode(url); 
        // alert(user_id_by_url);

         // const t2 = Template.instance();
         // t2.show_connection.set(user_id_by_url);

  //    setTimeout(function(){
  //         // $("#all_people").click();     
  //          $('ul.tabs').tabs('select_tab', 'all_people_tab');
  // $("#all_people_tab").addClass("active")
  // alert('hi');
     // document.getElementById("all_people_tab").click();
   // },1000);
// $("#all_people_tab").click();
  setInterval(function(){
             $(".tabs_ne , .tabs").css('width','100%');
            },200);           

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
  
  function onShow(tabOBJ){
    console.log(tabOBJ.selector);
  }


Template.search_content.onCreated(function(){
  this.total_people = new ReactiveVar(0);
  this.total_groups = new ReactiveVar(0);
  this.total_events = new ReactiveVar(0);
  this.total_blogs = new ReactiveVar(0);
});

Template.search_content.events({

  'click .all_people':function(events){

    var user_id = this.user_id;

    var logged_in_user = Session.get("userId");
    // alert('logged_in_user:'+logged_in_user+' User: '+user_id);
    if(logged_in_user == user_id)
    {
      // alert('1');
      Router.go('/profile');    
    }
    else{
       // alert('2');
    user_id= Base64.encode(user_id);
    var url = '/view_profile/'+user_id;
    Router.go(url);
    }
  },

    'click .blog_author':function(events){

    var user_id = this.blog_creator_id;
    
    var logged_in_user = Session.get("userId");
    // alert('logged_in_user:'+logged_in_user+' User: '+user_id);
    if(logged_in_user == user_id)
    {
      // alert('1');
      Router.go('/profile');    
    }
    else{
       // alert('2');
    user_id= Base64.encode(user_id);
    var url = '/view_profile/'+user_id;
    Router.go(url);
    }
  },


      'click #connect_now':function(event){
      var sent_to = this.sent_to; 
      var sent_by = Session.get("userId");

      if(sent_to == sent_by){
        var sent_to = this.sent_by; 
      }

      Meteor.call('con_req_insert',sent_to,sent_by,function(error,result){
      if(error){
        console.log('Error in sending request !!!');
      }else{
              console.log('Request Successfully Sent.');
           }
      });

      

    //   var show_button = FriendRequest.find({ 
    //     $or: [ { $and: 
    //       [ { 
    //         sent_to: sent_to 
    //       }, { 
    //         sent_by: sent_by 
    //          }, { 
    //         sent_by: sent_by 
    //          } 
    //       ] }, 
    //       { $and: 
    //         [ { sent_to: sent_by }, 
    //         { sent_by: sent_to } ] 
    //          } ] }).fetch();

    // var length = show_button.length;
    
    // if(length >= 1){
    //   var check_req_status = show_button[length -1].req_status;
    // }
    // console.log('Here : '+length +' show_button[0].req_status: '+ check_req_status);
    // console.log(show_button);
    // if( length != 0 && check_req_status == 0){
    //     return false;
    // }
    // else{
    //   // alert(' else path: ');
    //   // var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);
    //   // Meteor.call('con_req_insert',sent_to,sent_by,reqID,function(error,result){
    //   // if(error){
    //   //   console.log('Error in sending request !!!');
    //   // }else{
    //   //         console.log('Request Successfully Sent.');
    //   //      }
    //   // });
    // }
      Session.clear("current_req_id");  // here  

    },

          'click #connect_now2':function(event){
            // alert('here');  
      var sent_to = this.user_id; 
      // alert(sent_to);
      // return false;
      var sent_by = Session.get("userId");
      
      // alert(sent_to+' '+sent_by);

      var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);

      Meteor.call('con_req_insert',sent_to,sent_by,reqID,function(error,result){
      if(error){
        console.log('Error in sending request !!!');
      }else{
              console.log('Request Successfully Sent.');
           }
      });
    // }
      Session.clear("current_req_id");  // here  
    },

  'click .group_search':function(event){ 
    event.preventDefault();  
      var grp_id = this.grp_id;  
      var logged_in_user = Session.get("userId");  

      var result = UserGroup.find({grp_id: grp_id,status: {$ne: 'Inactive'}}).fetch();  
      var invite_accepted = result[0].invite_accepted; 
      grp_id= Base64.encode(grp_id); 

      if( invite_accepted.includes(logged_in_user) ){
      var url = '/group_discussion_listing/'+ grp_id;
      }
      else{
      var url = '/group_detail/'+ grp_id; 
      }
     Router.go(url);      
  },

  'click .event_search':function(event){
    event.preventDefault();
      var event_id = this.event_id;
    var logged_in_user = Session.get("userId");
    event_id= Base64.encode(event_id); 
    var url = '/event_detail/'+ event_id;   
    Router.go(url);
    return false;
  },

  'click .blog_search':function(event){
        event.preventDefault();
    var blog_id = this.blog_id;
    blog_id= Base64.encode(blog_id);
    Session.clear("edit_new_blog_image_url");
        var url = '/blog_detail/'+blog_id;
    Router.go(url);    
    return false;
  },
	'click #all_people_tab'(event) {
    $('ul.tabs').tabs('select_tab', 'all_people_tab');
	$("#all_people_tab").addClass("active")
	},
	'click #all_groups_tab':function(event){
    $('ul.tabs').tabs('select_tab', 'all_groups_tab');
    $("#all_groups_tab").addClass("active")
    },
    'click #all_events_tab':function(){
    $('ul.tabs').tabs('select_tab', 'all_events_tab');
	$("#all_events_tab").addClass("active")
	},
	'click #all_blogs_tab':function(){
	$("#all_blogs_tab").addClass("active");
    $('ul.tabs').tabs('select_tab', 'all_blogs_tab');
	},

        'click #event_invite_accpted': function(){
        // alert('coolsz');
        var accepted_by = Session.get("userId");
        var event_id = this.event_id;
        // alert("check_event: "+event_id);
        var result = Event.find({event_id: event_id,status: {$ne: 'Inactive'}}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);

        console.log(result[0]);

        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var invite_type = result[0].invite_type;
        var event_admin = result[0].event_admin;
        
        if(invite_accepted == "" || invite_accepted == 0 || !invite_accepted.includes(accepted_by)){

        // if(!invite_list.includes(accepted_by))
        // { 
        //   var userId = accepted_by;
        //   var currentEvent = Event.find({event_id: event_id}).fetch();
        //   var currentInvitationList = currentEvent[0].invite_list;

        // if(currentInvitationList == ""){
        //     var invite_list = userId; 
        // }
        // else{
        //       var invite_list = currentInvitationList + ',' +userId; 
        //     }
        //  // add_user_in_invitation_list(Session.get("userId"),event_id);
        //   Meteor.call('add_user_in_invitation_list',event_id,userId,invite_list,function(error,result){
        //       if(error){
        //         alert("Error");
        //             console.log('error');
        //         }else{
        //         alert("sucessfully");
        //             console.log('sucessfully added in invitation list');
        //             }
        //       });
        //  }
        if(invite_type == 'Public'){
            invite_list = "";
        }
        else if(invite_type == 'Private'){

          var splitted_array = invite_list.split(",");
          var final_requestee_list= "";

          for(var i=0;i<splitted_array.length;i++){
            if(splitted_array[i] == accepted_by){
              splitted_array.pop(accepted_by);
            }
            final_requestee_list=final_requestee_list+splitted_array[i]+",";
          } 

          if(splitted_array.length == 0){
          final_requestee_list="" ;
          }     
          else if(final_requestee_list != "" && final_requestee_list!= undefined){
          final_requestee_list = final_requestee_list.substring(0, final_requestee_list.length - 1);
          } 
            invite_list = final_requestee_list;
            invite_list = invite_list.split(",").join(",");
        }
        
          if(invite_accepted == 0 && invite_accepted == ""){
            invite_accepted = accepted_by; 
        }
        else{
              invite_accepted = invite_accepted + ',' +accepted_by; 
            }

            invite_accepted = invite_accepted.split(",").join(",");
        
        var logged_in_user = Session.get("userId");

        // user_accepted_invitation(invite_accepted,event_id);  
        // alert(' invite_accepted: '+invite_accepted+' event_id: '+event_id+' invite_list: '+invite_list);
           Meteor.call('event_people_invite_accepted',invite_accepted,event_id,invite_list,event_admin,logged_in_user,function(error,result){
              if(error){ 
                    console.log('error');
                }else{
                    console.log('sucessfully accepted');
                    }
              });
         }
         else{
          return false;
         }
    },      

    'click #Join_group': function(){

    var userId = Session.get("userId");
    var grp_id = this.grp_id;


    var result = UserGroup.find({grp_id: grp_id,status: {$ne: 'Inactive'}}).fetch();

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
    var grp_id = this.grp_id;
    // invite_accepted,grp_id

        var result = UserGroup.find({grp_id: grp_id, status: {$ne: 'Inactive'} }).fetch();
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


      'click #event_invite_rejected': function(){
        // alert('coolsz');
        var rejected_by = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'}}).fetch();
        // alert(event_id+' '+result[0].invite_list);

        console.log(result[0]);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var invite_type = result[0].invite_type;
        
        
        if(invite_rejected == "" || invite_rejected == 0 || !invite_rejected.includes(rejected_by)){
        // if(!invite_list.includes(rejected_by))
        // {
        //   alert('reject1');
        //   var userId = rejected_by;
        // var currentEvent = Event.find({event_id: event_id}).fetch();
        // var currentInvitationList = currentEvent[0].invite_list;

        // if(currentInvitationList == ""){
        //     var invite_list = userId; 
        // }
        // else{
        //       var invite_list = currentInvitationList + ',' +userId; 
        //     }
        //   // var accepted_by = rejected_by;
        //  // add_user_in_invitation_list(Session.get("userId"),event_id);
        //   Meteor.call('add_user_in_invitation_list',event_id,invite_list,rejected_by,function(error,result){
        //       if(error){
        //             console.log('error');
        //         }else{
        //             console.log('sucessfully removed in invitation list');
        //             }
        //       });
        //  }

         if(invite_type == 'Public'){
            invite_list = "";
        }
        else if(invite_type == 'Private'){

          var splitted_array = invite_list.split(",");
          var final_requestee_list= "";

          for(var i=0;i<splitted_array.length;i++){
            if(splitted_array[i] == rejected_by){
              splitted_array.pop(rejected_by);
            }
            final_requestee_list=final_requestee_list+splitted_array[i]+",";
          } 

          if(splitted_array.length == 0){
          final_requestee_list = 0;
          }     
          else if(final_requestee_list != "" && final_requestee_list!= undefined){
          final_requestee_list = final_requestee_list.substring(0, final_requestee_list.length - 1);
          } 
            invite_list = final_requestee_list;
            if(invite_list != "" && invite_list != 0){

            invite_list = invite_list.split(",").join(",");
            }
        }


        if(invite_rejected == 0){
            invite_rejected = rejected_by; 
        }
        else{
              invite_rejected = invite_rejected + ',' +rejected_by; 
            }

            invite_rejected = invite_rejected.split(",").join(",");
            
          // alert('invite_rejected: '+invite_rejected+'event_id: '+event_id);
           // alert(' invite_rejected: '+invite_rejected+' event_id: '+event_id+' invite_list: '+invite_list);
       
          Meteor.call('event_people_invite_rejected',invite_rejected,event_id,invite_list,function(error,result){
              if(error){
                    console.log('error');
                }else{
                    console.log('sucessfully removed');
                    }
              });
        }
      },

      'click .closed_modal_window': function(){
          $('.modal').modal('close');
      },  

        'click #send_Join_group_request': function(){

    var userId = Session.get("userId");
    var logged_in_user = Session.get("userId");
    var grp_id = this.grp_id;
    
        var result = UserGroup.find({grp_id: grp_id,status: {$ne: 'Inactive'}}).fetch();
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

});

Template.search_content.helpers({

        total_people(){
            
        },

          user_is_admin(){
                var logged_in_user = Session.get("userId");
                if(logged_in_user == 'user_admin'){
                  return true;
                }
                else{
                  return false;
                }
            },

        ShowResultFor(){

            var url = window.location.href+"";
             if(url.includes("search"))
                 {
                var new_url = url.split("/");
                url = new_url[new_url.length-1];
                // $("#search_text").val(url);
              }

              
              return Session.get("search_keyword");
},

            checkIfEventIsPastEvent(){
  
   // alert('check if its clear');
   
          var end_date = this.event_end_date;
          var name = this.event_name;
          var mydate = new Date();
          var str = moment(mydate).format('YYYY MM DD');

          // alert('end_date: '+end_date +'current date: '+str+'name: '+name);
          if(str > end_date){
            // alert('past event check : 1');
              return true;
          }
          else{
            // alert('past event check : 2');
            return false;
          }

            },

       check_invite_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'} }).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        console.log('result now: ');
        console.log(event_id);
        console.log(result);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var invite_type = result[0].invite_type;

        if(logged_in_user == result[0].event_admin){
          return false;
        }

        if( (invite_type == 'Public' &&  (invite_accepted == 0 || invite_accepted == "" || 
          !invite_accepted.includes(logged_in_user)) && (invite_rejected == 0 || invite_rejected == "" || 
          !invite_rejected.includes(logged_in_user)) ) || (invite_type == 'Private' && 
          (invite_accepted == 0 || invite_accepted == "" || !invite_accepted.includes(logged_in_user) )
           && (invite_rejected == 0 || invite_rejected == "" || !invite_rejected.includes(logged_in_user) )
            && (invite_list != 0 && invite_list != "" 
            && invite_list.includes(logged_in_user))) ){
          return true;
        }
         else{
           // friend h ya ni 
          return false;
         } //(invite_accepted!=0 && !invite_accepted.includes(logged_in_user)) && (invite_rejected!=0 && !invite_rejected.includes(logged_in_user))){
          // if(invite_accepted == 0 ){
          // }else{
          // }          
          // if(invite_accepted == 0 )
          // }else{
          // }

          // if(invite_accepted.includes(logged_in_user) || invite_rejected.includes(logged_in_user)){
          //   console.log('');
          // }
          // else{
          //   return true;
          // }
          //eturn true;
        // }
        // else if(invite_list.includes(logged_in_user) && invite_accepted== 0 && invite_rejected == 0 ){
        //     return true;
        // }
        // else{
        //  return false;
        // }
     },

     check_accept_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'} }).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        // alert('logged_in_user:'+logged_in_user+'invite_list: '+invite_list+'invite_accepted:'+invite_accepted+'invite_rejected: '+invite_rejected);
        if(invite_accepted == 0){
            return false;
        }else{
        if(invite_accepted.includes(logged_in_user)){
          return true;
        }
        else{
          return false;
        }
      }
        
     },



          check_if_admin(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;
         var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'} }).fetch();
         if(logged_in_user == result[0].user_id){
            return true;
         }else{
          return false;
         }
     },

     check_reject_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'} }).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;

        if(invite_rejected.includes(logged_in_user)){ 
          return true;
        }
        else{
          return false;
        }
     },

         join_status_check_array(){  
    var sent_by = Session.get("userId");
    var grp_id = this.grp_id;

    var Group_array = UserGroup.find({grp_id: grp_id ,status: {$ne: 'Inactive'} }).fetch();
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
    var grp_id = this.grp_id;;
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
         var admin = this.admin;

         var userid = Session.get("userId");
         var grp_id = this.grp_id;

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



  search_people(){

  setTimeout(function(){
    // alert('my file');
     document.getElementById("all_people_tab").click();
   },2000);

    var logged_in_user = Session.get("userId");

    var search_keyword = Session.get("search_keyword");
    const query = new RegExp(search_keyword,'i');   

      var data =  UserInfo.find({email_status: 1,name:query, 
               $and: [ 
                      { user_id: 
                              { $ne: logged_in_user }
                       }, 
                       { user_id:
                              { $ne: 'user_admin' }
                       },
                       {
                        status: {$ne: 'Inactive'}
                       }

                    ]
                 }).fetch();

    // var data =  UserInfo.find({email_status: 1,name:query, user_id: {$ne: logged_in_user } } ).fetch();
  // var data =  UserInfo.find({$and:[{email_status:1},
  //             {name:query}, {
  //              $and: [ 
  //                     { user_id: 
  //                             { $ne: logged_in_user }
  //                      }, 
  //                      { user_id:
  //                             { $ne: 'user_admin' }
  //                      }
  //                   ]
                
  //               } 
  //               ]}).fetch();
    const t= Template.instance();
    t.total_people.set(data.length);
    return data;
  },

	search_people_for_admin(){

  setTimeout(function(){
    // alert('my file');
     document.getElementById("all_people_tab").click();
   },2000);

    var logged_in_user = Session.get("userId");

		var search_keyword = Session.get("search_keyword");
		const query = new RegExp(search_keyword,'i');   

      var data =  UserInfo.find({email_status: 1,name:query, 
               $and: [ 
                      { user_id: 
                              { $ne: logged_in_user }
                       }, 
                       { user_id:
                              { $ne: 'user_admin' }
                       },
                       {
                        status: {$ne: 'Inactive'}
                       }

                    ]
                 }).fetch();

		// var data =  UserInfo.find({email_status: 1,name:query, user_id: {$ne: logged_in_user } } ).fetch();
  // var data =  UserInfo.find({$and:[{email_status:1},
  //             {name:query}, {
  //              $and: [ 
  //                     { user_id: 
  //                             { $ne: logged_in_user }
  //                      }, 
  //                      { user_id:
  //                             { $ne: 'user_admin' }
  //                      }
  //                   ]
                
  //               } 
  //               ]}).fetch();
    const t= Template.instance();
    t.total_people.set(data.length);
    return data;
	},

  total_people(){
    const t= Template.instance();
    return t.total_people.get();
  },

      check_status(){

      var sent_to = this.user_id;
      var sent_by = Session.get("userId");

      // alert('sent_to:'+sent_to+' sent_by:'+sent_by);

      var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);
      var show_button = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to }, { sent_by: sent_by } ] }, { $and: [ { sent_to: sent_by }, { sent_by: sent_to } ] } ] },{sort: {requestedAt: -1},limit: 1 }).fetch();
      // var length = show_button.length;
      console.log('show_button');
      console.log(show_button);
      return show_button;
    },


  search_groups(){
		var search_keyword = Session.get("search_keyword");
		const query = new RegExp(search_keyword,'i');   
		// 1. Display All Open + Public Groups
    
		var all_open_group =  UserGroup.find({$and:[{grp_title: query},{ status: {$ne: 'Inactive'} },{$or:[{grp_type: "Open" },{ "grp_type": "Public" }]}]}).fetch();
		// 2.  Display Where I am member of that Group

    const t= Template.instance();
    t.total_groups.set(all_open_group.length);

		return all_open_group;
	},

  show_searched_text(){
      // return results;
  },

  total_groups(){
    const t= Template.instance();
    return t.total_groups.get();
  },

	get_total_members(){
 		 var total_accepted= this.invite_accepted;
  		if(total_accepted==""){
	    return 1;
  		}else{
    	var array = total_accepted.split(",");
    	return array.length ;
 	 }
	},

	get_total_discussions(){
    Meteor.subscribe("discussions_based_on_discussion_ids",this.grp_id);
  	return Discussion.find({"grp_id":this.grp_id}).count();
	},
	Show_grp_image(){
	var img = this.grp_image;
    var default_value = 'Default_group.png';
   		 if(img !=  default_value){
    		return img;
   		 }else{
    		return '/uploads/default/'+ img;
    	}
	},

  fetch_events(){
     var search_keyword = Session.get("search_keyword"); 
		const query = new RegExp(search_keyword,'i');   
        var  mydate=new Date();
        var str=moment(mydate).format('YYYY MM DD');
        var lists = Event.find({event_name:query,event_start_date:{$lte:str}, status: {$ne: 'Inactive'} }).fetch();
        // if public or invited in a group
          var new_list = new Array();
  for(var i = 0; i< lists.length ; i++){

        var invite_type = invite_type;
        var invite_accepted = lists[i].invite_accepted; 
        var logged_in_user = Session.get('userId');
        var invite_rejected = lists[i].invite_rejected;
        var invite_list = lists[i].invite_list;
        var invite_type = lists[i].invite_type;

        if(invite_type == 'Private'){
  if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
                   new_list.push(lists[i]);
           } 
        } 
        else if(invite_type == 'Public'){
           new_list.push(lists[i]);
        }
      } 
         const t= Template.instance();
          t.total_events.set(new_list.length);
        return new_list;
      },

  total_events(){
         const t= Template.instance();
         return t.total_events.get();
  },
    
  fetch_all_blogs(){
     var mydate=new Date();   
     var search_keyword = Session.get("search_keyword");
    const query = new RegExp(search_keyword,'i');   
          var str=moment(mydate).format('YYYY-MM-DD');          
      allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_title:query},{Blog_publish_date:{$lte:str}},{ status: {$ne: 'Inactive'} }]}).fetch();
      // if(allBlogs){
      //   	var array_length = allBlogs.length; 
      // 		var blogsdata= new Array();;
     	// 	for(var i=0;i<array_length;i++)
	     //    {   
      //       if(Session.get("userId")!=allBlogs[i].blog_creator_id){
      //       var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
      //       if(show_followers.length==1){
      //         blogsdata.push(allBlogs[i]);
      //         }              
      //       	}else{
      //      	   blogsdata.push(allBlogs[i]);
      //       	}
      //   	} 
          const t= Template.instance();
          t.total_blogs.set(allBlogs.length);          
    	    return allBlogs;
	 },

   total_blogs(){
      const t= Template.instance();
      return t.total_blogs.get();
   },

   changeDateFormat(){
         var date = new Date(this.Blog_publish_date);
        var formatted = moment(date).format('MMM D,  YYYY');
       return formatted;
      },
  
   fetch_blog_creator_info(blog_creator_id){
        return UserInfo.find({"user_id":blog_creator_id,status: {$ne: 'Inactive'} }).fetch()[0].name;
      },
      
      trim_content(grp_title){
        var content =grp_title;  
        if(content.length > 20){
         return content.substr(0, 20)+"...";
        }
        else{
        return content;
        }
      },

  datemnth:function()
  {
    var datem =this.event_start_date;
    var newdate = moment(datem).format("MMM"); 
    return newdate;
  },
  datenm:function()
  {
    var datem =this.event_start_date;
    var newdate = moment(datem).format("DD"); 
    return newdate;
    
  },
  dateday:function()
  {
    var datem =this.event_start_date;
    var newdate = moment(datem).format("ddd"); 
    return newdate;
    
  },  

    display_event_response(){
    var logged_in_user = Session.get("userId");
    // var logged_in_user = Session.get("userId");
      // var event_id = Session.get("show_event_id");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'} }).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        // console.log('result now: ');
        // console.log(event_id);
        // console.log(result);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        console.log(result[0].event_name);
        var sent_to = result[0].event_admin;
        var sent_by = Session.get("userId");
      // //alert('sent_to:'+sent_to+' sent_by:'+sent_by);
      // var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);
      // db.friend.find({sent_to: 'user_931176',sent_by: 'user_1224544',req_status: 0});  
      // var show_button = FriendRequest.find({sent_to: sent_to,sent_by: sent_by}).fetch();
      // var show_button = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to }, { sent_by: sent_by }, { req_status: 1 } ] }, { $and: [ { sent_to: sent_by }, { sent_by: sent_to }, { req_status: 1 }] } ] }).fetch();
      // var length = show_button.length;
        if((invite_rejected == "" ||invite_rejected == 0 || !invite_rejected.includes(logged_in_user))  && (invite_accepted == 0 || invite_accepted == "" || !invite_accepted.includes(logged_in_user)) ){
           console.log("case 1");
           // alert("case 1");
           return true;
          }
          else{
          console.log('case 2');
          // alert('case 2');
          return false;
         } 
  },
  check_accept_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id, status: {$ne: 'Inactive'} }).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        // alert('logged_in_user:'+logged_in_user+'invite_list: '+invite_list+'invite_accepted:'+invite_accepted+'invite_rejected: '+invite_rejected);
        if(invite_accepted == 0){
            return false;
        }else{
        if( (invite_accepted != 0 || invite_accepted != "") && invite_accepted.includes(logged_in_user)){
          return true;
        }
        else{
          return false;
        }
      }
        
     },

     check_reject_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id , status: {$ne: 'Inactive'} }).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;

        if( (invite_rejected != 0 || invite_rejected != "") &&  invite_rejected.includes(logged_in_user)){
          return true;
        }
        else{
          return false;
        }
     },


});