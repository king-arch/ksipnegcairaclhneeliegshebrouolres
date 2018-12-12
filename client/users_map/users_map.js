import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Images } from './../../import/config.js';
import { UserInfo }  from './../../import/collections/insert.js';
import GoogleMapsLoader from 'google-maps';


import { Base64 } from 'meteor/ostrio:base64';
// //document.title = "Special Neighbourhood | User map";
Meteor.startup(function() {  
});


Template.map.events({
	 'click .redirect_to_profile':function(){
	 	var data = $(".redirect_to_profile").attr("ank");
	 	// alert(data);
    var user_id = Session.get("userId");
    user_id= Base64.encode(data);
    var url = '/view_profile/'+user_id;
    if(Session.get("userId") == this.user_id)
    {
      Router.go('/profile');    
    }
    else{
      Router.go(url);
    }
    }
});


// Template.map.onDestroyed(function(){
//         // Session.setPersistent("firstTimeUser",false);
// setInterval(function(){ 
//         Meteor.call("firstTimeUser",Session.get("userId"),function(error,result){

//         if(error){
//           alert("Error");
//         }else{
//         	alert('cools');
//          console.log("sucessfull update for first time user");
//         }
         
//     });

// });

// });
	var all_users;
   Template.map.onDestroyed(function(){
   	all_users.stop();
   });
   Template.map.onRendered(function(){
 all_users = Meteor.subscribe("all_users");
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

   
Template.map.onCreated(function() {  
	GoogleMapsLoader.KEY = 'AIzaSyBnQrXrRyWtQu7EKB9Hk1S10Gc6eQuamUo';
	 var user_id = Session.get("userId");
	 //alert(user_id);
	 setTimeout(function(){

     var perinfo =UserInfo.find({user_id: user_id}).fetch();
     	//JSON.stringify(perinfo);
		Session.setPersistent("userlat",parseInt(perinfo[0].lat));
		Session.setPersistent("userlong",parseInt(perinfo[0].long));
		//alert(Session.get("userlong"));
	

$("#loading_div").addClass("loader_visiblity_block");

  var userLatLong = {lat: parseFloat(perinfo[0].lat), lng: parseFloat(perinfo[0].long)};

GoogleMapsLoader.load(function(google) {
        var map = new google.maps.Map(document.getElementById('map-container'), {
 		center: userLatLong,
          zoom: 14,
        minZoom:6,
        maxZoom:18,
	    scrollwheel: true,
	    navigationControl: true,
	    mapTypeControl: true,
	    scaleControl: true,
	    draggable: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
// GoogleMapsLoader.LANGUAGE = 'en';  

   		var markers = {};

		UserInfo.find().observe({  
		  added: function(document) {
		  		if(document.user_id !="user_admin"){
		  				if(document.lat){
				  	 var cc=getlatlong(Session.get('userlat'),Session.get('userlong'),document.lat,document.long,'M')
		  	
		  		if(document.user_id==Session.get("userId")){
		  		var username="Me";
		  		//var markerico='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
		  		// var markerico='http://vayuz.com/location_green.svg';
		  				  		var pinIcon = new google.maps.MarkerImage(
							    '/uploads/map_icons/purple.svg',
							    null, /* size is determined at runtime */
							    null, /* origin is 0,0 */
							    null, /* anchor is bottom center of the scaled image */
							    new google.maps.Size(50, 60));  /* Size given in CSS Length units */


		  		var distnc='<img class="pointer map_user_img" src="'+document.profile_pic+'"></br><a style="height:10px !important; width:10px !important; margin-left: 15px;" '+ ' ank='+document.user_id +'class="redirect_to_profile pointer" >'+username+'</a></br>';
		 	 	}else{
		  		var username=document.name;
		  		// var markerico='http://vayuz.com/location_red.svg';
		  				  		var pinIcon = new google.maps.MarkerImage(
							    '/uploads/map_icons/red.svg',
							    null, /* size is determined at runtime */
							    null, /* origin is 0,0 */
							    null, /* anchor is bottom center of the scaled image */
							    new google.maps.Size(50, 60));  /* Size given in CSS Length units */

		  		if(document.online_status){
		  			if(document.online_status=="online"){
		  				// markerico = "http://vayuz.com/location_green.svg";
		  						  		var pinIcon = new google.maps.MarkerImage(
							    '/uploads/map_icons/green.svg',
							    null, /* size is determined at runtime */
							    null, /* origin is 0,0 */
							    null, /* anchor is bottom center of the scaled image */
							    new google.maps.Size(50, 60));  /* Size given in CSS Length units */
		  			}
		  		}
		  		
		  		var distnc='<img class="map_user_img pointer" src="'+document.profile_pic+'"></br><a style="height:10px !important; width:10px !important; margin-left: 15px;"'+ ' ank='+document.user_id +' class="redirect_to_profile pointer">'+username+'</a></br><span style="margin-left: 15px;">'+cc+'</span>';
		  		}
		  
		  	  var marker = new google.maps.Marker({
		   	   draggable: false,
		      animation: google.maps.Animation.DROP,
		      position: new google.maps.LatLng(document.lat, document.long),
		      map: map,
		      title: username,
		      // Icon:markerico,
		      Icon: pinIcon,
		      id: document._id
		    });
		   
		   let infowindow = new google.maps.InfoWindow({
          		 content: distnc
		       })
		       marker.addListener('click', function(event){
		             infowindow.open(map, marker);
		       })

		    markers[document._id] = marker;
			}
		  }
		  		}
			  
		});


  });
 },2000);
});




function getlatlong(lat1, lon1, lat2, lon2,unit) {

		var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	if (d>1) return Math.round(d)+"km";
	else if (d<=1) return Math.round(d*1000)+"m";
	return d;
}