import { Template } from 'meteor/templating';
import { UserInfo } from './../../import/collections/insert.js';

Template.passion_details.onRendered(function(){
    var user_id = Session.get("userId");
  /*  Meteor.call("get_user_information",user_id,function(result,error){
    if(!result[0].passion){
     $('.yyy').material_chip({
        data: []
      });      
    }else{
      var all_passion = result[0].passion;
      var myData = all_passion.split(",");
      var content = [];
      for(var i=0;i<myData.length;i++){
        content.push({tag:myData[i]})
      }
      $('.yyy').material_chip({
      data: content
      });
      }  
    }  )    
    */
    var userInfo = UserInfo.find({"user_id":user_id}).fetch();
     if(!userInfo[0].passion){
     $('.yyy').material_chip({
        data: []
      });      
    }else{
      var all_passion = userInfo[0].passion;
      var myData = all_passion.split(",");
      var content = [];
      for(var i=0;i<myData.length;i++){
        content.push({tag:myData[i]})
      }
      $('.yyy').material_chip({
      data: content
      });
    }  

});

Template.passion_details.events({
 'click #save_passion': function(){
   var data= $('#chips_check').material_chip('data');
    var passion = "";
    for(var i=0;i<data.length;i++){
        passion = passion + data[i].tag+ ",";    
    }
    if(passion==""){
      alert("Value Could not be empty");
    return false;  
    }else{ 
    passion = passion.substring(0, passion.length - 1);
    }

    alert(passion);
    var userId = Session.get("userId");
    Meteor.call('update_passion',userId,passion,function(error,result){
          if(error){
            console.log('error');
          }
          else{
            console.log('Sucess');
          }
        });

    }
 });  
