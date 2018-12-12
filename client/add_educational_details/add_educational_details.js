
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

    Template.add_educational.events({
   'click .save_edu': function(event){
        event.preventDefault();
        var course = $('#course').val();
        var board = $('#board').val();
        var school = $('#school').val();
        
        var edu_format = $('#education_format1').dropdown('get value');

        var edu_start_month = $('#edu_start_month').dropdown('get value');
        var edu_start_year = $('#edu_start_year').dropdown('get value');
        var edu_end_month = $('#edu_end_month').dropdown('get value');
        var edu_end_year = $('#edu_end_year').dropdown('get value');
       
        var edu_location = $('#autocomplete7').val();
        // alert(edu_format);
        // console.log(edu_format);
        if(course == null || course == "")
        {
          $('#course').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#course').removeClass('emptyfield');
        }
                if(board == null || board == "")
        {
          $('#board').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#board').removeClass('emptyfield');
        }

        if(school == null || school == "")
        {
          $('#school').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#school').removeClass('emptyfield');
        }
        if(edu_start_year == null || edu_start_year == "")
        {
          $('#edu_start_year').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edu_start_year').removeClass('emptyfield');
        }

        if(edu_start_month == null || edu_start_month == "")
        {
          $('#edu_start_month').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edu_start_month').removeClass('emptyfield');
        }

        if(edu_location == null || edu_location == "")
        {
          $('#autocomplete7').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#autocomplete7').removeClass('emptyfield');
        }

//Start script for percentage and cgpa


if(document.getElementById('check_education_edu_2').checked){
  $("#edu_end_month").removeClass('red-border'); 
  $("#edu_end_year").removeClass('red-border'); 
  } 
  else
{
      if (edu_end_month ==null || edu_end_month =="" )
    {
    $("#edu_end_month").focus().addClass('red-border');
      return false;
      }
    else{
    $("#edu_end_month").removeClass('red-border');  
    }
      if (edu_end_year ==null ||  edu_end_year =="" )
    {
    $("#edu_end_year").focus().addClass('red-border');
      return false;
      }
    else{
    $("#edu_end_year").removeClass('red-border');  
    } 
  
   if(edu_start_year > edu_end_year || edu_start_year == edu_end_year)
  {
    alert("Start Year cant be greater than End Year");
    $("#edu_start_year").focus().addClass('red-border');
      return false;
  }   
}

  if(edu_format == ""){
    $("#education_format1").focus().addClass('red-border');
    $("#education_format1").focus().addClass('emptyfield');
        return false;
  }
//End script for percentage and cgpa
  // alert(edu_format);
//start script for percentage and cgpa
   if(edu_format =="percentage" || edu_format =="Percentage")
   {
     
  var edu_grade = $("#education_grade").val();
      edu_grade = jQuery.trim(edu_grade);
    if(!edu_grade.match(/^\d+$/))
  {
    alert("number can only be integer");  
    $("#education_grade").focus().addClass('emptyfield');
    return false;   
  }
  else if(edu_grade > 100)
  {
    alert("% cant be greater then 100");
    $("#education_grade").focus().addClass('emptyfield');
    return false;
  }
  var msg6 = edu_grade;
   }
  else if(edu_format == "cgpa" || edu_format == "CGPA")
  {     
  var edu_grade =  parseInt($("#education_grade").val());
  edu_grade = jQuery.trim(edu_grade);
  

  var cgpa_out_of =  parseInt($("#cgpa_out_of").dropdown('get value'));
  if(isNaN(cgpa_out_of)){
     $("#cgpa_out_of").focus().addClass('red-border');
    $("#cgpa_out_of").focus().addClass('emptyfield');
    return false;
  }

        if(cgpa_out_of == null || cgpa_out_of == "")
        {
          $('#cgpa_out_of').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#cgpa_out_of').removeClass('emptyfield');
        }

  //if(!tm1.match(/^\d+$/) && !tm1.val().indexOf('.') != -1)
  if(!edu_grade.match(/^\d+$/))
  {
    alert("number can only be integer");  
    $("#education_grade").focus().addClass('emptyfield');
    return false;
  }
  //alert(tm1+tm2);
  if(edu_grade > cgpa_out_of)
  {
    alert("Cgpa cant be greater then "+ cgpa_out_of);
    //alert(tm2 +tm1);
    $("#education_grade").focus().addClass('emptyfield');
    return false;
  }
  $("#education_grade").removeClass('emptyfield');
  var msg6 = edu_grade+'/'+cgpa_out_of;
  //alert(msg6);
  }

  var score = msg6;
        var course = $('#course').val();
        var board = $('#board').val();
        var school = $('#school').val();

        $('#edu_start_month').val('');
        $('#edu_start_year').val('');
        $('#edu_end_month').val('');
        $('#edu_end_year').val('');
        $('#autocomplete7').val('');

        var user_id = Session.get("userId");
        alert(board,school,score,edu_start_month,edu_start_year,edu_end_month,edu_end_year,edu_location);
        Meteor.call('insert_education',user_id,course,board,school,score,edu_start_month,edu_start_year,edu_end_month,edu_end_year,edu_location,function(error,result){
          if(error){
              // alert('error');
              console.log('error in updating education');
          }else{
              // alert('result');
              window.location.reload();
              console.log('error in updating education');
          }
        });
        // alert('education inserted');
        Router.go('/profile');
        window.location.reload();
        $('.modal').modal('close');
        $(".form_reset").trigger('reset');

  },

    });

    
    Meteor.startup(function() {  
      GoogleMaps.load();
    });

    Template.add_educational.onRendered(function(){
      
    setTimeout(function(){
    if (GoogleMaps.loaded()) {
      $("#autocomplete7").geocomplete({ details: "form" });
    }
},5000);
  //alert("started");
});