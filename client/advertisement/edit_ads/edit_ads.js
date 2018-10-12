
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { advertisement } from './../../../import/collections/insert.js';
import { Emembers } from './../../../import/collections/insert.js';
import { Event } from './../../../import/collections/insert.js';
import { Session } from 'meteor/session';

//document.title = "Special Neighbourhood | Create Event";
Meteor.startup(function() {  
      GoogleMaps.load();
    });

   Template.ads_edit.onRendered(function(){

   	   var url = window.location.href;

        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var user_id_by_url = Base64.decode(url); 

        Session.set("promotion_id",user_id_by_url);

        var result = advertisement.find({ promotion_id: Session.get("promotion_id") }).fetch();

	 var promotion_type = result[0].promotion_type;
	 var promotion_start_date = result[0].promotion_start_date;
	 var promotion_end_date = result[0].promotion_end_date;
	 var promotion_url = result[0].promotion_url;
	 var promotion_title = result[0].promotion_title;
	 var promotion_content = result[0].promotion_content;
	 //alert(s1);
	
	 // $("#promotion_content").val(promotion_content);
	 $("#promotion_start_date").val(promotion_start_date);
	 $("#promotion_end_date").val(promotion_end_date);
	 $("#promotion_url").val(promotion_url);
	 $("#promotion_title").val(promotion_title);

    setTimeout(function(){
    $("#hidden_promotion_type").val();
	$("#promotion_type").dropdown("set selected", promotion_type);
	 $('#promotion_type').addClass("disabled");

			if(promotion_type == 'Textual'){
			$('#hide_discription_box').removeClass('show_or_hide');
			$('#hide_picture_box').addClass('show_or_hide');
			var promotion_discription=$("#promotion_discription").val();
			
			$("#promotion_discription").val(promotion_content);


			if(promotion_discription=='')
				{
					$("#promotion_discription").addClass('emptyfield3');
					$("#promotion_discription").focus();
					return false;
				}else
				{
					$("#promotion_discription").removeClass('emptyfield3');
				}


		}
   		else if(promotion_type == 'Picture'){
   			$('#hide_picture_box').removeClass('show_or_hide');
   			$('#hide_discription_box').addClass('show_or_hide');
   			$("#my_image").attr("src",promotion_content);
   			$("#cover_image").val(promotion_content);
   			var cover_image = $("#cover_image").val();

   			if(cover_image=='')
				{	
					alert('Cover image cannot be empty for cover_image');
					$("#cover_image").addClass('emptyfield3');
					$("#cover_image").focus();
					return false;
				}else
				{
					$("#cover_image").removeClass('emptyfield3');
				}

		}

    },1000); 



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
  });
// Template.ads_create.onRendered(function(){
// //GoogleMaps.load();
// 	alert(GoogleMaps);
//  if (GoogleMaps.loaded()) {
//  	alert("aa gaya");
//       $("#location").geocomplete({ details: "form" });

//     }

// });
Template.ads_edit.helpers({

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
    var image_Name = Session.get("imagePath_admin_ads");
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

Template.ads_edit.events({
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



	'click #promotion_type':function(){
		// alert('hide');
		var promotion_type=$("#hidden_promotion_type").val();

		if(promotion_type=='')
		{
			$("#promotion_type").addClass('emptyfield_focus');
			$("#promotion_type").focus();
			return false;
		}else
		{
			$("#promotion_type").removeClass('emptyfield_focus');
		}

		if(promotion_type == 'Textual'){
			$('#hide_discription_box').removeClass('show_or_hide');
			$('#hide_picture_box').addClass('show_or_hide');
			var promotion_discription=$("#promotion_discription").val();

			if(promotion_discription=='')
				{
					$("#promotion_discription").addClass('emptyfield3');
					$("#promotion_discription").focus();
					return false;
				}else
				{
					$("#promotion_discription").removeClass('emptyfield3');
				}


		}
   		else if(promotion_type == 'Picture'){
   			$('#hide_picture_box').removeClass('show_or_hide');
   			$('#hide_discription_box').addClass('show_or_hide');

   			var cover_image = $("#cover_image").val();

   			if(cover_image=='')
				{	
					alert('Cover image cannot be empty for cover_image');
					$("#cover_image").addClass('emptyfield3');
					$("#cover_image").focus();
					return false;
				}else
				{
					$("#cover_image").removeClass('emptyfield3');
				}

		}

	},

	'click #save_promotion':function()
	{
		// alert('here: - ');
		var promotion_type = $("#hidden_promotion_type").val();
		var promotion_start_date = $("#promotion_start_date").val();
		var promotion_end_date = $("#promotion_end_date").val();

		if(promotion_start_date == '')
		{
			$("#promotion_start_date").addClass('emptyfield_focus');
			$("#promotion_start_date").focus();
			return false;
		}else
		{
			$("#promotion_start_date").removeClass('emptyfield_focus');
		}

		if(promotion_end_date == '')
		{
			$("#promotion_end_date").addClass('emptyfield_focus');
			$("#promotion_end_date").focus();
			return false;
		}else
		{
			$("#promotion_end_date").removeClass('emptyfield_focus');
		}

		if(promotion_type == '')
		{
			$("#promotion_type").addClass('emptyfield_focus');
			$("#promotion_type").focus();
			return false;
		}else
		{
			$("#promotion_type").removeClass('emptyfield_focus');
		}

		if(promotion_type == 'Textual'){
			$('#hide_discription_box').removeClass('show_or_hide');
			$('#hide_picture_box').addClass('show_or_hide');
			var promotion_content=$("#promotion_discription").val();

			if(promotion_content=='')
				{
					$("#promotion_discription").addClass('emptyfield3');
					$("#promotion_discription").focus();
					return false;
				}else
				{
					$("#promotion_discription").removeClass('emptyfield3');
				}
		}
   		else if(promotion_type == 'Picture'){
   			$('#hide_picture_box').removeClass('show_or_hide');
   			$('#hide_discription_box').addClass('show_or_hide');

   			var promotion_content = $("#cover_image").val();

   			if(promotion_content == '')
				{	
					alert('Cover image cannot be empty for cover_image');
					$("#cover_image").addClass('emptyfield3');
					$("#cover_image").focus();
					return false;
				}
				else
				{
					$("#cover_image").removeClass('emptyfield3');
				}
		}

		var promotion_title = $("#promotion_title").val();

		if(promotion_title == '')
		{
			$("#promotion_title").addClass('emptyfield3');
			$("#promotion_title").focus();
			return false;
		}else
		{
			$("#promotion_title").removeClass('emptyfield3');
		}

		var promotion_url = $("#promotion_url").val();
		if(promotion_url == '')
		{
			$("#promotion_url").addClass('emptyfield3');
			$("#promotion_url").focus();
			return false;
		}else
		{
			$("#promotion_url").removeClass('emptyfield3');
		}
		
	// alert(' promotion_url: '+promotion_url+' promotion_title: '+promotion_title+' promotion_type: '+promotion_type+' promotion_content: '+promotion_content+
	// 	  ' promotion_start_date: '+ promotion_start_date+ ' promotion_end_date: '+promotion_end_date);
	// return false;
	// var image_Name_2 = Session.get("imagePath_admin_ads");
 //    if(image_Name_2 == "" || image_Name_2 == null || image_Name_2 == 'undefined') {
 //      var cover_image = 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/Dad-Blogs-Featured-Image.png';
 //    }
 //    else{
 //      var cover_image = image_Name_2;
 //    }

 	var promotion_id = Session.get("promotion_id");
 	
    Meteor.call('update_promotion',promotion_id,promotion_title,promotion_type,promotion_url,
    	promotion_content,promotion_start_date,promotion_end_date,function(error,result){
              if(error){
                console.log("Some error occured.");
              }else{ 
               	toastr.success("promotions sucessfully updated to ads list!");
                window.location.href="/ads";            
              }
          });	

		 Session.clear("imagePath_admin_ads");

	},

	'click #cover_image': function(e, template) {
  		$("#coverimage").click();
	},

	'change #coverimage': function(e, template) {
  		upload_image(e, template);
	},

	'click #remove_cover': function(){   
		  // alert("removed"); 
		  Session.setPersistent("imagePath_admin_ads","");   
		},  

	// 'click #remove_cover':function(){
	// 	var oldimg=Session.get("oldcover");
	// 	 // $("#my_image").attr("src",oldimg); 
 //            // $("#cover_image").val(oldimg);
 //            // $('#removecoverpic').hide();
	// },



    'click .clicked_cancel': function(){
        // alert('sss');
    // var event_id = Session.get("show_event_id");
    // alert(event_id);
    // var logged_in_user = Session.get("userId");

    // event_id= Base64.encode(event_id); 
    var result = confirm(" Are you sure you want to cancel this form ?");

	    if(result == true){
		    var url = '/ads'; 
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
  Session.setPersistent("imagePath_admin_ads",base64data);
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
//   Session.setPersistent("imagePath_admin_ads",new_image_url);
// });
//    reader.onerror = function (error) {
//      console.log('Error: ', error);
//    };
      }   
  }
}

}

Template.createevent.onRendered(function(){
    // var autocomplete = new google.maps.places.Autocomplete(
    // (document.getElementById('autocomplete10')),{types: ['geocode'] }
  //);
  //alert("started");
  	setTimeout(function(){

  	
    if (GoogleMaps.loaded()) {
      $("#location").geocomplete({ details: "form" });
      //alert("loaded");
    }
},5000);
  //alert("started");
});
