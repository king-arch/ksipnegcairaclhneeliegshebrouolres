
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { Emembers } from './../../../import/collections/insert.js';
import { Event } from './../../../import/collections/insert.js';
import { advertisement } from './../../../import/collections/insert.js';

import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

//document.title = "Special Neighbourhood | Event Listing";


var ads_listing;

 Template.adslist.onDestroyed(function(){
  ads_listing.stop();

 });

Template.adslist.onCreated(function adslistOnCreated(){
  this.search_conn = new ReactiveVar("");
  this.search_ads = new ReactiveVar("");
  this.all_textual_ads = new ReactiveVar("");
  this.all_active_ticker = new ReactiveVar("");
  this.all_archived_ticker = new ReactiveVar("");
  this.all_picture_ads = new ReactiveVar("");
  this.all_active_picture = new ReactiveVar("");
  this.all_archived_picture = new ReactiveVar("");
  this.Show_active_ads = new ReactiveVar("");
  this.event_created_by_me = new ReactiveVar("");
});

Template.adslist.onRendered(function(){
  ads_listing = Meteor.subscribe("all_ads");
})

Template.adslist.helpers({

		user_is_admin(){
			var logged_in_user = Session.get("userId");
			if(logged_in_user == 'user_admin'){
				return true;
			}
			else{
				return false;
			}
	},
	 
   check_promotion_inactive_or_not(){
    var promotion_id = this.promotion_id;;
    var result = advertisement.find({ promotion_id: promotion_id ,promotion_status: 'Active' }).fetch();
    var status = result[0].promotion_status;

    if( status == 'Active' || status  == null || status == undefined ){
      return true;
    }
   },

		Show_all_active_ticker(){
   		 const t5 = Template.instance();
	     const query = new RegExp(t5.search_ads.get(),'i');   
       // alert('query: '+query);

	     if(t5.search_ads.get() == ""){
	     var lists = advertisement.find({ promotion_type: 'Textual',promotion_status: 'Active' }).fetch();
	     }
       else{
 	        var lists = advertisement.find({ promotion_type: 'Textual', promotion_title : query ,promotion_status: 'Active' }).fetch();
     }
     	 const t1 = Template.instance();
   		 t1.all_active_ticker.set(lists.length);
		   return lists;
	},

			Show_all_archived_ticker(){
   		 const t5 = Template.instance();
	     const query = new RegExp(t5.search_ads.get(),'i');   
       // alert('query: '+query);

	     if(t5.search_ads.get() == ""){
	     var lists = advertisement.find({ promotion_type: 'Textual',promotion_status: 'Inactive' }).fetch();
	     } 
       else{ 
 	        var lists = advertisement.find({ promotion_type: 'Textual', promotion_title : query ,promotion_status: 'Inactive' }).fetch();
     } 
     	 const t1 = Template.instance();
   		 t1.all_archived_ticker.set(lists.length);
		   return lists;
	}, 

		Show_all_textual_ads(){
   		 const t5 = Template.instance();
	     const query = new RegExp(t5.search_ads.get(),'i');   
       // alert('query: '+query);

	     if(t5.search_ads.get() == ""){
	     var lists = advertisement.find({ promotion_type: 'Textual',promotion_status: 'Active' }).fetch();
	     }
       else{
 	        var lists = advertisement.find({ promotion_type: 'Textual', promotion_title : query ,promotion_status: 'Active' }).fetch();
     }
     	 const t1 = Template.instance();
   		 t1.all_textual_ads.set(lists.length);
		   return lists;
	},

  Show_all_active_picture(){ 
       const t5 = Template.instance();
       const query = new RegExp(t5.search_ads.get(),'i');   

       if(t5.search_ads.get() == ""){
       var lists = advertisement.find({ promotion_type: 'Picture' ,promotion_status: 'Active' }).fetch();
       }else{
       var lists = advertisement.find({ promotion_type: 'Picture', promotion_title : query, promotion_status: 'Active' }).fetch();
     }
       const t1 = Template.instance();
       t1.all_active_picture.set(lists.length);
    return lists;
  },


  Show_all_archived_picture(){ 
       const t5 = Template.instance();
       const query = new RegExp(t5.search_ads.get(),'i');   

       if(t5.search_ads.get() == ""){
       var lists = advertisement.find({ promotion_type: 'Picture' ,promotion_status: 'Inactive' }).fetch();
       }else{
       var lists = advertisement.find({ promotion_type: 'Picture', promotion_title : query, promotion_status: 'Inactive' }).fetch();
     }
       const t1 = Template.instance();
       t1.all_archived_picture.set(lists.length);
    return lists;
  },


  // Show_all_picturial_ads(){ 
  //      const t5 = Template.instance();
  //      const query = new RegExp(t5.search_ads.get(),'i');   

  //      if(t5.search_ads.get() == ""){
  //      var lists = advertisement.find({ promotion_type: 'Picture' ,promotion_status: 'Active' }).fetch();
  //      }else{
  //      var lists = advertisement.find({ promotion_type: 'Picture', promotion_title : query, promotion_status: 'Active' }).fetch();
  //    }
  //      const t1 = Template.instance();
  //      t1.all_picture_ads.set(lists.length);
  //   return lists;
  // },

	Show_Active_ads(){
	     const t5 = Template.instance();
       const query = new RegExp(t5.search_ads.get(),'i');   

       if(t5.search_ads.get() == ""){
       var lists = advertisement.find({ promotion_status: {$ne: 'Inactive'  } }).fetch();
       }else{
       var lists = advertisement.find({ promotion_title : query, promotion_status: {$ne: 'Inactive' } }).fetch();
     }
       const t1 = Template.instance();
       t1.Show_active_ads.set(lists.length);
       return lists;
	},


	all_textual_ads_count(){
	   	 const t1 = Template.instance();
   		 var count = t1.all_textual_ads.get();
   		 return count;
	},

	all_active_ticker_count(){
	   	 const t1 = Template.instance();
   		 var count = t1.all_active_ticker.get();
   		 return count;
	},

	all_archived_ticker_count(){
	   	 const t1 = Template.instance();
   		 var count = t1.all_archived_ticker.get();
   		 return count;
	},

	all_active_picture_count(){
	   const t2 = Template.instance();
   	   var count = t2.all_active_picture.get();
   	   return count;
	},

	all_archived_picture_count(){
	   const t2 = Template.instance();
   	   var count = t2.all_archived_picture.get();
   	   return count;
	},

	Show_active_ads(){
       	 const t2 = Template.instance();
   		 var count = t2.Show_active_ads.get();
   		 return count;
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
	promotion_title:function()
	{
		var etitle =this.promotion_title;
		if(etitle.length > 20){
		var t=etitle.substr(0, 20);
		return t+'...';
		}
		else{
			return etitle;
		}
	},

  promotion_content_trim(){
    var etitle =this.promotion_content;
    if(etitle.length > 71){
    var t= etitle.substr(0, 71);
    return t+'...';
    }
    else{
      return etitle;
    }
  },

  displayPromotionPictureCount(){
    // var etitle = this.promotion_content;
    var result = advertisement.find({promotion_type: "Picture"}).count();

    if(result > 1){

    return result;
    }
    else{
      return 0;
    }

  },

  displaylClicksOnPictureCount(){
    // var etitle = this.promotion_content;
    var result = advertisement.find({promotion_type: "Picture"}).fetch();
var show_final_count=0;
for(var i=0; i < result.length ; i++)
{
    show_final_count = show_final_count + result[i].clicks_count;
}   
return show_final_count;
  },

  displayPromotionTickerCount(){
    // var etitle = this.promotion_content;
    var result = advertisement.find({promotion_type: "Textual"}).count();

    if(result > 1)
    {

    return result;
    }
    else{
      return 0;
    }
  },

  displayClicksOnTickerCount(){
    // var etitle = this.promotion_content;
    var result = advertisement.find({promotion_type: "Textual"}).fetch();

    var show_final_count=0;
for(var i=0; i < result.length ; i++)
{
    show_final_count = show_final_count + result[i].clicks_count;
}   
return show_final_count;

  },

	promotion_start_date(){
		var promotion_start_date = this.promotion_start_date;
    promotion_start_date_array =  promotion_start_date.split(" ");
    var month = moment(promotion_start_date_array[1]).format("MMM");
    var year = promotion_start_date_array[0];
    var date = promotion_start_date_array[2];

    var string_to_return = month + ' '+ date+', '+year;
    return string_to_return;

	},

    promotion_end_date(){
    var promotion_end_date = this.promotion_end_date;
    promotion_end_date_array =  promotion_end_date.split(" ");
    var month = moment(promotion_end_date_array[1]).format("MMM");
    var year = promotion_end_date_array[0];
    var date = promotion_end_date_array[2];

    var string_to_return = month + ' '+ date+', '+year;
    return string_to_return;

  },

});


Template.adslist.events({

  'click #search_ads':function()
  {
    const t = Template.instance();
       t.search_ads.set($("#search_all_event").val());
           // Template.adslist.__helpers["Show_all_textual_ads"]();
  },

  'click .edit_promotion':function()
  {
           var promotion_id = this.promotion_id;
           // alert(promotion_id);
               promotion_id = Base64.encode(promotion_id); 

              var url = '/edit_promotion/'+ promotion_id;   
              // alert(url);
              Router.go(url);  
  },

  'click #activate':function()
  {

  	var check_confirmation = confirm("sure you want to archive this event ? you will not be able to activate it again.");
  	if(check_confirmation == true){

    var promotion_id =this.promotion_id;
    // alert('promotion_id '+promotion_id);
    var promotion_status = 'Inactive';

    Meteor.call('change_promotion_activation_status',promotion_status,promotion_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      } 
      else{
          toastr.success('promotion is inactive and will not appear with other ads');
      }
     });
  	}
  },

	'click #in_activate':function()
	{
    var promotion_id =this.promotion_id;
    // alert('promotion_id '+promotion_id);
    var promotion_status = "Active";

    Meteor.call('change_promotion_activation_status',promotion_status,promotion_id,function(error,result){
      if(error)
      { 
          toastr.error('Error');
      } 
      else{ 
          toastr.success('promotion is now Active');
      }
      
     });

	},


	'click .search_all_text_conn': function(){
    // alert('noeww');
		var search_txt = $('#search_all_text_conn').val();
		const t5 = Template.instance();
		t5.search_ads.set(search_txt);

    // Template.adslist.__helpers["Show_all_textual_ads"]();
		$('.search_input_box_value').val(search_txt);
	},

	'click .search_upcoming_conn': function(){
		var search_txt = $('#search_upcoming_conn').val();

		const t5 = Template.instance();
		t5.search_ads.set(search_txt);

		$('.search_input_box_value').val(search_txt);
	},

	'click .search_past_conn': function(){
		var search_txt = $('#search_past_conn').val();

		const t5 = Template.instance();
		t5.search_ads.set(search_txt);

		$('.search_input_box_value').val(search_txt);
	},

	'click .search_created_by_me_conn': function(){
		var search_txt = $('#search_created_by_me_conn').val();

		const t5 = Template.instance();
		t5.search_ads.set(search_txt);

		$('.search_input_box_value').val(search_txt);
	},
		'click #create_event':function(){
		Router.go('/create_Promotion');
	},

	'click .delete_add': function(){
		var promotion_id = this.promotion_id;
		// alert(promotion_id);

		 Meteor.call('changeAdminStatus',promotion_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('Advertisement is removed');
      }

     });

	},

});