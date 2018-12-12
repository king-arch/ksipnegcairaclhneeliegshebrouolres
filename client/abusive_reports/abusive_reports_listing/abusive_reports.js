import { AbusiveContent } from './../../../import/collections/insert.js';
import { Comment } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';


Template.abusiveReports.onRendered(function(){
  if(Session.get("userId")!="user_admin"){
    Router.go("/hub");
    return false;
  }
  Meteor.subscribe("fetch_abusive_content");
  Session.set("active_abusive_panel","Active Abusive posts");
});

Template.abusiveReports.helpers({
  "active_abusive_panel":function(){
    return Session.get("active_abusive_panel");  
  },
  "fetch_abusive_content":function(){
   var allAbusiveContent;
    if(Session.get("active_abusive_panel")=="Active Abusive posts"){
    allAbusiveContent = AbusiveContent.find({abusive_content_type:"post",is_active : 1}, { sort: {created_at: -1 }}).fetch();
    }else if(Session.get("active_abusive_panel")=="Deleted Abusive posts"){
      allAbusiveContent = AbusiveContent.find({abusive_content_type:"post",is_active : 0},{ sort: {created_at: -1 }}).fetch();
    }else if(Session.get("active_abusive_panel")=="Active Abusive comments"){
      allAbusiveContent = AbusiveContent.find({abusive_content_type:"comment",is_active : 1},{ sort: {created_at: -1 }}).fetch();
    }else{
      allAbusiveContent = AbusiveContent.find({abusive_content_type:"comment",is_active : 0},{ sort: {created_at: -1 }}).fetch();
    }
    return allAbusiveContent;
  },
  "fetch_comment_content":function(comment_id){
    Meteor.subscribe("comment_based_on_comment_id",comment_id)
    var commentContent= Comment.find({comment_id:comment_id}).fetch();
    if(commentContent[0]){
      return commentContent[0].comment_txt;
    }
  },"fetch_total_times_abused":function(post_id){
      return AbusiveContent.find({post_id:post_id}).count();
  },
  calculate_time_difference(a){
    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
   var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  var hours = (millis / (1000 * 60 * 60)).toFixed(1);
 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);

   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + 'm';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + 'h';
        }else{ 
        return Math.floor(hours) + 'h';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +"d";
    }else{
    return Math.floor(days) +"d";
    }
  }
  else{    
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds ;
  }
}
});

Template.abusiveReports.events({
  "click #active_abusive_posts":function(events){
    events.preventDefault();
  Session.set("active_abusive_panel","Active Abusive posts");
  }, "click #deleted_abusive_post":function(events){
    events.preventDefault();
  Session.set("active_abusive_panel","Deleted Abusive posts");
  },
  "click #active_abusive_comments":function(events){
    events.preventDefault();;
  Session.set("active_abusive_panel","Active Abusive comments");
  },"click #deleted_abusive_comment":function(events){
    events.preventDefault();
  Session.set("active_abusive_panel","Deleted Abusive comments");
  },"click .visit_page":function(events){
        events.preventDefault();
      var post_id= Base64.encode(this.abusive_parent_post);
      if(this.abusive_content_type  == "post"){ 
         Router.go('/post_detail_admin/'+post_id+"/post");
      }else{
         Router.go('/post_detail_admin/'+post_id+"/"+this.post_id);
      }
  }
})