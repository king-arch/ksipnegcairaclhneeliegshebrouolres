
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { UserInfo } from './../../../import/collections/insert.js';

    
   Template.groupcreate.onRendered(function(){

Session.set("imagePath_gp_create_group","");

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
   
    Template.groupcreate.events({
    	'click #save_group': function(event){
    		event.preventDefault(); 
    		var grp_title = $('#grp_title').val();	
    		var grp_type = $('#grp_type').val();	
    		var grp_discription = $('#grp_discription').val();	
			 // if (document.getElementById('grp_visibility_1').checked) {
			 //           var grp_visibility = 'Public';
			 //        }
			 //        else{
			 //           var grp_visibility = 'Private';
			 //        }  	
        if(grp_title == null || grp_title == "")
          {
            $('#grp_title').addClass('emptyfield').focus();
            return false;
          }
          else{
            $('#grp_title').removeClass('emptyfield');
          }

        if(grp_type == null || grp_type == "")
        {
          $('#group_type_drop_down').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#group_type_drop_down').removeClass('emptyfield');
        }

        if(grp_discription == null || grp_discription == "")
        {
          $('#grp_discription').addClass('emptyfield').focus();
          return false;
        }
        else{
          if(grp_discription.length < 50){
              alert("Group Discriptions Should be more then 50");
              $('#grp_discription').addClass('emptyfield').focus();
              return false;
          }
          else{
              $('#grp_discription').removeClass('emptyfield');
          }
        }

    		var image_Name = Session.get("imagePath_gp_create_group");
        if(image_Name){
          var grp_image = image_Name;      
        }    
        else{
        var grp_image = '/uploads/default/Default_group.png';
    }
        var user_id = Session.get("userId");
        grp_id = 'grp_'+ Math.floor((Math.random() * 2465789) + 1);
    		Meteor.call('insert_Group_details',user_id,grp_image,grp_title,grp_type,grp_discription,grp_id,function(error,result){
    			if(error){
    				console.log('Error');
    			}else{
    				console.log('sucessfull');
    			}
    		});
    // var sent_by = Session.get("userId");
    // var admin = sent_by;
    // req_id = 'grp_req_'+ Math.floor((Math.random() * 2465789) + 1);
    // status = 1;
    // Meteor.call('insert_group_request',req_id,sent_by,grp_id,status,admin,function(error,result){
    //       if(error){
    //         console.log('error');
    //       }
    //       else{
    //         console.log('Sucess');
    //       }
    //     });

        Session.clear("imagePath_gp_create_group");     
        Router.go('/grplisting');          
      }                                   
    });                                 

  Template.groupcreate.helpers({

  uploaded_image:function(){
  var user_id = Session.get("userId");
    var image_Name = Session.get("imagePath_gp_create_group");

  if(image_Name){    
  var display_image = image_Name;
    return display_image;
  }   
  else{    
           var display_image = '/uploads/default/Default_group.png';
           return display_image;
      }    
  },    

});

Template.groupcreate.events({
// 'click #camera_clicked': function(){
//       $('#fileInput').click();
// },

  'click #remove_cover': function(){   
  // alert("removed"); 
      Session.setPersistent("imagePath_gp_create_group","");   
  },  

 'change #fileInput': function(e, template) {
    upload_image(e, template);
    $("#loading_div").removeClass("loader_visiblity_block");
},
'click #crop_image':function(){
  crop_image();
},

'click .clicked_cancel': function(){
        // alert('sss');
    var result = confirm(" Are you sure you want to cancel this form ?");

    if(result == true){
        Session.clear("imagePath_gp_create_group");
        Router.go('/grplisting');    
      }
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
    // alert("case 2");
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


});



// function upload_image(e,template){

//     if (e.currentTarget.files && e.currentTarget.files[0]) {
//      var file = e.currentTarget.files[0];
//       if (file) {
   
//         var reader = new FileReader();
//    var base64data="";
//    reader.readAsDataURL(file);
//    reader.onload = function () {
//    console.log(reader.result);
//    base64data = reader.result;

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
// // alert(base64data);
// $.ajax(settings).done(function (response) {
//   console.log(response);
//     $("#loading_div").addClass("loader_visiblity_block");
//   var new_image_url = 'http://beta.bitovn.com/testing/' + response.substr(1, response.length);
//   // console.log(new_image_url);
//   Session.setPersistent("imagePath_gp_create_group",new_image_url);
// });
//    reader.onerror = function (error) {
//      console.log('Error: ', error);
//    };
//       }   
//   }
// }

// }



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
console.log(blob);
var file = new FormData(document.forms[0]);
file.append("canvasImage", blob);
// alert(dataURL);
base64data = dataURL;
console.log(base64data);
  Session.setPersistent("imagePath_gp_create_group",base64data);

  
//        var settings = {
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
// // alert(base64data);
// $.ajax(settings).done(function (response) {
//   console.log(response);
//   // alert(response);
//   var imagePath = 'http://beta.bitovn.com/testing/' + response.substr(1, response.length);
//   console.log(imagePath);
//   Session.setPersistent("imagePath_gp_create_group",imagePath);

//      var user_id = Session.get("userId");
//      // var user_id = Session.get("userId");
//      // alert(user_id +' & ' +imagePath);

//    // Meteor.call("upload_cover_image",user_id,imagePath,function(error,result){
//    //      if(error){
//    //        console.log("Error");
//    //      }else{
//    //          console.log("cover Pic Changed");
//    //           // toastr.success(Sucess, cover Pic Changed);
//            $('#divcrop_cover').removeClass('cropper-example-lena');
//         // }
//         template.currentUpload.set(false);
//    //  });

// });
//         var uploadInstance = Images.insert({
//                       file: file,
//                         streams: 'dynamic',
//                           chunkSize: 'dynamic'
//                     });
//         // alert(file);

//         uploadInstance.on('start', function() {
//           // template.currentUpload.set(this);
//         });
//         uploadInstance.on('end', function(error, fileObj) {
//           // alert('3');
//           if (error) {
//              alert("Error");
//             window.alert('Error during upload: ' + error.reason);
//           } else {
//             var new_cover_image_url = Session.get("imagePath_gp_create_group");
//              var imagePath = new_cover_image_url;

//              $("#crop_image").hide();
//              $("#divcrop").hide();
//              $('#divcrop').removeClass('cropper-example-lena');
//              $("#defaultbox").show();
//              $("#my_image").attr("src",imagePath);             
//             $("#my_image_cover").attr("src","");  
//             $("#my_image_cover").attr("srcset","");  
//              $("#my_image2").attr("src","");
   
//           }
//         });
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