
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { UserInfo }  from './../../../import/collections/insert.js';
import { Privacy } from './../../../import/collections/insert.js';


Template.edit_useragreement.onRendered(function() {
  
      var edit_type = "useragreement"; 
       Meteor.call("fetch_privacy_content",edit_type,function(error,result){
       if(error){
           alert("Error Occured while fetching data");
       }else{
              if(result == ""){
                   return false;
               }else{
                console.log("user_agreement_content");
                console.log(result[0].privacy_content);
                $('#edit_privacy').trumbowyg('html', result[0].privacy_content);
               }
        }
    });
         
});

// Template.edit_useragreement.helpers({
//   edit_privacy_array(){
//     // alert("hera");
//     var result = Privacy.find({ edit_type: "useragreement" }).fetch();
//     // alert( JSON.stringify(result) );
//     return result;
//   },

// });

Template.edit_useragreement.events({

  "click #cancelBack": function(){
     Router.go('/settings');     
  },

  "click #save_edit_privacy": function(){

        // var userId = Session.get("userId");
        var edit_privacy = $("#edit_privacy").val();
        
        Meteor.call('update_useragreement',edit_privacy,function(error,result){
          if(error){
            // alert('error');
            console.log('error');
          }
          else{
            // alert('Sucess');
            console.log('Sucess');
            Router.go('/settings');
          }
        });
    
  },


});