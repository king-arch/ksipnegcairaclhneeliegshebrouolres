
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { UserInfo }  from './../../import/collections/insert.js';



import { ServiceConfiguration } from 'meteor/service-configuration';

var user_info_based_on_email;

Template.login.onDestroyed(function(){
  user_info_based_on_email.stop();
});

// function nammaa(){
// var show12 = Meteor.user(); 
// console.log(show12);
// if(show12){
// var source = Session.get("check_source");  
// check_login(source);
// console.log(show12);
//  }
// }

Template.login.onDestroyed(function () {
  Session.set("makeUserActive","");
  tracker.stop();
});

var tracker;
Template.login.onRendered(function () {

// click_google_login();

//   Session.set("imagePath","");
//   tracker = Tracker.autorun(function() {
//    Session.setPersistent("check_onlyonce",0);
//   if(Meteor.user()){
//       if(Session.get("nammaval")==1){
//       nammaa();
//       Session.setPersistent("nammaval",0);
//       console.log("Inside Login Autorun");
//     }
//    }
// });

});

Template.login.events({

    // 'click #login_with_googleplus': function(e) {
    //     alert('clicked');
        
    //     $('#google_login').click();
    //     // Meteor.loginWithFacebook();
    // },

'click .show_password': function(){
  
  var input = $('#login_password').attr("type");

  if (input == "password"){
    $('#login_password').attr("type", "text");

    $('#sign_up_eye_open').addClass("loader_visiblity_block");
    $('#sign_up_eye_close').removeClass("loader_visiblity_block");

  } else {
    $('#login_password').attr("type", "password");


    $('#sign_up_eye_close').addClass("loader_visiblity_block");
    $('#sign_up_eye_open').removeClass("loader_visiblity_block");

  }
},

'click .show_password2': function(){
  
  var input = $('#password1').attr("type");

  if (input == "password") {
    $('#password1').attr("type", "text");

    $('#sign_in_eye_open').addClass("loader_visiblity_block");
    $('#sign_in_eye_close').removeClass("loader_visiblity_block");

  } else {
    $('#password1').attr("type", "password");

    $('#sign_in_eye_close').addClass("loader_visiblity_block");
    $('#sign_in_eye_open').removeClass("loader_visiblity_block");
  }

},
  'submit #login-form': function(event){
  event.preventDefault();
  // alert('signup');
  var username = $('#username').val();
  var email = $('#email').val();
  var password = $('#password1').val();  
  
//  alert(name+' '+email+' '+phone+' '+password);
  var name = username.trim(); 
  var email = email.trim().toLowerCase(); 
  var password = password.trim();
if(name=='')
{
  $("#username").addClass('emptyfield2');
  return false;
}else
{
  $("#username").removeClass('emptyfield2');
}
if(email=='')
{
  $("#email").addClass('emptyfield2');
  return false;
}else
{
  $("#email").removeClass('emptyfield2');
}
if(password=='')
{
  $("#password1").addClass('emptyfield2');
  return false;
}else
{
  $("#password1").removeClass('emptyfield2');
}

if(password.length <= 7)
{
  //alert("Password should be of 6 digits at least");
  toastr.warning("Password should be of 8 digits at least");
  return false;
}
if(name.length > 20)
{
  //alert('Cant enter more then 20 digits in Name');
   toastr.warning("Cant enter more then 20 characters in Name");
  return false;
}
user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);
c =UserInfo.find({email: email}).count();
//alert(c);
if(c > 0){
  //alert('email already exist!');
  toastr.error("email already exist!");
  return false; 
} 

  
   name =  name.charAt(0).toUpperCase()+ name.slice(1);
var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);

      Meteor.call('save_user',userID,name,password,email,function(error,result){
              if(error){
                alert("Some error occure.");
              
              }else{
                if(result == "email_exists"){
                   toastr.error("email already exist!");
                   return false;
                }else{
                Session.setPersistent("userId",userID);
                Session.setPersistent("userEmail",email);
                Router.go('/email');

                }
              }
          });
      }
});

Template.toplog.events({

  'click #login_submit':function(event){
      // alert('inside login');
      event.preventDefault();
      var login_email = $('#login_email').val();         
      var login_password = $('#login_password').val();         

       if(login_email == null || login_email == "")
        {
          $('#login_email').addClass('emptyfield').focus();
          return false; 
        }
        else{
          $('#login_email').removeClass('emptyfield');
        }

         if(login_password == null || login_password == "")
        {
          $('#login_password').addClass('emptyfield').focus();
          return false; 
        }
        else{
          $('#login_password').removeClass('emptyfield');
        }

          Meteor.call("user_login",login_email,login_password, function(error,result){
      
        if(error){
          toastr.error("Something went wrong, Please try again");          
        }else{

          // alert(JSON.stringify(result));
          if(result == "No User"){
             var msg='Wrong email or Password';
            toastr.error(msg+""); 
          }
          else if(result.length == 1){

            if(result[0].status == 'Blocked'){

          var name = result[0].name;
            toastr.error(' Your account has been Blocked by Admin');
            return false;
        }
          toastr.success("Logged in Successfully");
            // alert("Valid User");
            var userId = result[0].user_id;
         // alert('session set to '+userId);
          Session.setPersistent("userId",userId);
          Session.set("coming_from_login","true");
          $('.form_reset').trigger('reset');
         var login_status = 1;
         var userId = Session.get("userId");
          storeToken();
         Meteor.call("update_login_status",login_status,userId,function(error,result){
              if(error){
                //alert('user login status updation error');
                console.log('error');
              }
              else{
                //alert('user is now online');
                 console.log('result');
              }

            });
            if(result[0]){
              if(result[0].email_status==0){
                Router.go('/email');
              }else if(!result[0].location){
                // alert("location empty");
                    Session.set("emptyField","location");
                  Router.go("/signup");
              }else if(!result[0].phone){
                // alert("phone empty");
                   Session.set("emptyField","phone");
                   Router.go("/signup") 
              }else if(!result[0].disablities){
                // alert("speech empty");
                      Session.set("emptyField","speech");
                      Router.go("/signup")
              }else if(!result[0].profile_pic){
                    // alert("profile pic empty");
                       Session.set("emptyField","profile_pic");
                       Router.go("/signup");                       
              }else if(!result[0].headline){
                   Session.set("emptyField","headline");
                       Router.go("/signup");                       
              }else{
                Router.go("/feed");
              }

              // window.location.replace("/signup");

            // Router.go('/signup');
            return false;
          }


          }else{
            toastr.warning("Wrong Email or Password");
          }
        }
      });
}
});

function storeToken(){
        if(Meteor.isCordova){
            Meteor.call("update_user_token",Session.get("userToken"),Session.get("userId"),function(error,result){
              if(error){
                alert("Token not updated");
              }else{
                alert("Token updated");
              }
            });
          }
}

Template.log.events({

    // 'click #login_with_googleplus': function(e) {
    //     alert('clicked');
    //     $('#google_login').click();

    //     // Meteor.loginWithFacebook();
    // },

   //  'click #login_with_linkdin': function(e) {
   //      e.preventDefault();
   //    // Meteor.loginWithLinkedin();
   //    Session.setPersistent("nammaval",1);
   //      // Meteor.loginWithFacebook();
   //       Meteor.loginWithLinkedIn({
   //        requestPermissions: ['r_basicprofile','r_emailaddress']
   //        }, function(err){
   //          if(err){
   //            console.log('error with login is: ', err);
   //          }
   //      });
    
   //  },

   // 'click #login_with_facebook': function(e) {
   //      e.preventDefault();
   //      Session.setPersistent("nammaval",1);
   //      // Meteor.loginWithGoogle();
   //      Meteor.loginWithFacebook();
   //      document.getElementById("login_with_fb2").click();
   //  },
});

Template.log.events({
// 'click #login_with_googleplus': function(){

// // $('#login_with_googleplus').click();
// var show12 = Meteor.user(); 

// var source = 'Google'; 
// // alert(source);
// Session.setPersistent("check_source",source); 

// if(show12){  
// check_login(source);
//  }
//  // else{
//  //   $('#login_with_googleplus').click();
//  // }
//     },    
// })
// Template.log.events({
// 'click #login_with_linkdin': function(){

// // $('#login_with_googleplus').click();
// var show12 = Meteor.user(); 

// var source = 'Linkedin'; 
// // alert(source);
// Session.setPersistent("check_source",source); 

// if(show12){  
// check_login(source);
//  }
//  // else{
//  //   $('#login_with_googleplus').click();
//  // }
//     },    
// })

// Template.log.events({
// 'click #login_with_fb2': function(){
//   var show12 = Meteor.user(); 
//   console.log(show12);
//   var source = 'Facebook';
//   Session.setPersistent("check_source",source); 
//   if(show12){
//     check_login(source);
//     console.log(show12);
//    }
//     },    
});


function check_login(source){

        var source = source;
        var show12 = Meteor.user();
       
        if(show12){  
        if(source=="Google"){

      var name  = show12.services.google.name;
      var email = show12.services.google.email;
      var picture = show12.services.google.picture; 
             user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);     
      var check_existance = UserInfo.find({email: email}).count();

        }else if(source == "Facebook"){
  
       var name  = show12.services.facebook.name;
       var email = show12.services.facebook.email;       

       user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);
       var check_existance = UserInfo.find({email: email}).count();
       var picture = "http://graph.facebook.com/" + show12.services.facebook.id + "/picture/?type=large";

        }else{
      var name  = show12.services.linkedin.firstName+' '+show12.services.linkedin.lastName;
      var email = show12.services.linkedin.emailAddress; 

      user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);     
      var check_existance = UserInfo.find({email: email}).count();  
      if(check_existance>0)
      {
        Session.setPersistent("nammaval",1);
      }
      var picture = show12.services.linkedin.pictureUrl; 
           //alert(email);
        }
           }
     // console.log(show12);return false;
       // alert(show12);      
      if(check_existance == 0){
         var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);  
         Session.setPersistent("userId",userID);
 
 var ab = Meteor.call("create_user",userID,source,name,email,picture);  
       
         Session.setPersistent("userEmail",email);       
        storeToken();
         window.location.replace("/signup");
      }
      else{
        // return false;
        user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);
        var users = UserInfo.find({email: email}).fetch();
        var userID = users[0].user_id;
        console.log(users);
        //alert(userID);

        if(userID){
        Session.setPersistent("userId",userID);
          storeToken();


                  // var users =UserInfo.find({"user_id":userID}).fetch();
        storeToken();
          console.log(users);

           if(users[0]){
            console.log("inside  login"  );
              if(users[0].email_status==0){
                Router.go('/email');
                 // Router.go('/signup');
                 console.log("case 1");
              }else if(!users[0].location){
                // alert("location empty");
                console.log("case 2");
                   Session.set("emptyField","location");

                   window.location.replace("/signup");
                   // Router.go('/signup');
              }else if(!users[0].phone){
                console.log("case 3");
                // alert("phone empty");
                   Session.set("emptyField","phone"); 

                   window.location.replace("/signup");
                   // Router.go('/signup');
              }else if(!users[0].disablities){
                console.log("case 4");
                // alert("speech empty");
                      Session.set("emptyField","speech");

                      window.location.replace("/signup");
                      // Router.go('/signup');
              }else if(!users[0].profile_pic){
                console.log("case 5");
                    // alert("profile pic empty");
                       Session.set("emptyField","profile_pic");                       
              }else if(!users[0].headline){
                   Session.set("emptyField","headline");

                   window.location.replace("/signup");
                   // Router.go('/signup');
              }else{
                
            Router.go('/feed');
              }
          }

        window.location.replace("/signup");
        }
        else{
          return false;
        }
      }
}


// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }


// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

// var getEmail = profile.getEmail();
// var getName = profile.getName();
// var getImageUrl = profile.getImageUrl();

//         Meteor.call('check_for_google_login',getEmail,getName,getImageUrl,function(error,result){
//               if(error){
//                 alert("Some error occure.");
              
//               }else{
//                 if(result == "email_exists"){
//                    toastr.error("email already exist!");
//                    return false;
//                 }else{
//                   // alert('successfull login');
//                   var url = result.send_url;
//                   var userID = result.userID;
                
//                  userID= Base64.encode(userID);

//                 // Session.setPersistent("userId",userID);
//                 // Session.setPersistent("userEmail",email);
//                 Router.go(url+'/'+userID);

//                 }
//               }
//           });

// }

