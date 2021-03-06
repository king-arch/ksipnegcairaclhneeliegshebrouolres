import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { Emembers } from './../../../import/collections/insert.js';
import { Event } from './../../../import/collections/insert.js';
import { Session } from 'meteor/session';

//document.title = "Special Neighbourhood | Create Event";
Meteor.startup(function() {  
      GoogleMaps.load();
    });


   Template.eventcreate.onRendered(function(){
 setInterval(function(){
   var start_date = $('#start_date').val();
       if(start_date!=undefined && start_date!=null && start_date!=""){
       if(!start_date.includes(",")){
       Session.set("changed_format_date_start_date",start_date);
       var changed_format_date_start_date = moment(start_date).format('MMM DD, YYYY'); 
       $('#start_date').val(changed_format_date_start_date +"");
   }
 }

   var end_date = $('#end_date').val();
       if(end_date!=undefined && end_date!=null && end_date!=""){
       if(!end_date.includes(",")){
       Session.set("changed_format_date_end_date",end_date);
       var changed_format_date_end_date = moment(end_date).format('MMM DD, YYYY'); 
       $('#end_date').val(changed_format_date_end_date +"");
   }
 }
 

  }, 300);

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
// Template.eventcreate.onRendered(function(){
// //GoogleMaps.load();
// 	alert(GoogleMaps);
//  if (GoogleMaps.loaded()) {
//  	alert("aa gaya");
//       $("#location").geocomplete({ details: "form" });

//     }

// });
Template.eventcreate.helpers({

	frientlist:function()
	{
		var userid=Session.get('userId');
		 var friends=FriendRequest.find({ 
				        $and: [ { $or: 
				          [ { 
				            sent_to: userid 
				          }, { 
				            sent_by: userid 
				             } 
				          ] }, 
				          { $and: 
				            [ { req_status: 1 }] 
				             } ] }).fetch();
		 return friends;
	},

  uploaded_image:function(){
  var user_id = Session.get("userId");
    var image_Name = Session.get("imagePath_gp_create_event");
  if(image_Name){    
    // alert(image_Name);
  var display_image = image_Name;
    return display_image;
  }   
  else{    
           var display_image = '/uploads/default/Default_group.png';
           return display_image;
      }    
  },  

	userinfo:function()
	{ 
		var userid=Session.get('userId');
		var sent_to=this.sent_to;
		var sent_by=this.sent_by;
		
		//alert(sent_to);
		if(userid!=sent_to)
		{
			var sent_too=this.sent_to;
		}
		if(userid!=sent_by)
		{
			var sent_too=this.sent_by;
		}
		//alert(sent_too);
		return UserInfo.find({user_id:sent_too}).fetch();
	},
});

Template.eventcreate.events({
	'click #agreeto':function(){
		//alert('here');
		//var p=JSON.stringify(this);
		//alert(name.count);
		var name=$(".inviteuser:checked");
		var c=name.length || 0
		//alert(c);
		// $("#emembers").val(name);
		 var array = _.map(name, function(item) {
		     return item.defaultValue;
		   });
		 $("#emembers").val(array);
		$("#invitemem").text("+ Select invitees ("+c+")");
		//alert(name);
		
	},
	'click #invite_all':function()
	{
		$("#invitemem").text("+ Select invitees");
		$("#invitemem").hide();
	},

	'click #invite_friends':function()
	{
		//$("#invitemem").text("+ Select invitees");
		$("#invitemem").show();
	},

	'click #save_event':function()
	{
		var ename=$("#event_name").val();
		if(ename=='')
		{
			$("#event_name").addClass('emptyfield');
			$("#event_name").focus();
			return false;
		}else
		{
			$("#event_name").removeClass('emptyfield');
		}
		var location=$("#location").val();
		if(location=='')
		{
			$("#location").addClass('emptyfield');
			$("#location").focus();
			return false;
		}else
		{
			$("#location").removeClass('emptyfield');
		}
		var eventtype=$("#eventtype").val();
		if(eventtype=='')
		{
			$("#eventtype").addClass('emptyfield');
			$("#eventtype").focus();
			return false;
		}else
		{
			$("#eventtype").removeClass('emptyfield');
		}
		var start_date = Session.get("changed_format_date_start_date");
		if(start_date=='')
		{
			$("#start_date").addClass('emptyfield');
			$("#start_date").focus();
			return false;
		}else
		{
			$("#start_date").removeClass('emptyfield');
		}
		var end_date = Session.get("changed_format_date_end_date");
		if(end_date=='')
		{
			$("#end_date").addClass('emptyfield');
			$("#end_date").focus();
			return false;
		}else if(moment(end_date).format('YYYY MM DD')<moment(start_date).format('YYYY MM DD'))
		{
			$("#end_date").addClass('emptyfield');
			$("#end_date").focus();
			return false;
		}else
		{
			$("#end_date").removeClass('emptyfield');
		} 
		var description=$("#description").val();	
		if(description=='')
		{
			$("#description").addClass('emptyfield');
			$("#description").focus();
			return false;
		}else
		{
			$("#description").removeClass('emptyfield');
		}
		
		var userid=Session.get('userId');
		var cover_image=$("#cover_image").val();
		var lat=$("#lat").val();
		var long=$("#long").val();
		
	var image_Name_2 = Session.get("imagePath_gp_create_event");
    if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
      var cover_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
    }
    else{
      var cover_image = image_Name_2;
    }


		var event_invite =$("input[name='event_invite']:checked").val();
		if(event_invite == 'invite_all'){
					var sent_to = Session.get("userId");
	    var freinds = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).fetch();
	 	
	 	console.log('friends');
	 	console.log(freinds);

	 	var invite_list = 0
	 	if(freinds.length){
	 	for(var i=0;i<freinds.length;i++){
	 		var logged_in = Session.get("userId");
	 		// alert(freinds[i].sent_to +' & '+ freinds[i].sent_by +' invite_list: '+ invite_list);
	 		if(logged_in == freinds[i].sent_to){

	 			var sent_by = freinds[i].sent_by;
	 			if(invite_list == 0 ){
	 				invite_list = sent_by;
	 			}else{
	 			invite_list = invite_list + ',' + sent_by;
	 			}
	 		}
	 		else{
	 			var sent_to = freinds[i].sent_to;
	 			if(invite_list == 0 ){
	 				invite_list = sent_to;
	 			}
	 			else{
	 				invite_list = invite_list + ',' + sent_to;
	 			}
	 		  
	 		}
	 	}
	 }
	 	// alert('Here: '+invite_list);
	 	var invite_type = 'Public';
		}else{
		var invite_list=$("#emembers").val();
		var invite_type = 'Private';
		// emembers=emembers.split(',');
		}
		
		var event_id = 'event_'+Math.floor((Math.random() * 2465789) + 1);
		// alert(emembers.length);

		if(invite_type == 'Public'){
			invite_list = "";
		}
		

		 Meteor.call('save_event',event_id,userid,ename,location,eventtype,start_date,end_date,cover_image,lat,long,description,invite_list,invite_type,function(error,result){
              if(error){
                console.log("Some error occured.");
              }else{
               	toastr.success("Event added successfully!");
                window.location.href="/events";            
              }
          });	

		 Session.clear("imagePath_gp_create_event");

	},



	// 'click #cover_image': function(e, template) {
 //  		$("#coverimage").click();
	// },

	// 'change #coverimage': function(e, template) {
 //  		upload_image(e, template);
	// },

	'click #remove_cover': function(){   
		  // alert("removed"); 
		  Session.setPersistent("imagePath_gp_create_event","");   
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


    'click .clicked_cancel': function(){
        // alert('sss');
    // var event_id = Session.get("show_event_id");
    // alert(event_id);
    // var logged_in_user = Session.get("userId");

    // event_id= Base64.encode(event_id); 
    var result = confirm(" Are you sure you want to cancel this form ?");
	    if(result == true){
	    	Session.clear("imagePath_gp_create_event");
		    var url = '/events'; 
		    Router.go(url);
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
    $("#loading_div").addClass("loader_visiblity_block");
  var new_image_url = 'http://beta.bitovn.com/testing/' + response.substr(1, response.length);
  // console.log(new_image_url);
  Session.setPersistent("imagePath_gp_create_event",new_image_url);
});
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
      }   
  }
}

}

Template.createevent.onRendered(function(){
    // var autocomplete = new google.maps.places.Autocomplete(
    // (document.getElementById('autocomplete10')),{types: ['geocode'] }
  //);
  //alert("started");
    Session.setPersistent("imagePath_gp_create_event","");

  	setTimeout(function(){

  	
    if (GoogleMaps.loaded()) {
      $("#location").geocomplete({ details: "form" });
      //alert("loaded");
    }
},5000);
  //alert("started");
});



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
  Session.setPersistent("imagePath_gp_create_event",base64data);
  
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
//   Session.setPersistent("imagePath_gp_create_event",imagePath);

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
//             var new_cover_image_url = Session.get("imagePath_gp_create_event");
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