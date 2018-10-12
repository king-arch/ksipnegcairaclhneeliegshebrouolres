
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { Blog } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';

import { Comment } from './../../../import/collections/insert.js';
import { Like } from './../../../import/collections/insert.js';
import { Followers } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

//document.title = "Special Neighbourhood | Blog Preview";
// Template.blog_preview.onRendered(function(){
//   $("#edit_blog_description").hide();
// setTimeout(function(){
//   $("#edit_blog_description").show();
//   $("#loader").hide();
//   $(".trumbowyg-button-pane").css('display','none');
//   $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
//   $(".trumbowyg-editor").attr('contenteditable','false');
//  $(".trumbowyg-editor").css('height','auto');
//  $(".trumbowyg-box,.trumbowyg-editor").css('min-height','10px');
//  $(".trumbowyg-box").css('padding-top','0px');
//  $(".trumbowyg-editor").css('padding-left','0px');
//   document.getElementById("edit_blog_description").disabled = true;
// },900);


// });


Template.blog_preview.onRendered(function(){
   var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var user_id_by_url = Base64.decode(url); 
         Session.set("detailed_blog_id",user_id_by_url);

        Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
        Meteor.subscribe("fetch_blogs_content",Session.get("detailed_blog_id"));
  window.scrollTo(0,0);
  /*if(Session.get("reloadOnce")=="true"){
    Session.set("reloadOnce","false");
    location.reload(); 
  }*/
/*$("#edit_blog_description").hide();
$(".loading").removeClass("loader_visiblity_block");
  
  setTimeout(function(){  
  $(".trumbowyg-editor").attr('contenteditable','false');
  $(".loading").addClass("loader_visiblity_block");
  $(".trumbowyg-button-pane").css('display','none !important');
   $(".trumbowyg-editor").css('height','auto');
  setInterval(function(){
      if($("#loader").is(":visible")){
        show_content_hide_loader();        
    } 
  },1000);
},900);*/
  

  // $("#edit_blog_description").hide();
// setTimeout(function(){
  // alert(Session.get("temp_data"));
  console.log(Session.get("temp_data"));
  if(Session.get("temp_data")==undefined){
    setInterval(function(){
        if(Session.get("temp_data")!=undefined){
        $("#temp_data").html(Session.get("temp_data"));
        }
    },500)
  }else{
        $("#temp_data").html(Session.get("temp_data"));
  
  }
  $("#loader").hide();

});
/*
function show_content_hide_loader(){
  $(".trumbowyg-button-pane").css('display','none');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
  $(".trumbowyg-editor").attr('contenteditable','false');
 $(".trumbowyg-editor").css('height','auto');
  document.getElementById("edit_blog_description").disabled = true;


$("#loader").hide();
    $("#edit_blog_description").show();
  $(".trumbowyg-editor").attr('contenteditable','false');
  $(".trumbowyg-button-pane").css('display','none !important');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
 $(".trumbowyg-editor").css('height','auto');
 $(".trumbowyg-box,.trumbowyg-editor").css('min-height','10px');
 $(".trumbowyg-box").css('padding-top','0px');
 $(".trumbowyg-editor").css('padding-left','0px');
  document.getElementById("edit_blog_description").disabled = true;
}*/
function visible(elm) {
  if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
  if(getComputedStyle(elm).visibility === 'hidden') { return false; }
  return true;
}


   Template.blogpreview.onRendered(function(){

setInterval(function(){ 
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


Template.blogpreview.helpers({
	 detailed_blog_array(){
             var detailed_blog_id = Session.get("detailed_blog_id"); 
            console.log(detailed_blog_id);
            var result = Blog.find({blog_id: detailed_blog_id}).fetch();            
            // console.log(result);
            
            // var blog_image        = result[0].blog_image;
            // console.log(blog_image);
            return result;
  },
   temp_data(blog_description){
    Session.set("temp_data",blog_description);
  },
  fetch_blog_creator(user_id){
    var user_information = UserInfo.find({user_id:user_id}).fetch();
    return user_information[0].name;
  },
   fetch_blog_creator_image(user_id){
  var user_information = UserInfo.find({user_id:user_id}).fetch();
    return user_information[0].profile_pic;
  },changed_format_date(Blog_publish_date){
/*    var changed_format_date = moment(Blog_publish_date).format('MMM DD, YYYY'); 
     return changed_format_date;*/
     var str = Blog_publish_date;
          var date = str.split("-")[2];
          var month = str.split("-")[1];
          var year = str.split("-")[0];
          var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
          return months[month-1]+ " " +date +", " +year;

  }

});

Template.blogpreview.events({
	'click #edit_blog':function(){
    var blog_id =  Session.get("detailed_blog_id");
    blog_id= Base64.encode(blog_id);
    Session.clear("edit_new_blog_image_url");
    var url = '/edit_blog/'+blog_id;
    Router.go(url); 
	},
	'click #submit_event':function(){
		// publish blog and go to listing Page
		Meteor.call('publish_blog',Session.get("detailed_blog_id"),function(error,result){
				if(error){
					alert("error");
				}else{
          toastr.success("created sucessfully ","Success");
					Router.go("/blog_listing");
				}
		});
	}
})