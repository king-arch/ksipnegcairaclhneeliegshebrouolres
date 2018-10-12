import { Template } from 'meteor/templating';

Meteor.startup(function() {  
      GoogleMaps.load();
});

Template.edit_achive.onRendered(function(){
setTimeout(function(){
    if (GoogleMaps.loaded()) {
      $("#autocomplete2").geocomplete({ details: "form" });
    }
},5000);
  var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];

         Meteor.call('fetch_user_archeivement',url,function(error,result){
          if(error){
            alert("error");
          }else{
            console.log(result);            
        setTimeout(function(){
            var awd_type = result[0].type;
            var description = result[0].description;
            var awd_month = result[0].awd_month;
            var awd_year = result[0].awd_year;
            


            var awd_location = result[0].location;
            var hidden_id = result[0]._id;

            $('#edit_description').val(description);

            $("#edit_awd_type").dropdown("set selected", awd_type);  
            $("#edit_awd_month").dropdown("set selected", awd_month);
            $("#edit_awd_year").dropdown("set selected", awd_year);

            $('#autocomplete2').val(awd_location);
            $('#hidden_edit_awd_id').val(hidden_id);

        },400);
      }    
        });

})
 
Template.edit_achive.events({
  'click #edit_save_award': function(event){
        // alert('award');
        event.preventDefault();
        // alert('hello');
        // var awd_type = $('#edit_awd_type').val();
        var awd_type = $('#edit_awd_type').dropdown('get value');
        var description = $('#edit_description').val();

        var awd_month = $('#edit_awd_month').dropdown('get value');
        var awd_year = $('#edit_awd_year').dropdown('get value');

        // var awd_month = $('#edit_awd_month').val();
        // var awd_year = $('#edit_awd_year').val();

        var awd_location = $('#autocomplete2').val();

        if(awd_type == null || awd_type == "")
        {
          $('#edit_awd_type').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_awd_type').removeClass('emptyfield');
        }
        
        if(description == null || description == "")
        {
          $('#edit_description').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_description').removeClass('emptyfield');
        }

        if(awd_month == null || awd_month == "")
        {
          $('#edit_awd_month').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_awd_month').removeClass('emptyfield');
        }

        if(awd_year == null || awd_year == "")
        {
          $('#edit_awd_year').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_awd_year').removeClass('emptyfield');
        }

        if(awd_location == null || awd_location == "")
        {
          $('#autocomplete2').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#autocomplete2').removeClass('emptyfield');
        }
        
          var userId = Session.get("userId");
          var edit_id = $('#hidden_edit_awd_id').val();
          // alert(edit_id);
          Meteor.call('update_awd',userId,edit_id,awd_type ,description,awd_month,awd_year,awd_location, function(error,result){
          if(error){
            // alert('error');
            console.log('error');
          }else{
            // alert('Suceesfully updated');
      Router.go("/profile");
          }
          });  
      },
          'click #delete_award': function(){
          alert('ddd');
             var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
         var awd_id =url;
             Meteor.call("remove_award",awd_id,function(error,result){
                 if(result){
                        Router.go("/profile")
                     // console.log('Skill Removed');
                  }else{
                     alert('failure');
                     // console.log('error');
                  }
         });

  }
});