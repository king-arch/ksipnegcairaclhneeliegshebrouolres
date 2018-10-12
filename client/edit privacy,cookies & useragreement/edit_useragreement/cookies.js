
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Base64 } from 'meteor/ostrio:base64';

import { Meteor } from 'meteor/meteor';

import { UserInfo }  from './../../../import/collections/insert.js';
import { Privacy } from './../../../import/collections/insert.js';
/*

Template.cookies_policy.onRendered(function() {
	
             // UI._globalHelpers['edit_useragreement_array']();
             // UI._globalHelpers['temp_data']();

  window.scrollTo(0,0);

  setTimeout(function(){
      $("#comment_form").hide();
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
  $("#loader").hide();
});

*/


Template.cookies_policy.onRendered(function() {
  
             // UI._globalHelpers['edit_useragreement_array']();
             // UI._globalHelpers['temp_data']();

             var edit_type = "cookies"; 
       Meteor.call("fetch_privacy_content",edit_type,function(error,result){
       if(error){
           alert("Error Occured while fetching data");
       }else{
        $("#loader").addClass("hidden_element_class")
              if(result == ""){
                  $("#no_privacy_added").removeClass("hidden_element_class");
                   return false;
               }else{
                console.log("privacy_content");
                console.log(result[0].privacy_content);
                $('#temp_data').html(result[0].privacy_content);
               }
        }
    });
    });