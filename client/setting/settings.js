

import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../import/collections/insert.js';
import { UserInfo } from './../../import/collections/insert.js';
import { Emembers } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';
import { Session } from 'meteor/session'

   Template.settings_page.onRendered(function(){

setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    var result = UserInfo.find({user_id: logged_in_User}).fetch();

    if(result[0].source){
    	if(result[0].source == "Google" || result[0].source == "Facebook"){
    		var userSigninType = 1;
    	}
    	else{
    		var userSigninType = 0;
    	}
    }
     else{
    		var userSigninType = 0;
    	}

    Session.set("userSigninType",userSigninType);
    UI._globalHelpers['check_if_user_uses_socialMediaPlugin']();

if(result[0]){
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

if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("body_bg");
       $('#setting_container').addClass("pink_background");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  

        $('#c1').addClass("div_activ_bg_color");
		$('#c2').removeClass("div_activ_bg_color");
		$('#c3').removeClass("div_activ_bg_color");
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("body_bg");
     $('#setting_container').addClass("blue_background");
        
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("body_bg");

        $('#c2').addClass("div_activ_bg_color");
		$('#c3').removeClass("div_activ_bg_color");
		$('#c1').removeClass("div_activ_bg_color");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("body_bg");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");

 $('#setting_container').addClass("default_background");
      $('.page_wh').addClass("body_bg");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");

        $('#c3').addClass("div_activ_bg_color");
		$('#c1').removeClass("div_activ_bg_color");
		$('#c2').removeClass("div_activ_bg_color");
             
     } 
  }
}, 1000);


   });

Template.settings_page.helpers({

  logged_in_user_isadmin(){
    var logged_in_User = Session.get("userId");
    if(logged_in_User == 'user_admin'){
          return true;
    }
    else{
      return false;
    }
 },

 check_if_user_uses_socialMediaPlugin(){
 	var userSigninType = Session.get("userSigninType");
 	// alert("usersignin value"+userSigninType);
 	if(userSigninType == 0){
 		return true;
 	}
 	else{
 		return false;
 	}

 },

});


Template.settings_page.events({


'click #privacy': function(){
	// alert('privacy');
	Router.go('/edit_privacy');   
},

'click #cookies': function(){
	// alert('cookies');
	Router.go('/edit_cookies');   
},

'click #useragreement': function(){
    // alert('user agreement');
    Router.go('/edit_useragreement');   
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
          // alert('decrease');
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

// 'click .show_password': function(){
  
//   var input = $('#login_password').attr("type");

//   if (input == "password"){
//     $('#login_password').attr("type", "text");

//     $('#sign_up_eye_open').addClass("loader_visiblity_block");
//     $('#sign_up_eye_close').removeClass("loader_visiblity_block");

//   } else {
//     $('#login_password').attr("type", "password");


//     $('#sign_up_eye_close').addClass("loader_visiblity_block");
//     $('#sign_up_eye_open').removeClass("loader_visiblity_block");

//   }
// },

'click #Reset_password': function(){
	// alert('here');
	var old_password = $('#old_password').val();
	var new_password = $('#new_password').val();
	var retype_new_password = $('#retype_new_password').val();

	if(old_password=='')
		{
			$("#old_password").addClass('emptyfield3');
			$("#old_password").focus();
			return false;
		}else
		{
			$("#old_password").removeClass('emptyfield3');
		}
	if(new_password=='')
		{
			$("#new_password").addClass('emptyfield3');
			$("#new_password").focus();
			return false;
		}else
		{
			$("#new_password").removeClass('emptyfield3');
		}
	if(retype_new_password=='')
		{
			$("#retype_new_password").addClass('emptyfield3');
			$("#retype_new_password").focus();
			return false;
		}else
		{
			$("#retype_new_password").removeClass('emptyfield3');
		}

		if(new_password.length < 8)
		{
			alert('password length should not be less then 8');
			$("#new_password").addClass('emptyfield3');
			$("#new_password").focus();
		}

		var logged_in_User = Session.get('userId');
		var result = UserInfo.find({ user_id: logged_in_User }).fetch();
		var password = result[0].password;

		if(password == old_password){
			if(new_password == retype_new_password){

				Meteor.call('change_pass',logged_in_User,new_password,function(error,result){
		              if(error){ 
		                console.log("Some error occured.");
		              }else{
		               	toastr.success("Password sucessfully changed");          
		              }
		          });

			}else{
				alert('new maswords did not match');
				$("#new_password").addClass('emptyfield3');
				$("#new_password").focus();
			}
		}
		else{
			alert('wrong old password');
			$("#old_password").removeClass('emptyfield3');
			$("#old_password").focus();
		}
		location.href("");

},


	'click #c1':function(){
		// alert('kkkwe 1');
		$('#c1').addClass("div_activ_bg_color");
		$('#c2').removeClass("div_activ_bg_color");
		$('#c3').removeClass("div_activ_bg_color");

	    $('body').addClass("make_bg_2");
	    $('body').removeClass("make_bg_1");
	    $('body').removeClass("body_bg");
	    
	    $('.page_wh').addClass("make_bg_2");
	    $('.page_wh').removeClass("make_bg_1");
	    $('.page_wh').removeClass("body_bg");

	    var logged_in_User = Session.get("userId");
	    // var set_theme_value = '1';
	    var set_theme_value = '1';

	    Meteor.call('ChangeThemeColor',set_theme_value,logged_in_User,function(error,result){
              if(error){ 
                console.log("Some error occured.");
              }else{
               	toastr.success("theme color sucessfully changed!");          
              }
          });
	},

		'click #c2':function(){
		// alert('kkkwe 2');
	    $('#c2').addClass("div_activ_bg_color");
		$('#c1').removeClass("div_activ_bg_color");
		$('#c3').removeClass("div_activ_bg_color");

		// document.body.style.backgroundColor = "red";
	    $('body').addClass("make_bg_1");
		$('body').removeClass("make_bg_2");
	    $('body').removeClass("body_bg");

	    $('.page_wh').addClass("make_bg_1");
		$('.page_wh').removeClass("make_bg_2");
	    $('.page_wh').removeClass("body_bg");

	    var logged_in_User = Session.get("userId");
	    var set_theme_value = '2';

	    Meteor.call('ChangeThemeColor',set_theme_value,logged_in_User,function(error,result){
              if(error){ 
                console.log("Some error occured.");
              }else{
               	toastr.success("theme color sucessfully changed!");          
              }
          });
	},

		'click #c3':function(){
		// alert('kkkwe 3');
		$('#c3').addClass("div_activ_bg_color");
		$('#c2').removeClass("div_activ_bg_color");
		$('#c1').removeClass("div_activ_bg_color");

	    $('body').addClass("body_bg");
		$('body').removeClass("make_bg_2");
	    $('body').removeClass("make_bg_1");

	    $('.page_wh').addClass("body_bg");
		$('.page_wh').removeClass("make_bg_2");
	    $('.page_wh').removeClass("make_bg_1");

	    var logged_in_User = Session.get("userId");
	    var set_theme_value = '3';

	    Meteor.call('ChangeThemeColor',set_theme_value,logged_in_User,function(error,result){
              if(error){ 
                console.log("Some error occured.");
              }else{
               	toastr.success("theme color sucessfully changed!");          
              }
          });
	},

		'click #reset_password':function(){

		var old_password = $("#old_password").val();
		var new_password = $("#new_password").val();
		var retype_new_password = $("#retype_new_password").val();

		 if( old_password == "" || old_password  == null || old_password == undefined ){
		      return true;
		    }
		    else{
		      return false;
		    }

		 if( new_password == "" || new_password  == null || new_password == undefined ){
		      return true;
		    }
		    else{
		      return false;
		    }

		 if( retype_new_password == "" || retype_new_password  == null || retype_new_password == undefined ){
		      return true;
		    }
		    else{
		      return false;
		    }
    
	    var logged_in_User = Session.get("userId");
	    var set_theme_value = '3';

	    Meteor.call('ChangeThemeColor',set_theme_value,logged_in_User,function(error,result){
              if(error){ 
                console.log("Some error occured.");
              }else{
               	toastr.success("theme color sucessfully changed!");          
              }
          });
	},

	});


