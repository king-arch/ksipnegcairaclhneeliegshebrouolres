
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FriendRequest } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Base64 } from 'meteor/ostrio:base64';

import { UserGroup } from './../../../import/collections/insert.js';

Template.Group_member.onCreated(function Group_memberOnCreated() {
  this.search_conn = new ReactiveVar("");
  this.request_count = new ReactiveVar("");
  this.connection_count = new ReactiveVar("");
});

    
   Template.Group_member.onRendered(function(){

   	    var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var user_id_by_url = Base64.decode(url); 
        Session.set("grp_id_for_Group_member",user_id_by_url);

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
   
Template.Group_member.helpers({
	  
	request_counts(){
     const t3 = Template.instance();
     var result = t3.request_count.get();
     if(result == ""){
     	return 0;
     } 
     else{
     	return result;
     }

     // alert("rezult: "+result);
     return result;
		  //    var sent_to = Session.get("userId");
			 // var count1 = FriendRequest.find({sent_to: sent_to,req_status: 0}).count();
			 // return count1;
	},

     ignore(){
	 var sent_to = Session.get("userId");
	 var count2 = FriendRequest.find({sent_to: sent_to,req_status: 2}).count();
	 return count2;
	}, 

	 connection_counts(){
	 // alert('boojj');
	 // var sent_to = Session.get("userId");
	 // var grp_id = Session.get("grp_id_for_Group_member");
	 // var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).count();
	 // alert(count3);
	 // var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to }, { sent_by: sent_by } ,{ req_status: 1 } ] }, { $and: [ { sent_to: sent_by }, { sent_by: sent_to },{ req_status: 1 } ] } ] }).fetch();
	 // var count3 = FriendRequest.find({sent_to: sent_to,req_status: 1}).count();
	 // var count3 = FriendRequest.find({sent_to: sent_to,req_status: 1}).count();
	 // return count3; 	
	      const t2 = Template.instance();
     return t2.connection_count.get();

	},

	 show_pending(){
	 var sent_to = Session.get("userId");
	 var grp_id = Session.get("grp_id_for_Group_member");
	 var show_pending = UserGroup.find({grp_id: grp_id}).fetch();
	 var length = show_pending.length;
	 // //alert('Length: '+length);
	 if(length > 0){
	 return show_pending;
	}
	},

	 show_pending2(){
	 var use_id = this.requestee_list; 
	 // //alert(use_id);	
	 var pending_details = UserInfo.find({user_id: use_id}).fetch();
     return pending_details;
	},

	 show_ignored(){
	 var sent_to = Session.get("userId");
	 var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 2}).fetch();
	 var length = show_pending.length;
	 // //alert('Length: '+length);
	 if(length > 0){
	 return show_pending;
	}
	},

	 show_ignored2(){
	
	 var use_id = this.sent_by; 
	 var pending_details = UserInfo.find({user_id: use_id}).fetch();
	 return pending_details;
	
	},

	show_connections(){	
	 const t = Template.instance();
	 var sent_to = Session.get("userId");

	 // //alert(sent_to); 
	 // db.friend.find({sent_to: 'user_1224544',req_status: 0}).pretty()
	 var show_pending = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).fetch();
	 // var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 1}).fetch();
	 var length = show_pending.length;
	 //alert('Length: '+length);



	    if(length > 0){
	    	

		   return show_pending; 	
		}
	},
	// connected_since(){
	// 	var connected_since = Session.get('connected_since');
	// 	return  connected_since;
	// },
	connected_since(){
		var sent_to = Session.get("userId");
		var sent_by = this.user_id;
	 // //alert(sent_to); 
	 // db.friend.find({sent_to: 'user_1224544',req_status: 0}).pretty()
	 var show_pending = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{sent_by: sent_by},{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{sent_to: sent_by},{ req_status: 1 } ] } ] }).fetch();
	 // var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 1}).fetch();
	 var length = show_pending.length;
	 //alert('Length: '+length);
	 console.log('for connected since display : ');
	 console.log(show_pending);

	 var value1 = show_pending[0].updatedAt; 
	 console.log(' here '+value1);
	 var value2 = calculate_time_difference(value1);

	 console.log(' here '+value2);
	 return value2;
	},

     show_requests(){

	 var grp_id = Session.get("grp_id_for_Group_member");
	 var head = UserGroup.find({grp_id: grp_id}).fetch();
	 // var accepted_users = head[0].invite_accepted;
	 if(head[0]){
	 	var accepted_users = head[0].requestee_list;
     if(accepted_users != "" && accepted_users != null && accepted_users != undefined){
            var users_array = accepted_users.split(",");	 
     var all_users= new Array();
     for(var i=0;i<users_array.length;i++){
	    var users = UserInfo.find({"user_id":users_array[i]}).fetch();
	    all_users.push(users[0]);
     }




     if(all_users.length == 0){
     	return false;
     }
    // alert('request_count set:'+all_users.length);

    const t3 = Template.instance();
    t3.request_count.set(all_users.length);

     return all_users;
     }
     else{

    const t3 = Template.instance();   
    t3.request_count.set("0");  
     }
	 }
	 
 },

     show_group_members(){

	 var grp_id = Session.get("grp_id_for_Group_member");
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
     if(all_users.length == 0){
     	return false;
     }    
     	    	
     const t2 = Template.instance();
 	 t2.connection_count.set(all_users.length);

     return all_users;
     }
 },

 location_country(){
   var country_only = this.location;
   var country_only_array = country_only.split(',');
   var length = country_only_array.length;
   return country_only_array[country_only_array.length-1];
 },
 headline_online_only(){
   var headline = this.headline;
   var length = headline.length;
   if(length > 25){
   	  headline = headline.slice(0, 25);
   	  return headline+'...';
   	}
   else{
   	return headline;
   }  
 },
});

Template.Group_member.events({
	 'click .change_group_req_status': function(){
	 // //alert('inside accpet request');
	 // alert(this.user_id);
	 var userId= this.user_id;
	 var logged_in_user = Session.get("userId");
	 Meteor.call('make_user_member',Session.get("grp_id_for_Group_member"),logged_in_user,userId,function(error,result){
	 	if(error)
		 	{
		 	   console.log('Error');
		 	}
		 	else{
		 		console.log('sucess: '+result);
		 	}

	 const t3 = Template.instance();
     var result = t3.request_count.set();
     Template.Group_member.__helpers["show_requests"]();

	 });

/*	 var sent_by = this.user_id;
	 var sent_to = Session.get("userId");
	 // //alert(userId);
	 var show_button = FriendRequest.find({ sent_to: sent_to , sent_by: sent_by }).fetch();
      // var length = show_button.length;
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
		 	   //alert('Error');
		 	}
		 	else{
		 		//alert('sucess: '+result);
		 	}
	 });
*/	},


'click #remove_from_group': function(){

 // alert(this.user_id);
	 var userId= this.user_id;
	 Meteor.call('remove_member',Session.get("grp_id_for_Group_member"),userId,function(error,result){
	 	if(error)
		 	{
		 	   console.log('Error');
		 	}
		 	else{
		 		console.log('Sucess: '+result);
		 	}
	 });

},

});

Template.Group_member.events({
	 'click .request_ignore_status': function(){
	 // //alert('inside ignore request');
	 var sent_by = this.user_id;
	 var sent_to = Session.get("userId");
	 // //alert(userId);
	 var show_button = FriendRequest.find({ sent_to: sent_to , sent_by: sent_by , req_status: 0 }).fetch();
      // var length = show_button.length;
      var req_id = show_button[0].req_id;


	 var request_type = 2;
	 Meteor.call('con_req_update',req_id,sent_by,sent_to,request_type,function(error,result){
	 	if(error)
		 	{
		 	   //alert('Error');
		 	   console.log('Error');
		 	}
		 	else{
		 		//alert('sucess: '+result);
		 		console.log('Sucess');
		 	}
	 });
	},

	      'click .redirect_click_2': function(){
      // event.preventDefault();
    var user_id =  this.user_id;

    var logged_in_user = Session.get("userId");

    if(logged_in_user == user_id)
    {
      Router.go('/profile');    
    }
    else{
    var url = '/view_profile/'+Base64.encode(user_id);
    Router.go(url);
    }
  },

});

Template.Group_member.events({
	 'click #remove_connection': function(){
	 // alert('inside ignore request');

	 var logged_in_user = Session.get("userId");
	 var check_user_id = this.user_id;

	 var result = FriendRequest.find({ $or: [ { $and: [ { sent_to: logged_in_user },{ sent_by: check_user_id },{ req_status: 1 } ] }, { $and: [{ sent_by: logged_in_user },{ sent_to: check_user_id },{ req_status: 1 } ] } ] }).fetch();
	 // var length = show_button.length;
	 
	 if(logged_in_user == result[0].sent_by){
	 	var sent_to = check_user_id;
	 	var sent_by = logged_in_user;
	 }
	 else{
	 	var sent_by = check_user_id;
	 	var sent_to = logged_in_user;
	 }
	 // var sent_by = this.user_id;

	 // var sent_to = Session.get("userId");
	 // //alert(userId);
	 var request_type = 3;
	 var req_id = result[0].req_id;
	 // alert(' sent_by: '+sent_by+' sent_to: '+sent_to+' request_type: '+request_type);
	 Meteor.call('con_req_update',req_id,sent_by,sent_to,request_type,function(error,result){
	 	if(error)
		 	{
		 	   console.log('Error');
		 	}
		else{
		 		console.log('sucess: '+result);
		 	}
	 });
	}
});

Template.Group_member.events({
'click #search_connection_all': function(){
	// alert($('#search_all_text_conn').val());
	const t = Template.instance();
    // alert('sooorrr');
    // var search_text = $('#search_all_text_conn').val();
    // var result =  UserGroup.find({grp_title:{$regex:new RegExp('^' + search_text)}}).fetch();
      // alert(search_text);
      t.search_conn.set($('#search_all_text_conn').val());
      
}
});


function calculate_time_difference(a){
    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);

   if(minutes<1 && seconds<10){
    return ' Just now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + ' seconds';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + ' minutes';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + ' hour';
        }else{ 
        return Math.floor(hours) + ' hours';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +" day";
    }else{
    return Math.floor(days) +" days";
    }
  }
  else{    
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
  }
}



