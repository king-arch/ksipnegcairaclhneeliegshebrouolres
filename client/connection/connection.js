
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { FriendRequest } from './../../import/collections/insert.js';
import { UserInfo } from './../../import/collections/insert.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Base64 } from 'meteor/ostrio:base64';

Template.connection_content.onCreated(function connection_contentOnCreated() {
  this.search_conn = new ReactiveVar("");
});

// Template.connection_content.helpers({
var all_connection_data;
var all_friends;


  

Template.connection_content.onDestroyed(function(){
  all_connection_data.stop();
  all_friends.stop();
});




Template.connection_content.onRendered(function(){

  all_connection_data = Meteor.subscribe('user_info_for_connections');
  all_friends = Meteor.subscribe('user_info_all_friends',Session.get("userId"));

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


Template.connection_content.helpers({

	user_is_admin(){
			var logged_in_user = Session.get("userId");
			if(logged_in_user == 'user_admin'){
				return true;
			}
			else{
				return false;
			}
	},
	  
	request(){
		     var sent_to = Session.get("userId");
			 var count1 = FriendRequest.find({sent_to: sent_to,req_status: 0}).count();
			 return count1;
	},

     ignore(){
	 var sent_to = Session.get("userId");
	 var count2 = FriendRequest.find({sent_to: sent_to,req_status: 2}).count();
	 return count2;
	}, 
 
     show_all_users(){
     	    var logged_in_user = Session.get("userId");
     	    // Meteor.subscribe('user_info_based_on_id',logged_in_user);
     		var result = UserInfo.find({user_id: {$ne: logged_in_user}}).fetch();
     		return result;
     },

	 connection(){
	 // alert('boojj');
	 var sent_to = Session.get("userId");

	 if(sent_to == 'user_admin'){
	 	var count3 = UserInfo.find({}).count();
	     return count3-1; 
	 }
	 else{

	 var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).count();
	 }
	 return count3; 	
	},

	 show_pending(){
	 var sent_to = Session.get("userId");
	 var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 0}).fetch();
	 var length = show_pending.length;
	 // //alert('Length: '+length);
		 if(length > 0){
		 return show_pending;
		}
	},

	 show_pending2(){
	 var use_id = this.sent_by; 
	 // //alert(use_id);	
	   // Meteor.subscribe('user_info_based_on_id',use_id);
	 var pending_details = UserInfo.find({user_id: use_id}).fetch();
     return pending_details;
	},

	 show_ignored(){
			 var sent_to = Session.get("userId");
			 var show_pending = FriendRequest.find({sent_to: sent_to,req_status: 2}).fetch();
			 var length = show_pending.length;
			 if(length > 0){
			 return show_pending;
		}
	},

	 show_ignored2(){
	 var use_id = this.sent_by; 
	  // Meteor.subscribe('user_info_based_on_id',use_id);
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


 calculate_time_difference(a){
    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);

   if(minutes<1 && seconds<10){
    return ' Just now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + ' s';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + ' m';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + ' h';
        }else{ 
        return Math.floor(hours) + ' h';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +" d";
    }else{
    return Math.floor(days) +" d";
    }
  }
  else{    
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
  }
},

    

     show_connections_2(){
     	// alert('csss');
     var use_id = this.sent_by; 
     var logged_in = Session.get("userId");
     // var connected_since = this.updatedAt;
     // var updated_at = calculate_time_difference(connected_since);
     // $('#check1').text(updated_at);
     // var logged_in = Session.setPersistent("connected_since",this.updatedAt);

      const t = Template.instance();
      // alert('critsmas');
     const query = new RegExp(t.search_conn.get(),'i');   
     // alert(query);

     if(t.search_conn.get() == ""){
     // alert('1');
     if(use_id == logged_in){
        use_id = this.sent_to;
         // Meteor.subscribe('user_info_based_on_id',use_id);
        var connection_details = UserInfo.find({user_id: use_id}).fetch();
        var show_details = connection_details[0];
     console.log(connection_details);
     return connection_details; 
     }
     else{
     	 // Meteor.subscribe('user_info_based_on_id',use_id);
     var connection_details = UserInfo.find({user_id: use_id}).fetch();
     var show_details = connection_details[0];
     console.log(connection_details);
     return connection_details;     
     }}else{
     	// alert('2');
if(use_id == logged_in){
	 // Meteor.subscribe('user_info_based_on_id',use_id);
        use_id = this.sent_to;
        var connection_details = UserInfo.find({user_id: use_id, name: query}).fetch();
        var show_details = connection_details[0];
     console.log(connection_details);
     return connection_details; 
     }
     else{
     	 // Meteor.subscribe('user_info_based_on_id',use_id);
     var connection_details = UserInfo.find({user_id: use_id, name: query}).fetch();
     var show_details = connection_details[0];
     console.log(connection_details);
     return connection_details;     
     }
     }
     // const query = new RegExp(t.search_conn.get())   
     // if(t.search_conn.get() == ""){
     // var listing = FriendRequest.find({},{sort: {createdAt: -1}}).fetch();
     // return listing;
     // }else{
     //    return connection_details;
     // // var listing =UserGroup.find({grp_title:{$regex:query}}).fetch();
     // }
     // return listing;
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

	 check_user_blocked_or_not(){
	 	// alert('hi');
	 	var logged_in_user = this.user_id;;
	 	 // Meteor.subscribe('user_info_based_on_id',logged_in_user);
		var result = UserInfo.find({ user_id: logged_in_user }).fetch();
		var status = result[0].status;
		// alert(logged_in_user+''+status);
		if( status == "" || status  == null || status == undefined ){
			return true;
		}
		else{
			return false;
		}
	 },

});

Template.connection_content.events({
	 'click .request_accept_status': function(){
	 // //alert('inside accpet request');
	 var sent_by = this.user_id;
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
	 
	},


	 'click #block_user': function(){

	 	var confirmation = confirm("Are you sure you want to block this user ?");

	 	if(confirmation == true){

	 	var user_id =this.user_id;
	 	// alert('blocked'+n1);
	 	var user_status = 'Blocked';
	 Meteor.call('change_user_blocked_status',user_status,user_id,function(error,result){
	 		if(error)
		 	{
		 	    toastr.error('Error');
		 	}
		 	else{
		 	    toastr.success('Succesfully blocked');
		 	}
	 });

	 	}

	},

	 'click #unblock_user': function(){
	 	var user_id =this.user_id;
	 	// alert('blocked'+n1);

	 	var confirmation = confirm("This user is blocked at this moment. Are you sure you want to unblock this user ?");

	 	if(confirmation == true){

	 	var user_status = "";
	 Meteor.call('change_user_blocked_status',user_status,user_id,function(error,result){
	 		if(error)
		 	{
		 	    toastr.error('Error');
		 	}
		 	else{
		 	    toastr.success('Succesfully unblocked');
		 	}
	 });

	}
	},


});

Template.connection_content.events({
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
		 	}
		 	else{
		 		//alert('sucess: '+result);
		 	}
	 });
	}
});

Template.connection_content.events({
	 'click #remove_connection': function(){
	 // alert('inside ignore request');
	 if(confirm("Are you sure you want to remove? ")){


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
	}
});

Template.connection_content.events({
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
'click #search_connection_all': function(){
	// alert($('#search_all_text_conn').val());
	const t = Template.instance();
    // alert('sooorrr');
    // var search_text = $('#search_all_text_conn').val();
    // var result =  UserGroup.find({grp_title:{$regex:new RegExp('^' + search_text)}}).fetch();
      // alert(search_text);
      t.search_conn.set($('#search_all_text_conn').val());
      
},'click #all_connections':function(){
	$("#connection").show();
	$("#request").hide();
	$("#ignore").hide();
},
'click #request_connections':function(){
	$("#connection").hide();
	$("#request").show();
	$("#ignore").hide();
},
'click #ignore_connections':function(){
	$("#connection").hide();
	$("#request").hide();
	$("#ignore").show();
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



