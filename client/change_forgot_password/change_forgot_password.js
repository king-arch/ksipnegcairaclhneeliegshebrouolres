import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { UserInfo }  from './../../import/collections/insert.js';
import { Session } from 'meteor/session';
//document.title = "Special Neighbourhood | Change password";

var user_info_based_on_id;
Template.forgotpassword2.onDestroyed(function(){
  user_info_based_on_id.stop();
});


Template.forgotpassword2.onRendered(function(){
user_info_based_on_id = Meteor.subscribe("user_info_based_on_id", Session.get("userId"));	


        var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];

        var user_id_by_url = Base64.decode(url); 
        Session.setPersistent("userId",user_id_by_url);


});


Template.forgotpassword2.events({

	"click #showpassword":function(){
		var att=$("#password").attr("type");
		if(att=="password")
		{
			$("#password").attr("type","text");
			$("#passeye").attr("class","fa fa-eye-slash");
		}else{
			$("#password").attr("type","password");
			$("#passeye").attr("class","fa fa-eye");
		}
		//alert(att);
	},

	'click .show_password': function(){
  
  var input = $('#password').attr("type");

  if (input == "password"){
    $('#password').attr("type", "text");

    $('#sign_up_eye_open').addClass("loader_visiblity_block");
    $('#sign_up_eye_close').removeClass("loader_visiblity_block");

  } else {
    $('#password').attr("type", "password");


    $('#sign_up_eye_close').addClass("loader_visiblity_block");
    $('#sign_up_eye_open').removeClass("loader_visiblity_block");

  }
},

	'click .updatepass':function(){
// alert('case 1');
		var pass=$("#password").val();
		var userId = Session.get('userId');
		 $("#spinnerimg").show();

		if(pass==''){
			 $("#password").addClass('emptyfield2');
			 $("#spinnerimg").hide();
		}
		else{
		
		$("#password").removeClass('emptyfield2');
		$('#loader_gif').removeClass('div_hide_class');
		$('#save_text').addClass('div_hide_class');
// alert('case 2');
			Meteor.call("change_pass",Session.get("userId"),pass,function(error,result){
	        if(error){
	        	// alert('case 3');
	         toastr.error("Some error occure");
	          $("#spinnerimg").hide();
	        }else{
// alert('case 4');
	 //    $('#loader_gif').addClass('div_hide_class');
		// $('#save_text').removeClass('div_hide_class');

			      
			      var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();
			      var userEmail = c1[0].email;

var name = c1[0].name;
var div_style= "width:600px;height:auto;margin:auto;font-family:sans-serif;font-weight:normal;font-size:12px; border:10px solid red";
var div_style2= "width:600px;height:auto;float:left;background-color:#efefef;border:10px solid red !important";
var div_style3= "background-color:#fff;border-spacing:0px;width:100%";
var div_style4= "width:100%;height:50px;float:left;background-color:#fff";
var div_style5= "background-color:#fff;width:100%";
var div_style6= "background-color:#fff;width:100%";
var div_style7= "width:150px;height:auto;float:left;vertical-align: middle;";
var div_style8= "height: 50px";
var div_style9= "height: 50px";
var div_style10= "float: right; margin-right: 15px; color: #666";
var div_style11= "width:96%;height:auto;float:left;padding:10px";
var div_style12= "width:100%; border:0";
var div_style13= "color:#414850;line-height:30px";
var div_style14= "color:#414850;line-height:30px";
var div_style15= "width:100%;float:left;background-color:#fff;;margin-top:6px";
var image_url="http://beta.specialneighborhood.com/feed/blog/logo.png";
var style="width:150px; height:150px";
var spacing="2";
var email = "ankit.vayuz@gmail.com";
var htmlCode="<html><head><title>Email</title></head><body><div style="+div_style+"><div style="+div_style2 +"><table style="+div_style3+"><tbody><tr><td><div style="+div_style4+"><table style="+div_style6+"><tbody><tr><td><div style="+div_style7+"><a> <img src="+image_url+" style="+style+"/></a></div></td><td><p style="+div_style10+"><p></td>"+
"</tr></tbody></table></div><div style="+div_style11+"><table style ="+div_style12 +" cellspacing="+spacing+" cellpadding="+spacing+"><tbody><tr><td "+
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Your password has been changed Sucessfully and below are your login details"+
"!</td></tr><tr><td colspan="+div_style11
+"><br/><p>Email: "+c1[0].email+" </p></br><p>Password : "+pass+"</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for special neighborhood, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Special Neighborhood Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Special Neighborhood, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: userEmail,
            from: 'specialneighborhoodteam@gmail.com',
            subject: "SN | Password Sucessfully Changed",
            html: htmlCode,
        };

 // var htmlCode = "<p><h3>Bitovn</h3></p> <p> Hi "+det[0].name+"</p><p>Your password has been changed successfully below are your login details</p></br><p>Username:"+det[0].email+"</p></br><p>Password:"+pass+"</p></br><p>Have fun, and don't hesitate to contact us with your feedback.</p></br><p>The Bitovn Team</p>"
			     
			    /*  var email = {
			            to: userEmail,
			            from: 'ankit.vayuz@gmail.com',
			            subject: "test email",
			            html: htmlCode,
			        };*/

			        Meteor.call('sendEmail', "", email,function(error,result){
			        if(error){
			          // $("#errorlabel").text("Some error occure.");
			          //  $("#errorlabel").show();
			          // $("#errorlabel").addClass("errorlabel");
			          toastr.error("Some error occure.");
			           $("#spinnerimg").hide();
			         // $("#send_mail").text("Resend");
			        }else{
			          // $("#errorlabel").text("Your password has been changed successfully.");
			          // $("#errorlabel").addClass("successlabel");
			          // $("#errorlabel").show();
			          toastr.success("Your password has been changed successfully.");
			           $("#spinnerimg").hide();
			          //$("#send_mail").text("Resend");
			          //alert("Send");
			          //Meteor._sleepForMs(400);
						     
						     Meteor.setInterval(function(){
							 // Router.go('/feed');
							 location.href = '/feed';

							}, 400);
					
			           
			        }
			    });

	       		}
        	});
		}
	}
});;