
// 
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { Blog } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';

import { Comment } from './../../../import/collections/insert.js';
import { Like } from './../../../import/collections/insert.js';
import { Followers } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session';
// document.title = "Special Neighborhood | Blog Details";

let all_likes;
let all_comments;
let all_followers;


   Template.blogdetails.onDestroyed(function(){
      all_likes.stop();
  all_comments.stop();
  all_followers.stop();
});
   Template.blogdetails.onRendered(function(){
    // alert('b1');
    all_likes = Meteor.subscribe("all_likes");
all_comments = Meteor.subscribe("all_comments");
all_followers = Meteor.subscribe("all_followers");

Meteor.subscribe("user_info_based_on_id",Session.get("userId"));
 
 Session.set("reply_comment_show_limit","");
 Session.set("likes_count","");
 Session.set("detailed_blog_id","");
       var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var user_id_by_url = Base64.decode(url); 
         Session.set("detailed_blog_id",user_id_by_url);
 Meteor.subscribe("fetch_blogs_content",Session.get("detailed_blog_id"));
    var logged_in_User =  Session.get("userId");


      Meteor.call('FetchUserData',logged_in_User,function(error,result){
    if(error)
      {
         console.log('Error');
      }
      else{
       setTimeout(function(){ 
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

           UI._globalHelpers['detailed_blog_array']();
           UI._globalHelpers['changeDateFormat']();
           UI._globalHelpers['fetch_blog_creator_information']();
           UI._globalHelpers['temp_data']();
           UI._globalHelpers['Like_unlike_txt_event']();
           UI._globalHelpers['show_like_count']();
           UI._globalHelpers['fetch_count_total_level_zero_comments']();
           UI._globalHelpers['get_current_logged_in_user_details']();
           UI._globalHelpers['headline']();
           UI._globalHelpers['count_for_level_zero_comments']();
           UI._globalHelpers['show_comment_lvl0']();
           UI._globalHelpers['show_commenter_info']();
           UI._globalHelpers['calculate_time_difference']();
           UI._globalHelpers['check_for_edited']();
           UI._globalHelpers['comment_txt']();
           UI._globalHelpers['check_if_commented_by_is_user']();
           UI._globalHelpers['Like_unlike_txt']();
           UI._globalHelpers['show_like_count_comment']();
           UI._globalHelpers['show_count']();
           UI._globalHelpers['show_more_comment_reply']();
           UI._globalHelpers['show_limit_comment_reply']();
           UI._globalHelpers['show_comment_reply']();
           UI._globalHelpers['you_may_like_to_read']();
           UI._globalHelpers['trim_content']();
           UI._globalHelpers['fetch_blog_creator']();
           UI._globalHelpers['check_if_current_logged_in_is_admin']();
           UI._globalHelpers['likes_count']();
           UI._globalHelpers['fetch_all_liked_users']();
           UI._globalHelpers['fetch_user_information']();


     }
   });

   });



Template.blogdetails.helpers({
 check_for_edited(comment_id){
    var commentedComment = Comment.find({comment_id: comment_id,commentActivityStatus: 0}).fetch()
    if(commentedComment[0].editedAt)
    {
      return true;
    }
  },
check_if_commented_by_is_user(comment_by){

  if(Session.get("userId") == comment_by){
    return true;
  }
},

  detailed_blog_array(){
             // var detailed_blog_id = Session.get("detailed_blog_id");
             // var t2 = Template.instance();
            // var detailed_blog_id = t2.detailed_blog_id.get();
            var detailed_blog_id = Session.get("detailed_blog_id");
            // alert("cool bro"+detailed_blog_id);
            console.log("detailed_blog_id: ");
            console.log(detailed_blog_id);
            var result = Blog.find({blog_id: detailed_blog_id}).fetch();            
            console.log(result);
            var blog_image = result[0].blog_image;
            console.log(blog_image);
            if(result[0].is_draft == 1){
              Session.set("detail_page_in_draft","true");
            } 
          return result;
  },
  temp_data(blog_description){
    Session.set("temp_data",blog_description);
  },
  blog_description1(){
      
    // trumbowyg.html(this.blog_description);
    return '';
/*  
    var data = ;
    $( "#div_blog_content_container" ).html( htmlEncode (data));
     return 'a';*/

  },
   changeDateFormat(createdAt){
    var date = new Date(createdAt);
    var formatted = moment(date).format('MMM D,  YYYY');
    // alert(formatted);
    return formatted;
  },
  fetch_blog_creator(user_id){

    Meteor.subscribe("user_info_based_on_id",user_id);
    var user_information = UserInfo.find({user_id:user_id}).fetch();
    return user_information[0].name;
  },
  fetch_blog_creator_headline(user_id){
    Meteor.subscribe("user_info_based_on_id",user_id);
  var user_information = UserInfo.find({user_id:user_id}).fetch();
    return user_information[0].headline;
  },
  fetch_blog_creator_information(user_id){
    Meteor.subscribe("user_info_based_on_id",user_id);
    var user_information = UserInfo.find({user_id:user_id}).fetch();
    return user_information;
  },
  get_current_logged_in_user_details(){
    var user_information = UserInfo.find({user_id:Session.get("userId")}).fetch();
    return user_information;
  },
  show_commenter_info(){
      var user_id = this.comment_by;
      Meteor.subscribe("user_info_based_on_id",user_id);
       var result = UserInfo.find({user_id: user_id}).fetch();
       return result;
     },
     count_for_level_zero_comments(){
          // var t2 = Template.instance();
            var blog_id = Session.get("detailed_blog_id");
            // var blog_id = t2.detailed_blog_id.get();
      var result = Comment.find({blog_id: blog_id, comment_type: 'orignal',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).count();
      if(result!=0){
      return result;
      }else{
        return false;
      }
     },
     show_comment_lvl0(){
      comment_by = Session.get("userId");
        // var blog_id = Session.get("detailed_blog_id");

          // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();
            var blog_id = Session.get("detailed_blog_id");

      var result = Comment.find({blog_id: blog_id, comment_type: 'orignal',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch();
      return result;
     },

     fetch_count_total_level_zero_comments(){
     var blog_id = Session.get("detailed_blog_id");
     // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();

      var result = Comment.find({blog_id: blog_id, comment_type: 'orignal',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch();
      return result.length; 
     },
     Like_unlike_txt_event(){
        var liked_by = Session.get("userId");
        var blog_id = Session.get("detailed_blog_id");
        // var t2 = Template.instance();
       // var blog_id = t2.detailed_blog_id.get();
       var result = Like.find({blog_id: blog_id, liked_by: liked_by, like_type: 'main_blog'}).count();
        if(result > 0){
              return 'Liked';
        }
        else{
            return 'Like';
        }
     }, show_like_count(){
      var liked_by = Session.get("userId");
      var blog_id = Session.get("detailed_blog_id");
            // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();
            
            var result_count = Like.find({blog_id: blog_id,like_type: 'main_blog'}).count();
        return result_count;
     },
     calculate_time_difference(a){
    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);

   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + 'm';
  }else if(minutes>=60 && hours<24){
    if(Math.floor(hours)==1 || minutes==60){
    return Math.floor(hours) + 'h';
    }else{ 
    return Math.floor(hours) + 'h';
    }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +"d";
    }else{
    return Math.floor(days) +"d";
    }
  }
  else{    
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
      }
  },
     show_like_count_comment(){
        var comment_id = this.comment_id;
        var blog_id = this.blog_id;
      var result_count = Like.find({like_type: 'blog_comment',blog_id: blog_id,comment_id: comment_id}).count();
        return result_count;
     },
     show_count(){
      var comment_by = Session.get("userId");
      var blog_id = Session.get("detailed_blog_id");
            // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();
      var result_count = Comment.find({blog_id: blog_id, comment_type: 'reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: -1}}).count()
      return result_count;
     },
      Like_unlike_txt(){
      var comment_id = this.comment_id;
        var blog_id = this.blog_id;
        var liked_by = Session.get("userId");
      var result_count = Like.find({like_type: 'blog_comment',blog_id: blog_id,comment_id: comment_id,liked_by: liked_by}).count();
      if(result_count == 0){
        return 'Like';
      }else{
        return 'Liked';
      }
    }, show_comment_reply(){
      comment_by = Session.get("userId");
      var blog_id = Session.get("detailed_blog_id");
    // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();
      const t = Template.instance();
      var result = Comment.find({blog_id: blog_id, comment_type: 'reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: 1}}).fetch()
      return result;
     },
     show_comment_reply(){
      comment_by = Session.get("userId");
      var detailed_blog_id = Session.get("detailed_blog_id");
          // var t2 = Template.instance();
            // var detailed_blog_id = t2.detailed_blog_id.get();

      // const t = Template.instance();

      if(Session.get('reply_comment_show_limit') == ""){
        var result = Comment.find({blog_id: detailed_blog_id, comment_type: 'reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: -1} , limit: 3}).fetch().reverse();
        return result;
      }
      var result = Comment.find({blog_id: detailed_blog_id, comment_type: 'reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch().reverse();
      return result;
      // }


     },
     show_more_comment_reply(){
      var comment_by = Session.get("userId");
      var detailed_blog_id = Session.get("detailed_blog_id");
            // var t2 = Template.instance();
            // var detailed_blog_id = t2.detailed_blog_id.get();

      var result_count = Comment.find({blog_id: detailed_blog_id, comment_type: 'reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: 1}}).count()
      if(result_count > 3){
        return true;
      }     
      else{
        return false;
      }
     },
     
    
      show_limit_comment_reply(){
      // const t = Template.instance();
      if( Session.get('reply_comment_show_limit') == ""){
        return true;
      }     
      else{
        return false;
      }
     },
     check_users_for_a_follower(userId){
      var current_user_id =Session.get("userId");
      var blog_creator_id = userId;
      if(current_user_id == blog_creator_id){
        return '';
      }
      var show_pending = Followers.find({follower: current_user_id,following: blog_creator_id,is_follower:1}).count();
      if(show_pending == 0){
        return 'Follow';
      }else{
        return 'Following';
      }
     },
    you_may_like_to_read(){
     var blog_id =   Session.get("detailed_blog_id");
     // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();

     var currentAuthor = Blog.find({blog_id: blog_id}).fetch();

     var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');        
       var result = Blog.find( {$and:[{blog_creator_id: {$ne : currentAuthor[0].blog_creator_id}},{is_draft: 0},{is_active: 1},{Blog_publish_date:{$lte:str}}]},{limit: 5}).fetch();
     return result;
     },
     trim_content(content){
     if(content.length > 20){
         return content.substr(0, 20)+"...";
        }
        else{
        return content;
        }
      },
     fetch_all_liked_users(){
     var blog_id =   Session.get("detailed_blog_id");
     // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();
             // var blog_type = Session.get("blog_type");
      var comment_id = Session.get("comment_id");
      var all_liked_users = Like.find({blog_id: blog_id, comment_id: comment_id}).fetch();
      var data = JSON.stringify(all_liked_users);
      console.log("Data " +data);

      // const t = Template.instance();
      // t.likes_count.set(all_liked_users.length);  
      Session.set("likes_count",all_liked_users.length);

      return all_liked_users;
     },

     likes_count(){
        // const t = Template.instance();
       // return t.likes_count.get();
        return Session.get("likes_count");
     },
     fetch_user_information(){
      Meteor.subscribe("user_info_based_on_id",this.liked_by);
     var userInfo = UserInfo.find({"user_id":this.liked_by}).fetch();
     return userInfo;
      },
      check_if_current_logged_in_is_admin(){
       var currentLoggedIn = Session.get("userId");
       // var t2 = Template.instance();
       // var blog_id = t2.detailed_blog_id.get();
       var blog_id = Session.get("detailed_blog_id");

        var result = Blog.find({blog_id: blog_id}).fetch();            
        if(result[0].blog_creator_id == currentLoggedIn){
          return true;
        }
        // console.log(result);
      },
      edit_blog_link(){

      // var t2 = Template.instance();
       // var blog_id = t2.detailed_blog_id.get();
       var blog_id = Session.get("detailed_blog_id");
      blog_id= Base64.encode(blog_id);
      Session.clear("edit_new_blog_image_url");
      var url = '/edit_blog/'+blog_id;
      return url;
      },

get_commentator_information(){
     var userId= this.comment_by;
     Meteor.subscribe("user_info_based_on_id",userId);
     var userInfo = UserInfo.find({"user_id":userId}).fetch();
     return userInfo;
},
get_commentator_profile_pic(user_id){
  Meteor.subscribe("user_info_based_on_id",user_id);
   var userInfo = UserInfo.find({"user_id":user_id}).fetch();
    return userInfo[0].profile_pic;  
},
get_commentator_user_name(user_id){
  Meteor.subscribe("user_info_based_on_id",user_id);
   var userInfo = UserInfo.find({"user_id":user_id}).fetch();
    return userInfo[0].name;  
},

});
  


Template.blogdetail.onRendered(function(){
});

Template.blogdetails.onRendered(function(){
  window.scrollTo(0,0);
  setTimeout(function(){
    if(Session.get("detail_page_in_draft")=="true"){
      
      $("#comment_form").hide();
    }
  },500);
  $("#edit_blog_description").hide();
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
  $("#loader").hide();/*
$("#edit_blog_description").show();
$("#loader").hide();
  $(".trumbowyg-button-pane").css('display','none');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
// $(".trumbowyg-overlay").css('min-height','10px');
  $(".trumbowyg-editor").attr('contenteditable','false');
 $(".trumbowyg-editor").css('height','auto');
  document.getElementById("edit_blog_description").disabled = true;*/
// },900);
});

function show_content_hide_loader(){
    // $(".trumbowyg-overlay").css('min-height','10px');
    $(".trumbowyg-editor").css('min-height','50px');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
  $(".trumbowyg-button-pane").css('display','none');
  $(".trumbowyg-editor").attr('contenteditable','false');
 $(".trumbowyg-editor").css('height','auto');
  document.getElementById("edit_blog_description").disabled = true;

// $("#edit_blog_description").css('min-height','50px');;
$("#loader").hide();
    $("#edit_blog_description").show();
  $(".trumbowyg-editor").attr('contenteditable','false');
  $(".trumbowyg-button-pane").css('display','none !important');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
 $(".trumbowyg-editor").css('height','auto');
 // $(".materialize-textarea").css('height','auto');
 $(".trumbowyg-box,.trumbowyg-editor").css('min-height','10px');
 $(".trumbowyg-box").css('padding-top','0px');
 $(".trumbowyg-editor").css('padding-left','0px');
  document.getElementById("edit_blog_description").disabled = true;
}
function visible(elm) {
  if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
  if(getComputedStyle(elm).visibility === 'hidden') { return false; }
  return true;
}



Template.blogdetails.events({
  'mouseover .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).show();
  },
   'mouseout .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).hide();
  },

    'mouseover .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).show();
  },
  'mouseout .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).hide();
  },
    'keypress .hidden_comment':function(e){
    var key = e.keyCode;

    // If the user has pressed enter
    if (key == 13) {

       if($("#hidden_comment_"+this.comment_id).is(':focus')){
        var comment_txt = $("#hidden_comment_"+this.comment_id).val();
        var comment_id = this.comment_id;
        Meteor.call("update_commented_text",Session.get("userId"),this.comment_id,comment_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_"+comment_id).addClass("loader_visiblity_block");
             $("#show_comment_"+comment_id).removeClass("loader_visiblity_block");
          }
        })
        return false;
      }else if($("#hidden_comment_level_2_"+this.comment_id).is(':focus')){
        var comment_txt = $("#hidden_comment_level_2_"+this.comment_id).val();
        
        var comment_id = this.comment_id;
        Meteor.call("update_commented_text",Session.get("userId"),this.comment_id,comment_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_level_2_"+comment_id).addClass("loader_visiblity_block");
             $("#show_comment_level_2_"+comment_id).removeClass("loader_visiblity_block");
          }
        })
        return false;

      }
    }
    else {
        return true;
    }
  },

  'click .edit_comment':function(){
    $("#hidden_comment_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_"+this.comment_id).addClass("loader_visiblity_block ");
  },
  'click .remove_comment':function(){
    if(confirm("Sure, You want to remove this Comment")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"),this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },
  'click .level_2_edit_comment':function(){
    $("#hidden_comment_level_2_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_level_2_"+this.comment_id).addClass("loader_visiblity_block ");
  },
  'click .level_2_remove_comment':function(){
    if(confirm("Sure, You want to remove this Comment")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"), this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },
  'click .hide_modal_class':function(){
   $('#Show_invited_list').modal().hide();

  },
  'click #create_blog_btn':function(){
        Router.go('/create_blog');
  },
  'keyup input': function(event) {
      if (event.ctrlKey && event.which == 13) {
       // Ctrl-Enter pressed
        $("#submit_comment").click();
  }
  else if (event.which === 13) {
        
        $(".submit_comment_lvl1").click();
      }
    },

  'click #submit_comment':function(){
      
    var comment_txt = $('#parent_comment').val();
      if(comment_txt == null || comment_txt == "")
        {
          $('#parent_comment').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#parent_comment').removeClass('emptyfield');
        }

      comment_by = Session.get("userId");
      
      /*var commentcount =  Comment.find({comment_type: 'orignal'}, { sort: {createdAt: 1 }}).fetch();
      if(commentcount != '' && commentcount != null && commentcount != undefined ){
      var last_comment_id = commentcount[commentcount.length-1].comment_id;
      var actual_count = last_comment_id%50000;
      var a1 = actual_count + 1;
      var comment_id = 50000+ a1;
      }
      else{
        comment_id = 50001;
      }*/
            var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;

      var blog_id = Session.get("detailed_blog_id");
       // var t2 = Template.instance();
            // var blog_id = t2.detailed_blog_id.get();
      var parent = 0;
      // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);
      Meteor.call('blog_comments',comment_id,blog_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');

          }else{
              console.log('succesfully commented');
              }
      });
      $('#parent_comment').val('');
     
  },
  'click .like_button_comments':function(){

        var liked_by = Session.get("userId");
        var comment_id = this.comment_id;
        var blog_id = this.blog_id;
        
        var comment_txt = this.comment_txt;
        var comment_by = this.comment_by;
        var comment_type = this.comment_type;
        
        var parent = this.parent;
        
         Meteor.call('perform_like_action',liked_by,comment_id,blog_id,comment_txt,comment_by,comment_type,parent,function(error,result){
          if(result){
            console.log("Done");
          }else{
            toastr.warning("Some Error Occured");
          }
        });

    },
    'click .blog_detail_redirect':function(){
      var blog_id = this.blog_id;
      blog_id= Base64.encode(blog_id);
      var url = '/blog_detailed/'+blog_id;  
      Router.go(url);   
    },
    'click .submit_comment_lvl1': function(){
        var comment_id_from_btn = this.comment_id;
        // alert(' & '+ comment_id_from_btn);
        var get_val = 'commentlvl1_'+comment_id_from_btn;
        var comment_txt = $('#'+get_val).val();
        // alert(get_val+' & '+comment_txt);
         if($("#commentlvl1_"+comment_id_from_btn).is(':focus')){

      if(comment_txt == null || comment_txt == "")
        {
          $('#'+get_val).addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#'+get_val).removeClass('emptyfield');
        }

      comment_by = Session.get("userId");

      var k12 = comment_id_from_btn;
     /* const count3 = Comment.find({comment_id:{$regex:new RegExp('^' + k12 +'_')},commentActivityStatus: 0}).count(); //like 'pa%'
      var a = 0;
      var count4 = 0;
      if(count3 == 0)
      {
       a = '_1';
       comment_id = k12+a;
      }
      else
       {
        // alert('just checkin: k12: '+k12);
        var count_4 = count3+1;
        a = '_';
        count4 = k12+a+count_4;
        var count5 = Comment.find({comment_id: {$regex:new RegExp('^' + k12)}},{sort: {createdAt: 1},commentActivityStatus: 0}).fetch();   
        var old_id = count5[count5.length-1].comment_id;
        var comment_id_for_reply = old_id.split('_');
        var k123 = comment_id_for_reply[comment_id_for_reply.length-1];
        var k123_1 = parseInt(k123)+1;
        a = '_';
        var comment_id = comment_id_from_btn + a + k123_1;  
       }*/
      var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;
    var detailed_blog_id = Session.get("detailed_blog_id");
                var parent = comment_id_from_btn;

      Meteor.call('blogs_comments_lvl_1',comment_id,detailed_blog_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');
          }else{
              // sAlert.success('Sucessfully commented',"123");
              console.log('sucessfully commented');
              }
      });
      $('#'+get_val).val('');
    }
     },
     'click #show_more_comment_reply': function(){
        // const t = Template.instance();
        // t.reply_comment_show_limit.set("3");
        Session.set('reply_comment_show_limit',3)
      },

      'click #show_less_comment_reply': function(){
        // const t = Template.instance();
        // t.reply_comment_show_limit.set("");
        Session.set('reply_comment_show_limit',"")
      },
    
       'click .like_Button_event': function(){
        var liked_by = Session.get("userId");
        var detailed_blog_id = Session.get("detailed_blog_id");;

          
          Meteor.call('like_blog_action',liked_by, detailed_blog_id,function(error,result){
            if(error){
                  toastr.warning("Some Error Occured");
            }else{
                  console.log("Done");
            }
          });
        },
       'click #follow_button':function(){
        // alert("cool");
        var current_user_id =Session.get("userId");
        var detailed_blog_id = Session.get("detailed_blog_id"); 
         // var t2 = Template.instance();
            // var detailed_blog_id = t2.detailed_blog_id.get();
            // alert(current_user_id+' & '+detailed_blog_id);
        var result = Blog.find({blog_id: detailed_blog_id}).fetch();            
        var blog_creator_id = result[0].blog_creator_id
        var show_pending = Followers.find({follower: current_user_id,following: blog_creator_id,is_follower:1}).fetch();
         console.log(show_pending);
          var change_follow_status = 0;
          if(show_pending.length==0){
            change_follow_status=1;
          }  
          Meteor.call('change_follow_status',current_user_id,blog_creator_id,change_follow_status,function(error,result){
                if(error){
                  alert("Error");
                }else{
                  console.log("Success");
                }
          });
        
       },
         'click .display_like_count':function(){
            Session.set("comment_id",this.comment_id);
           Template.blogdetails.__helpers["fetch_all_liked_users"]();
        },
        'click .display_like_count_level_1':function(){
            Session.set("comment_id",this.comment_id);
           Template.blogdetails.__helpers["fetch_all_liked_users"]();
        },'click .display_like_count_level_2':function(){
            Session.set("comment_id",this.comment_id);
           Template.blogdetails.__helpers["fetch_all_liked_users"]();
        },
        'click .comments_with_count':function(){
           var get_val = 'commentlvl1_'+this.comment_id;
           $('#'+get_val).focus(); 
        },'click .parent_comment':function(){
           var get_val = "parent_comment";
           $('#'+get_val).focus(); 
        },
        'click #close_button':function(){
              $('#Show_invited_list').modal('close');
        },
        'click .redirect_to_profile':function(){
    var user_id = Session.get("userId");
    user_id= Base64.encode(this.user_id);
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





  /*if(Session.get("reloadOnce")=="true"){
    Session.set("reloadOnce","false");
    location.reload(); 
  }*/
/*  $(".trumbowyg-editor").css('min-height','50px');
  $(".trumbowyg-button-pane").css('display','none');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
  $(".trumbowyg-editor").attr('contenteditable','false');
 $(".trumbowyg-editor").css('height','auto');
  document.getElementById("edit_blog_description").disabled = true;*/
// $(".trumbowyg-editor").css('height','auto');
  // $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
   // $(".trumbowyg-overlay").css('min-height','10px');
/*
$("#loader").hide();
    $("#edit_blog_description").show();
  $(".trumbowyg-editor").attr('contenteditable','false');
  $(".trumbowyg-button-pane").css('display','none !important');
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
 $(".trumbowyg-editor").css('height','auto');
 // $(".trumbowyg-box").css('min-height','10px');
$(".trumbowyg-editor").css('height','auto');
 $(".trumbowyg-box").css('padding-top','0px');
 $(".trumbowyg-editor").css('padding-left','0px');
  $(".trumbowyg-box,.trumbowyg-editor").css('min-height','10px');
  document.getElementById("edit_blog_description").disabled = true;
$("#edit_blog_description").hide();
$(".loading").removeClass("loader_visiblity_block");
  $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
  $(".trumbowyg-editor").css('height','auto');
  // $(".trumbowyg-editor").css('min-height','50px');
  setTimeout(function(){  
  $(".trumbowyg-editor").attr('contenteditable','false');
  $(".loading").addClass("loader_visiblity_block");
    $(".trumbowyg-box, .trumbowyg-editor").css('border','0px');
     $(".trumbowyg-box,.trumbowyg-editor").css('min-height','10px');
  $(".trumbowyg-button-pane").css('display','none !important');
   $(".trumbowyg-editor").css('height','auto');
     // $(".trumbowyg-overlay").css('min-height','10px');
  // $(".trumbowyg-editor").css('min-height','50px');
    setInterval(function(){
      if($("#loader").is(":visible")){
        show_content_hide_loader();        
    } 
  },1000);
},900);
  */