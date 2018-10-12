
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { UserInfo }  from './../../import/collections/insert.js';
import { Session } from 'meteor/session';

// document.title = "Special Neighborhood | Forgot password";

var get_user_info_to_send_mail;

Template.forgotpassword1.onDestroyed(function(){
  get_user_info_to_send_mail.stop();
});

Template.forgotpassword1.events({
	"click #send_mail":function(event){
		event.preventDefault();
		 $("#spinnerimg").show();
		var email_addr=$("#email_addr").val();
		if(email_addr==''){
			// $("#errorlabel").text("Please fill the email field.");
			// $("#errorlabel").show();
			// $("#errorlabel").addClass("errorlabel");
			 $("#email_addr").addClass('emptyfield2');
			  $("#spinnerimg").hide();
		}else{

		get_user_info_to_send_mail = Meteor.subscribe("get_user_info_to_send_mail",email_addr);	

		c =UserInfo.find({email: email_addr}).count();
		$("#email_addr").removeClass('emptyfield2');
		if(c<1){
			toastr.error("This email address does not exist in our system");
			$("#spinnerimg").hide();
		}else
		{
			get_user_info_to_send_mail = Meteor.subscribe("get_user_info_to_send_mail",email_addr);	
			
			  var det = UserInfo.find({email: email_addr}).fetch();
			  userId = Base64.encode(det[0].user_id);

		      var userEmail = det[0].email;
		      
		      if(det[0].source == "Linkedin" || det[0].source == "Facebook" || det[0].source == "Google"){
		      	 $("#spinnerimg").hide();
				toastr.error("As You are registerd with "+det[0].source + " . You request for forgot password has been rejected.");
				return false;
		      }

		      //var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();
var name = det[0].name;
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
var image_url="http://specialneighborhood.com/uploads/icons/sn_logo.png";
var style="width:150px; height:150px";
var spacing="2";
var email = "specialneighborhoodteam@gmail.com";
var htmlCode="<html><head><title>Email</title></head><body><div style="+div_style+"><div style="+div_style2 +"><table style="+div_style3+"><tbody><tr><td><div style="+div_style4+"><table style="+div_style6+"><tbody><tr><td><div style="+div_style7+"><a> <img src="+image_url+" style="+style+"/></a></div></td><td><p style="+div_style10+"><p></td>"+
"</tr></tbody></table></div><div style="+div_style11+"><table style ="+div_style12 +" cellspacing="+spacing+" cellpadding="+spacing+"><tbody><tr><td "+
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Your request for Password reset has been processed successfully."+
"</td></tr><tr><td colspan="+div_style11
+"><br/><p>Please click on the link below to reset your password</p>"+
"<a href=http://www.specialneighborhood.com/change_forgot_password/"+userId +" </a>Reset Password link</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for Special Neighborhood, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Special Neighborhood Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Special Neighborhood, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";


      
		      //var htmlCode = "<p><h3>Bitovn</h3></p> <p> Hi "+det[0].name+"</p><p>Please click on the link below to reset your password</p> <a id="+userId+"  ank="+userId +" href=http://13.127.230.229/change_forgot_password/"+userId + " target=_blank>http://13.127.230.229/change_forgot_password/"+userId+"</a></br><p>Have fun, and don't hesitate to contact us with your feedback.</p></br><p>The Bitovn Team</p>"
		      var email = {
		            to: userEmail,
		            from: 'specialneighborhoodteam@gmail.com',
		            subject: "SN | Forgot Password",
		            html: htmlCode,
		        };

		        Meteor.call('sendEmail', "", email,function(error,result){
		        if(error){
		          // $("#errorlabel").text("Some error occure.");
		          //  $("#errorlabel").show();
		          // $("#errorlabel").addClass("errorlabel");
		          
		          toastr.error("Some error occured");
		           $("#spinnerimg").hide();
		          $("#send_mail").text("Resend");
		        }else{
		          // $("#errorlabel").text("We have sent a password reset email to your registered email address.");
		          // $("#errorlabel").addClass("successlabel");
		          // $("#errorlabel").show();
		           toastr.success("We have sent a password reset email to your registered email address.");
		           $("#spinnerimg").hide();
		          $("#send_mail").text("Resend");
		          Router.go("/");
		          //alert("Send");
		        }
		    });

		}
	}
	}
});