
import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session';



this.setTitle = function(title) {
  var base;
  base = 'Special Neighborhood';
  window.scrollTo(0,0);
  if (title) {
    return document.title = title + ' | ' + base;
  } else {
    return base;
  }
};

Router.route('/profile',
function () {
  if(Session.get("userId")!=""){
  this.render('profile');

}else{
  Router.go('/');  
}
},{
    onAfterAction: function() {
      return setTitle('Profile');
    }
  });

// this.setTitle = function(title) {
//   var base;
//   base = 'Special Neighborhood';
//   if (title) {
//     Session.set("currentPage",title);
//     return document.title = title + ' | ' + base;
//   } else {
//     return base;
//   }
// };

// Router.configure({dataNotFound: 'login', notFoundTemplate: 'login' });

Router.configure({
  
// layoutTemplate: "layout",
    loadingTemplate: "loading",
    notFoundTemplate: "page_not_found"

});

// function checkIfLogin(){
//   var loggedInUser = Session.get("userId");
//   if(loggedInUser){
//     return 'hub';
//   }
//   else{
//    return 'login';
//   }
// }

Router.route('/view_profile/:user_id', 
function () {
   var  params = this.params; // { _id: "5" }
  // var id = params.user_id; // "5"

    var userId = params.user_id; // "5"
    userId = Base64.decode(userId); 
      // alert("decrypt" + userId);
  // Session.set("makeUserActive","true");
  // Session.setPersistent("show_connection",head[0].user_id);
  Session.setPersistent("show_connection",userId);  
  // alert(Session.get("show_connection"));
  this.render('view_profile');
},{
    onAfterAction: function() {
      return setTitle('View Profile');
    }
  },
);

// Router.plugin('dataNotFound', {notFoundTemplate: 'Login'});

Router.route('/', function () {
  this.render('login');
},{
    onAfterAction: function() {
      return setTitle('Login');
    }
  });

Router.route('/edit_privacy', function () {
  this.render('editprivacy');
},{
    onAfterAction: function() {
      return setTitle('Privacy');
    }
  });

Router.route('/landing_page', function () {
  this.render('landing_page');
},{
    onAfterAction: function() {
      return setTitle('Welcome to Special Neighborhood');
    }
  });

Router.route('/edit_cookies', function () {
  this.render('editcookies');
},{
    onAfterAction: function() {
      return setTitle('Cookies');
    }
  });

Router.route('/edit_useragreement', function () {
  this.render('edituseragreement');
},{
    onAfterAction: function() {
      return setTitle('User Agreement');
    }
  });

Router.route('/signup', function () {
   if(Session.get("userId")!=""){
 this.render('signup');
}else{
  Router.go('/');  
}

},{
    onAfterAction: function() {
      return setTitle('Sign up');
    }
  });

Router.route('/connection', function () {
  this.render('connection');
},
{
  onAfterAction: function() {
      return setTitle('Connection');
}
});

Router.route('/Messaging', function () {
  this.render('messagingpage');
},{
    onAfterAction: function() {
      return setTitle('Messaging');
    }
  });

Router.route('/grplisting', function () {
  this.render('grplisting');
},{
    onAfterAction: function() {
      return setTitle('Group Listing');
    }
  });

Router.route('/group_discussion_listing/:grp_id', function () {
    var  params = this.params; // { _id: "5" }
  var grp_id = params.grp_id; // "5"
   var decoded = Base64.decode(grp_id); 
      // alert("decrypt" + userId);
  Session.set("show_grp_id_for_discussion",decoded);
  this.render('group_discussion_listing');
},{
    onAfterAction: function() {
      return setTitle('Group Discussion');
    }
  });

Router.route('/edit_promotion/:promotion_id', function () {
    var  params = this.params; // { _id: "5" }
  var promotion_id = params.promotion_id; // "5"
   var decoded = Base64.decode(promotion_id); 
      // alert("decrypt" + userId);
  // Session.set("show_grp_id_for_discussion",decoded);
  this.render('edit_promotion');
},{
    onAfterAction: function() {
      return setTitle('Edit promotion');
    }
  });

Router.route('/email', function () 
{  if(Session.get("userId")!=""){
  this.render('email');
}else{
  Router.go('/');  
}
},{
    onAfterAction: function() {
      return setTitle('Sign up');
    }
  });

Router.route('/grp_discussion_detail/:discussion_id', function () {
  var  params = this.params; // { _id: "5" }
  var discussion_id = params.discussion_id; // "5"
    decoded = Base64.decode(discussion_id); 
      // alert("decrypt" + userId);
  Session.set("show_discussion_id",decoded);
  // Session.setPersistent("userId",userId);
  this.render('group_discussion_detail');
},{
    onAfterAction: function() {
      return setTitle('Discussion Detail');
    }
  });

Router.route('/activate_email/:id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
    userId = Base64.decode(userId); 
      // alert("decrypt" + userId);
  Session.set("makeUserActive","true");
  Session.setPersistent("userId",userId);
  this.render('email');


},{
    onAfterAction: function() {
      return setTitle('Email Activation');
    }
  });



Router.route('/creategroup', function () {
  this.render('creategroup');
},{
    onAfterAction: function() {
      return setTitle('Create Group');
    }
  });

Router.route('/messaging_page', function () {
  this.render('messaging_page');
},{
    onAfterAction: function() {
      return setTitle('Messaging');
    }
  });

Router.route('/group_detail/:grp_id', function () {

  var  params = this.params; // { _id: "5" }
  var encrypted = params.grp_id; // "5"
  
// decrypted = CryptoJS.AES.decrypt(encrypted, 'Passphrase');
// var id = decrypted.toString(CryptoJS.enc.Utf8);
var decoded = Base64.decode(encrypted);
Session.set("show_grp_id",decoded);  
 // Router.go(/group_detail/:encrypted);
 this.render('groupdetail');
},{
    onAfterAction: function() {
      return setTitle('Group Detail');
    }
  });

Router.route('/editgroup/:grp_id', function () {
  var  params = this.params; // { _id: "5" }
  var encrypted = params.grp_id; // "5"
  
// decrypted = CryptoJS.AES.decrypt(encrypted, 'Passphrase');
// var id = decrypted.toString(CryptoJS.enc.Utf8);
var decoded = Base64.decode(encrypted);

Session.set("show_grp_edit_id",decoded);  
  this.render('editgroup');
},{
    onAfterAction: function() {
      return setTitle('Edit Group');
    }
  });

Router.route('/logout', function () {
  Router.go('/');
},{
    onAfterAction: function() {
      return setTitle('Login');
    }
  });

Router.route('/test/:status', function () {
  var status = this.params.status;
  Session.set("joinSession",status);
  this.render('test');
});

Router.route('/test', function () {
  this.render('test');
});


Router.route('/video_chat/:callerId/calling/:pickerId/:chat_room_id/:video_session_id', function () {
  var callerId = this.params.callerId; // "5"
  var pickerId = this.params.pickerId; // "100"
  var chat_room_id = this.params.chat_room_id; // "100"
  Session.set("videoSessionCallerId",callerId);
  Session.set("videoSessionPickerId",pickerId);
  Session.set("videoSessionChatRoomId",chat_room_id)
  Session.set("videoSessionId",this.params.video_session_id);
  this.render('video_chat');
});

Router.route('/audio_chat/:callerId/calling/:pickerId/:chat_room_id/:video_session_id', function () {
  var callerId = this.params.callerId; // "5"
  var pickerId = this.params.pickerId; // "100"
  var chat_room_id = this.params.chat_room_id; // "100"
  Session.set("audioSessionCallerId",callerId);
  Session.set("audioSessionPickerId",pickerId);
  Session.set("audioSessionChatRoomId",chat_room_id)
  Session.set("audioSessionId",this.params.video_session_id);
  this.render('audio_chat');
});

Router.route('/video_chat_accept/accept_call/:video_chat_roomId', function () {
  var video_session_id = this.params.video_chat_roomId; 
  // alert(video_session_id);
  Session.set("video_session_id",video_session_id);
  this.render('video_chat_accept');
});


Router.route('/messaging_right/:user_id', function () {
  var  params = this.params; // { _id: "5" }
  var encrypted = params.user_id; // "5"
  var decoded = Base64.decode(encrypted);
  
  $("#message_container").animate({ scrollTop: $('#message_container').prop("scrollHeight")}, 1);
      Session.set("msgid_forright",decoded);  
      this.render('messaging_right');

});
Router.route('/chatter/:user_id', function () {
  var  params = this.params; // { _id: "5" }
  var encrypted = params.user_id; // "5"
  var decoded = Base64.decode(encrypted);
  
  $("#message_container").animate({ scrollTop: $('#message_container').prop("scrollHeight")}, 1);
      Session.set("msgid_forright",decoded);  
      this.render('chatter');

});


Router.route('/msg_right/:user_id', function () {
  var  params = this.params; // { _id: "5" }
  var encrypted = params.user_id; // "5"
  var decoded = Base64.decode(encrypted);
  
  $("#message_container").animate({ scrollTop: $('#message_container').prop("scrollHeight")}, 1);
      Session.set("msgid_forright",decoded);  
      this.render('msg_right');

});

Router.route('/messaging_mobile_screen/:user_id', function () {
  var  params = this.params;
  var encrypted = params.user_id; 
  var decoded = Base64.decode(encrypted); 
  
  this.render('messagingpage_mobile_screen');
},{
    onAfterAction: function() {
      return setTitle('Messaging');
    }
});

Router.route('/Messaging_mobile', function () {

  this.render('messagingpage_mobile'); 
  

},{
    onAfterAction: function() {
      return setTitle('Messaging');
    }
  });

// Router.route('/messaging_mobile_screen', function () {

//   this.render('messagingpage_mobile_screen'); 
  

// },{
//     onAfterAction: function() {
//       return setTitle('Messaging');
//     }
//   });



Router.route('/forgot_password', function () {
  this.render('forgot_password');
},{
    onAfterAction: function() {
      return setTitle('Forgot Password');
    }
  });
Router.route('/change_forgot_password/:id', function () {
   var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
   userId = Base64.decode(userId);
    Session.setPersistent("userId",userId);
  this.render('change_forgot_password');
},{
    onAfterAction: function() {
      return setTitle('Change Password');
    }
  });


Router.route('/users_map', function () {
  this.render('usermap');
},{
    onAfterAction: function() {
      return setTitle('Users Map');
    }
  });


Router.route('/msg_temp', function () {
  this.render('msg_temp');
});


Router.route('/grouplisting', function () {
  this.render('grplisting');
},{
    onAfterAction: function() {
      return setTitle('Group Listing');
    }
  });


Router.route('/create_event', function () {
  this.render('createevent');
},{
    onAfterAction: function() {
      return setTitle('Create Event');
 }
});

Router.route('/create_Promotion', function () {
  this.render('createads');
},{
    onAfterAction: function() {
      return setTitle('create ads');
 }
});

Router.route('/events', function () {
  this.render('event_listing');
},{
    onAfterAction: function() {
      return setTitle('Events Listing');
    }
  });


Router.route('/edit_event/:id', function () {
   var  params = this.params; 
   var eventId = params.id;
   Session.setPersistent("eventId",eventId);
   this.render('editevent');
},{
    onAfterAction: function() {
      return setTitle('Edit Event');
    }
  });
/*
Router.route('/edit_event/:event_id', function () {
  var  params = this.params;
  var encrypted = params.event_id; 

  var decoded = Base64.decode(encrypted); 
  Session.setPersistent("show_event_id",decoded);  
  // var d1 = Session.get("show_event_id");

  // alert(encrypted+' & '+d1);
  this.render('editevent');
},{
    onAfterAction: function() {
      return setTitle('Edit Event');
    }
  });*/


Router.route('/event_detail/:event_id', function () {
  var  params = this.params;
  var encrypted = params.event_id; 

  var decoded = Base64.decode(encrypted); 
  Session.setPersistent("show_event_id",decoded);  
  // var d1 = Session.get("show_event_id");
  
  // alert(encrypted+' & '+d1);
  this.render('event_detail');
},{
    onAfterAction: function() {
      return setTitle('Event Detail');
    }
});












Router.route('/create_blog', function () {
  this.render('createblog');
},{
    onAfterAction: function() {
      return setTitle('Create Blog');
    }
});

Router.route('/list_blog', function () {
  this.render('listblog');
},{
    onAfterAction: function() {
      return setTitle('Blog List');
    }
});

Router.route('/edit_blog', function () {
  this.render('editblog');
},{
    onAfterAction: function() {
      return setTitle('Edit Blog');
    }
});

Router.route('/blog_listing', function () {
  this.render('blog_listing');
},{
    onAfterAction: function() {
      return setTitle('Blogs');
    }
});

Router.route('/edit_blog/:blog_id', function () {
  var  params = this.params;
  var encrypted = params.blog_id; 
  var decoded = Base64.decode(encrypted); 
  Session.setPersistent("show_blog_edit_id",decoded);  
  // var d1 = Session.get("show_event_id");
  // alert(encrypted+' & '+d1);
  this.render('editblog');
},{
    onAfterAction: function() {
      return setTitle('Edit Blog');
    }
});


Router.route('/blog_detail',function(){
   Session.setPersistent("checkForReloadingPageTwice",true);  
  this.render('blogdetail');
},{
    onAfterAction: function() {
      return setTitle('Blog Detail');
    }
});
Router.route('/blog_detail/:blog_id', function () {
  var  params = this.params;
  var encrypted = params.blog_id; 
  var decoded = Base64.decode(encrypted); 
  Session.setPersistent("detailed_blog_id",decoded);  
  // var d1 = Session.get("show_event_id");
  // alert(encrypted+' & '+d1);
  this.render('blogdetail');
},{
    onAfterAction: function() {
      return setTitle('Blog Detail');
    }
});

Router.route('/blog_preview/:blog_id', function () {
  var  params = this.params;
  var encrypted = params.blog_id; 
  var decoded = Base64.decode(encrypted); 
  Session.setPersistent("detailed_blog_id",decoded);  
  
  this.render('blog_preview');
},{
    onAfterAction: function() {
      return setTitle('Blog Preview');
    }
});



/////////////////Ankit Addedd
Router.route('/feed', function () {
  this.render('hub');
},{
    onAfterAction: function() {
      return setTitle('Feed');
    }
});

Router.route('/post_detail_page/:post_id', function () {
  var  params = this.params;
  var encrypted = params.post_id; 
  var decoded = Base64.decode(encrypted); 
  Session.set("post_id",decoded);
  this.render('post_detail_page');
},{
    onAfterAction: function() {
      return setTitle('Detail Page');
    }
});

Router.route('/blog_detailed/:blog_id', function () {
  var  params = this.params;
  var encrypted = params.blog_id; 
  var decoded = Base64.decode(encrypted); 
  Session.setPersistent("detailed_blog_id",decoded);
    
  this.render('blog_detail1');
},{
    onAfterAction: function() {
      return setTitle('Blog Detail');
    }
});

Router.route('/Group_member/:grp_id', function () {
  var  params = this.params;
  var encrypted = params.grp_id; 
  var decoded = Base64.decode(encrypted); 
  
  this.render('Group_member_page');
},{
    onAfterAction: function() {
      return setTitle('Group Members');
    }
});



///Search 
Router.route('/search/:search_keyword', function () {
  var  params = this.params;
  var search_keyword = params.search_keyword; 
  Session.setPersistent("search_keyword",search_keyword);  
  this.render('search');
},{
    onAfterAction: function() {
      return setTitle('Search');
    }
});


Router.route('/notification', function () {
  this.render('notification');
},{
    onAfterAction: function() {
      return setTitle('Notifications');
    }
});


/*Router.route('/add_educational_details', function () {
  this.render('add_educational_details');
});

Router.route('/add_achivement', function () {
  this.render('add_achivement');
});

Router.route('/edit_achivement', function () {
  this.render('edit_achivement');
});

Router.route('/add_skills', function () {
  this.render('add_skills');
});

Router.route('/edit_skills', function () {
  this.render('edit_skills');
});
*/


Router.route('/edit_professional_details/:professional_id', function () {
 this.render('edit_professional_details');
},{
    onAfterAction: function() {
      return setTitle('Edit Professional Detail');
    }
});

Router.route('/add_professional_details', function () {
 this.render('add_professional_details');
},{
    onAfterAction: function() {
      return setTitle('Add Professional Detail');
    }
});
Router.route('/edit_educational_details/:id', function () {
 this.render('edit_educational_details');
},{
    onAfterAction: function() {
      return setTitle('Edit Educational Detail');
    }
});
Router.route('/add_educational_details', function () {
  this.render('add_educational_details');
},{
    onAfterAction: function() {
      return setTitle('Add Educational Detail');
    }
});

Router.route('/add_achivement', function () {
  this.render('add_achivement');
},{
    onAfterAction: function() {
      return setTitle('Add Achivement');
    }
});

Router.route('/edit_achivement/:id', function () {
  this.render('edit_achivement');
},{
    onAfterAction: function() {
      return setTitle('Edit Achivement');
    }
});

Router.route('/add_skills', function () {
  this.render('add_skills');
},{
    onAfterAction: function() {
      return setTitle('Add Skills');
    }
});

Router.route('/edit_skills/:skill_id', function () {
    var  params = this.params; // { _id: "5" }
    var skill_id = params.skill_id; // "5"   
  this.render('edit_skills');
},{
    onAfterAction: function() {
      return setTitle('Edit Skills');
    }
});

Router.route('/edit_summary', function () {
  this.render('edit_summary');
},{
    onAfterAction: function() {
      return setTitle('Edit Summmary');
    }
});

Router.route('/edit_passion', function () {
  this.render('edit_passion');
},{
    onAfterAction: function() {
      return setTitle('Edit Passion');
    }
});

Router.route('/ads', function () {
  this.render('ads_listing');
},{
    onAfterAction: function() {
      return setTitle('Edit Passion');
    }
});

Router.route('/cookies', function () {
  this.render('cookies');
},{
    onAfterAction: function() {
      return setTitle('Cookies Policy');
    }
  });
Router.route('/privacy', function () {
  this.render('privacy');
},{
    onAfterAction: function() {
      return setTitle('Privacy Policy');
    }
  });
Router.route('/useragreement', function () {
  this.render('useragreement');
},{
    onAfterAction: function() {
      return setTitle('User Agreements');
    }
  });

Router.route('/settings', function () {
  this.render('settings');
},{
    onAfterAction: function() {
      return setTitle('Settings');
    }
  });

Router.route('/abusive_reports', function () {
  this.render('abusive_reports');
},{
    onAfterAction: function() {
      return setTitle('Abusive Reports');
    }
  });

Router.route('/post_detail_admin/:post_id/:post', function () {
  var  params = this.params;
  var encrypted = params.post_id; 
  var post = params.post;
  var decoded = Base64.decode(encrypted); 
  if(post == "post"){
    Session.set("current_post_id","post");
    Session.set("post_id",decoded);
  }else{
    Session.set("current_post_id",post);
    Session.set("post_id",decoded);
  }

  this.render('post_detail_admin');
},{
    onAfterAction: function() {
      return setTitle('Detail Page');
    }
});

