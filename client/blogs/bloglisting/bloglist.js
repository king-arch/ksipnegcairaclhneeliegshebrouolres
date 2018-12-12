
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';
import { Blog } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';


   Template.blog_list.onRendered(function(){

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


  Template.blog_list.helpers({
	blog_fulllist(){
	  var c1 = Blog.find({}).fetch();
	  console.log(c1);
	  return c1;
	},


    });

Template.blog_list.events({
	'click .redirect_click_1': function(event){
    // alert(1);
    event.preventDefault();
    var blog_id = this.blog_id;
    blog_id= Base64.encode(blog_id);
    
    var url = '/edit_blog/'+blog_id;
    Router.go(url);    

},

})

