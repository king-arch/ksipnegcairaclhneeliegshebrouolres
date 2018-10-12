import { Template } from 'meteor/templating';
import { UserSkill } from './../../import/collections/insert.js';

Meteor.startup(function() {  
      GoogleMaps.load();
    });



Template.edit_professional_details_temp.onRendered(function(){
        var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
       
          
        Meteor.call('fetch_user_professional_details',url,function(error,result){
          if(error){
            alert("error");
          }else{
        setTimeout(function(){
          var company_name = result[0].company;
            var job_title = result[0].title;
            var autocomplete5 = result[0].location;
            var hidden_profjr_id = result[0]._id;
            var skill_used = result[0].skill;
            var key_responsibilities = result[0].key_responsibilities;

            var start_month = result[0].start_month;
            var start_year = result[0].start_year;
            var end_month = result[0].end_month;
            var end_year = result[0].end_year;
            var job_type = result[0].job_type;

            $("#edit_start_month").dropdown("set selected", start_month);
            $("#edit_start_year").dropdown("set selected", start_year);
            $("#edit_end_month").dropdown("set selected", end_month);
            $("#edit_end_year").dropdown("set selected", end_year);
            $("#edit_job_type").dropdown("set selected", job_type);
            $('#edit_company_name').val(company_name);
            $('#edit_job_title').val(job_title);
            $('#autocomplete5').val(autocomplete5);
            $('#hidden_profjr_id').val(hidden_profjr_id);
            $('#edit_skill_used').val(skill_used);
            $('#edit_key_responsibilities').val(key_responsibilities);
            if(end_year == "" || end_year == null || end_year == undefined){
              $("#edit_check_experience").attr("checked",true);
          if(document.getElementById('edit_check_experience').checked){
              $('#onchecked_edit_profjr_end_date').addClass('display_hide');
              $('#edit_end_month').removeClass('display_show');
            }
        }else{
              $("#edit_check_experience").attr("checked",false);
              $('#onchecked_edit_profjr_end_date').removeClass('display_hide');
              $('#edit_end_month').addClass('display_show');              
            }
        },400);
      }    
        });
});


Template.edit_professional_details_temp.onRendered(function(){
    setTimeout(function(){
    if (GoogleMaps.loaded()) {
      // $("#autocomplete5").geocomplete({ details: "form" });
    }
},5000);
});

Template.edit_professional_details_temp.events({
  
    'change #edit_check_experience' :function () { 
      // alert('chekced');
      if(document.getElementById('edit_check_experience').checked){
        
      $("#onchecked_edit_profjr_end_date").addClass('display_hide');
      $("#onchecked_edit_profjr_end_date").removeClass('display_show');

      $("#onchecked_edit_profjr_end_date_show").addClass('display_show');
      $("#onchecked_edit_profjr_end_date_show").removeClass('display_hide');
      
      $("#edit_end_year").val('');
      $("#edit_end_month").val('');
}
    else{
      $("#onchecked_edit_profjr_end_date").addClass('display_show');
      $("#onchecked_edit_profjr_end_date").removeClass('display_hide');

      $("#onchecked_edit_profjr_end_date_show").addClass('display_hide');
      $("#onchecked_edit_profjr_end_date_show").removeClass('display_show');

              
     }
},
 'click .update_professional_details':function(event){          
    

      event.preventDefault();
        // alert('hello');
        var company_name = $('#edit_company_name').val();
        var job_title = $('#edit_job_title').val();
        var start_month = $('#edit_start_month').dropdown('get value');
        var start_year  = $('#edit_start_year').dropdown('get value');
        var end_month   = $('#edit_end_month').dropdown('get value');
        var end_year    = $('#edit_end_year').dropdown('get value');

        var Job_location = $('#autocomplete5').val();
        var skill_used = $('#edit_skill_used').val();
        var key_responsibilities = $('#edit_key_responsibilities').val();
        var job_type = $('#edit_job_type').val();
        // alert(start_year);

        if(company_name == null || company_name == "")
        {
          $('#edit_company_name').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_company_name').removeClass('emptyfield');
        }
                if(job_title == null || job_title == "")
        {
          $('#edit_job_title').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_job_title').removeClass('emptyfield');
        }

        if(start_month == null || start_month == "")
        {
          $('#edit_start_month').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_start_month').removeClass('emptyfield');
        }
        if(start_year == null || start_year == "")
        {
          $('#edit_start_year').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_start_year').removeClass('emptyfield');
        }
        if(Job_location == null || Job_location == "")
        {
          $('#autocomplete5').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#autocomplete5').removeClass('emptyfield');
        }
        if(skill_used == null || skill_used == "")
        {
          $('#edit_skill_used').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_skill_used').removeClass('emptyfield');
        }
        if(key_responsibilities == null || key_responsibilities == "")
        {
          $('#edit_key_responsibilities').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_key_responsibilities').removeClass('emptyfield');
        }
 

    if(document.getElementById('edit_check_experience').checked){
         
  $("#edit_end_month").removeClass('emptyfield'); 
  $("#edit_end_year").removeClass('emptyfield'); 
      end_month = "";
      end_year = "";
  } 
  else
{
      if (end_month ==null || end_month =="" )
    {
    $("#edit_end_month").focus().addClass('emptyfield');
      return false;
      }
    else{
    $("#edit_end_month").removeClass('emptyfield');  
    }
      if (end_year==null || end_year=="" )
    {
    $("#edit_end_year").focus().addClass('emptyfield');
      return false;
      }
    else{
    $("#edit_end_year").removeClass('emptyfield');  
    } 
  
   if(start_year > end_year || start_year == end_year)
  {
    alert("End Year cant be greater than Start Year");
    $("#edit_end_year").focus().addClass('emptyfield');
      return false;
  } 
}



    var edit_id = $('#hidden_profjr_id').val();
       
     Meteor.call('update_profjr',edit_id,company_name,job_title,start_month,start_year,end_month,end_year,Job_location,
          skill_used,key_responsibilities,job_type,function(error,result){
                if(error){
                  // alert('Error at 2');
                  console.log('error');
                  alert('error');
                }else{
                  // alert('update professional jr');
                  console.log('update professional jr');
                  Router.go("/profile");
                  }
          });
  
    },
       'click #delete_profjr': function(){
      var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
       
          
    Meteor.call("remove_profjr",url,function(error,result){
                 if(result){
                     alert('professional Removed');
                     // console.log('Skill Removed');
                  }else{
                    Router.go("/profile");
                     // console.log('error');
                  }
         });
     }
});