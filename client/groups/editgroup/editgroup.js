
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { UserGroup } from './../../../import/collections/insert.js';
import { Session } from 'meteor/session';
import { Base64 } from 'meteor/ostrio:base64';
import { UserInfo } from './../../../import/collections/insert.js';
          
          Template.groupedit.onRendered(function(){
              // UI._globalHelpers['load_edit_form']();


              // setTimeout(function(){
              //  var grp_type = Session.get('grp_type');
              //  // alert(grp_type);
              // $("#group_type_drop_down").dropdown("set selected", grp_type);
              //  },1000); 

              var grp_id = Session.get("show_grp_edit_id");
              // alert(grp_id);
              Meteor.subscribe("group_information_based_on_group_id",Session.get("show_grp_edit_id"));

              var listing = UserGroup.find({grp_id: grp_id}).fetch();
              $("#group_type_drop_down").dropdown("set selected", listing[0].grp_type);

              
setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
     Meteor.subscribe("user_info_based_on_id",logged_in_User);
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


    Template.groupedit.events({
      'click #edit_save_group': function(event){

        event.preventDefault(); 
        var grp_title = $('#edit_grp_title').val(); 
        var grp_image_default = $('#cover_image_hidden').val();  
        var grp_type = $('#edit_grp_type').val(); 
        var grp_discription = $('#edit_grp_discription').val(); 
        // var grp_visibility = $('#grp_visibility').val();  

       // if (document.getElementById('edit_grp_visibility_1').checked) {
       //           var grp_visibility = 'Public';
       //        }
       //        else{
       //           var grp_visibility = 'Private';
       //        }
            
        if(grp_title == null || grp_title == "")
        {
          $('#edit_grp_title').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_grp_title').removeClass('emptyfield');
        }

        if(grp_type == null || grp_type == "")
        {
          $('#edit_grp_type').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_grp_type').removeClass('emptyfield');
        }

        if(grp_discription == null || grp_discription == "")
        {
          $('#edit_grp_discription').addClass('emptyfield').focus();
          return false;
        }
        else{
          if(grp_discription.length < 50){
              alert("Group Discriptions Should be more then 50");
              $('#edit_grp_discription').addClass('emptyfield').focus();
              return false;
          }
          else{
              $('#grp_discription').removeClass('emptyfield');
          }
        }

        // alert(grp_title + grp_type + grp_discription + grp_visibility);
        // var image_Name = Session.get("imagePath_gp_edit_group");        

    var image_Name_2 = Session.get("imagePath_gp_edit_group");
    // alert('While saving : '+image_Name_2);
    if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
      // alert('Path 1');
      // console.log(image_Name_2);
      var grp_image = '/uploads/default/Default_group.png';
    }
    else{
      // alert('Path 2');
      var grp_image = image_Name_2;
    }

        var activity_status = this.activity_status;
        var user_id = Session.get("userId");
        // grp_id = 'grp_'+ Math.floor((Math.random() * 2465789) + 1);
        var grp_id = this.grp_id;
        // alert(user_id+' '+grp_image+' '+grp_title+' '+grp_type+' '+grp_discription+' '+grp_id+' '+activity_status);
          Meteor.call("update_Group_details",user_id,grp_image,grp_title,grp_type,grp_discription,grp_id,activity_status,function(error,result){
          if(error){
            console.log('Error');
          }else{
            console.log('sucessfull');
          }
        });

        Session.clear("imagePath_gp_edit_group"); 
        grp_id= Base64.encode(grp_id); 

        var url = '/group_detail/'+ grp_id; 
        Router.go(url); 
        
    }, 

    'click .clicked_cancel': function(){
        // alert('sss');
    var result = confirm(" Are you sure you want to cancel this form ?");

    if(result == true){
        Session.clear("imagePath_gp_edit_group");
        var grp_id = this.grp_id;
        grp_id= Base64.encode(grp_id); 
        var url = '/group_detail/'+ grp_id;
        Router.go(url);
     }
    },

    // 'click .edit_for_loading_group_type_drop_down': function(){
    //       var job_type = this.job_type;
    //       alert(job_type);
    //         $("#group_type_drop_down").dropdown("set selected", job_type);
    // },

    });

    Template.groupedit.helpers({
load_edit_form(){
  // alert('ttt');
    var grp_id = Session.get("show_grp_edit_id");
    // alert(grp_id);
    var listing = UserGroup.find({grp_id: grp_id}).fetch();
    // alert(listing);
    // console.log(listing);
    Session.setPersistent("grp_type",listing[0].grp_type);
    Session.setPersistent("imagePath_gp_edit_group",listing[0].grp_image);
    // var job_type = listing[0].job_type;
    //       alert(job_type);
    //         $("#group_type_drop_down").dropdown("set selected", job_type);

    return listing;
},

  uploaded_image:function(){

    var user_id = Session.get("userId");
    var image_Name = Session.get("imagePath_gp_edit_group");
    // var image_Name_2 = Session.get("imagePath_gp_edit_group");
    
    // if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
    // var image_Name = this.grp_image;    
    // }
    // else{
    //   image_Name = image_Name_2;
    // }
  if(image_Name){ 
  var display_image = image_Name;
  return display_image;
  }
  else{
           var display_image = '/uploads/default/Default_group.png';
           // alert(display_image);
           return display_image;
     }
  }

})

Template.groupedit.events({
  
//   'click #camera_clicked': function(){
//       $('#fileInput').click();
// },

//event to remove
  'click #remove_cover': function(){   
  // alert("removed"); 
      Session.setPersistent("imagePath_gp_edit_group","");   
  },  

 'change #fileInput': function(e, template) {
    upload_image(e, template);
    $("#loading_div").removeClass("loader_visiblity_block");
},
'click #crop_image':function(){
    crop_image();
},



'click #camera_clicked':function(){
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


'keyup .check_word_Count': function(){
  // alert('ss');
           var content = $('.check_word_Count').val();
           // alert(' Recent content: '+content);
           var new_content = content.split(' ');
           var check_new_content = new_content[new_content.length-1];
           // return false;
           if(check_new_content.length > 30){
            alert('Character limit( 30 characters in a word ) exceeded');
            var sliced_content = check_new_content.slice(0,29);
            // alert('sliced : '+sliced_content);
            new_content[new_content.length-1] = sliced_content;

            var new_text_final =new_content.join(" ");
            $('.check_word_Count').val(new_text_final);
           }
        },
});




function upload_image(e,template){

    if (e.currentTarget.files && e.currentTarget.files[0]) {
     var file = e.currentTarget.files[0];
      if (file) {
   
   var reader = new FileReader();
   var base64data="";
   
   reader.readAsDataURL(file);
   reader.onload = function () {
   
   console.log(reader.result);
   base64data = reader.result;

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
  var new_image_url = 'http://beta.bitovn.com/testing/' + response.substr(1, response.length);
  // console.log(new_image_url);
  Session.setPersistent("imagePath_gp_edit_group",new_image_url);
  $("#loading_div").addClass("loader_visiblity_block");
  });
};
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
      }   
  }
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
                               aspectRatio: 4 / 1,
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
// alert(dataURL);
// base64data = dataURL;
// console.log(base64data);
  // Session.setPersistent("imagePath_gp_edit_group",base64data);
  
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
      Session.setPersistent("imagePath_gp_edit_group",image_url);
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