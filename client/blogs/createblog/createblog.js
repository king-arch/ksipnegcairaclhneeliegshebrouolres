import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { Blog } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
// import flatpickr from "flatpickr";

  // Template.blogcreate.onRendered(function(){
  // var element = document.getElementById("#Blog_publish_date");
  // flatpickr(element, {});
   // });

Template.blogcreate.onDestroyed(function(){

  Session.set("imagePath_blog","");
  Session.clear("imagePath_blog");
});

    Template.blogcreate.onRendered(function(){
 
 $('#hereiam').click();
      Session.set("imagePath_blog","");
  Session.clear("imagePath_blog");
setTimeout(function(){
try {

 var trumbowyg = $('#blog_description').trumbowyg(
 {
  btnsDef: {
        // Create a new dropdown
       
    },
    // Redefine the button pane
    btns: [
        ['strong', 'em', 'del'],
        ['superscript', 'subscript'],
        //['link'],
        // ['insertImage'],
         ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        [ 'orderedList'],
        ['horizontalRule'],
        ['removeformat'],
        // ['fullscreen']
    ],
  });
   var modal = $('.modal').modal();
} catch (e) {
  if (e instanceof TypeError) {
    
       var url = window.location.href;
       var new_url = url.split("/");
       url = new_url[new_url.length-1];
     if(url == 'create_blog'){

    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}

  }
} 
},1000);



  setInterval(function(){
    var Blog_publish_date = $('#Blog_publish_date').val();
        if(Blog_publish_date!=undefined && Blog_publish_date!=null && Blog_publish_date!=""){
        if(!Blog_publish_date.includes(",")){
        Session.set("changed_format_date",Blog_publish_date);
        var changed_format_date = moment(Blog_publish_date).format('MMM DD, YYYY'); 
        $('#Blog_publish_date').val(changed_format_date +"");
    }
  }
   }, 300);

   });


   Template.blogcreate.onRendered(function(){

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


function visible(elm) {
  if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
  if(getComputedStyle(elm).visibility === 'hidden') { return false; }
  return true;
}

      


  Template.blogcreate.events({
    'click .clicked_cancel': function(){

    var result = confirm(" Sure you want to leave this page ?");

      if(result == true){
          Router.go('/blog_listing');    
        }
      },

      // 'click #cover_image': function(e, template) {
      //     $('#coverimage').click();
      // },

      // 'change #coverimage': function(e, template) {
      //   $("#loading_div").removeClass("loader_visiblity_block");
      //     upload_image(e, template);
      // },

        'click #remove_cover': function(){   
            // toastr.error("removed"); 
            var confirmation = confirm("Are you sure you want to remove selected cover ?");
            if(confirmation == true){

                Session.setPersistent("imagePath_blog","");   
            }
            },  


'click #cover_image':function(){
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
    setTimeout(function(){
      if(!($("#crop_cover_image").is(":visible"))){
         upload_cover_pic(e, template);
    $('#cover_pic_modal').click();
      }
    },500);
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



    	'change #Change_blog_image': function(e, template){
        // alert('hello');
        upload_blog_cover_image(e, template);
        // alert('hello');
         $('#blog_pic_modal').click();
       },
       
    //    'click #Default_blog_image': function(e){
    //     // alert('hi');
    //     // Session.clear("new_blog_image_url");
    // var  src ="https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png";
    // Session.set("new_blog_image_url",src);
    //    },
       'change #blog_pic_modal': function() {
            $('#divcrop_profile').addClass('cropper-example-lena');
             $('.cropper-example-lena > img').cropper({
             aspectRatio: 16 / 9,
            autoCropArea: 0.65,
            strict: false,
            guides: false,
            highlight: false,
            dragCrop: false,
            zoomOnTouch:false,
            zoomOnWheel:false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            
            });
},  

  'click #crop_image':function(){
    crop_image();
},

'click #crop_blog_image_selection':function(){
  // alert('1');
  toastr.warning("Please wait, Processing image");
  crop_image();

}, 

'click #save_blog': function(){
      // alert('here');
      var blog_title = $('#blog_title').val();
      var blog_description = $('#blog_description').val();
      // var blog_visibility = $('#blog_visibility').dropdown('get value');
       var Blog_publish_date = Session.get("changed_format_date");
      // var Blog_publish_date = $('#Blog_publish_date').val();


       if(blog_title == null || blog_title == "")
        {
          toastr.warning("Blog Title is empty");
          $('#blog_title').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#blog_title').removeClass('emptyfield');
        }

         if(blog_description == null || blog_description == "")
        {
          toastr.warning("Blog description is empty");
          $('#blog_description').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#blog_description').removeClass('emptyfield');
        }

         /*if(blog_visibility == null || blog_visibility == "")
        {
          $('#blog_visibility').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#blog_visibility').removeClass('emptyfield');
        }*/

         if(Blog_publish_date == null || Blog_publish_date == "")
        {
          toastr.warning("Blog Publish date is empty");
          $('#Blog_publish_date').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#Blog_publish_date').removeClass('emptyfield');
        }
         blog_id = 'blog_'+ Math.floor((Math.random() * 2465789) + 1);

        var is_draft = 0;
        var is_active =0;

     var image_Name_2 = Session.get("imagePath_blog");
     if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
       var blog_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
        }
        else{
          var blog_image = image_Name_2;
          }

        // alert(blog_image);

        console.log('blog_title: '+blog_title+'blog_description: ' +blog_description+
          +' Blog_publish_date: ' +Blog_publish_date+
          'blog_image: ' +blog_image+'blog_id: '+blog_id);
        // return false;

        insert_blog(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,Session.get("userId"),is_draft,is_active);        
        Session.clear("imagePath_blog");


},

'click #save_blog_draft_btn':function(){

    var blog_title = $('#blog_title').val();
      var blog_description = $('#blog_description').val();
      // var blog_visibility = $('#blog_visibility').dropdown('get value');
      // var Blog_publish_date = $('#Blog_publish_date').val();

      var Blog_publish_date = Session.get("changed_format_date"); //2
      
       if(blog_title == null || blog_title == "")
        {
            toastr.warning("Blog Title is empty");
          $('#blog_title').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#blog_title').removeClass('emptyfield');
        }

         if(blog_description == null || blog_description == "")
        {
        toastr.warning("Blog description is empty"); 
          $('#blog_description').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#blog_description').removeClass('emptyfield');
        }

        /* if(blog_visibility == null || blog_visibility == "")
        {
          $('#blog_visibility').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#blog_visibility').removeClass('emptyfield');
        }*/

         if(Blog_publish_date == null || Blog_publish_date == "")
        {
           toastr.warning("Blog Publish date is empty");
          $('#Blog_publish_date').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#Blog_publish_date').removeClass('emptyfield');
        }
        
         blog_id = 'blog_'+ Math.floor((Math.random() * 2465789) + 1);

     var image_Name_2 = Session.get("imagePath_blog");
     if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
       var blog_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
        }
        else{
          var blog_image = image_Name_2;
          }

        // alert(blog_image);

        console.log('blog_title: '+blog_title+'blog_description: ' +blog_description+
          +' Blog_publish_date: ' +Blog_publish_date+
          'blog_image: ' +blog_image+'blog_id: '+blog_id);
        // return false;



       /* console.log('blog_title: '+blog_title+'blog_description: ' +blog_description+
          'blog_visibility: ' +blog_visibility+'Blog_publish_date: ' +Blog_publish_date+
          'blog_image: ' +blog_image+'blog_id: '+blog_id);*/
        var is_draft = 1;
        var is_active =0;
        insert_blog(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,Session.get("userId"),is_draft,is_active);            var is_draft = 0;
         Session.clear("imagePath_blog");
}
// 'click #check_alert':function(){
//    sAlert.success('blog sucessfully created',"123");
// },

    });


function insert_blog(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,userId,is_draft,is_active){
  var Blog_publish_date = Blog_publish_date.replace(" ","-").replace(" ","-");
  
  Meteor.call('insert_blog',blog_id,blog_title,blog_description,Blog_publish_date,blog_image,Session.get("userId"),is_draft,is_active,function(error,result){
        
          if(error){
              console.log('error in blog creation');
              toastr.error("Error");
          }else{
              Session.set("new_blog_image_url",'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png');
              console.log('blog sucessfully created');

              if(is_draft == 0){
              // toastr.success('blog sucessfully created',"Success");
              }else{
              toastr.success('Saved in Draft Sucessfully',"Success"); 
              }  
              
              blog_id= Base64.encode(blog_id);
              var url = '/blog_preview/'+blog_id;
              if(is_draft==0){ 
              Router.go(url); 
              }else{
              Router.go('/blog_listing'); 
              }

          }

        });
}        

Template.blogcreate.helpers({

  blog_cover_pic_image:function(){
     var image_Name = Session.get("new_blog_image_url");
      if(image_Name){
      return image_Name;
    }else{
      return  "https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png";
    }
  },

  //helper
  uploaded_image:function(){
  var user_id = Session.get("userId");
    var image_Name = Session.get("imagePath_blog");

  if(image_Name){    
  var display_image = image_Name;
   $("#remove_cover").removeClass("hide_redmore");
  }   
  else{    
           var display_image = '/uploads/default/Default_group.png';
           $("#remove_cover").addClass("hide_redmore");
      }
   
           return display_image;
  },    

});


// function upload_image(e,template){

//         if (e.currentTarget.files && e.currentTarget.files[0]) {
//          var file = e.currentTarget.files[0];
//           if (file) {
       
//             var reader = new FileReader();
//        var base64data="";
//        reader.readAsDataURL(file);
//        reader.onload = function () {
//        console.log(reader.result);
//        base64data = reader.result;

//             var settings = {
//       "async": true,
//       "crossDomain": true,
//       "url": "http://beta.bitovn.com/testing/image_upload.php",
//       "method": "POST",
//       "headers": {
//         "content-type": "application/x-www-form-urlencoded"
//       },
//       "data": {
//         "image": base64data,
//       }
//     }
//     // alert(base64data);
//     $.ajax(settings).done(function (response) {
//       console.log(response);
//         $("#loading_div").addClass("loader_visiblity_block");
//       var new_image_url = 'http://beta.bitovn.com/testing/' + response.substr(1, response.length);
//       // console.log(new_image_url);
//       Session.setPersistent("imagePath_blog",new_image_url);
//     });
//        reader.onerror = function (error) {
//          console.log('Error: ', error);
//        };
//           }   
//       }
//     }
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
// var file = new FormData(document.forms[0]);
// file.append("canvasImage", blob);
// // alert(dataURL);
// base64data = dataURL;
// console.log(base64data);
//   Session.setPersistent("imagePath_blog",base64data);


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
      Session.setPersistent("imagePath_blog",image_url);
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