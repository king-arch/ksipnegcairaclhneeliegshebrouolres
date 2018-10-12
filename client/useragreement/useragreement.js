

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Base64 } from 'meteor/ostrio:base64';

import { Meteor } from 'meteor/meteor';
import { Privacy } from './../../import/collections/insert.js';
import { UserInfo } from './../../import/collections/insert.js';
Template.user_agr.onRendered(function() {

      var edit_type = "useragreement"; 
       Meteor.call("fetch_privacy_content",edit_type,function(error,result){
       if(error){
           alert("Error Occured while fetching data");
       }else{
        $("#loader").addClass("hidden_element_class");
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

