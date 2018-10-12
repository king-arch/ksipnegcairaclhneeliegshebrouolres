
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { Blog } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

Template.blog_edit.onRendered(function(){
//         var edit_blog_title        = this.blog_title;
//         var edit_blog_description  = this.blog_description;
//         var edit_Blog_publish_date = this.Blog_publish_date;
//         var edit_blog_visibility   = this.blog_visibility;
//         var edit_blog_image        = this.blog_image;

//       $('#edit_blog_title').val(edit_blog_title);
//       $('#edit_blog_description').val(edit_blog_description);
//       $('#edit_Blog_publish_date').val(edit_Blog_publish_date);

         var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var user_id_by_url = Base64.decode(url); 
        Session.set("detailed_blog_id",user_id_by_url);
        Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
        Meteor.subscribe("fetch_blogs_content",Session.get("detailed_blog_id"));
   
     setInterval(function(){
    var Blog_publish_date = $('#edit_Blog_publish_date').val();
    if(Blog_publish_date!=undefined && Blog_publish_date!=null && Blog_publish_date!=""){
    
      if(!Blog_publish_date.includes(",")){
      Session.set("changed_format_date",Blog_publish_date);
     var changed_format_date = moment(Blog_publish_date).format('MMM DD, YYYY'); 
     $('#edit_Blog_publish_date').val(changed_format_date +"");
    }
    } 

   }, 300);


    setTimeout(function(){
      var s2 = Session.get("edit_new_blog_image_url_temp");
      var s1 = Session.get('edit_blog_visibility');
        // Session.clear("edit_new_blog_image_url");
        // Session.set("edit_new_blog_image_url",s2);
         $("#edit_blog_visibility").dropdown("set selected", s1); 



    },1000);
      
//       Session.set("edit_new_blog_image_url",edit_blog_image);

      //          Session.setPersistent("imagePath_edit_blog","");
      // var user_id = Session.get("userId");

      // var edit_blog_id = Session.get("show_blog_edit_id"); 
      // // alert(edit_blog_id);
      // var result = Blog.find({blog_id: edit_blog_id}).fetch();   
      // console.log('result');
      // console.log(result);
      // if(result[0]){
      //   Session.setPersistent("imagePath_edit_blog",result[0].blog_image);
      // console.log( Session.get("imagePath_edit_blog") );
      // }


});



   Template.blog_edit.onRendered(function(){


  try {

  var modal = $('.modal').modal();
var trumbowyg = $('#edit_blog_description').trumbowyg(
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
}catch(e){
    if (e instanceof TypeError) {
      
         var url = window.location.href;
         var new_url = url.split("/");
         url = new_url[new_url.length-2];
       if(url == 'edit_blog'){

      if(!window.location.hash) {
          window.location = window.location + '#loaded';
          window.location.reload();
       }
    }
  }
}



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

  Template.blog_edit.events({
    'click .clicked_cancel': function(){

     var result = confirm("Sure you want to leave this page ?");
    if(result == true){
        Router.go('/blog_listing'); 
        }   
      },

     'click #cover_image': function(e, template) {
          $('#coverimage').click();
      },

     'change #coverimage': function(e, template) {
      upload_image(e, template);
       $("#loading_div").removeClass("loader_visiblity_block");
  },


        'click #remove_cover': function(){   
            var confirmation = confirm("Are you sure you want to remove selected cover ?");
            if(confirmation == true){ 
                Session.setPersistent("imagePath_edit_blog","");   
              }
            },  


//     	'change #Change_blog_image': function(e, template){
//        // alert("change");
//           upload_blog_cover_image(e, template);
//          $('#blog_pic_modal').click();
//        },
       
//        'click #Default_blog_image': function(e){
//         var  src ="https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png";
//          Session.set("edit_new_blog_image_url",src);
//        },

//        'change #blog_pic_modal': function() {
//             $('#divcrop_profile').addClass('cropper-example-lena');
//              $('.cropper-example-lena > img').cropper({
//              aspectRatio: 8 / 8,
//             autoCropArea: 0.65,
//             strict: true,
//             guides: true,
//             highlight: true,
//             dragCrop: true,
//             cropBoxMovable: true,
//             cropBoxResizable: false
//             });
// },  

//   'click #crop_image':function(){
//     crop_image();
// },


 // start croping js

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



'click #crop_blog_image_selection':function(){
   toastr.warning("Please wait, Processing image");
   crop_image();
}, 
'click #save_edit_blog': function(){
      // alert('here');
      // toastr.warning("Please wait");
      var blog_title = $('#edit_blog_title').val();
      var blog_description = $('#edit_blog_description').val();
      // var blog_visibility = $('#edit_blog_visibility').dropdown('get value');
      // var Blog_publish_date = $('#edit_Blog_publish_date').val();
       var Blog_publish_date = Session.get("changed_format_date"); 
      // var blog_image = Session.get("edit_new_blog_image_url");


       if(blog_title == null || blog_title == "")
        {
          toastr.warning("Blog title is empty");
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

        //  if(blog_visibility == null || blog_visibility == "")
        // {
        //   toastr.warning("Blog visibility is empty");
        //   $('#blog_visibility').addClass('emptyfield').focus();
        //   return false;
        // }
        // else{
        //   $('#blog_visibility').removeClass('emptyfield');
        // }

         if(Blog_publish_date == null || Blog_publish_date == "")
        {
           toastr.warning("Blog published date is empty");
          $('#Blog_publish_date').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#Blog_publish_date').removeClass('emptyfield');
        }
         blog_id = Session.get("show_blog_edit_id");


  /*      console.log('blog_title: '+blog_title+'blog_description: ' +blog_description+
          'blog_visibility: ' +blog_visibility+'Blog_publish_date: ' +Blog_publish_date+
          'blog_image: ' +blog_image+'blog_id: '+blog_id);*/
        var image_Name_2 = Session.get("imagePath_edit_blog");
           if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
             var blog_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
              }
              else{
                var blog_image = image_Name_2;
                }

        // alert(blog_image);

        var is_draft = 0;
        var is_active = 1;
        update_blog(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,is_draft,is_active);
       Session.clear("imagePath_edit_blog"); 
},
  
'click #save_blog_draft_btn':function(){
  var blog_title = $('#edit_blog_title').val();
      var blog_description = $('#edit_blog_description').val();
      // var blog_visibility = $('#edit_blog_visibility').dropdown('get value');
      // var Blog_publish_date = $('#edit_Blog_publish_date').val();/
       var Blog_publish_date = Session.get("changed_format_date"); 
      var blog_image = Session.get("edit_new_blog_image_url");
      if(blog_image){
           console.log(blog_image);
      }else{
       var blog_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
      }

       if(blog_title == null || blog_title == "")
        {
             toastr.warning("Blog title is empty");
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
             toastr.warning("Blog published date is empty");
          $('#Blog_publish_date').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#Blog_publish_date').removeClass('emptyfield');
        }
         blog_id = Session.get("show_blog_edit_id");

/*
        console.log('blog_title: '+blog_title+'blog_description: ' +blog_description+
          'blog_visibility: ' +blog_visibility+'Blog_publish_date: ' +Blog_publish_date+
          'blog_image: ' +blog_image+'blog_id: '+blog_id);*/
        var image_Name_2 = Session.get("imagePath_edit_blog");
     if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
       var blog_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
        }
        else{
          var blog_image = image_Name_2;
          }

        // alert(blog_image);

        var is_draft = 1;
        var is_active = 0;
        update_blog(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,is_draft);   
Session.clear("imagePath_edit_blog");
}});

function update_blog(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,is_draft,is_active){
  Blog_publish_date = Blog_publish_date.replace(" ","-").replace(" ","-");
  Meteor.call('update_blog',blog_id,blog_title,blog_description,Blog_publish_date,blog_image,is_draft,is_active,function(error,result){       
          if(error){
              // alert('error');
              console.log('error in blog creation');
          }else{
            toastr.success("sucessfully updated","Success");
              // alert('result');
              // Session.clear("edit_new_blog_image_url");
              // Session.set("edit_new_blog_image_url",'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png');
              console.log('blog sucessfully created');
              Router.go('/blog_listing');
              
          }

        });
}

Template.blog_edit.helpers({

  edit_blog_array: function(){
            // e.preventDefault();
            var edit_blog_id = Session.get("show_blog_edit_id"); 
            // console.log(edit_blog_id);
            var result = Blog.find({blog_id: edit_blog_id}).fetch();            
            // console.log(result);

            var edit_blog_image        = result[0].blog_image;
                    Session.setPersistent("imagePath_edit_blog",edit_blog_image);

                if(edit_blog_image == '/uploads/default/Default_group.png'){
                  $("#remove_cover").addClass("hide_redmore");
                }
                else{
                  $("#remove_cover").removeClass("hide_redmore");
                }
    
            console.log(edit_blog_image);
            Session.set("changed_format_date",result[0].Blog_publish_date); 
            Session.set("edit_new_blog_image_url",edit_blog_image);
            Session.set("edit_blog_visibility",result[0].blog_visibility);
            return result;
            // $("#special_note").text(special_note);
            },

// edit_blog_title(){
// var edit_blog_title        = this.blog_title;
// $('#edit_blog_title').val(edit_blog_title);
// },

//   load_blog_data(){
//         // var edit_blog_title        = this.blog_title;
//         var edit_blog_description  = this.blog_description;
//         var edit_Blog_publish_date = this.Blog_publish_date;
//         var edit_blog_visibility   = this.blog_visibility;
//         var edit_blog_image        = this.blog_image;

//         alert(blog_description+' '+Blog_publish_date+' '+blog_visibility+' '+blog_image);
//       // $('#edit_blog_title').val(edit_blog_title);
//       $('#edit_blog_description').val(edit_blog_description);
//       $('#edit_Blog_publish_date').val(edit_Blog_publish_date);
//       $("#edit_blog_visibility").dropdown("set selected", edit_blog_visibility);
//       Session.set("edit_new_blog_image_url",edit_blog_image);
//       // return false;
//   },

  blog_cover_pic_image:function(){

   var image_Name = Session.get("edit_new_blog_image_url");
   // alert(image_Name);
    return image_Name;
  
  },

    uploaded_image:function(){
  var user_id = Session.get("userId");
    var image_Name = Session.get("imagePath_edit_blog");

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
  changed_format_date(Blog_publish_date){
     var str = Blog_publish_date;
          var date = str.split("-")[2];
          var month = str.split("-")[1];
          var year = str.split("-")[0];
          var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
          return months[month-1]+ " " +date +", " +year;

  }

});


Meteor.startup(function () {

    sAlert.config({
        effect: '',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });
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
//       toastr.success("Image uploaded sucessfully");
//         $("#loading_div").addClass("loader_visiblity_block");
//       var new_image_url = 'http://beta.bitovn.com/testing/' + response.substr(1, response.length);
//       // console.log(new_image_url);
//       Session.setPersistent("imagePath_edit_blog",new_image_url);
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
var file = new FormData(document.forms[0]);
file.append("canvasImage", blob);
// alert(dataURL);
base64data = dataURL;
console.log(base64data);
  Session.setPersistent("imagePath_edit_blog",base64data);
  
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
//   Session.setPersistent("imagePath_edit_blog",imagePath);

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
//             var new_cover_image_url = Session.get("imagePath_edit_blog");
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