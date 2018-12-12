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


Template.admin_panel.helpers({

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

	show_all_user(){	
			 var show_pending = UserInfo.find({}).fetch();
			 var length = show_pending.length;

			 if(length > 0){
			 return show_pending; 	
		}
	},

		show_all_groups(){	
			 var show_pending = UserGroup.find({}).fetch();
			 var length = show_pending.length;

			 if(length > 0){
			 return show_pending; 	
		}
	},

		show_all_events(){	
			 var show_pending = Event.find({}).fetch();
			 var length = show_pending.length;

			 if(length > 0){
			 return show_pending; 	
		}
	},

		show_all_blogs(){	
			 var show_pending = Blog.find({}).fetch();
			 var length = show_pending.length;

			 if(length > 0){
			 return show_pending; 	
		}
	},

	  trim_content(content){
     if(content.length > 24){
         return content.substr(0, 24)+"...";
        }
        else{
        return content;
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

Template.admin_panel.events({

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
		 	   console.log('Error');
		 	}
		 	else{
		 		console.log('sucess: '+result); 
		 	}
	 });

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

	'click #search_connection_all': function(){
		const t = Template.instance();
	    t.search_conn.set($('#search_all_text_conn').val());
	},

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



