import { Template } from 'meteor/templating';
import { UserSkill } from './../../import/collections/insert.js';

import { ReactiveVar } from 'meteor/reactive-var';
import { Base64 } from 'meteor/ostrio:base64';





Template.edit_skills.onRendered(function(){
        var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        Meteor.call('fetch_user_skills',url,function(error,result){
          if(error){
            alert("error");
          }else{
        setTimeout(function(){
          $('#edit_awd_expert_value').val(result[0].awd_expert);
        $('#edit_last_used_value').val(result[0].last_used);
        $('#edit_skill_name').val(result[0].skill_name);
         $("#edit_awd_expert").dropdown("set selected",result[0].awd_expert+"");
        $("#edit_last_used").dropdown("set selected",result[0].last_used+"");
        // $("#edit_last_used").dropdown("set selected",result[0].skill_name+"");
        },400);
      }    
        });
});

Template.edit_skills.events({

  'click #delete_skill': function(){
    var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
    var skill_id = url;
    alert(skill_id);
    Meteor.call("remove_skill",skill_id,function(error,result){
                 if(result){
                     alert('Skill Removed');
                     Router.go("/profile");
                     // console.log('Skill Removed');
                  }else{
                     alert('failure');
                     // console.log('error');
                  }
         });

  },
  'click #edit_save_skill': function(event){
        
        event.preventDefault();
        var awd_expert = $('#edit_awd_expert_value').val();
        var last_used = $('#edit_last_used_value').val();
        var skill_name = $('#edit_skill_name').val();

        if(awd_expert == null || awd_expert == "")
        {
          $('#edit_awd_expert').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_awd_expert').removeClass('emptyfield');
        }
                if(last_used == null || last_used == "")
        {
          $('#edit_last_used').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_last_used').removeClass('emptyfield');
        }

        if(skill_name == null || skill_name == "")
        {
          $('#edit_skill_name').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#edit_skill_name').removeClass('emptyfield');
        }
        var user_id = Session.get("userId");

        var userId = Session.get("userId");
         
        var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
         var edit_id = url;

        // var edit_id = $('#hidden_edit_skill_name').val();
        // alert('update skill 2');
        alert(edit_id+awd_expert+last_used+skill_name);
        Meteor.call('update_skill',edit_id,awd_expert,last_used,skill_name,function(error,result){
                 if(result){
                     // alert('Skill Sucessfully insert');
                     console.log('Skill Sucessfully insert');
                     Router.go("/profile");
                  }else{
                     // alert('failure');
                     console.log('error');
                  }
         });
  }
});