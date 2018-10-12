
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../import/collections/insert.js';
import { UserInfo } from './../../import/collections/insert.js';
import { Emembers } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';
import { advertisement } from './../../import/collections/insert.js';

import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';


var ads_listing;
var ads_listing_picture;
var ads_listing_ticker;

 Template.ticker.onDestroyed(function(){
  ads_listing_ticker.stop();
 });


var interval_ticker;


Template.ticker.onDestroyed(function(){
   clearInterval(interval_ticker);
});

Template.ticker.onRendered(function(){

ads_listing_ticker = Meteor.subscribe('all_ads');
function tick() {
    $('#ticker li:first').fadeOut("slow",function() {
        $(this).appendTo($('#ticker')).slideDown();
    });
}
interval_ticker = setInterval(function() {
    tick()
}, 5000);	

});

Template.picture_ticker.onDestroyed(function(){
   clearInterval(interval_ticker);
});


Template.picture_ticker.onRendered(function(){
  ads_listing_picture = Meteor.subscribe("all_ads");
function tick2() {
    $('#ticker2 li:first').fadeOut("slow",function() {
        $(this).appendTo($('#ticker2')).slideDown();
    });
}
setInterval(function() {
    tick2()
}, 5000);	
});

Template.ticker.helpers({

	change_textual_ads(){

    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');
// console.log('str: '+str);
var str2 = str.split("-").join(" ");
// console.log('str2: '+str2);
    var result = advertisement.find({
                                        $and: [
                                        { promotion_type: 'Textual' },
                                        { promotion_status: 
                                                        {
                                                            $ne: 'Inactive' 
                                                        }
                                        },
                                        { promotion_start_date: 
                                                        {
                                                            $lte: str2
                                                        }
                                        },
                                        { promotion_end_date: 
                                                        {
                                                            $gte : str2
                                                        }
                                         }
                                    ] }).fetch();

        // var result = advertisement.find({
        //                                  promotion_type: 'Textual' ,
        //                                  promotions_status: 
        //                                                 {
        //                                                     $ne: 'Inactive' 
        //                                                 }
        //                                 }).fetch();
// var promotion_array = new Array();
//         for(var i = 0; i< result.length; i++){
//             console.log(' promotion_start_date: '+result[i].promotion_start_date+' promotion_end_date: '+result[i].promotion_end_date+' str2: '+str2);
//             var promotion_start_date = result[i].promotion_start_date;
//             var promotion_end_date = result[i].promotion_end_date;
//             if(promotion_start_date <= str2 && promotion_end_date >= str2){

//             promotion_array.push(result[i]);
//             }
//         }
// console.log('promotion_array: ');
// console.log(promotion_array);
// console.log('result: ');
// console.log(result);
     // Event.find({$and: 
     //                            [{
     //                              event_start_date: {
     //                                                  $gte: str
     //                                                },
     //                              event_end_date: {
     //                                                  $lte: str
     //                                                }
     //                            }], event_name: query, status: {$ne: 'Inactive'} }).fetch();
     console.log(result);
    return result;
	},

});

	function tick() {
    $('#ticker li:first').fadeOut("slow",function() {
        $(this).appendTo($('#ticker')).slideDown();
    });
}

Template.picture_ticker.helpers({


	change_picture_ads(){
    
    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');
    // console.log('str: '+str);
    var str2 = str.split("-").join(" ");
    // console.log('str2: '+str2);

    var result = advertisement.find({
                                        $and: [
                                        { promotion_type: 'Picture' },
                                        { promotion_status: 
                                                        {
                                                            $ne: 'Inactive' 
                                                        }
                                        },
                                        { promotion_start_date: 
                                                        {
                                                            $lte: str2
                                                        }
                                        },
                                        { promotion_end_date: 
                                                        {
                                                            $gte : str2
                                                        }
                                         }
                                    ] }).fetch();
    console.log(result);
    return result;
	},

});

	function tick2() {
    $('#ticker li:first').fadeOut("slow",function() {
        $(this).appendTo($('#ticker')).fadeOut("slow");
    });
}


Template.ticker.events({

//    'click #OpenNewTab': function(){

//    var newwindow=window.open(url);
// window.focus();

//    },

   'click .update_count': function(){
    // alert('gfgff');
       var promotion_id = this.promotion_id;

       var result = advertisement.find({ promotion_id: promotion_id }).fetch();
       console.log(result);
       if(result[0].clicks_count){

       var clicks_count = result[0].clicks_count +1;
       }
       else{
        var clicks_count = 1;
       }


       Meteor.call('updateCountOnPromotion',promotion_id,clicks_count,function(error,result){
      if(error)
      { 
          toastr.error('Error');
      } 
      else{ 
          // toastr.success('promotion is now Active');
          console.log('promotion is now Active');
      }
      
     });

       // var promotion_url = this.promotion_url;
       // Router.go('/promotion_url');  

    },
});

Template.picture_ticker.events({

//      'click #OpenNewTab': function(){

//    var newwindow=window.open(url);
// window.focus();
    
//    },


   'click .update_count': function(){
    // alert('gfgff');
       var promotion_id = this.promotion_id;

       var result = advertisement.find({ promotion_id: promotion_id }).fetch();
       var clicks_count = result[0].clicks_count;
       clicks_count = clicks_count +1;

       Meteor.call('updateCountOnPromotion',promotion_id,clicks_count,function(error,result){
      if(error)
      { 
          toastr.error('Error');
      } 
      else{ 
          // toastr.success('promotion is now Active');
          console.log('promotion is now Active');
      }
      
     });

       // var promotion_url = this.promotion_url;
       // Router.go('/promotion_url');  

    },
});