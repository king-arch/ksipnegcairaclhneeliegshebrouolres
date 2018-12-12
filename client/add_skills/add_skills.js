import { UserSkill } from './../../import/collections/insert.js';
import { Template } from 'meteor/templating';


Template.add_skill.helpers({
    show_skills(){
      var user_id = Session.get("userId");
       var result =  UserSkill.find({user_id: user_id});
       return result;
    },
    skill_gif(awd_expert){
   var awd_expert = awd_expert;
      if(awd_expert == 'Beginner'){
         return '/uploads/skill/beginner.gif';
      }
      else if(awd_expert == 'Middle'){
        return '/uploads/skill/middle.gif';
      }
      else if(awd_expert == 'Expert'){
        return '/uploads/skill/expert.gif';
      }
    }
});


Template.add_skill.events({
  'click #save_skill': function(event){
    	alert("save_skill");
        event.preventDefault();
    
        // var awd_expert = $('#awd_expert').dropdown('get value');
        var awd_expert = $('#awd_expert_value').val();	
        var last_used = $('#last_used_value').val();
        var skill_name = $('#skill_name').val();

        if(awd_expert == null || awd_expert == "")
        {
          $('#awd_expert').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#awd_expert').removeClass('emptyfield');
        }
                if(last_used == null || last_used == "")
        {
          $('#last_used').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#last_used').removeClass('emptyfield');
        }

        if(skill_name == null || skill_name == "")
        {
          $('#skill_name').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#skill_name').removeClass('emptyfield');
        }
        var userId = Session.get("userId");
        Meteor.call('insert_skill',userId,awd_expert,last_used,skill_name,function(error,result){
                 if(error){
                     // alert('Skill Sucessfully insert');
                     console.log('error');
                  }else{
						Router.go('/profile');
                  }          
        });

       
  },
  'click #edit_save_skill': function(event){
    
        // alert('update skill');
        event.preventDefault();
        // alert('hello');
        // var awd_expert = $('#edit_awd_expert').val();
        // var last_used = $('#edit_last_used').val();
        var awd_expert = $('#edit_awd_expert').dropdown('get value');
        var last_used = $('#edit_last_used').dropdown('get value');

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
        var edit_id = $('#hidden_edit_skill_name').val();
        // alert('update skill 2');
        alert(edit_id+awd_expert+last_used+skill_name);
        Meteor.call('update_skill',edit_id,awd_expert,last_used,skill_name,function(error,result){
                 if(result){
                     // alert('Skill Sucessfully insert');
                     console.log('Skill Sucessfully insert');
                  }else{
                     // alert('failure');
                     console.log('error');
                  }
         });
        $('.modal').modal('close');
        $(".form_reset").trigger('reset');
  },

  'click #delete_skill': function(){
    var skill_id = $('#hidden_edit_id_forskill').val();
    // alert(skill_id);
    Meteor.call("remove_skill",skill_id,function(error,result){
                 if(result){
                     alert('Skill Removed');
                     // console.log('Skill Removed');
                  }else{
                     alert('failure');
                     // console.log('error');
                  }
         });
    $('.modal').modal('close');
  }
});
