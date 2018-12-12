

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Images } from './../../import/config.js';
import { UserInfo }  from './../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

//document.title = "Bitovn | Signup";
Template.signup.onDestroyed(function () {
  // alert("Destroyed");
  // Session.set("imagePath","/uploads/default/default-profile-pic.png");
  tracker.stop();
});

Meteor.startup(function() {  
      GoogleMaps.load();
    });
Template.signup.onCreated(function () {
   Geolocation.currentLocation();
 });
var tracker;

Template.signup.onRendered(function () {
  
  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
    
      var url = window.location.href;
       var new_url = url.split("/");
       url = new_url[new_url.length-1];
//      if(url == 'signup'){

//     if(!window.location.hash) {
//         window.location = window.location + '#loaded';
//         window.location.reload();
//     }
// }

 Session.set("imagePath","/uploads/default/default-profile-pic.png");
   setTimeout(function(){
          $("#loader").addClass("hidden_element_class");
      },3000);

  setTimeout(function(){
    if (GoogleMaps.loaded()) {
      $("#autocomplete10").geocomplete({ details: "form" });
    }
  },400);
//   this.comp = Tracker.autorun(function() {
//   var userId  = Session.get("userId");
//   if(userId!=""){
//           var users =UserInfo.find({"user_id":userId}).fetch();
//   console.log(users);
//   //alert(userId);
//   // alert("Users" +users.length);
//   if(users[0]){
// console.log("Inside SIgn up");
//     if(users[0].email_status==0){
//       Router.go('/email');
//       console.log("case  1 ");
//     } if(!users[0].location){
//       console.log("case  location");
//     $('ul.tabs').tabs('select_tab', 'test3');
//   }else if(!users[0].phone){
//       console.log("case  phone");
//       $('ul.tabs').tabs('select_tab', 'test5');
//     }else if(!users[0].disablities){
//          console.log("case  disablities");
//          Session.setPersistent("imagePath","/uploads/default/default-profile-pic.png");
//          Session.setPersistent("imageCropped","false");
//         $('ul.tabs').tabs('select_tab', 'test4');

//     }else if(!users[0].profile_pic){
//          console.log("case  profile pic"); 
//         $('ul.tabs').tabs('select_tab', 'test6');
//     }else if(!users[0].headline ){
//          console.log("case  headline"); 
//         $('ul.tabs').tabs('select_tab', 'test7');
//     }
//       // if(users[0].firstTimeUser == 1){
//       //    sendWelcomeEmail();
//       //    Router.go('/users_map');
//       // }
//       // else{
//          // Router.go('/feed');
//          Router.go('/signup');
//       // }
//       // Router.go('/landing_page');
    
//   }
// }else{
//   Router.go('/');
// }

// });



   tracker = Tracker.autorun(function() {
      var userId  = Session.get("userId");
      Meteor.subscribe("user_info_based_on_id",userId);
      var users =UserInfo.find({"user_id":userId}).fetch();
      

           if(users[0]){
            console.log("inside  Signup"  );
              if(users[0].email_status==0){
                Router.go('/email');
                 // Router.go('/signup');
                 console.log("case 1");
              }else if(!users[0].location){
                // alert("location empty");
                console.log("case 2");
                   Session.set("emptyField","location");
                     $('ul.tabs').tabs('select_tab', 'test3');
              }else if(!users[0].phone){
                console.log("case 3");
                 $('ul.tabs').tabs('select_tab', 'test5');
                // alert("phone empty");
                   Session.set("emptyField","phone"); 
              }else if(!users[0].disablities){
                console.log("case 4");
                       Session.set("emptyField","speech");
                       $('ul.tabs').tabs('select_tab', 'test4');
              }else if(!users[0].profile_pic){
                      console.log("case 5");
                    // alert("profile pic empty");
                       Session.set("emptyField","profile_pic");    
                         $('ul.tabs').tabs('select_tab', 'test6');                   
              }else if(!users[0].headline){
                   console.log("case 5" + "HEaldine Empty");
                   $('ul.tabs').tabs('select_tab', 'test7');
                   Session.set("emptyField","headline");
              }

          }

});
  

var emptyfield =   Session.get("emptyField");
  var latlong =  Geolocation.latLng();
   if(latlong){
   console.log(latlong.lat);
   reverseGeocode.getSecureLocation(latlong.lat, latlong.lng, function(location){
    $("#autocomplete10").val(reverseGeocode.getAddrStr());
  });
   }

  Session.set("currentIndex","0");
  if(Session.get("emptyField")=="location"){
          Session.set("currentIndex","0");
         $('ul.tabs').tabs('select_tab', 'test3');
  }else if(Session.get("emptyField")=="phone"){
         Session.set("currentIndex","1");
        $('ul.tabs').tabs('select_tab', 'test5');    
  }else if(Session.get("emptyField")=="speech"){
        Session.set("currentIndex","2");
        $('ul.tabs').tabs('select_tab', 'test4');
  }else if(Session.get("emptyField")=="profile_pic"){ 
        Session.set("currentIndex","3");
        $('ul.tabs').tabs('select_tab', 'test6');
  }else if(Session.get("emptyField")=="headline"){ 
        Session.set("currentIndex","4");
        $('ul.tabs').tabs('select_tab', 'test7');
  }

  if(Session.get("switchToFour") == "true"){
    $('ul.tabs').tabs('select_tab', 'test6');
  }
    $('#divcrop').hide();
    $('#crop_image').hide();
    $('#crop_cancel').hide();

  // $result = $('#result');
        
  
        
});

Template.dme.helpers({
  "current_page":function(){
      Session.set("currentIndex","0");
  if(Session.get("emptyField")=="location"){
          Session.set("currentIndex","0");
         $('ul.tabs').tabs('select_tab', 'test3');
  }else if(Session.get("emptyField")=="phone"){
         Session.set("currentIndex","1");
        $('ul.tabs').tabs('select_tab', 'test5');    
  }else if(Session.get("emptyField")=="speech"){
        Session.set("currentIndex","2");
        $('ul.tabs').tabs('select_tab', 'test4');
  }else if(Session.get("emptyField")=="profile_pic"){ 
        Session.set("currentIndex","3");
        $('ul.tabs').tabs('select_tab', 'test6');
  }else if(Session.get("emptyField")=="headline"){ 
        Session.set("currentIndex","4");
        $('ul.tabs').tabs('select_tab', 'test7');
  }
},
    profilepic_image:function(){
    
    var image_Name = Session.get("imagePath");
    if(image_Name){
      if(image_Name == '/uploads/default/default-profile-pic.png'){
        // $("#remove_profile").addClass("hide_redmore");
      }
      else{
        // $("#remove_profile").removeClass("hide_redmore");
      }
      var display_image = image_Name;
      return display_image;
     }
  },

  uploaded_image:function(){

  var imagePath = Session.get("imagePath");
  if(imagePath){
  //alert(imagePath);
  var display_image =  imagePath;
    return display_image;
  }
  else{
   var  display_image = '/uploads/default/Default_group.png';
     Session.setPersistent("imagePath",display_image);
    return display_image;
  }
},

  cropped_image:function(){
  // var imagePath = Session.get("imagePathcropped");
  if(imagePath){
    var display_image =  imagePath;
    return display_image;
  }
  else{
    var display_image = '/uploads/default/Default_group.png';
    return display_image;
  }
}

})


Template.signup.events({
 // start croping js
'click #new_coverpic_button':function(){
  // alert('case 1');
  $('#upload_cover').click();
},

 'change #upload_cover': function(e, template) {
    // alert('case 1');
  // alert('upload PPlicked');
  // Session.clear("coverpic_imagePath");
    // upload_cover_image(e, template);
    upload_cover_pic(e, template);
    $('#cover_pic_modal').click();
    // $('#crop_cover_image').modal('show');
},

'change #cover_pic_modal': function() {
            $('#divcrop_cover').addClass('cropper-example-lena');
             $('.cropper-example-lena > img').cropper({
             aspectRatio: 8 / 8,
viewMode: 1,
  dragMode: 'move',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
  autoCropArea: 1
            });
},     

'click #crop_cover_image_selection':function(){
  // alert('1');
  crop_image_cover();
},



 'keyup input': function(event) {
      
      if (event.which === 13) {
        if(Session.get("currentIndex")== 0){
      validation_address_field();
        }else if(Session.get("currentIndex")==1){
      validation_contact_no();
        }else if(Session.get("currentIndex")==2){
          validation_for_disability();
        }
         event.stopPropagation();
         return false;
      }
  },

'click #adderss_field'(event) {
  validation_address_field();
},
'click #contact_no_button'(event){
  
  validation_contact_no();  
},
'click #disability'(event){
    validation_for_disability();
},
 'change #fileInput': function(e, template) {
    upload_image(e, template);
},
'click #crop_image':function(){
    $("#spinnerimg").show();
    crop_image();
},'click #crop_cancel':function(){
  //alert('Relaod');
  Session.setPersistent("switchToFour","true");
  Session.clear("imagePath");
  location.reload();
},
'click #Hearin':function(){
  if(document.getElementById("not_disabled").checked){
       document.getElementById("not_disabled").checked = false; 
  }
},'click #Speech':function(){
  if(document.getElementById("not_disabled").checked){
       document.getElementById("not_disabled").checked = false; 
  }
},'click #Visually':function(){
  if(document.getElementById("not_disabled").checked){
       document.getElementById("not_disabled").checked = false; 
  }
},'click #Physical':function(){
  if(document.getElementById("not_disabled").checked){
       document.getElementById("not_disabled").checked = false; 
  }
},
'click #not_disabled':function(){
   if(document.getElementById("not_disabled").checked){
    document.getElementById("Hearin").checked = false; 
    document.getElementById("Speech").checked = false;
    document.getElementById("Visually").checked = false;
    document.getElementById("Physical").checked = false;
  }  
},
'click #submit_image':function(){
  if(Session.get("imageCropped")=="true"){
    Meteor.call("upload_user_image",Session.get("userId"),Session.get("imagePath"),function(error,result){
        if(error){
          alert("Error");
        }else{
           Session.setPersistent("switchToFour","false");
          Session.setPersistent("imageCropped","false");
         $('ul.tabs').tabs('select_tab', 'test7'); 
        }
    });
  }else{
    alert("Select image first");
  }
},

'click #profile_headline':function(){
  var data= $('#textarea1').val();
  if(data=="" || data.trim() == ""){
    toastr.success("Headline could not be empty");
  }else{
      Meteor.call("update_headline",Session.get("userId"),data,function(error,result){
        if(error){
          alert("Error");
        }else{
        // sendWelcomeEmail();
        Router.go('/users_map');
        // Router.go('/feed');
        }
         

    });
  }
  // Session.setPersistent("firstTimeUser",true);
}

});

 


function validation_address_field(){
  var adderss_field = $("#autocomplete10").val();
  var lat = $("#lat").val();
  var long = $("#long").val();
  if(lat=='' && long==''){
    toastr.success("Please select the address from the dropdown");
  }
  else if(adderss_field==""){
  //alert("Address could not be empty");
  toastr.success("Address could not be empty");
  }
  else{

  Meteor.call('insert_address', Session.get("userId"), adderss_field,lat,long, function(error, result){
    if(error){
      alert('Error');
    }else{
      Session.set("currentIndex","1");
      Session.setPersistent("address",adderss_field);
        if(Session.get("address") == "pak")
          {
            $("#contact_no").val("92");
            var  address  =Session.get("address"); 
        //alert(address);
          }
      $('ul.tabs').tabs('select_tab', 'test5');           
    }
  }); 
}
}



function validation_contact_no(){
  var contact_no = $("#contact_no").val();
  var countrycode = $("#countrycode").val();

  // var edu_grade = $("#education_grade").val();
      // contact_no = contact_no.trim();
  //   if(!contact_no.match(/^\d+$/))
  // {   
  //   alert("number can only be integer");  
  //   $("#contact_no").focus().addClass('emptyfield');   
  //   return false;   
  // }   
// else{
if(contact_no=="" || contact_no==null){
   $("#contact_no").addClass('emptyfield2');
  }else if(contact_no.length < 5 ){
    //alert("Invalid");
     $("#contact_no").addClass('emptyfield2');
  }else if(countrycode.length=='')
  {
    $("#countrycode").addClass('emptyfield2');
  }
  else{
    $("#countrycode").removeClass('emptyfield2');
    $("#contact_no").removeClass('emptyfield2');

  var newUser = UserInfo.find({"phone":contact_no,"countrycode":countrycode}).fetch();
    console.log(newUser);
    if(newUser.length == 0){
     Meteor.call('insert_contact_no', Session.get("userId"), contact_no,countrycode, function(error, result){
       if(error){
        toastr.success("Some error occurs!");
       }else{
        Session.set("currentIndex","2");
       $('ul.tabs').tabs('select_tab', 'test4');   
      }
    }); 
    
    }else{
        toastr.success("Mobile number already exists with other user");
        return false;
    }  
}
  // }
//}

}

function validation_for_disability(){
       
        var hearing = document.getElementById("Hearin");
        if (hearing.checked) {
      hearing = 'Yes';
    } else {
      hearing = 'No';
    }
         
    var speech = document.getElementById("Speech");
        if (speech.checked) {
          speech = 'Yes';
        } else {
           speech = 'No';
        }


        var visual = document.getElementById("Visually");
        if (visual.checked) {
          visual = 'Yes';
        } else {
          visual='No';
        } 

        var physical = document.getElementById("Physical");
          if (physical.checked) {
           physical  ='Yes';
           } else {
           physical  ='No';
        }
         var special_note = $("#special_note").val();
         

        
  Meteor.call('insert_disabilities', Session.get("userId"), hearing, speech, visual, physical, special_note, function(error, result){
    if(error){
      alert('Error');
    }else{

      Session.set("currentIndex","3");
      $('ul.tabs').tabs('select_tab', 'test6');           
    }
  }); 



}

function upload_image(e,template){
       // e.preventDefault();
    // var files = e.currentTarget.files;
    if (e.currentTarget.files && e.currentTarget.files[0]) {
     var file = e.currentTarget.files[0];
      if (file) {
   
        var reader = new FileReader();
   var base64data="";
   reader.readAsDataURL(file);
   reader.onload = function () {
   console.log(reader.result);
   base64data = reader.result;

//         var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://beta.bitovn.com/testing/image_upload.php",
//   "method": "POST",
//   "headers": {
//     "content-type": "application/x-www-form-urlencoded"
//   },
//   "data": {
//     "image": base64data,
//   }
// }
// alert(base64data);
// $.ajax(settings).done(function (response) {
//   console.log(response);
//   var imagePath = 'http://beta.bitovn.com/testing' + response.substr(1, response.length);
//   console.log(imagePath);
  

var imagePath = base64data;
 Session.setPersistent("imagePath",imagePath);
   // alert(imagePath);


            $('#divcrop').show();
            $('#defaultbox').hide();

            $('#divcrop').addClass('cropper-example-lena');
            $("#my_image2").attr("src",imagePath);

             $('.cropper-example-lena > img').cropper({
             aspectRatio: 8 / 8,
            autoCropArea: 0.65,
            viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        restore: false,
        modal: false,
        guides: false,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        zoomable:false
            
            });

    $('#crop_image').show();
    $('#crop_cancel').show();
    $("#show_cropping_options").show();
    $('#my_image2').cropper('destroy').cropper('replace', imagePath);
}}}}

function crop_image(){
   //event.preventDefault();
  var croppedPhoto = $('#my_image2').cropper('getCroppedCanvas');

  // event.preventDefault();
   // alert('vlll');
  // var croppedPhoto = $('#my_image_profile').cropper('getCroppedCanvas');
    console.log(croppedPhoto);
    // croppedPhoto.toBlob(function (blob) {
var dataURL = croppedPhoto.toDataURL('image/jpeg', 0.5);
var blob = dataURItoBlob(dataURL);
console.log(blob);
var file = new FormData(document.forms[0]);
file.append("canvasImage", blob);
// alert(dataURL);
base64data = dataURL;
// alert(base64data);
console.log(base64data);

       var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://beta.bitovn.com/testing/image_upload.php",
  "method": "POST",
  "headers": {
    "content-type": "application/x-www-form-urlencoded"
  },
  "data": {
    "image": base64data,
  }
}
// alert(base64data);
$.ajax(settings).done(function (response) {
  console.log(response);
  //alert(response);
  var imagePath = 'http://beta.bitovn.com/testing' + response.substr(1, response.length);
  console.log(imagePath);
  Session.setPersistent("new_profile_image_url",imagePath);

     var user_id = Session.get("userId");
     // var user_id = Session.get("userId");
     //alert(user_id +' & ' +imagePath);
      $("#my_image").attr("src",imagePath); 

   Meteor.call("upload_profile_image",user_id,imagePath,function(error,result){
        if(error){
          alert("Error");
        }else{
           // alert("Profile Pic Changed");
             // toastr.success(Sucess, Profile Pic Changed);
           $("#spinnerimg").show();
           $('#divcrop_profile').removeClass('cropper-example-lena');
        }
        template.currentUpload.set(false);
    });
 });

             var imagePath =  Session.get("new_profile_image_url");
             // alert(imagePath);
             Session.setPersistent("imageCropped","true");
             Session.setPersistent("imagePath",imagePath);
                
             $("#crop_image").hide();
             $("#divcrop").hide();
             $('#divcrop').removeClass('cropper-example-lena');
             $("#defaultbox").show();

             // $("#my_image").attr("src",imagePath); 
            
             $("#my_image2").attr("src","");
             $("#show_cropping_options").show();
          }

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
// window.onload = function(){
    // var autocomplete = new google.maps.places.Autocomplete(
    // (document.getElementById('autocomplete10')),{types: ['geocode'] }
  //);
     
// };

function sendWelcomeEmail(){

        userId= Base64.encode(Session.get("userId"));
      // alert(userId);  
      
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
var image_url="http://bitovn.com/uploads/icons/sn_logo.png";
var style="width:150px; height:150px";
var spacing="2";
var email = "bitovnhoodteam@gmail.com";
var htmlCode="<html><head><title>Email</title></head><body><div style="+div_style+"><div style="+div_style2 +"><table style="+div_style3+"><tbody><tr><td><div style="+div_style4+"><table style="+div_style6+"><tbody><tr><td><div style="+div_style7+"><a> <img src="+image_url+" style="+style+"/></a></div></td><td><p style="+div_style10+"><p></td>"+
"</tr></tbody></table></div><div style="+div_style11+"><table style ="+div_style12 +" cellspacing="+spacing+" cellpadding="+spacing+"><tbody><tr><td "+
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Welcome to the Bitovn"+
" Family!</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for Bitovn, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Bitovn Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Bitovn, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: userEmail,
            from: 'bitovnteam@gmail.com',
            subject: "Bitovn | Welcome email",
            html: htmlCode,
        };

        Meteor.call('sendEmail', "", email,function(error,result){
        if(error){
          // $("#spinnerimg").hide();
          // toastr.success("Some error occured");
        }else{
           toastr.success("Welcome to Bitovn");
          // document.getElementById("sent_text").textContent="Please check your email "+userEmail+".";
          // $(".email_sub_heading_two").hide() q
          // $("#spinnerimg").hide();
          // $("#sent_text").val("Sent");
          //$("#edit_grp_discription").text("We have sent an activeation email to your registered email address.");
          // toastr.success("We have sent an activation email to your registered email address.");
          // document.getElementById("edit_grp_discription").className += " email_sub_heading_two";
          // $("#send_mail").text("Resend");
          //alert("Send");
        }
    });
}




function upload_cover_pic(e,template){
  $('#my_image_cover').cropper('destroy');
    // e.preventDefault();
    // var files = e.currentTarget.files;
    if (e.currentTarget.files && e.currentTarget.files[0]) {
     var file = e.currentTarget.files[0];
      if (file) {
   
        var reader = new FileReader();
   var base64data="";
   reader.readAsDataURL(file);
   reader.onload = function () {
   console.log(reader.result);
   base64data = reader.result;

//         var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://beta.bitovn.com/testing/image_upload.php",
//   "method": "POST",
//   "headers": {
//     "content-type": "application/x-www-form-urlencoded"
//   },
//   "data": {
//     "image": base64data,
//   }
// }
// alert(base64data);
// $.ajax(settings).done(function (response) {
//   console.log(response);
//   var imagePath = 'http://beta.bitovn.com/testing' + response.substr(1, response.length);
//   console.log(imagePath);
//   Session.setPersistent("new_image_url",imagePath);

var imagePath = base64data;
    $("#my_image_cover").attr("src",imagePath);             
            $("#my_image_cover").attr("srcset",imagePath);             
            
            $("#crop_cover_modal").attr("src",imagePath);
            $('#divcrop_cover').addClass('cropper-example-lena');
           // $('#crop_cover_modal').addClass('cropper-example-lena');
            // $('#image').cropper({
            //         aspectRatio: 16 / 4,
            //         autoCropArea: 0,
            //           viewMode: 1,
            //     dragMode: 'move',
            //     autoCropArea: 1,
            //     restore: true,
            //     modal: true,
            //     guides: false,
            //     highlight: true,
            //     cropBoxMovable: false,
            //     cropBoxResizable: true,
            //     zoomable:false
            //         });

             $('.cropper-example-lena > img').cropper({
                               aspectRatio: 1 / 1,
                    autoCropArea: 0,
                      viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: true,
                modal: true,
                guides: false,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                zoomable:false
            });
          // $('#my_image_cover').cropper('destroy').cropper('replace', imagePath);

    //var imagePath = Session.get("new_image_url");

};
    
     }  }} 



function crop_image_cover(){
  // alert('12345');
   // event.preventDefault();
   // alert('vlll');
  var croppedPhoto = $('#my_image_cover').cropper('getCroppedCanvas');
    console.log(croppedPhoto);
    // croppedPhoto.toBlob(function (blob) {
var dataURL = croppedPhoto.toDataURL('image/jpeg', 0.5);
var blob = dataURItoBlob(dataURL);
// console.log(blob);
// var file = new FormData(document.forms[0]);
// file.append("canvasImage", blob);
// // alert(dataURL);
// base64data = dataURL;
// console.log(base64data);
//   Session.setPersistent("imagePath",base64data);
//    Session.setPersistent("imageCropped","true");

//******************************* Start API code**************************
var form = new FormData();
form.append("files", blob);

var uploading_url = "https://specialneighborhood.com/upload_files";

var settings = {
 "async": true,
 "crossDomain": true,
 "url": uploading_url,
 "method": "POST",
 "headers": {
   "cache-control": "no-cache"
 },
 "processData": false,
 "contentType": false,
 "mimeType": "multipart/form-data",
 "data": form
}

$.ajax(settings).done(function (response){
 var image_url ="http://52.66.153.82:4300/files/"+response;
 console.log(image_url);
      // alert(image_url);
        Session.setPersistent("imagePath",image_url);
   Session.setPersistent("imageCropped","true");
});

//******************************* End API code**************************
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}


 // end croping js