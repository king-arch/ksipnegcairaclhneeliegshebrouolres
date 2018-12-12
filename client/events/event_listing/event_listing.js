
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { Emembers } from './../../../import/collections/insert.js';
import { Event } from './../../../import/collections/insert.js';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

//document.title = "Special Neighbourhood | Event Listing";

Template.eventlist.onCreated(function eventlistOnCreated(){
  this.search_conn = new ReactiveVar("");
  this.search_event = new ReactiveVar("");
  this.todays_event = new ReactiveVar("");
  this.upcoming_event = new ReactiveVar("");
  this.Past_event = new ReactiveVar("");
  this.event_created_by_me = new ReactiveVar("");
});

  Template.eventlist.onRendered(function(){

    
    Meteor.subscribe("all_friend_users");
    Meteor.subscribe("all_events");

    Meteor.subscribe("user_info_based_on_id",Session.get("userId"));


  setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    var result = UserInfo.find({user_id: logged_in_User}).fetch();
if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("body_bg");
       $('#event_container').addClass("pink_background");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("body_bg");
     $('#event_container').addClass("blue_background");
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("body_bg");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("body_bg");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");
 $('#event_container').addClass("default_background");
      $('.page_wh').addClass("body_bg");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");
             
     } 
  }
}, 1000);

});


Template.eventlist.helpers({

    user_is_admin(){
      var logged_in_user = Session.get("userId");
      if(logged_in_user == 'user_admin'){
        return true;
      }
      else{
        return false;
      }
  },

   
   check_event_inactive_or_not(){
    // alert('hi');
    var event_id = this.event_id;;
    var result = Event.find({ event_id: event_id }).fetch();
    var status = result[0].status;

    if( status == "" || status  == null || status == undefined ){
      return true;
    }
    else{
      return false;
    }
   },

  Show_all_todays_events(){
    Meteor.subscribe("all_events_for_todays");
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');

       var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   
       if(t5.search_event.get() == ""){
       var lists = Event.find({
                               $and: 
                                [ {
                                    event_start_date: {
                                                      $lte: str
                                                    }
                                                 
                                  },
                                  { event_end_date: {
                                                      $gte: str
                                                    }
                                },
                                {
                                   status: 
                                      {
                                        $ne: 'Inactive'
                                      } 
                                }] }).fetch();

       console.log('all lists: ');
       console.log(lists);
       }else{
        // alert('s2');
       var lists = Event.find({$and: 
                                [{
                                  event_start_date: {
                                                      $lte: str
                                                    },
                                  event_end_date: {
                                                       $gte: str
                                                    }
                                }], event_name: query, status: {$ne: 'Inactive'} }).fetch();
     }
        var logged_in_user = Session.get('userId');
        var new_list = new Array();

      for(var i = 0; i< lists.length ; i++){

        var invite_type = invite_type;
        var invite_accepted = lists[i].invite_accepted;

        var invite_rejected = lists[i].invite_rejected;
        var invite_list = lists[i].invite_list;
        var invite_type = lists[i].invite_type;

        if(invite_type == 'Private'){
          if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) 
            || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user))
             || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
                   new_list.push(lists[i]);
             }
        }
        else if(invite_type == 'Public'){
           new_list.push(lists[i]);
        }
      }

       var t1 = Template.instance();
       t1.todays_event.set(new_list.length);
    return new_list;
  },

    Show_all_todays_events_for_admin(){
    Meteor.subscribe("all_events_for_todays_for_admin")
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');

       var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   

     if(t5.search_event.get() == ""){
       var lists = Event.find({event_start_date:str}).fetch();
       }else{
       var lists = Event.find({event_start_date:str, event_name: query}).fetch();
     }
        // var logged_in_user = Session.get('userId');
        // var new_list = new Array();

      // for(var i = 0; i< lists.length ; i++){

      //  var invite_type = invite_type;
      //  var invite_accepted = lists[i].invite_accepted;

      //  var invite_rejected = lists[i].invite_rejected;
      //  var invite_list = lists[i].invite_list;
      //  var invite_type = lists[i].invite_type;

      //  if(invite_type == 'Private'){
      //    if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
      //              new_list.push(lists[i]);
      //  }
      //  }
      //  else if(invite_type == 'Public'){
      //     new_list.push(lists[i]);
      //  }
      // }

       var t1 = Template.instance();
       t1.todays_event.set(lists.length);
    return lists;
  },



  Show_all_upcoming_events(){
    Meteor.subscribe("all_upcoming_events") 
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');

    var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   

       if(t5.search_event.get() == ""){
       var upcoming = Event.find({event_start_date:{$gt:str}, status: {$ne: 'Inactive'} }).fetch();
       }else{
       var upcoming = Event.find({event_start_date:{$gt:str},event_name: query, status: {$ne: 'Inactive'} }).fetch();
       }

       var logged_in_user = Session.get('userId');
        var new_list = new Array();

      for(var i = 0; i< upcoming.length ; i++){

        var invite_type = invite_type;
        var invite_accepted = upcoming[i].invite_accepted;

        var invite_rejected = upcoming[i].invite_rejected;
        var invite_list = upcoming[i].invite_list;
        var invite_type = upcoming[i].invite_type;

        if(invite_type == 'Private'){
          if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
                   new_list.push(upcoming[i]);
        }
        }
        else if(invite_type == 'Public'){
           new_list.push(upcoming[i]);
        }
      }
     var t2 = Template.instance();
       t2.upcoming_event.set(new_list.length);

    return new_list;
  },

  Show_all_upcoming_events_for_admin(){
    Meteor.subscribe("all_upcoming_events_for_admin")  
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');

    var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   

       if(t5.search_event.get() == ""){
       var upcoming = Event.find({event_start_date:{$gt:str}}).fetch();
       }else{

       var upcoming = Event.find({event_start_date:{$gt:str},event_name: query}).fetch();
       }

       // var logged_in_user = Session.get('userId');
      //   var new_list = new Array();

      // for(var i = 0; i< upcoming.length ; i++){

      //  var invite_type = invite_type;
      //  var invite_accepted = upcoming[i].invite_accepted;

      //  var invite_rejected = upcoming[i].invite_rejected;
      //  var invite_list = upcoming[i].invite_list;
      //  var invite_type = upcoming[i].invite_type;

      //  if(invite_type == 'Private'){
      //    if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
      //              new_list.push(upcoming[i]);
      //  }
      //  }
      //  else if(invite_type == 'Public'){
      //     new_list.push(upcoming[i]);
      //  }
      // }


     var t2 = Template.instance();
       t2.upcoming_event.set(upcoming.length);

    return upcoming;
  },


  Show_all_past_events(){
    
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');
     
     var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   

  var logged_in_user = Session.get('userId');
  Meteor.subscribe("user_info_based_on_id",logged_in_user);
  var logged_in_user_result = UserInfo.find({user_id: logged_in_user}).fetch();
  var Sort_when_user_created = logged_in_user_result[0].createdAt;
 
  if(Sort_when_user_created != undefined){    
     var gt_str=moment(Sort_when_user_created).format('YYYY-MM-DD');
    Meteor.subscribe("all_past_events_with_created_date_greater_than_user",gt_str);
  }
  
       if(t5.search_event.get() == ""){
       var past = Event.find({$and: 
                                    [
                                      { event_end_date: 
                                                          {
                                                            $gt: gt_str
                                                          } 
                                      },
                                      {
                                        event_start_date: 
                                                          {
                                                            $lt: str
                                                          }
                                      },
                                        { 
                                          status: {$ne: 'Inactive'}
                                        } 
                                    ]
                              }).fetch();
       }else{

         var past = Event.find({event_end_date:{
                                  $gt: gt_str
                                },
                                 event_name: query,
                                  status: {$ne: 'Inactive'}}).fetch();
       }

        var new_list = new Array();

      for(var i = 0; i< past.length ; i++){

        var invite_type = invite_type;
        var invite_accepted = past[i].invite_accepted;

        var invite_rejected = past[i].invite_rejected;
        var invite_list = past[i].invite_list;
        var invite_type = past[i].invite_type;

        if(invite_type == 'Private'){
          if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
                   new_list.push(past[i]);
        }
        }
        else if(invite_type == 'Public'){
           new_list.push(past[i]);
        }
      }
      
     var t3 = Template.instance();
       t3.Past_event.set(new_list.length);

    return new_list;
  },


  Show_all_past_events_for_admin(){

    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');
     
       var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   

       if(t5.search_event.get() == ""){
       var past = Event.find({event_start_date:{$lt:str}}).fetch();
       }else{
       var past = Event.find({event_start_date:{$lt:str}, event_name: query}).fetch();
       }

        // var logged_in_user = Session.get('userId');
       //  var new_list = new Array();

      // for(var i = 0; i< past.length ; i++){

      //  var invite_type = invite_type;
      //  var invite_accepted = past[i].invite_accepted;

      //  var invite_rejected = past[i].invite_rejected;
      //  var invite_list = past[i].invite_list;
      //  var invite_type = past[i].invite_type;

      //  if(invite_type == 'Private'){
      //    if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
      //              new_list.push(past[i]);
      //  }
      //  }
      //  else if(invite_type == 'Public'){
      //     new_list.push(past[i]);
      //  }
      // }
      
     var t3 = Template.instance();
       t3.Past_event.set(past.length);

    return past;
  },

  Show_all_by_me_events(){

    var userid=Session.get('userId');
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');

     var t5 = Template.instance();
       var query = new RegExp(t5.search_event.get(),'i');   

       if(t5.search_event.get() == ""){
       var cretedbyme = Event.find({event_admin:userid,status: {$ne: 'Inactive'} }).fetch();
       }else{
       var cretedbyme = Event.find({event_admin:userid, event_name: query, status: {$ne: 'Inactive'} }).fetch();
       }

     var t4 = Template.instance();
       t4.event_created_by_me.set(cretedbyme.length);

    return cretedbyme;
  },

  todays_event_count(){
       var t1 = Template.instance();
       var count = t1.todays_event.get();
       return count;
  },

  upcoming_event(){
     var t2 = Template.instance();
       var count = t2.upcoming_event.get();
       return count;
  },

  Past_event(){
       var t2 = Template.instance();
       var count = t2.Past_event.get();
       return count;
  },

  event_created_by_me(){
     var t4 = Template.instance();
       var count = t4.event_created_by_me.get();
       return count;
  },

  

  event_location(){
    var event_location = this.event_location;
    if(event_location.length > 35){
      event_location = event_location.substr(0,35);
      return event_location+'...';
    }
    else{
      return event_location;
    }
  },


  datemnth:function()
  {
    var datem =this.event_start_date;
    //alert(datem);
    var newdate = moment(datem).format("MMM"); 
    return newdate;
    
  },
  datenm:function()
  {
    var datem =this.event_start_date;
    var newdate = moment(datem).format("DD"); 
    return newdate;
    
  },
  dateday:function()
  {
    var datem =this.event_start_date;
    var newdate = moment(datem).format("ddd"); 
    return newdate;
    
  },
  event_title:function()
  {
    var etitle =this.event_name;
    if(etitle.length > 15){
    var t=etitle.substr(0, 15);
    return t+' ...';
    }
    else{
      return etitle;
    }
    
  },
  eventvalidation:function()
  {
    var user_id=Session.get('userId');
    var event_id=this.event_id;
    return Event.find({user_id:user_id,event_id:event_id}).fetch();

  },

    display_event_response(){
    var logged_in_user = Session.get("userId");
    // var logged_in_user = Session.get("userId");
      // var event_id = Session.get("show_event_id");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        // console.log('result now: ');
        // console.log(event_id);
        // console.log(result);
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        console.log(result[0].event_name);
        var sent_to = result[0].event_admin;
        var sent_by = Session.get("userId");
      // //alert('sent_to:'+sent_to+' sent_by:'+sent_by);
      // var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);
      // db.friend.find({sent_to: 'user_931176',sent_by: 'user_1224544',req_status: 0});  
      // var show_button = FriendRequest.find({sent_to: sent_to,sent_by: sent_by}).fetch();
      // var show_button = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to }, { sent_by: sent_by }, { req_status: 1 } ] }, { $and: [ { sent_to: sent_by }, { sent_by: sent_to }, { req_status: 1 }] } ] }).fetch();
      // var length = show_button.length;
        if((invite_rejected == "" ||invite_rejected == 0 || !invite_rejected.includes(logged_in_user))  && (invite_accepted == 0 || invite_accepted == "" || !invite_accepted.includes(logged_in_user)) ){
           console.log("case 1");
           // alert("case 1");
           return true;
          }
          else{
          console.log('case 2');
          // alert('case 2');
          return false;
         } 
  },

       check_accept_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;
        // alert('logged_in_user:'+logged_in_user+'invite_list: '+invite_list+'invite_accepted:'+invite_accepted+'invite_rejected: '+invite_rejected);
        if(invite_accepted == 0){
            return false;
        }else{
        if( (invite_accepted != 0 || invite_accepted != "") && invite_accepted.includes(logged_in_user)){
          return true;
        }
        else{
          return false;
        }
      }
        
     },

     check_reject_status(){
        var logged_in_user = Session.get("userId");
        var event_id = this.event_id;

        var result = Event.find({event_id: event_id}).fetch();
        // alert(event_id+' '+result[0].invite_accepted);
        
        var invite_list = result[0].invite_list;
        var invite_accepted = result[0].invite_accepted;
        var invite_rejected = result[0].invite_rejected;

        if( (invite_rejected != 0 || invite_rejected != "") &&  invite_rejected.includes(logged_in_user)){
          return true;
        }
        else{
          return false;
        }
     },

});
Template.eventlist.events({    
      
     'keypress input': function(e){   
     // alert('ss');     
     var search_txt_1 = $('#search_all_text_conn').val();   
     var code = e.keyCode || e.which;    
                            if( code === 13 ) {    
                              // alert('se');   
                                e.preventDefault();  
                // alert(search_txt_1);    
     if(search_txt_1 != ""){    
      // alert('1');
          $('.search_all_text_conn').click();
     }
     else{
      // alert('2');
      $('.search_all_text_conn').click();
    }

    //  else if(search_txt_2 != ""){
    //    $('.search_upcoming_conn').click();
    //  }

    //  else if(search_txt_3 != ""){
    //   $('.search_past_conn').click();
    //  }

    //  else if(search_txt_4 != ""){
    //   $('.search_created_by_me_conn').click();
    //  }

    //  else{
    //   alert('2');
    //   $('.search_all_text_conn').click();
    // }
    
  }
  },

  'click #search_event':function()
  {

    var t = Template.instance();
    t.search_event.set( $("#search_all_event").val() );

  },

  'click #activate':function()
  {

    var confirmation = confirm("Are you sure you want to deactivate this event ?");

    if(confirmation == true){

    var event_id =this.event_id;
    // alert('event_id '+event_id);
    var event_status = 'Inactive';
    Meteor.call('change_event_activation_status',event_status,event_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('event is inactive and cant be found');
      }
      
     });
  }

  },

  'click #in_activate':function()
  {

    var confirmation = confirm("Are you sure you want to activate this event again ?");

    if(confirmation == true){

    var event_id =this.event_id;
    // alert('event_id '+event_id);
    var event_status = "";

    Meteor.call('change_event_activation_status',event_status,event_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('Event is Active');
      }

     });
  }

  },

  'click .go_inside_event': function(){

    var event_id = this.event_id;
    // alert(event_id);
    var logged_in_user = Session.get("userId");

    event_id= Base64.encode(event_id); 
    var url = '/event_detail/'+ event_id;   
    // alert(url);
    Router.go(url);       
    return false;  
    },

  'click .search_all_text_conn': function(){
    var search_txt = $('#search_all_text_conn').val();

    var t5 = Template.instance();
    t5.search_event.set(search_txt);

    // $('.search_input_box_value').val(search_txt);
  },

  'click .search_upcoming_conn': function(){
    var search_txt = $('#search_upcoming_conn').val();

    var t5 = Template.instance();
    t5.search_event.set(search_txt);

    // $('.search_input_box_value').val(search_txt);
  },

  'click .search_past_conn': function(){
    var search_txt = $('#search_past_conn').val();

    var t5 = Template.instance();
    t5.search_event.set(search_txt);

    // $('.search_input_box_value').val(search_txt);
  },

  'click .search_created_by_me_conn': function(){
    var search_txt = $('#search_created_by_me_conn').val();

    var t5 = Template.instance();
    t5.search_event.set(search_txt);

    // $('.search_input_box_value').val(search_txt);
  },
  'click #create_event':function(){
    Router.go('/create_event');
  }
});