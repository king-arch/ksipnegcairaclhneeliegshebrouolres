
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Base64 } from 'meteor/ostrio:base64';

import { UserInfo } from './../../import/collections/insert.js';
import { UserSkill } from './../../import/collections/insert.js';

import { UserProfJr } from './../../import/collections/insert.js';
import { UserEdu } from './../../import/collections/insert.js';

import { UserAward } from './../../import/collections/insert.js';
import { UserMedical } from './../../import/collections/insert.js';

import { Images } from './../../import/config.js';
import { Group } from './../../import/collections/insert.js';

import { Blog } from './../../import/collections/insert.js';
import { UserGroup } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';

import { FriendRequest } from './../../import/collections/insert.js';
// Template.hello.onRendered(function() {
//   var user_id = Session.get("userId");
//   $("#show_modal_body").fadeOut("slow");
// })
    Template.registerHelper('equals', function (a, b) {
      return a === b;
    });

    Template.add_achive.events({
      'click #save_award': function(event){
        event.preventDefault();
        var awd_type = $('#awd_type2').val();
        var description = $('#description').val();
        var awd_month = $('#awd_month2').val();
        var awd_year = $('#awd_year2').val();
        var awd_location = $('#autocomplete4').val();
        if(awd_type == null || awd_type == "")
        {
          $('#awd_type').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#awd_type').removeClass('emptyfield');
        }

        if(description == null || description == "")
        {
          $('#description').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#description').removeClass('emptyfield');
        }

        if(awd_month == null || awd_month == "")
        {
          $('#awd_month').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#awd_month').removeClass('emptyfield');
        }

        if(awd_year == null || awd_year == "")
        {
          $('#awd_year').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#awd_year').removeClass('emptyfield');
        }

        if(awd_location == null || awd_location == "")
        {
          $('#autocomplete4').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#autocomplete4').removeClass('emptyfield');
        }

        alert(userId+awd_type+description+awd_month+awd_year+awd_location);
          var userId = Session.get("userId");
   
          Meteor.call('insert_awd',userId,awd_type ,description,awd_month,awd_year,awd_location, function(error,result){
          if(error){
            console.log('error');
          }else{
            Router.go("/profile");
            console.log('Suceesfully inserted');
          }
          });  
  },
    });

Meteor.startup(function() {  
      GoogleMaps.load();
     
    });

    Template.add_achivement.onRendered(function(){
      
    setTimeout(function(){
    if (GoogleMaps.loaded()) {
      // $("#autocomplete11").geocomplete({ details: "form" });
      // $("#autocomplete10").geocomplete({ details: "form" });
      // $("#autocomplete9").geocomplete({ details: "form" });
      // $("#autocomplete8").geocomplete({ details: "form" });
      // $("#autocomplete7").geocomplete({ details: "form" });
      // $("#autocomplete6").geocomplete({ details: "form" });
      // $("#autocomplete5").geocomplete({ details: "form" });
      // $("#autocomplete4").geocomplete({ details: "form" });//
      // $("#autocomplete3").geocomplete({ details: "form" });
      // $("#autocomplete2").geocomplete({ details: "form" });
      // $("#autocomplete1").geocomplete({ details: "form" });
      // $("#autocomplete").geocomplete({ details: "form" });
    }
},5000);
  //alert("started");
});