import { Template } from 'meteor/templating';
import { UserSkill } from './../../import/collections/insert.js';

Meteor.startup(function() {  
      GoogleMaps.load();
    });



Template.add_professional.onRendered(function(){
    setTimeout(function(){
    if (GoogleMaps.loaded()) {
      $("#autocomplete6").geocomplete({ details: "form" });
    }
},5000);
});

Template.add_professional.events({
   'change #check_experience' :function () { 
      // alert('chekced');
      if(document.getElementById('check_experience').checked){
      
      $("#onchecked_profjr_end_date").addClass('display_hide');
      $("#onchecked_profjr_end_date").removeClass('display_show');

      $("#onchecked_profjr_end_date_show").addClass('display_show');
      $("#onchecked_profjr_end_date_show").removeClass('display_hide');
      
      $("#end_year").val('');
      $("#end_month").val('');
}
    else{
      $("#onchecked_profjr_end_date").addClass('display_show');
      $("#onchecked_profjr_end_date").removeClass('display_hide');

      $("#onchecked_profjr_end_date_show").addClass('display_hide');
      $("#onchecked_profjr_end_date_show").removeClass('display_show');

              
     }
},

  'click .add_profjr': function(event){
        event.preventDefault();
        var company_name = $('#company_name').val();
        var job_title = $('#job_title').val();

        // var start_month = $('#start_month').val();
        // var start_year = $('#start_year').val();
        // var end_month = $('#end_month').val();
        // var end_year = $('#end_year').val();
       
        var start_month = $('#start_month').dropdown('get value');
        var start_year = $('#start_year').dropdown('get value');
        var end_month = $('#end_month').dropdown('get value');
        var end_year = $('#end_year').dropdown('get value');
       
        var Job_location = $('#autocomplete6').val();
        // var skill_used = $('#skill_used').val();
        var skill_used = $('#skill_used').val();
        var key_responsibilities = $('#key_responsibilities').val();
        var job_type = $('#job_type').dropdown('get value');
        
         // alert(skill_used);

        if(company_name == null || company_name == "")
        {
          $('#company_name').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#company_name').removeClass('emptyfield');
        }
        if(job_title == null || job_title == "")
        {
          $('#job_title').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#job_title').removeClass('emptyfield');
        }

        if(start_month == null || start_month == "")
        {
          $('#start_month').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#start_month').removeClass('emptyfield');
        }
        if(start_year == null || start_year == "")
        {
          $('#start_year').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#start_year').removeClass('emptyfield');
        }
        if(Job_location == null || Job_location == "")
        {
          $('#autocomplete6').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#autocomplete6').removeClass('emptyfield');
        }
        if(skill_used == null || skill_used == "")
        {
          $('#skill_used').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#skill_used').removeClass('emptyfield');
        }
        if(key_responsibilities == null || key_responsibilities == "")
        {
          $('#key_responsibilities').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#key_responsibilities').removeClass('emptyfield');
        }    
//for checkbox validation
    if(document.getElementById('check_experience').checked){
  $("#end_month").removeClass('emptyfield'); 
  $("#end_year").removeClass('emptyfield'); 
  } 
  else
{
  // alert('way2');
      if (end_month ==null || end_month =="" )
    {
    $("#end_month").focus().addClass('emptyfield');
      return false;
      }
    else{
    $("#end_month").removeClass('emptyfield');  
    }
      if (end_year==null || end_year=="" )
    {
    $("#end_year").focus().addClass('emptyfield');
      return false;
      }
    else{
    $("#end_year").removeClass('emptyfield');  
    } 
  
   if(start_year > end_year || start_year == end_year)
  {
    alert("End Year cant be greater than Start Year");
    $("#end_year").focus().addClass('emptyfield');
      return false;
  } 
}
        // alert('above profjr');
        var user_id = Session.get("userId");

        // alert(company_name,job_title,start_month,start_year,end_month,end_year,Job_location,skill_used,key_responsibilities,job_type,user_id);
        Meteor.call('insert_profjr',company_name,job_title,start_month,start_year,end_month,end_year,Job_location,skill_used,key_responsibilities,job_type,user_id,function(error,result){
          if(error){
            alert("Error");
          }else{  
                    Router.go("/profile");
                    $("#start_month").dropdown("set selected", "");
                    $("#end_month").dropdown("set selected", "");
                    $("#end_year").dropdown("set selected", "");
                    $("#start_year").dropdown("set selected", "");
                    $("#job_type").dropdown("set selected", "");
                    $(".form_reset").trigger('reset');
          }
        });
        // alert('inserted');
       

        // $('#company_name').val();
        // $('#job_title').val();

               
        // $('#autocomplete6').val();
        // $('#skill_used').val();
        // $('#key_responsibilities').val();
        // $('#job_type').val();


  },
});