
import { Template } from 'meteor/templating';
import { Base64 } from 'meteor/ostrio:base64';
import { FriendRequest }  from './../../import/collections/insert.js';
import { UserInfo } from './../../import/collections/insert.js';
import { Emembers } from './../../import/collections/insert.js';
import { Event } from './../../import/collections/insert.js';
import { advertisement } from './../../import/collections/insert.js';

import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

Template.page_not_found_content.onDestroyed(function(){
  
});


Template.page_not_found_content.onRendered(function(){

});



Template.page_not_found_content.helpers({


});

Template.page_not_found_content.events({
   'click .go_back_no_page_found': function(){
      if(Session.get("userId")){
        Router.go('/feed');
      }
      else{
        Router.go('/');
      }
   },

});