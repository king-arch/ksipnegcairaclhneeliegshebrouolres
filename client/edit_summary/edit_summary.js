import { Template } from 'meteor/templating';

import { UserInfo } from './../../import/collections/insert.js';

Template.edit_summary_details.helpers({
  display_summary: function(){
  var user_id = Session.get("userId");
    var summary_1 = UserInfo.find({user_id: user_id});
    // postCreatorName[0].name
    return summary_1;
  }
})
Template.edit_summary_details.events({
  'click #save_summary': function(event){
        event.preventDefault();
        // alert('hello');
        var summary = $('#summary').val();
        //alert(summary_text);
        if(summary == null || summary == "")
        {
          $('#summary').addClass('emptyfield').focus();
          return false; 
        }
        else{
          $('#summary').removeClass('emptyfield');
        }
        var userId = Session.get("userId");
        Meteor.call('update_summary',userId,summary,function(error,result){
          if(error){

            console.log('error');
          }
          else{
              console.log('Sucess');
              Router.go("/profile");
          }
        });

  }
});