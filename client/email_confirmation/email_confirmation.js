import { Template } from 'meteor/templating';
import { UserInfo }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session';
// document.title = "Special Neighborhood | Email Confirmation";
Template.email_template.helpers({
'usernametoconfirm':function(){
  var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();
  if(c1[0]){
  return  c1[0].email;
  }else{
    return '';
  }
}
});


Template.email.helpers({
  'email_checker' : function(){
var x1 = Session.get("userId");

  if(Session.get("makeUserActive")=="true"){
    //alert("Checking Current Status");
    // alert(x1);
      console.log(x1);  
      Session.setPersistent("switchToFour","false");

       var c1 = UserInfo.find({"user_id": x1}).fetch();
      console.log(c1);

      
  if(c1[0] && c1[0].email_status ==1){
          //alert("active already");
            if(c1[0].headline){
            Router.go('/profile');
            }else{
            Router.go('/signup');
            }
        }else{
            //alert("not active ");
            Meteor.call('update_email_status', Session.get("userId"), 1, function(error, result){
              if(error){
               toastr.error("Some error occured");
              }else{
                Router.go('/signup');
              }
            }); 
      }

  }  
}});

Template.email_template.onRendered(function(){
Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
setTimeout(function(){
$("#send_mail").click();
},5000);



 var userHandle =  UserInfo.find({"user_id": Session.get("userId")}).observe({
      added: function(newDoc) {
    },
      removed: function(oldDoc) {
    },
      changed: function(newDoc, oldDoc) {
        if(newDoc.email_status != oldDoc.email_status){
         Router.go('/signup');
        }
    }
  });



});

Template.email_template.events({
  'click #send_mail':function(event){
      var userId = Session.get("userId");
      var h1 = "hidden";
      $("#spinnerimg").show();
      // userId  =CryptoJS.SHA1("user_1985791").toString();

      userId= Base64.encode(userId);
      // alert(userId);  
      var userEmail = Session.get("userEmail");
    Meteor.call('FetchUserData',Session.get("userId"),function(error,result){
    if(error)
      {
         console.log('Error');
      }
      else{
        console.log('sucess: '+result);
          // var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();
  // var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();
  var c1 =  result;
     
// var c1 = UserInfo.find({"user_id": Session.get("userId")}).fetch();

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
var image_url="http://specialneighborhood.com/uploads/icons/sn_logo.png";
var style="width:150px; height:150px";
var spacing="2";
var email = "specialneighborhoodteam@gmail.com";
var htmlCode="<html><head><title>Email</title></head><body><div style="+div_style+"><div style="+div_style2 +"><table style="+div_style3+"><tbody><tr><td><div style="+div_style4+"><table style="+div_style6+"><tbody><tr><td><div style="+div_style7+"><a> <img src="+image_url+" style="+style+"/></a></div></td><td><p style="+div_style10+"><p></td>"+
"</tr></tbody></table></div><div style="+div_style11+"><table style ="+div_style12 +" cellspacing="+spacing+" cellpadding="+spacing+"><tbody><tr><td "+
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Welcome to the Special"+
" Neighborhood Family!</td></tr><tr><td colspan="+spacing+">Your account is almost ready, but before you can login you need to complete a brief account verification process.</td></tr><tr><td colspan="+div_style11
+"><br/><a href=http://specialneighborhood.com/activate_email/"+userId + ">Click here</a> to verify your email ID.  (if you are using the mobile application, after you press on the previous link close the mobile browser and continue from the application).<br/></td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for special neighborhood, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Special Neighborhood Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Special Neighborhood, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: userEmail,
            from: 'specialneighborhoodteam@gmail.com',
            subject: "Special Neighborhood | Email Verification",
            html: htmlCode,
        };

        Meteor.call('sendEmail', "", email,function(error,result){
        if(error){
          $("#spinnerimg").hide();
          toastr.error("Some error occured");
        }else{
          document.getElementById("sent_text").textContent="Please check your email "+userEmail+".";
          // $(".email_sub_heading_two").hide() q
          $("#spinnerimg").hide();
          $("#sent_text").val("Sent");
          //$("#edit_grp_discription").text("We have sent an activeation email to your registered email address.");
          // toastr.success("We have sent an activation email to your registered email address.");
          document.getElementById("edit_grp_discription").className += " email_sub_heading_two";
          $("#send_mail").text("Resend");
          //alert("Send");
        }
    });

}
  });
    }
  });
