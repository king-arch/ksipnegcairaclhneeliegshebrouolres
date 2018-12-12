
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
import "./../lib/googlePlaces.js";

// Template.hello.onRendered(function() {
//   var user_id = Session.get("userId");
//   $("#show_modal_body").fadeOut("slow");
// })
 

   /* Template.edit_educational.onRendered(function(){
        var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];

        // Meteor.call('fetch_user_skills',url,function(error,result){
        //   if(error){
        //     alert("error");
        //   }else{
        // setTimeout(function(){

          Meteor.call('fetch_user_educational_details',url,function(error,result){
            if(result){     
          $('#edit_course').val(result[0].course);
        $('#edit_board').val(result[0].board);
        $('#edit_school').val(result[0].school);
        $('#autocomplete8').val(result[0].edu_location);
        $('#edit_education_format_value').val(result[0].education_format_value);
         $("#edit_awd_expert").dropdown("set selected",result[0].awd_expert+"");
        $("#edit_edu_start_month").dropdown("set selected",result[0].edu_start_month+"");
        $("#edit_edu_start_year").dropdown("set selected",result[0].edu_start_year+"");
        $("#edit_edu_end_month").dropdown("set selected",result[0].edu_end_month+"");
        $("#edit_edu_end_year").dropdown("set selected",result[0].edu_end_year+"");
          // $('#edit_score').val(edit_score);
            $("#edit_education_format").dropdown("set selected", result[0].edit_education_format);

      var score = result[0].score;
          if (isValid(score)) {
          
          var edit_education_format = 'percentage';
          var edit_score = score;
           $("#edit_education_format").dropdown("set selected","precentage");

        }else{
          // alert("CGPA");
           $("#edit_education_format").dropdown("set selected","cgpa");
           var edit_education_format = 'cgpa';
           // alert(score);
           var splitted_score = score.split("/");
          var edit_score = splitted_score[0];
          $('#edit_cgpa_out_of').removeClass('emptyfield');
          var edit_cgpa_out_of = splitted_score[1] ;
          // alert("naya alert yahi hai: "+edit_cgpa_out_of);
          if(edit_cgpa_out_of==10){
            $("#edit_cgpa_out_of").dropdown("set selected", "10");
          }else{
            $("#edit_cgpa_out_of").dropdown("set selected", "5");
          }
            }$('#edit_score').val(edit_score);
      }else {
              alert("Errror");
            }
          })
        // $("#edit_last_used").dropdown("set selected",result[0].skill_name+"");
      //   },400);
      // }    
      //   });
});
*/

Template.edit_educational_details.onRendered(function(){
setTimeout(function(){
    if (GoogleMaps.loaded()) {
      $("#autocomplete8").geocomplete({ details: "form" });
    }
},5000);

});
Template.edit_educational.onRendered(function(){
    
    var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
 Meteor.call('fetch_user_educational_details',url,function(error,result){
  if(result){


  var edit_course = result[0].course;
            var edit_school = result[0].school;
            var edit_board = result[0].board;
            var score = result[0].score;
            var edu_start_month = result[0].edu_start_month;
            var edu_start_year = result[0].edu_start_year;
            var edu_end_month = result[0].edu_end_month;
            var edu_end_year = result[0].edu_end_year;
            var edu_location = result[0].edu_location;
            var hidden_edit_edu_id = result[0]._id;
            alert("End Year" + edu_end_year);
              
        if (isValid(score)) {
          var edit_education_format = 'percentage';
          var edit_score = score;
        }else{
           var edit_education_format = 'cgpa';
           var splitted_score = score.split("/");
          var edit_score = splitted_score[0];
          $('#edit_cgpa_out_of').removeClass('emptyfield');
          var edit_cgpa_out_of = splitted_score[1] ;
          if(edit_cgpa_out_of==10){
            $("#edit_cgpa_out_of").dropdown("set selected", "10");
          }else{
            $("#edit_cgpa_out_of").dropdown("set selected", "5");
          }
        }
            $('#autocomplete8').val(edu_location);
            

            $('#edit_score').val(edit_score);
            $("#edit_education_format").dropdown("set selected", edit_education_format);

            
            // $('#edit_course').val(edit_course);
            $('#edit_course').val(edit_course);
            $('#hidden_edit_edu_id').val(hidden_edit_edu_id);

            $('#edit_school').val(edit_school);
            $('#edit_board').val(edit_board);
            // $('#edit_job_title').val(job_title);
     
      if(edu_end_year == "" || edu_end_year == null || edu_end_year == undefined){
            // $('#edit_end_year').addClass('display_hide');
            // $('#edit_end_month').addClass('display_hide');
            alert("Case 1");
              $("#edit_check_education_edu_2").attr("checked",true);
              // collw();
                                  if(document.getElementById('edit_check_education_edu_2').checked){
                                  // if(document.getElementById('edit_check_education_edu_2').checked){
                        // onchecked_edit_profjr_end_date
                        $('#onchecked_edit_du_end_date').addClass('display_hide');
                        $('#onchecked_edit_du_end_date').removeClass('display_show');
                        // $('#onchecked_edit_du_end_date').removeClass('display_show');
                        // $('#edit_end_month').addClass('display_hide');
            }
        }else{
          alert("Case 2");
              $("#onchecked_edit_edu_end_date_show").attr("checked",false);
              $("#edit_check_education_edu_2").attr("checked",false);
              $('#onchecked_edit_du_end_date').removeClass('display_hide');
              $('#onchecked_edit_du_end_date').addClass('display_show');
            }


            $("#edit_edu_start_month").dropdown("set selected", edu_start_month);
            $("#edit_edu_start_year").dropdown("set selected", edu_start_year);
            $("#edit_edu_end_month").dropdown("set selected", edu_end_month);
            $("#edit_edu_end_year").dropdown("set selected", edu_end_year);
     }
 });
})
function isValid(str)
{
 return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
  }

    Template.edit_educational.events({
       'change #check_education_edu_2' :function () { 
      if(document.getElementById('check_education_edu_2').checked){
      
      $("#onchecked_edu_end_date").addClass('display_hide');
      $("#onchecked_edu_end_date").removeClass('display_show');

      $("#onchecked_edu_end_date_show").addClass('display_show');
      $("#onchecked_edu_end_date_show").removeClass('display_hide');
      
      $("#edu_end_year").val('');
      $("#edu_end_month").val('');
}
    else{
      $("#onchecked_edu_end_date").addClass('display_show');
      $("#onchecked_edu_end_date").removeClass('display_hide');

      $("#onchecked_edu_end_date_show").addClass('display_hide');
      $("#onchecked_edu_end_date_show").removeClass('display_show');

              
     }
},
    'change #edit_check_education_edu_2' :function () { 
      // alert('chekced edit');
      if(document.getElementById('edit_check_education_edu_2').checked){
      
      $("#onchecked_edit_du_end_date").addClass('display_hide');
      $("#onchecked_edit_du_end_date").removeClass('display_show');

      $("#onchecked_edit_edu_end_date_show").addClass('display_show');
      $("#onchecked_edit_edu_end_date_show").removeClass('display_hide');
      
      $("#edit_edu_end_year").val('');
      $("#edit_edu_end_month").val('');
}
    else{
      $("#onchecked_edit_du_end_date").addClass('display_show');
      $("#onchecked_edit_du_end_date").removeClass('display_hide');

      $("#onchecked_edit_edu_end_date_show").addClass('display_hide');
      $("#onchecked_edit_edu_end_date_show").removeClass('display_show');

              
     }
},'click #delete_education': function(){
    
    // alert(skill_id);
 var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
    Meteor.call("remove_education",url,function(error,result){
                 if(result){
                     alert('education Removed');
                     // console.log('Skill Removed');
                     Router.go("/profile");
                  }else{
                     alert('failure');
                     // console.log('error');
                  }
         });
  },
 'click .edit_save_edu': function(event){
        event.preventDefault();
        // alert('edit_award');
        var course = $('#edit_course').val();
        var board = $('#edit_board').val();
        var school = $('#edit_school').val();
        
        var edu_format = $('#edit_education_format_value').val();

        var edu_start_month = $('#edit_edu_start_month').dropdown('get value');
        var edu_start_year = $('#edit_edu_start_year').dropdown('get value');
        var edu_end_month = $('#edit_edu_end_month').dropdown('get value');
        var edu_end_year = $('#edit_edu_end_year').dropdown('get value');
        
        var education_format = $('#edit_education_format').dropdown('get value');
        

       
        var edu_location = $('#autocomplete8').val();
         // alert(edu_start_month+edu_start_year+edu_end_month+edu_end_year+edu_location);
        if(course == null || course == "")
        {
          $('#edit_course').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_course').removeClass('emptyfield');
        }
                if(board == null || board == "")
        {
          $('#edit_board').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_board').removeClass('emptyfield');
        }

        if(school == null || school == "")
        {
          $('#edit_school').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_school').removeClass('emptyfield');
        }

        if(edu_start_year == null || edu_start_year == "")
        {
          $('#edit_edu_start_year').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_edu_start_year').removeClass('emptyfield');
        }
        if(edu_start_month == null || edu_start_month == "")
        {
          $('#edit_edu_start_month').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_edu_start_month').removeClass('emptyfield');
        }
        
        if(edu_location == null || edu_location == "")
        {
          $('#autocomplete8').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#autocomplete8').removeClass('emptyfield');
        }
        
 
//Start script for percentage and cgpa

if(document.getElementById('edit_check_education_edu_2').checked){
  $("#edit_edu_end_month").removeClass('red-border'); 
  $("#edit_edu_end_year").removeClass('red-border'); 
  edu_end_month = "";
  edu_end_year = "";
  } 
  else
{
      if (edu_end_month ==null || edu_end_month =="" )
    {
    $("#edit_edu_end_month").focus().addClass('red-border');
      return false;
      }
    else{
    $("#edit_edu_end_month").removeClass('red-border');  
    }
      if (edu_end_year ==null ||  edu_end_year =="" )
    {
    $("#edit_edu_end_year").focus().addClass('red-border');
      return false;
      }
    else{
    $("#edit_edu_end_year").removeClass('red-border');  
    } 
  
   if(edu_start_year > edu_end_year || edu_start_year == edu_end_year)
  {
    alert("Start Year cant be greater than End Year");
    $("#edit_edu_start_year").focus().addClass('red-border');
      return false;
  }   
}
// End script for percentage and cgpa

// start script for percentage and cgpa
   if(education_format =="percentage")
   {
     
  var edu_grade = $("#edit_score").val();
      edu_grade = jQuery.trim(edu_grade);
    if(!edu_grade.match(/^\d+$/))
  {
    alert("number can only be integer");  
    $("#edit_score").focus().addClass('emptyfield');
    return false;   
  }
  else if(edu_grade > 100)
  {
    alert("% cant be greater then 100");
    $("#edit_score").focus().addClass('emptyfield');
    return false;
  }
  var msg6 = edu_grade;
   }
  else if(education_format == "cgpa")
  {     
  var edu_grade =  parseInt($("#edit_score").val());
  edu_grade = jQuery.trim(edu_grade);  
  
  // var cgpa_out_of =  $('#edit_cgpa_out_of').dropdown('get value');
var edit_cgpa_out_of = $('#edit_cgpa_out_of').dropdown('get value');
  cgpa_out_of =  parseInt(edit_cgpa_out_of);
  // alert('cgpa out of : '+ cgpa_out_of);
        if(cgpa_out_of == null || cgpa_out_of == "")
        {
          $('#edit_cgpa_out_of').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_cgpa_out_of').removeClass('emptyfield');
        }
  //if(!tm1.match(/^\d+$/) && !tm1.val().indexOf('.') != -1)
  if(!edu_grade.match(/^\d+$/))
  {
    alert("number can only be integer");  
    $("#edit_score").focus().addClass('emptyfield');
    return false;
  }
  //alert(tm1+tm2);
  if(edu_grade > cgpa_out_of)
  {
    alert("Cgpa cant be greater then "+ cgpa_out_of);
    //alert(tm2 +tm1);
    $("#edit_score").focus().addClass('emptyfield');
    return false;
  }
  $("#edit_score").removeClass('emptyfield');
  var msg6 = edu_grade+'/'+cgpa_out_of;
  //alert(msg6);
  }

  var score = msg6;
  // alert("scored :"+score);
//end script for cgpa and percentage        
        var edit_id = $("#hidden_edit_edu_id").val();    
        var user_id = Session.get("userId");
        // alert(edit_id+course+board+school+score+edu_start_month+edu_start_year+edu_end_month+edu_end_year+edu_location);
        Meteor.call('update_education',edit_id,course,board,school,score,
          edu_start_month,edu_start_year,edu_end_month,edu_end_year,edu_location,function(error,result){
          if(error){
            // alert('error');
            console.log('error');
          }else{
            alert('sucessfully updated education');
             window.location.reload();
            console.log(result + 'sucessfully updated education');
          }
        });
        
        // alert('education inserted');
        $('.modal').modal('close');
        // var course = $('#course').val();
        // var board = $('#board').val();
        // var school = $('#school').val();

        // $('#edu_start_month').val('');
        // $('#edu_start_year').val('');
        // $('#edu_end_month').val('');
        // $('#edu_end_year').val('');
        // $('#autocomplete7').val('');
        $(".form_reset").trigger('reset');
        Router.go("/profile");
        location.reload();
  }

    });

Meteor.startup(function() {  
      GoogleMaps.load();
     
    });
