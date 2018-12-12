
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { Emembers } from './../../../import/collections/insert.js';
import { Event } from './../../../import/collections/insert.js';
import { Session } from 'meteor/session';
import { Comment } from './../../../import/collections/insert.js';
import { Like } from './../../../import/collections/insert.js';
import { Notifications } from './../../../import/collections/insert.js';

//document.title = "Special Neighbourhood | Edit Event";

Template.eventdetail.onDestroyed(function(){
detailed_event_subscription.stop();
all_comments.stop();
all_likes.stop();
all_friend_users.stop();
});

let detailed_event_subscription;
let all_likes;
let all_comments;
let all_friend_users;

Template.eventdetail.onRendered(function(){
  
         var url = window.location.href;
        var new_url = url.split("/");
        url = new_url[new_url.length-1];
        var event_id = Base64.decode(url); 

        Session.set("show_event_id",event_id);
        
  detailed_event_subscription = Meteor.subscribe("detailed_event_subscription",event_id); 

 all_likes = Meteor.subscribe("all_likes");
all_comments = Meteor.subscribe("all_comments");
all_friend_users = Meteor.subscribe("all_friend_users");

  setInterval(function(){
   var start_date = $('#start_date').val();
       if(start_date!=undefined && start_date!=null && start_date!=""){
       if(!start_date.includes(",")){
       Session.set("changed_format_date_start_date",start_date);
       var changed_format_date_start_date = moment(start_date).format('MMM DD, YYYY'); 
       $('#start_date').val(changed_format_date_start_date +"");
   }
 }

   var end_date = $('#end_date').val();
       if(end_date!=undefined && end_date!=null && end_date!=""){
       if(!end_date.includes(",")){
       Session.set("changed_format_date_end_date",end_date);
       var changed_format_date_end_date = moment(end_date).format('MMM DD, YYYY'); 
       $('#end_date').val(changed_format_date_end_date +"");
   }
 }   
  }, 300);

  setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    Meteor.subscribe("user_info_based_on_id",logged_in_User);

    var result = UserInfo.find({user_id: logged_in_User}).fetch();
if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("body_bg");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("body_bg");
    
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("body_bg");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("body_bg");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");

      $('.page_wh').addClass("body_bg");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");
             
     } 
  }
}, 3000);

});


Template.eventdetail.onCreated(function(){
Session.set("count_of_invite",0);
Session.set("count_of_attending",0);
this.reply_comment_show_limit = new ReactiveVar("");

});

    Template.registerHelper('equals', function (a, b) {
      return a === b;
    });


Meteor.startup(function() {  
      GoogleMaps.load();
    });

Template.eventdetail.onCreated(function() {
Blaze._allowJavascriptUrls();
});

Template.eventdetail.helpers({
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
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
      }
  },

  event_start_date(){

return moment(this.event_start_date).format('MMM DD, YYYY');

},

  event_end_date(){

return moment(this.event_end_date).format('MMM DD, YYYY');

},

  'show_event_details': function(){

     var event_id = Session.get("show_event_id");  
     var result = Event.find({event_id: event_id}).fetch();

     return result; 
  },

  show_event_creater(){

    var user_id = this.event_admin;
    Meteor.subscribe("user_info_based_on_id",user_id);
    var result = UserInfo.find({user_id: user_id});

    return result;
  },

  show_comment_lvl0(){

      comment_by = Session.get("userId");
      var event_id = Session.get("show_event_id");

      var result = Comment.find({event_id: event_id, comment_type: 'orignal',commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch()
      return result;
     },

     show_comment_reply(){

      comment_by = Session.get("userId");
      var event_id = Session.get("show_event_id");
       
      const t = Template.instance();

      if(t.reply_comment_show_limit.get() == ""){
        var result = Comment.find({event_id: event_id, comment_type: 'reply',parent: this.comment_id, commentActivityStatus: 0} ,{sort: {createdAt: -1} , limit: 3}).fetch().reverse();
      return result;
      }
      var result = Comment.find({event_id: event_id, comment_type: 'reply',parent: this.comment_id,commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch().reverse();
      return result;

     },

    checkIfEventIsPastEvent(){
   // alert('check if its clear');
          var end_date = this.event_end_date;
          var name = this.event_name;
          var mydate = new Date();
          var str = moment(mydate).format('YYYY MM DD');

          // alert('end_date: '+end_date +'current date: '+str+'name: '+name);
          if(str > end_date){
            // alert('past event check : 1');
              return true;
          }
          else{
            // alert('past event check : 2');
            return false;
          }

            },

     show_commenter_info(){
      var user_id = this.comment_by;
      // alert('a');
      Meteor.subscribe("user_info_based_on_id",user_id);
       var result = UserInfo.find({user_id: user_id}).fetch();
       return result;
     },

     logged_in_user(){
       var user_id = Session.get("userId");
       var result = UserInfo.find({user_id: user_id}).fetch();
       return result;
     },

     show_count(){
      var comment_by = Session.get("userId");
      var event_id = Session.get("show_event_id");

      var result_count = Comment.find({event_id: event_id, comment_type: 'reply',parent: this.comment_id, commentActivityStatus: 0} ,{sort: {createdAt: -1}}).count()
      // console.log(result_count);
      return result_count;
     },

     show_like_count(){
      var liked_by = Session.get("userId");
      var event_id = Session.get("show_event_id");
      var result_count = Like.find({event_id: event_id,like_type: 'main_event'}).count();
        return result_count;

     },
     Like_unlike_txt(){
      var comment_id = this.comment_id;
        var event_id = this.event_id;
        var liked_by = Session.get("userId");
      var result_count = Like.find({like_type: 'event_comment',event_id: event_id,comment_id: comment_id,liked_by: liked_by}).count();
      if(result_count == 0){
        return 'Like';
      }else{
        return 'Liked';
      }
    },

     show_like_count_comment(){
        var comment_id = this.comment_id;
        var event_id = this.event_id;
      var result_count = Like.find({like_type: 'event_comment',event_id: event_id,comment_id: comment_id}).count();
        return result_count;
     },

     Like_unlike_txt_event(){
        var liked_by = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Like.find({event_id: event_id, liked_by: liked_by, like_type: 'main_event'}).count();
        if(result > 0){
              return 'Liked';
          }
          else{
            return 'Like';
          }
     },

     event_description(){
          var description = this.description;
          // return description;
          if(description.length > 565){
                var new_description = description.slice(0,565);
              // $('#read_more_description').removeClass('hide_showmore_comments');
              // $('#read_less_description').addClass('hide_showmore_comments');
              return new_description;
          }
          else{
               // $('#read_more_description').addClass('hide_showmore_comments');
              return description;
              // $('#read_less_description').removeClass('hide_showmore_comments');           
          }
     },
          event_description_full(){
          var description = this.description;
          return description;         
     },

       show_Readless(){
   var description = this.description;
    // alert(summ);
    var count = description.length;
    if(count > 565){
      return true;
    }
    else{
      return false;
    }
  },       

  show_Readmore(){
    var description = this.description;
    // alert(summ);
    var count = description.length;
    // $('#read_more_summary').addClass('hide_redmore');
    // alert('Added');

    if(count > 565){
      return true;
    }
    else{
      return false;
    }

  },


     show_edit_if_creater(){

          var event_creater = Session.get("userId");
          var event_id = Session.get("show_event_id");  
          var result = Event.find({ event_id: event_id, event_admin: event_creater }).count(); 
          if(result > 0){
              return true;
          }
          else{
            return false;
          }

     },

     more_events(){
        var logged_in_user = Session.get("userId");
        var event_array = Event.find({event_admin: {$ne: logged_in_user} },{limit: 5}).fetch();
        return event_array;
     },

     ignore_loggedin_user_created_events(){
        var logged_in_user = Session.get("userId");
        var event_creater = this.user_id;
        var event_id = this._id;
        var currently_open_event_id = Session.get("show_event_id"); 
        // alert(currently_open_event_id+' & '+event_id);

        if(logged_in_user == event_creater ){
          return false;
        }else{
          if(event_id == currently_open_event_id){
            return false;
          }
          return true;
        }
     },

     show_more_comment_reply(){
      var comment_by = Session.get("userId");
      var event_id = Session.get("show_event_id");

      var result_count = Comment.find({event_id: event_id, comment_type: 'reply',parent: this.comment_id, commentActivityStatus: 0} ,{sort: {createdAt: -1}}).count()
      // console.log(result_count);
      // return result_count;

      if(result_count > 3){
        return true;
      }     
      else{
        return false;
      }
     },
     
      show_limit_comment_reply(){
      const t = Template.instance();
     

      if( t.reply_comment_show_limit.get() == ""){
        return true;
      }     
      else{
        return false;
      }
     },

     past_event(){
         // alert('check if its clear');
          var end_date = this.event_end_date;
          var mydate = new Date();
          var str = moment(mydate).format('YYYY MM DD');

          // alert('end_date: '+end_date +'current date: '+str)
          if(str > end_date){
            // alert('past event check : 1');
              return true;
          }
          else{
            // alert('past event check : 2');
            return false;
          }

     },

     check_invite_status(){
        var logged_in_user = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        console.log('result now: ');
        console.log(event_id);
        console.log(result);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var invite_type = result[0].invite_type;

        if(logged_in_user == result[0].event_admin){
          // alert('check_invite_status: 1');
          return false;
        }

        if( (invite_type == 'Public' &&  (invite_accepted == 0 || invite_accepted == "" || 
          !invite_accepted.includes(logged_in_user)) && (invite_rejected == 0 || invite_rejected == "" || 
          !invite_rejected.includes(logged_in_user)) ) || (invite_type == 'Private' && 
          (invite_accepted == 0 || invite_accepted == "" || !invite_accepted.includes(logged_in_user) )
           && (invite_rejected == 0 || invite_rejected == "" || !invite_rejected.includes(logged_in_user) )
            && (invite_list != 0 && invite_list != "" 
            && invite_list.includes(logged_in_user))) ){
          // alert('check_invite_status: 2');
          return true;
        }
         else{
          // alert('check_invite_status: 3');
            return false;
         } 
     },

     check_if_admin(){
        var logged_in_user = Session.get("userId");
        var event_id = Session.get("show_event_id");
         var result = Event.find({event_id: event_id}).fetch();
         if(logged_in_user == result[0].user_id){
            return true;
         }else{
          return false;
         }
     },

     check_accept_status(){
        var logged_in_user = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        // alert('logged_in_user:'+logged_in_user+'invite_list: '+invite_list+'invite_accepted:'+invite_accepted+'invite_rejected: '+invite_rejected);
        if(invite_accepted == 0){
            // alert('check_accept_status: 1');
            return false;
        }else{
        if(invite_accepted.includes(logged_in_user)){
          // alert('check_accept_status: 2');
          return true;
        }
        else{
          // alert('check_accept_status: 3');
          return false;
        }
      }       
     },
     check_accept_status_past(){
        var logged_in_user = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        // alert('logged_in_user:'+logged_in_user+'invite_list: '+invite_list+'invite_accepted:'+invite_accepted+'invite_rejected: '+invite_rejected);
        if(invite_accepted == 0){
            // alert('check_accept_status_past: 1');
            return false;
        }else{
        if(invite_accepted.includes(logged_in_user)){
          // alert('check_accept_status_past: 2');
          return true;
        }
        else{
          // alert('check_accept_status_past: 3');
          return false;
        }
      }       
     },

     check_reject_status(){
        var logged_in_user = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;

        if(invite_rejected.includes(logged_in_user)){ 
          // alert('check_reject_status: 1');
          return true;
        }
        else{
          // alert('check_reject_status: 2');
          return false;
        }
     },
     
     check_invited_count_array(){
        var logged_in_user = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Event.find({event_id: event_id}).fetch();
        return result;
     },

     people_invited_count(){
          var invite_list = this.invite_list;
          if(invite_list == 0 && invite_list == "" ){ 
            return 0;
          }
          else {
          if(invite_list.includes(",")){

          var new_array = invite_list.split(',');
          return new_array.length;
          }
          else{
            return 1;
          }


          }  
     },

     invite_rejected_count(){
          var invite_list = this.invite_accepted;
          
          if(invite_list != undefined && invite_list != null && invite_list != ''){
              var new_array = invite_list.split(',');
              // alert(new_array.length);
              return new_array.length;
          }else{
              return 1;
          }
          
     },

     show_invited_people_list(){
       var type = this.invite_type;
       if(type == 'Public'){
           return false;
         }
       },

       hide_if_event_is_public(){
          var type = this.invite_type;
          if(type == 'Public'){
            return false;
          }
          else{
            return true;
          }
       },

       show_attending_list(){
          var invite_accepted = this.invite_accepted;
          var logged_in_user = Session.get("userId");

          if(invite_accepted != 0 || invite_accepted != ""){
          if(invite_accepted.includes(",")){
              var new_invite_accepted = invite_accepted.split(",");

                     var all_users = new Array();
                     for(var i=0;i<new_invite_accepted.length;i++){
                      Meteor.subscribe("user_info_based_on_id",new_invite_accepted[i]);
                     }
                     
                     for(var i=0;i<new_invite_accepted.length;i++){
                      // if(i==0){
                      //   var users = UserInfo.find({"user_id": this.user_id}).fetch();
                      //   all_users.push(users[0]);
                      // }

                      var users = UserInfo.find({"user_id":new_invite_accepted[i]}).fetch();
                      all_users.push(users[0]);
                     }
                     if(all_users.length == 0){
                      Session.set("count_of_attending",0);
                      return false;
                     }
                     console.log('here');
                     console.log(all_users);
                     Session.set("count_of_attending",all_users.length);
                     return all_users;
                     }
          else if(!invite_accepted.includes(",") ){
            //   var all_users = new Array();
            //             var users = UserInfo.find({"user_id": this.user_id}).fetch();
            //             all_users.push(users[0]);
            // var users = UserInfo.find({"user_id":invite_accepted}).fetch();
            // all_users.push(users[0]);
              Meteor.subscribe("user_info_based_on_id",invite_accepted);
              var d1 = UserInfo.find({"user_id": invite_accepted }).fetch();
              Session.set("count_of_attending",d1.length);
              return d1;
          }
        }
          else{
              Meteor.subscribe("user_info_based_on_id",this.user_id);
              var users = UserInfo.find({"user_id": this.user_id}).fetch();
              Session.set("count_of_attending",users.length);
              return users;
          }
       },

              show_invited_list(){
          var invite_accepted = this.invite_list;
          var logged_in_user = Session.get("userId");
          if(invite_accepted != 0 || invite_accepted != ""){


          if(invite_accepted.includes(",")){
              var new_invite_accepted = invite_accepted.split(",");

                     var all_users = new Array();
                     for(var i=0;i<new_invite_accepted.length;i++){
                         Meteor.subscribe("user_info_based_on_id",new_invite_accepted[i]);
                     }
                     for(var i=0;i<new_invite_accepted.length;i++){
                      var users = UserInfo.find({"user_id":new_invite_accepted[i]}).fetch();
                      all_users.push(users[0]);
                     }
                     if(all_users.length == 0){
                      Session.set("count_of_invite",0);
                      return false;
                     }
                     
                     // var t2 = UserInfo.find({"user_id": invite_accepted }).fetch();
                     Session.set("count_of_invite",all_users.length);
                     return all_users;
                     }
  
          else if(!invite_accepted.includes(",")){
            // var users = UserInfo.find({"user_id":invite_accepted}).fetch();
                Meteor.subscribe("user_info_based_on_id",invite_accepted);
              var t1 = UserInfo.find({"user_id": invite_accepted }).fetch();
              Session.set("count_of_invite",t1.length);
              return t1;
          }
        }
          else{
              return false;
          }
       },

       show_count_of_invite(){
             return Session.get("count_of_invite");
       },

       show_count_of_attending(){
             return Session.get("count_of_attending");
       },

       show_liked_list_2(){
            return Like.find({comment_id: Session.get("save_comment_id")}).fetch();  
       },

       show_count_of_like(){
           var c2 = Like.find({comment_id: Session.get("save_comment_id")}).fetch();  
           return c2.length;
       },

       fetch_user_information(){
              Meteor.subscribe("user_info_based_on_id",this.liked_by);
            return UserInfo.find({"user_id": this.liked_by}).fetch();  
       },

       headline(){
          var headline = this.headline;
          if(headline.length > 35){
            headline = headline.substr(0,35);
            return headline+'...';
          }
          else{
            return headline;
          }
  },

   check_for_edited(comment_id){
    var commentedComment = Comment.find({comment_id: comment_id, commentActivityStatus: 0}).fetch()
    if(commentedComment[0].editedAt)
    {
      return true;
    }
  },


  check_if_commented_by_is_user(comment_by){
// alert('here')
  if(Session.get("userId") == comment_by){
    return true;
  }
},



});

Template.eventdetail.events({

  'mouseover .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).show();
  },

 'mouseout .level_2_commenting_div':function(){
    var comment_id = this.comment_id;
    $("#level_2_commenting_three_dots_"+comment_id).hide();
  },

 'mouseover .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).show();
  },

 'mouseout .parent_div':function(){
    var comment_id = this.comment_id;
    $("#three_dots_"+comment_id).hide();
  },

      'keypress .hidden_comment':function(e){
    var key = e.keyCode;

    // If the user has pressed enter
    if (key == 13) {

       if($("#hidden_comment_"+this.comment_id).is(':focus')){
        var comment_txt = $("#hidden_comment_"+this.comment_id).val();
        var comment_id = this.comment_id;
        Meteor.call("update_commented_text",Session.get("userId"),this.comment_id,comment_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_"+comment_id).addClass("loader_visiblity_block");
             $("#show_comment_"+comment_id).removeClass("loader_visiblity_block");
          }
        })
        return false;
      }else if($("#hidden_comment_level_2_"+this.comment_id).is(':focus')){
        var comment_txt = $("#hidden_comment_level_2_"+this.comment_id).val();
        
        var comment_id = this.comment_id;
        Meteor.call("update_commented_text",Session.get("userId"),this.comment_id,comment_txt,function(error,result){
          if(error){
            alert("Error");
          }else{
          
             $("#hidden_comment_level_2_"+comment_id).addClass("loader_visiblity_block");
             $("#show_comment_level_2_"+comment_id).removeClass("loader_visiblity_block");
          }
        })
        return false;
      }
    }
    else {
        return true;
    }
  },

  'click .edit_comment':function(){
    $("#hidden_comment_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_"+this.comment_id).addClass("loader_visiblity_block ");
  },
  'click .remove_comment':function(){
    // alert(this.comment_id);
    // return false;
    if(confirm("Sure, You want to remove this Comment ?")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"),this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },
  'click .level_2_edit_comment':function(){
    $("#hidden_comment_level_2_"+this.comment_id).removeClass("loader_visiblity_block");
    $("#show_comment_level_2_"+this.comment_id).addClass("loader_visiblity_block ");
  },
  'click .level_2_remove_comment':function(){
    //     alert(this.comment_id);
    // return false;
    if(confirm("Sure, You want to remove this Comment ?")){
      Meteor.call('remove_comment_from_comments',Session.get("userId"), this.comment_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        
      }
    });  
    }
    
  },


     'click #submit_comment': function(){

      var comment_txt = $('#comment').val();
      if(comment_txt == null || comment_txt == "")
        {
          $('#comment').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#comment').removeClass('emptyfield');
        }

    comment_by = Session.get("userId");
      
    /*  var commentcount =  Comment.find({comment_type: 'orignal'}, { sort: {createdAt: 1 }}).fetch();
      // alert(commentcount);
      if(commentcount != '' && commentcount != null && commentcount != undefined ){
        // alert(commentcount);
      var last_comment_id = commentcount[commentcount.length-1].comment_id;
      // if(last_comment_id){
      //   var comment_id_array = last_comment_id.split('_');
      // }

      // var add_count = comment_id_array[1];
      var actual_count = last_comment_id%10000;
      var a1 = actual_count + 1;
      var comment_id = 10000+ a1;
      }
      else{
        // alert(2);
        comment_id = 10001;
      }  */
    var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;
      var event_id = Session.get("show_event_id");
      var parent = 0;
      // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);
      Meteor.call('event_comments',comment_id,event_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');

          }else{
              // sAlert.success('Sucessfully commented',"123");
              console.log('succesfully commented');
              }
      });
      $('#comment').val('');
     },

     'click .submit_comment_lvl1': function(){

      

        var comment_id_from_btn = this.comment_id;
        // alert(' & '+ comment_id_from_btn);
        var get_val = 'commentlvl1_'+comment_id_from_btn;
        var comment_txt = $('#'+get_val).val();
        // alert(get_val+' & '+comment_txt);
  
      if($("#commentlvl1_"+comment_id_from_btn).is(':focus')){

      if(comment_txt == null || comment_txt == "")
        {
          $('#'+get_val).addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#'+get_val).removeClass('emptyfield');
        }
      }
      else{
        return false;
      }

      comment_by = Session.get("userId");
      
      // alert('check_1:comment_id_from_btn: ' + comment_id_from_btn);
      // var commentcount = Comment.find({}).count();
      // var comment_id_from_btn_array = comment_id_from_btn.split('_');
      var k12 = comment_id_from_btn;
      // alert('check_2: k12: ' + k12);
        // var new_count = add_count%10000;
       // var k12 = event.target.comment_1.value;
      //alert(new RegExp('/^' + k12 + '/'))
      //check if there is existing comments in same post
     /* const count3 = Comment.find({comment_id:{$regex:new RegExp('^' + k12 +'_')}, commentActivityStatus: 0}).count(); //like 'pa%'
      //alert('Post id is '+k12+' comment text is '+k14+' and the total post and comment count is '+count3);
      // alert('reply_count: '+count3);
      // return false;
      // alert('check_3:count3: ' + count3);
      var a = 0;
      var count4 = 0;
      if(count3 == 0)
      {
       a = '_1';
       comment_id = k12+a;
      }
      else
       {
        // alert('just checkin: k12: '+k12);
        var count_4 = count3+1;
        a = '_';
        count4 = k12+a+count_4;
        var count5 = Comment.find({comment_id: {$regex:new RegExp('^' + k12)}, commentActivityStatus: 0},{sort: {createdAt: 1}}).fetch(); //like 'pa%'
        // console.log(count5);
        // alert('just checkin: count5: '+count5);
        var old_id = count5[count5.length-1].comment_id;
        // alert('check_4:old_id: ' + old_id);
        var comment_id_for_reply = old_id.split('_');
        // console.log(comment_id_for_reply);
        var k123 = comment_id_for_reply[comment_id_for_reply.length-1];
        // var k123 = parseInt(k123);
        var k123_1 = parseInt(k123)+1;
        a = '_';
        var comment_id = comment_id_from_btn + a + k123_1;  
       }
*/    var comment_id = "comment_id_"+ Math.floor((Math.random() * 2465789) + 1);;

    var event_id = Session.get("show_event_id");
    var parent = comment_id_from_btn;

    // alert('comment_id: '+comment_id+'event_id: '+event_id+'comment_txt: '+comment_txt+'comment_by: '+comment_by);

      Meteor.call('event_comments_lvl_1',comment_id,event_id,comment_txt,comment_by,parent,function(error,result){
         if(error){
              // sAlert.error(' Error in submitting Commenting ',"123");
              console.log('error');
          }else{
              // sAlert.success('Sucessfully commented',"123");
              console.log('sucessfully commented');
              }
      });
 // $('#'+get_val).val('');       
$('#'+get_val).val('');
     },

     'click .like_button_comments': function(){
        // var comment_id = this.comment_id;

        var liked_by = Session.get("userId");
        var comment_id = this.comment_id;
        var event_id = this.event_id;
        
        var comment_txt = this.comment_txt;
        var comment_by = this.comment_by;
        var comment_type = this.comment_type;
        
        var parent = this.parent;
        

        var check_ifliked_before = Like.find({comment_id: comment_id, event_id: event_id, liked_by: liked_by}).fetch();  
        
        if(check_ifliked_before.length > 0){
          // alert('already liked');
          var like_id = check_ifliked_before[0].like_id;

          var newUser = Notifications.find({
                                  notification_by: liked_by,
                                  notification_for: comment_by, 
                                  comment_id: comment_id,
                                  event_id: event_id,
                                }).fetch();

          var notification_id = newUser[0].notification_id;
          // alert('notification_id: '+notification_id);

              Meteor.call('remove_event_comment_likes',like_id,notification_id, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('Like sucessfully removed');
                    }
              });
        }
        else{
          var like_id = 'like_comment_'+ Math.floor((Math.random() * 2465789) + 1);
              // alert(like_id+' '+comment_id+' '+comment_type +' '+ event_id+' '+comment_txt+' '+comment_by+' '+liked_by+' '+parent);
              Meteor.call('event_comment_likes',like_id,comment_id,event_id,comment_type,comment_txt,comment_by,liked_by,parent, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('sucessfully liked');
                    }
              });
            }
          },

     'click .like_Button_event': function(){

        // var comment_id = this.comment_id;
        // alert('here');
        // return false;
        var liked_by = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var check_ifliked_before = Like.find({event_id: event_id, liked_by: liked_by, like_type: 'main_event'}).fetch();     

        if(check_ifliked_before.length > 0){
          // alert('already liked');
          var like_id = check_ifliked_before[0].like_id;
              Meteor.call('remove_event_likes',like_id, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('Like sucessfully removed');
                    }
              });
        }
        else{
          var like_id = 'like_event_'+ Math.floor((Math.random() * 2465789) + 1);
              // alert(like_id+' '+comment_id+' '+comment_type +' '+ event_id+' '+comment_txt+' '+comment_by+' '+liked_by+' '+parent);
              Meteor.call('event_likes',like_id,event_id,liked_by, function(error,result){
              if(error){
                    // sAlert.error(' Error ',"123");
                    console.log('error');
                }else{
                  var like = Like.find({"like_id":like_id}).fetch();
                    Recipe.insert({"name":"ANki"},{"like_details":like[0]});
                    // sAlert.success(' You just liked a comment ',"123");
                    console.log('event sucessfully liked');
                    }
              });
            }
          },

      'click .redirect_click_1': function(event){
              event.preventDefault();
              var event_id = this._id;
              // alert(event_id);
              event_id= Base64.encode(event_id);     
              var url = '/edit_event/'+event_id;
              // alert(url);
              Router.go(url);
      },

      'click .redirect_click_2': function(event){
      event.preventDefault();
      var event_id = this.event_id;
      // alert(event_id);
      event_id= Base64.encode(event_id);     
      var url = '/event_detail/'+event_id;
      // alert(url);
      Router.go(url);
  },

  'click .redirect_click_onprofilepic': function(event){

    event.preventDefault();
    var user_id = this.user_id;
    var head = UserInfo.find({user_id: user_id}).fetch();
    Session.setPersistent("show_connection",head[0].user_id);
    var show_collection = Session.get("show_connection");
    var user_id = Session.get("userId");
    var url = '/view_profile/'+Base64.encode(head[0].user_id);

    if(show_collection == user_id)
    {
      Router.go('/profile');    
    }
    else{
    Router.go(url);
    }

},

      'click #show_more_comment_reply': function(){
        const t = Template.instance();
        t.reply_comment_show_limit.set("3");
      },

      'click #show_less_comment_reply': function(){
        const t = Template.instance();
        t.reply_comment_show_limit.set("");
      },

      'click #read_more_description': function(){
        // alert('cool');
         $('#show_readmore_div').addClass('hide_showmore_comments');
         $('#show_readless_div').removeClass('hide_showmore_comments');
      },      

      'click #read_less_description': function(){
        // alert('cool');
         $('#show_readmore_div').removeClass('hide_showmore_comments');
         $('#show_readless_div').addClass('hide_showmore_comments');
      },

      'click #event_invite_accpted': function(){
        // alert('coolsz');
        var accepted_by = Session.get("userId");
        var event_id = Session.get("show_event_id");
        // alert("check_event: "+event_id);
        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);

        console.log(result[0]);

        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var invite_type = result[0].invite_type;
        var event_admin = result[0].event_admin;
        
        if(invite_accepted == "" || invite_accepted == 0 || !invite_accepted.includes(accepted_by)){

        // if(!invite_list.includes(accepted_by))
        // { 
        //   var userId = accepted_by;
        //   var currentEvent = Event.find({event_id: event_id}).fetch();
        //   var currentInvitationList = currentEvent[0].invite_list;

        // if(currentInvitationList == ""){
        //     var invite_list = userId; 
        // }
        // else{
        //       var invite_list = currentInvitationList + ',' +userId; 
        //     }
        //  // add_user_in_invitation_list(Session.get("userId"),event_id);
        //   Meteor.call('add_user_in_invitation_list',event_id,userId,invite_list,function(error,result){
        //       if(error){
        //         alert("Error");
        //             console.log('error');
        //         }else{
        //         alert("sucessfully");
        //             console.log('sucessfully added in invitation list');
        //             }
        //       });
        //  }
        if(invite_type == 'Public'){
            invite_list = "";
        }
        else if(invite_type == 'Private'){

          var splitted_array = invite_list.split(",");
          var final_requestee_list= "";

          for(var i=0;i<splitted_array.length;i++){
            if(splitted_array[i] == accepted_by){
              splitted_array.pop(accepted_by);
            }
            final_requestee_list=final_requestee_list+splitted_array[i]+",";
          } 

          if(splitted_array.length == 0){
          final_requestee_list="" ;
          }     
          else if(final_requestee_list != "" && final_requestee_list!= undefined){
          final_requestee_list = final_requestee_list.substring(0, final_requestee_list.length - 1);
          } 
            invite_list = final_requestee_list;
            invite_list = invite_list.split(",").join(",");
        }
        
          if(invite_accepted == 0 && invite_accepted == ""){
            invite_accepted = accepted_by; 
        }
        else{
              invite_accepted = invite_accepted + ',' +accepted_by; 
            }

            invite_accepted = invite_accepted.split(",").join(",");
        
        var logged_in_user = Session.get("userId");

        // user_accepted_invitation(invite_accepted,event_id);  
        // alert(' invite_accepted: '+invite_accepted+' event_id: '+event_id+' invite_list: '+invite_list);
           Meteor.call('event_people_invite_accepted',invite_accepted,event_id,invite_list,event_admin,logged_in_user,function(error,result){
              if(error){ 
                    console.log('error');
                }else{
                    console.log('sucessfully accepted');
                    }
              });
         }
         else{
          return false;
         }
    },     
     
      'click .hide_modal_class':function(){
    // alert("hide_modal_class");
   // $('#Show_invited_list').modal('hide');
   $('#Show_invited_list').modal().hide();

  },

      'click #event_invite_rejected': function(){
        // alert('coolsz');
        var rejected_by = Session.get("userId");
        var event_id = Session.get("show_event_id");

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_list);

        console.log(result[0]);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        var invite_type = result[0].invite_type;
        
        
        if(invite_rejected == "" || invite_rejected == 0 || !invite_rejected.includes(rejected_by)){
        // if(!invite_list.includes(rejected_by))
        // {
        //   alert('reject1');
        //   var userId = rejected_by;
        // var currentEvent = Event.find({event_id: event_id}).fetch();
        // var currentInvitationList = currentEvent[0].invite_list;

        // if(currentInvitationList == ""){
        //     var invite_list = userId; 
        // }
        // else{
        //       var invite_list = currentInvitationList + ',' +userId; 
        //     }
        //   // var accepted_by = rejected_by;
        //  // add_user_in_invitation_list(Session.get("userId"),event_id);
        //   Meteor.call('add_user_in_invitation_list',event_id,invite_list,rejected_by,function(error,result){
        //       if(error){
        //             console.log('error');
        //         }else{
        //             console.log('sucessfully removed in invitation list');
        //             }
        //       });
        //  }

         if(invite_type == 'Public'){
            invite_list = "";
        }
        else if(invite_type == 'Private'){

          var splitted_array = invite_list.split(",");
          var final_requestee_list= "";

          for(var i=0;i<splitted_array.length;i++){
            if(splitted_array[i] == rejected_by){
              splitted_array.pop(rejected_by);
            }
            final_requestee_list=final_requestee_list+splitted_array[i]+",";
          } 

          if(splitted_array.length == 0){
          final_requestee_list = 0;
          }     
          else if(final_requestee_list != "" && final_requestee_list!= undefined){
          final_requestee_list = final_requestee_list.substring(0, final_requestee_list.length - 1);
          } 
            invite_list = final_requestee_list;
            if(invite_list != "" && invite_list != 0){

            invite_list = invite_list.split(",").join(",");
            }
        }


        if(invite_rejected == 0){
            invite_rejected = rejected_by; 
        }
        else{
              invite_rejected = invite_rejected + ',' +rejected_by; 
            }

            invite_rejected = invite_rejected.split(",").join(",");
            
          // alert('invite_rejected: '+invite_rejected+'event_id: '+event_id);
           // alert(' invite_rejected: '+invite_rejected+' event_id: '+event_id+' invite_list: '+invite_list);
       
          Meteor.call('event_people_invite_rejected',invite_rejected,event_id,invite_list,function(error,result){
              if(error){
                    console.log('error');
                }else{
                    console.log('sucessfully removed');
                    }
              });
        }
      },

      'click .closed_modal_window': function(){
          $('.modal').modal('close');
      },  

      'click .Show_liked_list': function(){
          // alert(this.comment_id);
          Session.set("save_comment_id",this.comment_id);
          Template.eventdetail.__helpers(["show_count_of_like"]);          
          Template.eventdetail.__helpers(["show_liked_list_2"]);          
      },

      'click .focus_on_comment_box': function(){
         var comment_id = this.comment_id;   
         var set_focus = '#commentlvl1_'+ comment_id;
         $(set_focus).focus();
      },

       'keyup input': function(event) {
                event.preventDefault();
                 if (event.ctrlKey && event.which == 13) {
                      // Ctrl-Enter pressed
                       $("#submit_comment").click();
                       }
                 else if (event.which === 13) {
                           $(".submit_comment_lvl1").click();
                         }
        },

});








