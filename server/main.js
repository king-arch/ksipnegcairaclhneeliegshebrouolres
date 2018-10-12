
import { Meteor } from 'meteor/meteor';
import { UserInfo }  from './../import/collections/insert.js';
import { UserSkill } from './../import/collections/insert.js';
import { UserProfJr } from './../import/collections/insert.js';
import { UserEdu } from './../import/collections/insert.js';

import { UserAward } from './../import/collections/insert.js';
import { UserMedical } from './../import/collections/insert.js';
import { FriendRequest } from './../import/collections/insert.js';
import { Message } from './../import/collections/insert.js';
import { UserGroup } from './../import/collections/insert.js';

import { Email } from 'meteor/email';
import { GroupRequest } from './../import/collections/insert.js';
import { Chatroom } from './../import/collections/insert.js';
import { VideoSession } from './../import/collections/insert.js';
import { AudioSession } from './../import/collections/insert.js';

import { ServiceConfiguration } from 'meteor/service-configuration';
import { Emembers } from './../import/collections/insert.js';
import { Event } from './../import/collections/insert.js';
import { Blog } from './../import/collections/insert.js';
import { Comment } from './../import/collections/insert.js';

import { Like } from './../import/collections/insert.js';
import { Followers } from './../import/collections/insert.js';
import { Hub } from './../import/collections/insert.js';
import { Discussion } from './../import/collections/insert.js';
import { Notifications } from './../import/collections/insert.js';

import { Privacy } from './../import/collections/insert.js';
import { advertisement } from './../import/collections/insert.js';
import { PollOption } from './../import/collections/insert.js';
import urlMetadata from 'url-metadata';


  
     Meteor.publish('like_based_on_comments_id', function(comment_id) {
      return Like.find({comment_id: comment_id});
    });

    Meteor.publish('like_based_on_discussion_id', function(postId) {
      return  Like.find({discussion_id: postId, like_type: 'Discussion_like'})
    });


    Meteor.publish('like_based_on_blog_id_and_comment_id', function(blog_id,comment_id) {
      return Like.find({like_type: 'blog_comment', blog_id: blog_id, comment_id: comment_id});
    });  

    Meteor.publish('like_based_on_blog_id', function(blog_id) {
      return Like.find({blog_id: blog_id,like_type: 'main_blog'});
    });

     Meteor.publish('like_based_on_event_id_and_comment', function(event_id,comment_id) {
      return Like.find({like_type: 'event_comment',event_id: event_id,comment_id: comment_id});
    });    
    Meteor.publish('all_user_friends_in_messaging', function(sent_to) {
      return FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] });
    });

      Meteor.publish('recent_list_in_connections', function(user_id) {
      return Chatroom.find({ $or: [{ user1: user_id },{ user2: user_id } ] },{sort: {last_msg_time: -1}})
    });  Meteor.publish('recent_list_in_connections_and_other_user', function(user1,user2) {
      return Chatroom.find({ $or: [
           {
            $and:
             [
              {
               user1: user1
              },
              {
               user2: user2
              }
             ]
           } ,
          { 
            $and:
              [
             {  
              user1: user2
             },
             {
              user2: user1
             }
            ]   
           }
           ] });

    }); 
      Meteor.publish('chatroom_messages_details', function(user_id,logged_in) {
      return Chatroom.find({ $or: [
           {
            $and:
             [
              {
               user1: user_id
              },
              {
               user2: logged_in
              }
             ]
           },
          { 
            $and:
              [
             {  
              user1: logged_in
             },
             {
              user2: user_id
             }
            ]
           }
           ] },  {sort: {last_msg_time: -1}})
    });



    Meteor.publish('user_info_based_on_id', function(user_id) {
      return UserInfo.find({"user_id":user_id}); 
    });

    Meteor.publish('user_info_based_on_email', function(email) {
      return UserInfo.find({"email":email}); 
    });

    Meteor.publish('get_user_info_to_send_mail', function(user_id) {
      return UserInfo.find({"user_id":user_id}); 
    });

    Meteor.publish('user_info_for_connections', function() {
      return UserInfo.find({}); 
    });

    Meteor.publish('user_info_all_friends', function(user_id) {
      return FriendRequest.find({ $or: [ { sent_to: user_id },{ sent_by: user_id }] }); 
    });


    Meteor.publish('all_likes', function() {
      return Like.find({}); 
    });
    Meteor.publish('all_comments', function() {
      return Comment.find({}); 
    });

    
    Meteor.publish('all_ads', function() {
      return advertisement.find({}); 
    });
    
      Meteor.publish('feed_blogs', function() {
      return  Blog.find( {$and:[{is_draft: 0},{is_active: 1}]},{limit: 5}); 
    });


      Meteor.publish('today_s_event', function(currentUser) {
      var  mydate=new Date();
    var str=moment(mydate).format('YYYY-MM-DD');
    var all_friends_array= new Array();
     // var currentUser = Session.get("userId");
     var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] },
       { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();

   for(var i=0;i<allFriends.length;i++){
    if(allFriends[i].sent_to == currentUser){
        all_friends_array.push(allFriends[i].sent_by);
    }else{
        all_friends_array.push(allFriends[i].sent_to);
    }
   }
   all_friends_array.push(currentUser);
  

  if(currentUser != 'user_admin'){
   var include_admin = 'user_admin';
   all_friends_array.push(include_admin);
   }

    var query = new RegExp(currentUser,'i');   

   // var lists = Event.find().count();
    var lists = Event.find({
                               $and: 
                                [ 
                                  {
                                    event_start_date: {
                                                      $lte: str
                                                    }                                                 
                                  },
                                  {
                                       event_end_date: {
                                                      $gte: str
                                                    }
                                  },
                                  {
                                   status: 
                                      {
                                        $ne: 'Inactive'
                                      } 
                                  },
                                    {
                                      invite_accepted : query
                                    }
                                ] 
                              });
      return lists;                         
    });


      Meteor.publish("blogs_for_hub_section",function(currentUser){
        var mydate=new Date();         
        var str=moment(mydate).format('YYYY-MM-DD');   
        var all_friends_array= new Array();
        // var currentUser = Session.get("userId");
        var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();
           for(var i=0;i<allFriends.length;i++){
            if(allFriends[i].sent_to == currentUser){
                all_friends_array.push(allFriends[i].sent_by);
            }else{
                all_friends_array.push(allFriends[i].sent_to);
            } 
            }
          all_friends_array.push(currentUser);
          var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_creator_id:{ $in:  all_friends_array  }} ,{Blog_publish_date:{$lte:str}}]});
          // var published_by_me = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_id:this.post_id},{blog_creator_id:{ $in:  all_friends_array  }}]}).fetch();
          // console.log(published_by_me);
          return published_by_me;
      })


    Meteor.publish('group_count_for_current_user', function(user_id) {
      var count3 = UserGroup.find({ admin: user_id });
       return count3;
    });
      
    Meteor.publish('blogs_you_may_like_to_read', function() {
      return Blog.find( {$and:[{is_draft: 0},{is_active: 1}]},{sort: {createdAt: 1},limit: 5})
    });
    
    Meteor.publish('user_group_count', function(user_id) {
      return UserGroup.find({ admin: user_id });
    });
    
     Meteor.publish('show_connection_count', function(sent_to) {
      return FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] });
    });
     Meteor.publish('comments_based_on_discussions', function(discussion_id,comment_id) {
      return Comment.find({discussion_id: discussion_id, comment_type: 'Discussion_reply',parent: comment_id,commentActivityStatus: 0 });
    });
    
    Meteor.publish('blog_count_for_current_user', function(logged_in_user) {
      // var logged_in_user = Session.get("other_user_profile");
        // var logged_in_user = Session.get("userId");
          var mydate=new Date();         
          var str=moment(mydate).format('YYYY-MM-DD');
          var c1 =Blog.find({ $and:[
          {is_draft: 0},
          {is_active: 1},
         {blog_creator_id:logged_in_user}
        ,{Blog_publish_date:{$lte:str}}]});
          return c1; 
    });

    Meteor.publish('connection_count_for_current_user', function(sent_to) {
      var count3 = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },{ req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] });
       return count3;   
    });

    Meteor.publish('get_feed_data_based_on_user_id', function(user_id, all_friends_array,limit) {
   //  var all_friends_array= new Array();
   //  var currentUser = user_id;
   // var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();

   // for(var i=0;i<allFriends.length;i++){
   //  if(allFriends[i].sent_to == currentUser){
   //      all_friends_array.push(allFriends[i].sent_by);
   //  }else{
   //      all_friends_array.push(allFriends[i].sent_to);
   //  }
   // }
   // all_friends_array.push(currentUser);
  
   //  if(currentUser != 'user_admin'){
   //     var include_admin = 'user_admin';
   //     all_friends_array.push(include_admin);
   // }

    var hubdata = Hub.find({post_creator_id: { $in:  all_friends_array  } , 
                  postActivityStatus: {$ne: 0} },{sort: {post_created_time: -1}, limit: limit*5});
  
    return hubdata;
    });

    //Blog Pub/sub
    Meteor.publish("like_based_on_post_id",function(post_id){
       var result = Like.find({post_id: post_id});
       return result;
    });

    Meteor.publish("comment_based_on_post_id",function(post_id){
      return Comment.find({post_id: post_id, comment_type: 'hub_orignal',commentActivityStatus: 0});
    });
     Meteor.publish("comment_reply_based_on_post_id",function(post_id,comment_id){
      return Comment.find({post_id: post_id, comment_type: 'hub_reply',parent: comment_id,commentActivityStatus: 0}); 
    });
    Meteor.publish("comment_based_comment_id",function(comment_id){
       var result = Comment.find({comment_id: comment_id,commentActivityStatus: 0});
       return result;
    });
    Meteor.publish("all_blog_data",function(detailed_blog_id){
      return Blog.find({blog_id: detailed_blog_id});            ;
    })
      Meteor.publish("fetch_all_followers",function(current_logged_in){
      return Followers.find({following: current_logged_in,is_follower:1});            
    })
       Meteor.publish("fetch_all_following",function(current_logged_in){
      return Followers.find({follower: current_logged_in,is_follower:1});            
    })
    //    Meteor.publish("like_based_on_blog_id",function(blog_id){
    //   return  Like.find({blog_id: blog_id,like_type: 'main_blog'});    
    // })
    Meteor.publish("comment_based_on_blog_id",function(blog_id){
      return  Comment.find({blog_id: blog_id, comment_type: 'orignal', commentActivityStatus: 0} ,{sort: {createdAt: -1}});    
    })

    
    Meteor.publish("logged_user_in_user_friends",function(user_id){
      return  FriendRequest.find({ $or: [ { $and: [ { sent_to: user_id  },{ req_status: 1 } ] }, { $and: [{ sent_by: user_id  },{ req_status: 1 } ] } ] })    
    })
    
    Meteor.publish("fetch_all_blogs_data",function(){
       var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');   
      return Blog.find({ $and:[{Blog_publish_date:{$lte:str}},{  status: {$ne: 'Inactive'} } ]},{sort: {Blog_publish_date: -1}});
    })
     
    Meteor.publish("fetch_all_user_blogs",function(user_id){
       var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');   
      return Blog.find({ $and:[{blog_creator_id:user_id} ]},{sort: {Blog_publish_date: -1}})
    })
    

    
    Meteor.publish("fetch_user_followers",function(user_id,blog_creator_id){  
      return Followers.find({follower:user_id,following: blog_creator_id,is_follower:1})
    })
        
    Meteor.publish("all_friend_users",function(){  
      return FriendRequest.find({});
    })
    
    Meteor.publish("all_user_related_friend_data",function(currentUser){  
      return FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] },
       { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] });
    })
    

    Meteor.publish("all_followers",function(){  
          return Followers.find({});
    })   
     Meteor.publish("fetch_blogs_content",function(blog_id){  
          return Blog.find({blog_id:blog_id});
    })


     Meteor.publish("blog_information_based_on_blog_id",function(blog_id){  
          return Blog.find({blog_id:blog_id});
    })  

     Meteor.publish("detailed_event_subscription",function(event_id){  
          return Event.find({event_id:event_id});
    })
    
     Meteor.publish("event_based_on_event_id",function(event_id){  
          return Event.find({event_id:event_id});
    })

     Meteor.publish("all_users_with_searched_keyword",function(user_id,query){  
       var query = new RegExp(query,'i');  
       return  UserInfo.find({email_status: 1,name:query, 
               $and: [ 
                      { user_id: 
                              { $ne: user_id }
                       }, 
                       { user_id:
                              { $ne: 'user_admin' }
                       },
                       {
                        status: {$ne: 'Inactive'}
                       }

                    ]
                 });
    });
    // TO be removed  
     Meteor.publish("all_users",function(){  
       return  UserInfo.find({});
     });


    Meteor.publish("all_groups_with_searched_keyword",function(query){  
        var all_open_group =  UserGroup.find({$and:[{grp_title: query},{ status: {$ne: 'Inactive'} },{$or:[{grp_type: "Open" },{ "grp_type": "Public" }]}]});
      return all_open_group;
    });
    
    Meteor.publish("all_events_with_searched_keyword",function(search_keyword){   
        const query = new RegExp(search_keyword,'i');   
        var  mydate=new Date();
        var str=moment(mydate).format('YYYY MM DD');
        var lists = Event.find({event_name:query,event_start_date:{$lte:str}, status: {$ne: 'Inactive'} });
        return lists;
    });
    Meteor.publish("all_blogs_with_searched_keyword",function(search_keyword){   
      // var search_keyword = Session.get("search_keyword");
       var  mydate=new Date();
      const query = new RegExp(search_keyword,'i');   
      var str=moment(mydate).format('YYYY-MM-DD');          
      allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_title:query},{Blog_publish_date:{$lte:str}},{ status: {$ne: 'Inactive'} }]});
      return allBlogs;
    });

    // Other's Profile
    Meteor.publish("user_skills_other_user",function(other_user_id){
      return UserSkill.find({user_id:other_user_id});
    })

   Meteor.publish("user_professional_journey_other_user",function(other_user_id){
      return UserProfJr.find({user_id: other_user_id});
    })
   Meteor.publish("user_education_other_user",function(other_user_id){
      return UserEdu.find({user_id: other_user_id});
    })
     Meteor.publish("user_award_other_user",function(other_user_id){
      return UserAward.find({user_id: other_user_id});
    })
     Meteor.publish("user_medical_other_user",function(other_user_id){
      return UserMedical.find({user_id: other_user_id});
    });



     // Connections Subscription

     Meteor.publish("user_related_connections",function(user_id){
      return FriendRequest.find({$or:[
                                        {sent_to: user_id},
                                        {sent_by: user_id}
                                     ]
                                });
    });


     // Event Listing Subscription
      Meteor.publish("all_events_for_todays",function(){
          var mydate=new Date();
      var str=moment(mydate).format('YYYY-MM-DD');
      return  Event.find({ $and: [ { 
                                    event_start_date: { $lte: str }
                                    },
                                    { 
                                    event_end_date: {
                                                      $gte: str
                                                    }
                                  },
                                  {
                                   status: {
                                        $ne: 'Inactive'
                                      }
                                    }
                                  ] });
     });

      Meteor.publish("all_upcoming_events",function(){
          var mydate=new Date();
      var str=moment(mydate).format('YYYY-MM-DD');
      return  Event.find({event_start_date:{$gt:str}, status: {$ne: 'Inactive'} });
     });

      Meteor.publish("all_past_events_with_created_date_greater_than_user",function(gt_str){
          var mydate=new Date();
      var str=moment(mydate).format('YYYY-MM-DD');
      return Event.find({$and: 
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
                              });
     });

      Meteor.publish("all_events",function(){
        return Event.find({});
      })

      // Admin subscription for todays event in event listing

      Meteor.publish("all_events_for_todays_for_admin",function(){
          var mydate=new Date();
      var str=moment(mydate).format('YYYY-MM-DD');
      return  Event.find({event_start_date:str});
     }); 
      Meteor.publish("all_upcoming_events_for_admin",function(){
          var mydate=new Date();
      var str=moment(mydate).format('YYYY-MM-DD');
      return  Event.find({event_start_date:{$gt:str}})
     });


      // Notifications Subscription
      Meteor.publish("all_user_related_notifications",function(userId)
      {
      return Notifications.find({"notification_for":userId , "notification_by" :  {$ne:userId} },{sort: {created_at: -1} });
      }) 
      Meteor.publish("notification_observer",function(userId)
      {
      return Notifications.find({"notification_by":userId});
      })


      Meteor.publish("check_for_new_connection_requests",function(logged_in_user)
      {
      return FriendRequest.find({ req_status: 0, sent_to: logged_in_user })
      }); 

      // Group Subscription
      Meteor.publish("all_group_requests_for_logged_in_user",function(user_id)
      {
      return UserGroup.find({  sent_by: user_id })
      });

      Meteor.publish("all_discussions_based_on_group",function(group_id)
      {
      return  Discussion.find({"grp_id":group_id});
      });

      Meteor.publish("discussions_based_on_discussion_ids",function(group_id)
      {
      return  Discussion.find({ discussion_id: discussion_id });
      });

     Meteor.publish("all_discussions",function()
      {
      return  Discussion.find({});
      }); 
       Meteor.publish("all_groups",function()
      {
      return  UserGroup.find({});
      });
    
     Meteor.publish("group_information_based_on_group_id",function(group_id)
      {
      return  UserGroup.find({grp_id: group_id});
      });

    
      Meteor.publish("hub_post_information",function(post_id)
      {
      return  Hub.find({post_id: post_id});
      }); 

      Meteor.publish("check_for_follower",function(current_logged_in,weather_I_am_following_this_person)
      {
      return  Followers.find({follower: current_logged_in,following:weather_I_am_following_this_person,is_follower:1})
      });


     // Messaging Section
     Meteor.publish("all_user_chatrooms",function(user_id){
        return  Chatroom.find({ $or: [{ user1: user_id },{ user2: user_id } ] },{sort: {last_msg_time: -1}});
     }) 

     Meteor.publish("all_user_messages",function(user_id){
         return  Message.find({ $or: [{ sent_to: user_id },{sent_by : user_id } ] });
     });

  
    Meteor.publish("feed_data_based_on_feed_id",function(post_id){
         return  Hub.find({"post_id":post_id},{sort: {post_created_time: -1}});
     });



     Meteor.publish("advertisement_ticker",function(){
       var mydate=new Date();
      var  str=moment(mydate).format('YYYY-MM-DD');
      var str2 = str.split("-").join(" ");

      return advertisement.find({
                                        $and: [
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
     })




    Meteor.publish("check_if_user_is_a_friend",function(logged_in_user,friend_id){  
      return FriendRequest.find({ $or: [ { $and: [ { sent_to: friend_id },{sent_by: logged_in_user},{ req_status: 1 } ] }, { $and: [{ sent_by: friend_id },{sent_to: logged_in_user},{ req_status: 1 } ] } ] });
    })


    Meteor.publish("all_events_with_event_start_date_greater_than_today",function(str){
      return Event.find({event_start_date:{$gt:str}, status: {$ne: 'Inactive'} });
    });
    
    Meteor.publish("all_events_created_by_user",function(user_id){
     var cretedbyme = Event.find({event_admin:user_id ,status: {$ne: 'Inactive'} });
     return cretedbyme;
    });

   Meteor.publish("events_whose_start_date_is_today",function(str){  
          return Event.find({event_start_date:str});
    })
       Meteor.publish("event_start_date_greater_than_current_date",function(str){  
          return Event.find({event_start_date:{$gt:str}});
    })
  
    Meteor.publish("all_past_events",function(str){  
          return Event.find({event_start_date:{$lt:str}});
    })

    Meteor.publish("event_check_for_user",function(user_id,event_id){
     var event = Event.find({user_id:user_id,event_id:event_id});
     return event;
    });
    
     Meteor.publish("all_past_events_greater_than_user_creation_date_and_less_than_current_date",function(Sort_when_user_created,str){
     var past = Event.find({$and: 
                                    [
                                      { event_end_date: 
                                                          {
                                                            $gt: Sort_when_user_created
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
                            });
     return past;
    });
     

     /*Router.route('/fetch_all_users',{where: 'server'})
   .get(function(){
      var response =UserInfo.find({"email_status": 1}).fetch();
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   });*/
   
Router.route('/fetch_user_friends',{where: 'server'}).post(function(){
    var currentUser =  this.request.body.user_id;
   var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();
   var all_friends_array = new Array();
   for(var i=0;i<allFriends.length;i++){
    if(allFriends[i].sent_by == currentUser){
        all_friends_array.push(allFriends[i].sent_to);
    }else {
        all_friends_array.push(allFriends[i].sent_by);
    }
   }
   all_friends_array.push(currentUser);
  
    if(currentUser != 'user_admin'){
   var include_admin = 'user_admin';
   all_friends_array.push(include_admin);
   }


   console.log(all_friends_array);
      var response = {
               "data" : all_friends_array
           }
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));

});

Router.route('/upload_image',{where: 'server'})
   .get(function(){
      var response = {
               "error" : false,
               "message" : "User added."
           }
       this.response.setHeader('Content-Type','application/json');
       this.response.end(JSON.stringify(response));
   })

   .post(function(){

     var response = this.response;
     var fs = require('fs');
     var data = this.request.body.image_data;
     var buf = new Buffer(data, 'base64');
     var refrence = this;

     var image = 'image'+Math.floor((Math.random() * 2465789) + 1)+".png";
     // var path = require('fs').realpathSync( process.cwd() + '/../../../../../public/');
     var path ="/var/www/html/special/public/uploads";

     fs.writeFile(path+"/"+ image,buf,function(err,success){
         if(err){
             var response = {
                       "p":path,
                       "result" : err,
                       "message" : "data",
                       "path":process.cwd(),
                       "dirname":__dirname,
                   };
         }else{
             var response = {
                       "result" : image,
           "path":path,
           "dirname":__dirname,
           "cwd":process.cwd(),                        
                       "message" : "data"
                   };
         }
         // console.log("file Created");
         
             refrence.response.setHeader('Content-Type','application/json');
             refrence.response.end(JSON.stringify(response));

           });
   });

   
Meteor.startup(function () {
  



  Push.debug = true;
  Push.Configure({
  gcm: {
      apiKey: 'AIzaSyAFAr37deN7Z9LuRPiWF2W09zve8v3JMDU',
      }

  // production: true,
  // 'sound' true,
  // 'badge' true,
  // 'alert' true,
  // 'vibrate' true,
  // 'sendInterval': 15000, Configurable interval between sending
  // 'sendBatchSize': 1, Configurable number of notifications to send per batch
  // 'keepNotifications': false,
//

});


  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/uploaded/'
  })
});




//    var t1 = Presence.configure({
//   state: function() {
//     return {
//       online: false
//     }
//     userId: cool;
//   }
// });

//     if(t1 == 0){
//      alert('i am active');
//      console.log('active');
//     }

//     else if( t1 == 1 || t1 == 2){
//        alert('i am inactive');
//        console.log('In-active');
//        Session.setPersistent("login_status",0);              
//     }

//     else{
//      console.log('In-active');
//     }
  

  // URL of the POST request

//////////////// GOoLGE Analytics Event CApturing Code //////////////////////////

/*
var url = "//www.google-analytics.com/collect"
var site = window.location.hostname

//Get the current unix time in JS and assign it to the cid
var cid = Date.now();

// Parameters of the POST request notice the different UA
var data = 'v=1&tid=UA-119353328-1&cid=' + cid + '&t=event&ec=' + site + '&ea=click&el=button'

document.getElementById('click').addEventListener('click', function() {
    console.log("sent", data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.onload = function(e) {
        console.log('loaded', e);
    };
    xhr.send(data);
});*/

///////////////// GOoLGE Analytics Event CApturing Code  ///////////////////////// 

  SyncedCron.config({
    collectionName: 'somethingDifferent'
  });

  SyncedCron.add({
    name: 'Crunch some important numbers for the marketing department',
    schedule: function(parser) {
      // parser is a later.parse object

      return parser.text('every 10 seconds');
    }, 
    job: function(intendedAt) {
      // console.log('crunching numbers');
      console.log('job should be running at:');
      // console.log(intendedAt);
      var make_all_chatrooms_non_typing = Chatroom.find({}).fetch();
      for(var i = 0; i < make_all_chatrooms_non_typing.length ; i++){
        if(make_all_chatrooms_non_typing[i].currently_typing != 0  || make_all_chatrooms_non_typing[i].currently_typing !=""){
           
           var result = Chatroom.update({
              _id: make_all_chatrooms_non_typing[i]._id,
            }, {
              $set: {
                              currently_typing: ""
                    }
            });           
        }
      }
      var allUsers = UserInfo.find({"online_status":"online"}).fetch();
      for(i=0;i<allUsers.length;i++){ 
          if((Date.now() - allUsers[i].last_activity_time) >= 60*1000){
          make_user_offline(allUsers[i].user_id);
          }
    }
      }
  });
  
     function make_user_offline(userId){
          var newUser = UserInfo.find({"user_id":userId}).fetch();
            if(newUser[0]){
            var result = UserInfo.update({
                _id: newUser[0]._id,
              }, {
                $set: {
                  "online_status": "offline",
                  "action_done_by":"admin",
                  "offline_at":Date.now()
                }
              });
            }
            return result;  
        }

        

  Meteor.startup(function () {
    // code to run on server at startup
    SyncedCron.start();
    
    // Stop jobs after 15 seconds
    // Meteor.setTimeout(function() { SyncedCron.stop(); }, 1050 * 1000);
  });

ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.insert({
  service: "google",
  // clientId: "902550023835-tpo7a94rp3jn1b9vajtng9mn8anhd7re.apps.googleusercontent.com",
  // clientId: "811376078975-gslj9rfgubco8946vjjmgod73dvho42h.apps.googleusercontent.com",
    clientId: "126159632597-e396vmihkhh8g2emu2u5n4fndktqjod9.apps.googleusercontent.com",

 // secret: "2HJIcxP16CafxFz-wVqfYCK1",
  // secret: "ONCA6YhP8ZCXmp4N9YY2ke5c",
    
 secret: "qZlmrGeiuAA_ohGfkx2M-_JS",
});

// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "784566848397487",
  secret: "678712697eae8bdc3cff25938136e2b9"
});

ServiceConfiguration.configurations.remove({
  service: "linkedin"
});

ServiceConfiguration.configurations.insert({
  service: "linkedin",
  clientId: "78eqh4qk0yx7y7",
  secret: "ixPAnSBiCtBq6WPJ"
});
// // first, remove configuration entry in case service is already configured
// Accounts.loginServiceConfiguration.remove({
//   service: "facebook"
// });
// Accounts.loginServiceConfiguration.insert({
//   service: "facebook",
//   appId: "784566848397487",
//   secret: "678712697eae8bdc3cff25938136e2b9"
// });

 smtp = {
    username: 'specialneighborhoodteam@gmail.com',
    password: 'SpNe1@J#n@',
    server: 'smtp.gmail.com',
    port: 587
  }
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

Meteor.methods({
  redirect_user_to_desired_page:function(email,name,profile,source){
   console.log(email)
   console.log(name)
   console.log(profile)
   console.log(source)
   var check_if_user_exits  = UserInfo.find({email: email,source:source}).fetch();
   if(check_if_user_exits.length != 0){
       return check_if_user_exits[0].user_id;
   }else{
    var user_id ="user_id_"+Math.floor((Math.random() * 2465789) + 1);
         var result =UserInfo.insert({
             name: name,
             email: email,
             user_id: user_id,
             source: source,
             email_status: 1,
             profile_pic:profile,
             createdAt:new Date() // no comma needed here
        });
         return user_id;
   }
 },

  fetch_all_users(){
    return UserInfo.find({"email_status": 1}).fetch();
  },
  fetch_event_details(event_id){
        var event = Event.find({event_id:event_id}).fetch();
        console.log(event);
        return event;
  },
  "fetch_all_user_friends":function(currentUser){
   var allFriends = FriendRequest.find({ $or: [ { $and: [ { sent_to: currentUser },{ req_status: 1 } ] }, { $and: [{ sent_by: currentUser },{ req_status: 1 } ] } ] }).fetch();
   var all_friends_array = new Array();
   for(var i=0;i<allFriends.length;i++){
    if(allFriends[i].sent_by == currentUser){
        all_friends_array.push(allFriends[i].sent_to);
    }else {
        all_friends_array.push(allFriends[i].sent_by);
    }
   }
   all_friends_array.push(currentUser);
  
    if(currentUser != 'user_admin'){
   var include_admin = 'user_admin';
   all_friends_array.push(include_admin);
   }


   console.log(all_friends_array);
   return all_friends_array;
  },
    "check_for_first_time_user":function(user_id){
      var result = UserInfo.find({"user_id":user_id}).fetch();
      if(result[0]){
        if(result[0].firstTimeUser == undefined || result[0].firstTimeUser != 1){
          
              var result =  UserInfo.update({
                  user_id: result[0].user_id,
                }, {
                  $set: {
                      firstTimeUser: 1,
                      }
                });
            return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
      
    },
    "user_login":function(user_email,user_password){  
      var user_Details =  UserInfo.find({email: user_email, password: user_password}).fetch(); 
      console.log("UserInfo" + user_Details);
      if(user_Details){
             return user_Details;
      }else{
        return "No User";
      }
  },
  
logout_google: function(name){
var result = Meteor.users.update({
   _id: name
}, {
   $set: {
       "services.resume.loginTokens": []
   }
}, {
   multi: true
});
return result;
},

  insert_address: function (userId,address,lat,long) {
    var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {"location": address,
           "lat":lat,
           "long":long}
      });
    }else{
      var result =UserInfo.insert({
          location:address,
              user_id:userId,
              lat:lat,
           long:long,
           source: '',
           status: '',

              createdAt: Date.now()// no comma needed here
         });
    }
    return result;
  },

 update_lat_long:function(lat,long,userId){
  update_last_activity_time(userId);
  var newUser = UserInfo.find({"user_id":userId}).fetch();  
var result =  UserInfo.update({
 _id: newUser[0]._id,
}, {
 $set: {
  "lat":lat,
  "long":long}
});
return result;
  
 },
update_user_token:function(userToken, userId){
  update_last_activity_time(userId);
  var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {"user_token": userToken}
      });
    }
  return "true";
},    
insert_contact_no: function (userId,contactno,ccode) {
    
    /*var newUser = UserInfo.find({"phone":contactno,"countrycode":ccode}).fetch();
    console.log(newUser)
    if(newUser.length == 0){*/

    var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
      var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {"phone": contactno,"countrycode":ccode}
      });
    }else{
      var result =UserInfo.insert({
          phone:contactno,
              user_id:userId,
              countrycode:ccode,
              status: '',
              source: '',
              createdAt:Date.now() // no comma needed here
         });
    }
    return result;
  }/*else{
    return "Number already exists";
  }}*/,

   insert_disabilities: function (userId,hearing, speech, visual, physical, special_note) {
    update_last_activity_time(userId);
    var newUser = UserMedical.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =UserMedical.update({
        user_id: userId,
      }, {
        $set: {
          "hearing": hearing,
          "speech": speech,
          "visual": visual,
          "physical": physical,
          "special_note": special_note,
        }
      });

    }else{

    var result = UserMedical.insert({
              user_id: userId,
              hearing: hearing,
            speech: speech,
            visual: visual,
            physical: physical,
            special_note: special_note,
              createdAt: Date.now() // no comma needed here
         });


    var newUser = UserInfo.find({"user_id":userId}).fetch();
        if(newUser[0]){
        var result =  UserInfo.update({
            _id: newUser[0]._id,
          }, {
            $set: {"disablities": "true"}
          });
        }



    }

    return result;
  },
  upload_user_image:function(userId,profile_pic){
  update_last_activity_time(userId);
  var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {"profile_pic": profile_pic}
      });
    }else{

      var result =UserInfo.insert({
          profile_pic:profile_pic,
              user_id:userId,
              status: '',
              source: '',
              createdAt:Date.now() // no comma needed here
         });
    }
    return result;  
  }, 
  
  update_headline:function(userId,headline){
    
  update_last_activity_time(userId); 
  var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {

          "headline": headline,
          "firstTimeUser": 1
        }
      });
    }else{
      var result = UserInfo.insert({
          headline:headline,
              user_id:userId,
              login_status: 1,
              firstTimeUser: 1,
              status: '',
              source: '',
              createdAt:Date.now() // no comma needed here
         });

    }
    return result;  
  },
  
  firstTimeUser:function(userId){ 
    
  update_last_activity_time(userId); 
  var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {
              "firstTimeUser": 0
            }
      });
    }
    return result;  
  },

  update_summary:function(userId,summary){
    update_last_activity_time(userId);
  var newUser = UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result = UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {"summary": summary}
      });
    }else{
      var result =UserInfo.insert({
          summary:summary,
              user_id:userId,
              status: '',
              source: '',
              createdAt:Date.now() // no comma needed here
         });
    }
    return result;  
  },

create_user:function(userID,source,name,email,picture){
      var result =UserInfo.insert({
          name: name,
              email: email,
              user_id: userID,
              source: source,
              email_status: 1,
              profile_pic:picture,
              status: '',
              summary:'',
              createdAt:Date.now() // no comma needed here
         });
      update_last_activity_time(userID);
    return result;  
  },
 

 // ************************** View Profile functions starting ********************************
  
  
        con_req_insert: function(sent_to,sent_by){
console.log('here: ');
         var show_button = FriendRequest.find({ 
        $or: [ { $and: 
          [ { 
            sent_to: sent_to 
          }, { 
            sent_by: sent_by 
             }, { 
            sent_by: sent_by 
             } 
          ] }, 
          { $and: 
            [ { sent_to: sent_by }, 
            { sent_by: sent_to } ] 
             } ] }).fetch();

    var length = show_button.length;
    
    if(length >= 1){
      var check_req_status = show_button[length -1].req_status;
    }


    console.log('Here : '+length +' show_button[0].req_status: '+ check_req_status);
    console.log(show_button);

    if( length != 0 && check_req_status == 0){
        return false;
    }
    else{

var reqID = 'req_'+Math.floor((Math.random() * 2465789) + 1);

    update_last_activity_time(sent_by);
      var result = FriendRequest.insert({
        req_id: reqID,
        sent_to: sent_to,
        sent_by: sent_by,
        req_status: 0,
        requestedAt: Date.now(),
        updatedAt: Date.now()
        });

            var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: sent_by,

                      notification_for: sent_to,
                      notification_type: 'Friend_request_sent',
                      
                      sender_by: sent_by,
                      reciver_by: sent_to,

                      redirect_component: 0,
                      is_read: 0,
                      created_at: Date.now(),
           });                         

          var receiver_name = UserInfo.find({"user_id":sent_to}).fetch(); 
          var sender_name = UserInfo.find({"user_id":sent_by}).fetch(); 
          var notification_text = sender_name[0].name + " has sent you a connection request";
          if(receiver_name[0].user_token){
            send_notification(sent_to,"Connection Request",notification_text,receiver_name[0].user_token); 
          }
        return result;  
      }
        },

 // ************************** View Profile functions Ending ********************************
 

 // ************************** Connections functions Starting ********************************
 
        con_req_update: function(req_id,sent_by,sent_to,request_type){
        update_last_activity_time(sent_by);
    if(request_type==1){


      var receiver_name = UserInfo.find({"user_id":sent_to}).fetch();  
          var notification_text = receiver_name[0].name + " has accepted your connection request";
          if(receiver_name[0].user_token){
            send_notification(sent_by,"Connection Request Accepted",notification_text,receiver_name[0].user_token); 
          }   

      var followers = Followers.find({follower:sent_by,following: sent_to,is_follower:1}).fetch();
      if(followers.length == 0){
        Followers.insert({
            follower: sent_by,
            following: sent_to,
            is_follower:1,
            created_date:Date.now()
          });
      }
      var following = Followers.find({follower:sent_to,following: sent_by,is_follower:1}).fetch();
      if(following.length == 0){
        Followers.insert({
            follower: sent_to,
            following: sent_by,
            is_follower:1,
            created_date:Date.now()
            });
        }
           
        }
        var result = FriendRequest.update({
        req_id: req_id
      }, {
        $set: {"req_status": request_type,"updatedAt": Date.now()}
      });

      if(request_type == 1){
      var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: sent_by,

                      notification_for: sent_to,
                      notification_type: 'Friend_request',
                      req_id: req_id,
                      accepted_by: sent_to,
                      reuested_by: sent_by,

                      redirect_component: req_id,
                      is_read: 0,
                      created_at: Date.now(),
    });
      

  var notification_id2 = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);


                    var result_2 = Notifications.insert({
                    notification_id: notification_id2,
                      notification_by: sent_to,

                      notification_for: sent_by,
                      notification_type: 'Friend_request',
                      req_id: req_id,
                      accepted_by: sent_to,
                      reuested_by: sent_by,

                      redirect_component: req_id,
                      is_read: 0,
                      created_at: Date.now(),
    });
      }

       

      return result;
      },
        
        con_req_update_withid: function(req_id,request_type){

          
      var result = FriendRequest.update({
        req_id: req_id
      }, {
        $set: {
          "req_status": request_type,
          "updatedAt": Date.now(),
        }
      });     
        return result;
      },
        
      pers_info_update: function(name,gender,marital_status,phone,datepicker,autocomplete,user_id)
      {   
    update_last_activity_time(user_id);
      
      var result = UserInfo.update({'user_id': user_id},{$set: {'name': name,'gender': gender,
          'marital_status': marital_status,'phone': phone,'dob': datepicker,
          'location': autocomplete}});
    return result;
    },
      
      insert_education: function(user_id,course,board,school,score,edu_start_month,edu_start_year,edu_end_month,edu_end_year,edu_location)
      {
      update_last_activity_time(user_id);
      var result = UserEdu.insert({'user_id': user_id,'course': course,'board': board,
          'school': school,'score': score,'edu_start_month': edu_start_month,
          'edu_start_year': edu_start_year,'edu_end_month': edu_end_month,'edu_end_year': edu_end_year,'edu_location': edu_location });
    return result;
    },
      
      insert_profjr: function(company_name,job_title,start_month,start_year,end_month,end_year,Job_location,skill_used,key_responsibilities,job_type,user_id)
      {
      update_last_activity_time(user_id);
      var result = UserProfJr.insert({
         user_id: user_id,
         company: company_name,
         title: job_title,
         start_month: start_month,   
         start_year: start_year,   
         end_month: end_month,   
         end_year: end_year, 
         location: Job_location,
         skill: skill_used,
         key_responsibilities: key_responsibilities,
         job_type: job_type,
         createdAt: Date.now(),  
        });
    return result;
    },
      
    insert_awd: function(userId,awd_type ,description,awd_month,awd_year,awd_location)
      {
     update_last_activity_time(userId);   
      var result = UserAward.insert({
         user_id: userId,
         type: awd_type,
         description: description,
         awd_month: awd_month,   
         awd_year: awd_year,   
         location: awd_location,
         createdAt: Date.now(),  
        });
    return result;
    },
      
    update_awd: function(userId,edit_id,awd_type ,description,awd_month,awd_year,awd_location)
      {
     update_last_activity_time(userId);   
    var result = UserAward.update({
        _id: edit_id,
      }, {
        $set: {
               "type": awd_type,
               "description": description,
               "awd_month": awd_month,   
               "awd_year": awd_year,   
               "location": awd_location,
               "createdAt": Date.now(),   
        }
      });
    return result;
    },
      
      insert_skill: function(userId,awd_expert,last_used,skill_name)
      {
      update_last_activity_time(userId);
    var result = UserSkill.insert({
         user_id: userId,
         awd_expert: awd_expert,
         last_used: last_used,
         skill_name: skill_name, 
         createdAt: Date.now(),  
        });
    return true;
    },

      update_skill: function(edit_id,awd_expert,last_used,skill_name)
      {
    var user_id_from_skills = UserSkill.find({_id: edit_id}).fetch();
    if(user_id_from_skills[0].user_id){
    update_last_activity_time(user_id_from_skills[0].user_id);
    }
    var result = UserSkill.update({
        _id: edit_id,
      }, {
        $set: {
           awd_expert: awd_expert,
           last_used: last_used,
           skill_name: skill_name, 
           createdAt: Date.now(),     
        }
      });
    return true;
    },
    update_profjr: function(edit_id,company_name,job_title,start_month,start_year,end_month,end_year,Job_location,
          skill_used,key_responsibilities,job_type)
      {

      var user_id_from_prof = UserProfJr.find({_id: edit_id}).fetch();
    if(user_id_from_prof[0].user_id){
    update_last_activity_time(user_id_from_prof[0].user_id);
    }



    var result = UserProfJr.update({
            _id: edit_id
          },
            {
        $set: {
         company: company_name,
         title: job_title,
         start_month: start_month,   
         start_year: start_year,   
           
         end_month: end_month,   
         end_year: end_year, 
         location: Job_location,
         skill: skill_used,
         job_type: job_type,
         key_responsibilities: key_responsibilities,
         updatedAt: Date.now() ,
         }});
    return true;
    },

    update_profjr_2: function(edit_id,company_name,job_title,start_month,end_month,Job_location,
          skill_used,key_responsibilities,job_type)
      {


      var user_id_from_prof = UserProfJr.find({_id: edit_id}).fetch();
    if(user_id_from_prof[0].user_id){
    update_last_activity_time(user_id_from_prof[0].user_id);
    }


    var result = UserProfJr.update({
            _id: edit_id
          },
            {
        $set: {
         company: company_name,
         title: job_title,
         start_month: start_month,   
         start_year: start_year,   
           
         location: Job_location,
         skill: skill_used,
         job_type: job_type,
         key_responsibilities: key_responsibilities,
         updatedAt: Date.now() ,
         }});
    return true;
    },


    update_education: function(edit_id,course,board,school,score,edu_start_month,edu_start_year,edu_end_month,edu_end_year,edu_location)
      {
    
    var user_id_from_prof = UserEdu.find({_id: edit_id}).fetch();
    if(user_id_from_prof[0].user_id){
    update_last_activity_time(user_id_from_prof[0].user_id);
    }


    var result = UserEdu.update({
            _id: edit_id
        
          },
            {
        $set: {'course': course,'board': board,
          'school': school,'score': score,'edu_start_month': edu_start_month,
          'edu_start_year': edu_start_year,'edu_end_month': edu_end_month,'edu_end_year': edu_end_year,'edu_location': edu_location }
     });
    return true;
    },
        upload_cover_image: function(user_id,imagePath)
      {

      update_last_activity_time(user_id);
    var result = UserInfo.update({
        user_id: user_id,
      }, {
        $set: {
               "cover_image": imagePath,
               "lastUpdateAt": Date.now()
        }
      });
    return result;
    },

    upload_profile_image: function(user_id,imagePath)
      {
         update_last_activity_time(user_id);
    var result = UserInfo.update({
        user_id: user_id,
      }, {
        $set: {
               "profile_pic": imagePath,
               "lastUpdateAt": Date.now()
        }
      });
    return result;
    },

    upload_cover_image: function(user_id,imagePath)
      {
         update_last_activity_time(user_id);
    var result = UserInfo.update({
        user_id: user_id,
      }, {
        $set: {
               "cover_image": imagePath,
               "lastUpdateAt": Date.now()
        }
      });
    return result;
    },

        insert_message: function(sent_by,sent_to,msg_text,msg_id,chatroom_id,msg_img_id)
      {
    // update_last_activity_time(sent_by);
    var newUser = UserInfo.find({"user_id":sent_by}).fetch();
            if(newUser[0]){
            var result = UserInfo.update({
                _id: newUser[0]._id,
              }, {
                $set: {"online_status": "online"}
              });
            }
            // return result;

    var newUser = UserInfo.find({"user_id":sent_to}).fetch();
      if(newUser[0]){
      var name = newUser[0].name;
      
      if(newUser[0].user_token){
      Push.send({
            title: name,
            text: msg_text,
            from: 'server',
            badge: 1,
        query: {
                token: newUser[0].user_token
            }             
        }); 
      }
      
      }

    var result = Message.insert({ 
     msg_id: msg_id,
         sent_by: sent_by,
         sent_to: sent_to,
         chatroom_id:chatroom_id,
         msg_text: msg_text,
         image_attach: msg_img_id,
         sentAt: Date.now(),  
        });
    return true;
    }, 

        
        insert_message_With_img: function(sent_by,sent_to,msg_img_id,msg_id)
      {
        update_last_activity_time(sent_by);
    var result = Message.insert({
     msg_id: msg_id,
         sent_by: sent_by,
         sent_to: sent_to,
         msg_text: 0,
         image_attach: msg_img_id,
         sentAt: Date.now(),  
        });
    return true;
    }, 

    insert_message_With_attachment: function(msg_id,sent_to,sent_by,attach_name,attach_path,format)
      {
          update_last_activity_time(sent_by);
    var result = Message.insert({
     msg_id: msg_id,
         sent_by: sent_by,
         sent_to: sent_to,
         msg_text: 0,
         image_attach: 0,
         attachment_name: attach_name,
         attachment_path: attach_path,
         format: format,
         sentAt: Date.now(),  
        });
    return true;
    }, 
   
      sendEmail: function (userId, email) {
        // console.log(email);
        // console.log(userId);
      update_last_activity_time(userId);
            Email.send(email);
        },


    update_email_status:function(userId,email_status){
      update_last_activity_time(userId);
            var newUser = UserInfo.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  UserInfo.update({
              _id: newUser[0]._id,
            }, {
              $set: {"email_status": 1}
            });
          }
          return result;
        },      

    set_default_cover:function(userId,set_default){
      update_last_activity_time(userId);
            var newUser = UserInfo.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  UserInfo.update({
              _id: newUser[0]._id,
            }, {
              $set: {"cover_image": set_default}
            });
          }
          return result;
        },      

    set_default_profile_pic:function(userId,set_default){
      update_last_activity_time(userId);
            var newUser = UserInfo.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  UserInfo.update({
              _id: newUser[0]._id,
            }, {
              $set: {"profile_pic": set_default}
            });
          }
          return result;
        },

    update_login_status:function(login_status,userId){
      update_last_activity_time(userId);
            var newUser = UserInfo.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  UserInfo.update({
              _id: newUser[0]._id,
            }, {
              $set: {"login_status": login_status}
            });
          }
          return result;
        },

    update_passion:function(userId,passion){
      update_last_activity_time(userId);
            var newUser = UserInfo.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  UserInfo.update({
              _id: newUser[0]._id,
            }, {
              $set: {"passion": passion}
            });
          }
          return result;
        },
        
        remove_skill:function(skill_id){
        var user_id_from_skills= UserSkill.find({_id: skill_id}).fetch();
    if(user_id_from_skills[0].user_id){
    update_last_activity_time(user_id_from_skills[0].user_id);
    }


              var result =  UserSkill.remove({_id: skill_id });
          return result;
        },

        remove_award:function(awd_id){
    
    var user_id_from_award= UserAward.find({_id: awd_id}).fetch();
    if(user_id_from_award[0].user_id){
    update_last_activity_time(user_id_from_award[0].user_id);
    }

              var result =  UserAward.remove({_id: awd_id });
          return result;
        },

        remove_profjr:function(profjr_id){
          var user_id_from_prof= UserProfJr.find({_id: profjr_id}).fetch();
      if(user_id_from_prof[0].user_id){
      update_last_activity_time(user_id_from_prof[0].user_id);
      }
              var result =  UserProfJr.remove({_id: profjr_id });
          return result;
        },

        remove_education:function(edu_id){
          
          var user_id_from_edu= UserEdu.find({_id: edu_id}).fetch();
      if(user_id_from_edu[0].user_id){
      update_last_activity_time(user_id_from_edu[0].user_id);
      }

              var result =  UserEdu.remove({_id: edu_id });
          return result;
        },

        remove_group_request:function(sent_by,grp_id){

              var newGroup = UserGroup.find({grp_id: grp_id}).fetch();
              if(newGroup[0].admin){
          update_last_activity_time(newGroup[0].admin);
              }
              var result =  GroupRequest.remove({sent_by: sent_by, grp_id: grp_id});
          return result;
        },

        insert_group_request:function(req_id,sent_by,grp_id,status){
        
        update_last_activity_time(sent_by);
            
            var result = GroupRequest.insert({
               req_id: req_id,
               sent_by: sent_by,
               grp_id: grp_id,
               status: status,
               sentAt: Date.now(),  
              });
          return result;
        },

        Update_Chatroom:function(currentuserId, chatroom_id,user1,user2,last_msg,last_msg_id,last_msg_sent_by,connect_status,currently_typing){
        update_last_activity_time(currentuserId);           
            
            var newUser = Chatroom.find({chatroom_id: chatroom_id}).fetch();
          var total_messages = Message.find({"chatroom_id":chatroom_id}).count();
          // var total_messages = Message.find({"chatroom_id":chatroom_id}).count();
          if(newUser[0]){
          var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      total_messages:total_messages+1,
                            last_msg: last_msg,
                            last_msg_id:last_msg_id,
                            last_msg_time: Date.now(),
                        last_msg_sent_by: last_msg_sent_by, 
                        connect_status: connect_status, 
                        currently_typing: currently_typing

              }
            });
          }
          else{
            var result =  Chatroom.insert({
                        chatroom_id: chatroom_id, 
                        user1:        user1 , 
                        user2:        user2 , 
                        last_msg_id: last_msg_id,
                        last_msg: last_msg, 
                        mute_status_user2: 'Mute',
                        mute_status_user1: 'Mute',
                        last_msg_time: Date.now(),
                        last_msg_sent_by: last_msg_sent_by, 
                        connect_status: connect_status, 
                        currently_typing: currently_typing 
                    });
                  }
          return result;
        },

        Update_currently_typing:function(currentuserId, chatroom_id,currently_typing){  
      update_last_activity_time(currentuserId);           
            var newUser = Chatroom.find({chatroom_id: chatroom_id}).fetch();
          if(newUser[0]){
          var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                              currently_typing: currently_typing
                            }
            });
          }
          return result;
        },
        change_user_online_status:function(userId,status){    
          // update_last_activity_time(userId);           
          var newUser = UserInfo.find({"user_id":userId}).fetch();
            if(newUser[0]){
            var result = UserInfo.update({
                _id: newUser[0]._id,
              }, {
                $set: {"online_status": status}
              });
            }
            return result;  
        },
         update_chatroom_count:function(currentUserId, chatroom_id,count){
          update_last_activity_time(currentUserId); 
          console.log("chatroom_id" + chatroom_id);

          var newUser = Chatroom.find({chatroom_id: chatroom_id}).fetch();
            var updatedCount=0;
            console.log(newUser);
            if(!newUser[0].unread_msg_count && newUser[0].last_msg_sent_by != currentUserId){
              var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                          last_msg_time: Date.now(),
                              unread_msg_count: 1
                            }
            });
            }

          if(newUser[0].unread_msg_count){
          updatedCount  = newUser[0].unread_msg_count+1;
          }else{
          updatedCount  =1; 
          }
          if(count == 0){
            updatedCount = 0;
          }
          if(newUser[0]){
            if(updatedCount !=0 ){
              var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                     last_msg_time: Date.now(),
                              unread_msg_count: updatedCount
                            }
            });
            }else{


              if(newUser[0].last_msg_sent_by != currentUserId){
              var result = Chatroom.update({
              _id: newUser[0]._id,
             }, {
                $set: {
                    unread_msg_count: updatedCount
                            }
             });
  
              }
            } 
          }
          if(count == 0){
            if(newUser[0].last_msg_sent_by != currentUserId){
              var all_messages_for_this_chatroom =  Message.find({chatroom_id: chatroom_id, delivery_status : {
                                                                                                             $ne :  "read"
                                                                                                          }}).fetch();
            for(var i=0; i<all_messages_for_this_chatroom.length; i++){
                 var result = Message.update({
                    _id: all_messages_for_this_chatroom[i]._id,
                  }, {
                    $set: {"delivery_status": "read"}
                  });
            }
            }
            
          }
          return result;
        },
        update_last_msg_status:function(currentUserId,message_id,status){
      update_last_activity_time(currentUserId); 


          var newUser = Message.find({"msg_id":message_id}).fetch();
          if(status == "read"){
        var newUser = Message.find({"chatroom_id":newUser[0].chatroom_id}).fetch();
        for(var i=0;i<newUser.length;i++){
        var result = Message.update({
          _id: newUser[i]._id,
          }, {
          $set: {"delivery_status": "read"}
        });
        }
        
      
          }else{
          if(newUser[0]){
      var result = Message.update({
          _id: newUser[0]._id,
        }, {
          $set: {"delivery_status": status}
        });
      } 
          }
      
            return result;  
        },
        Update_Notification_satus_user1:function(currentUserId, chatroom_id,mute_status_user1){
      update_last_activity_time(currentUserId); 

        var newUser = Chatroom.find({chatroom_id: chatroom_id}).fetch();
          //var total_messages = Message.find({"chatroom_id":chatroom_id}).count();
          if(newUser[0]){
          var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  mute_status_user1: mute_status_user1,
              }
            });
          }
},
        Update_Notification_satus_user2:function(currentUserId,chatroom_id,mute_status_user2){
          update_last_activity_time(currentUserId); 
var newUser = Chatroom.find({chatroom_id: chatroom_id}).fetch();
          // var total_messages = Message.find({"chatroom_id":chatroom_id}).count();
          if(newUser[0]){
          var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  mute_status_user2: mute_status_user2,
              }
            });
          }
},
      maintain_video_session:function(videoSessionId, callerId,pickerId,chatRoom){
      // var newUser = VideoSession.find({$and: [{"caller_id":callerId},{"picker_id":pickerId},{"is_picked":true}]}).fetch();
      var newUser = VideoSession.find({"video_session_id":videoSessionId}).fetch();
            if(!newUser[0]){
            /*  var result = VideoSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  is_picked: false,
              }
            });*/
            var result =VideoSession.insert({
                video_session_id:videoSessionId,
                chatroom_id:chatRoom,
                caller_id:callerId,
                    picker_id:pickerId,
                    createdAt: Date.now()// no comma needed here
              });
            var newUser = Chatroom.find({chatroom_id: chatRoom}).fetch();
          if(newUser[0]){
            if(!newUser[0].video_session_counts){
            var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                     video_session_counts: 1,
                     video_session_id: videoSessionId,
                            }
            });

            }else{
            var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                     video_session_counts: newUser[0].video_session_counts+1,
                                video_session_id: videoSessionId,
                          }
            });
            }

            }
          return "Inserted";
          }else{
            var result = VideoSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  is_picked: true,
              }
            });
            return "Updated";
          }
                      

      },
      rejects_the_call:function(videoSessionId,status,type){
            if(type=="video"){
            var newUser = VideoSession.find({"video_session_id":videoSessionId}).fetch();
            var result = VideoSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  is_rejected: true,
              }
            }); 
          }else{
            var newUser = AudioSession.find({"audio_session_id":videoSessionId}).fetch();
            var result = AudioSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  is_rejected: true,
              }
            });
          } 
              return result;
        },
      change_video_chat_user_availability:function(videoSessionId,current_user,status){
        var newUser = VideoSession.find({"video_session_id":videoSessionId}).fetch();
        var type = "";
        if(newUser[0].is_picked){
          if(newUser[0].caller_id == current_user){
          
        var result = VideoSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  caller: status,
              }
            });

        }else{
        var result = VideoSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  picker: status,
              }
            });
        }
        }
        
        return status +" changed user "+current_user ;
      },
      maintain_audio_session:function(videoSessionId, callerId,pickerId,chatRoom){
      // var newUser = VideoSession.find({$and: [{"caller_id":callerId},{"picker_id":pickerId},{"is_picked":true}]}).fetch();
      var newUser = AudioSession.find({"audio_session_id":videoSessionId}).fetch();
            if(!newUser[0]){
            /*  var result = VideoSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  is_picked: false,
              }
            });*/
            var result =AudioSession.insert({
                audio_session_id:videoSessionId,
                chatroom_id:chatRoom,
                caller_id:callerId,
                    picker_id:pickerId,
                    createdAt: Date.now()// no comma needed here
              });
            var newUser = Chatroom.find({chatroom_id: chatRoom}).fetch();
          if(newUser[0]){
            if(!newUser[0].audio_session_counts){
            var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                     audio_session_counts: 1,
                     audio_session_id: videoSessionId,
                            }
            });

            }else{
            var result = Chatroom.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                     audio_session_counts: newUser[0].audio_session_counts+1,
                                audio_session_id: videoSessionId,
                          }
            });
            }

            }
          return "Inserted";
          }else{
            var result = AudioSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  is_picked: true,
              }
            });
            return "Updated";
          }
                      

      },
      change_audio_chat_user_availability:function(videoSessionId,current_user,status){
        var newUser = AudioSession.find({"audio_session_id":videoSessionId}).fetch();
        var type = "";
        if(newUser[0].is_picked){
          if(newUser[0].caller_id == current_user){
          
        var result = AudioSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  caller: status,
              }
            });

        }else{
        var result = AudioSession.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                  picker: status,
              }
            });
        }
        }
        
        return status +" changed user "+current_user ;
      },
      'serverNotification'(title, text,deviceToken) {
        Push.send({
          title,
          text,
          from: 'push',
          badge: 1,
          query: {
            token: {'gcm' : deviceToken}
          }
        });
    },
    change_pass:function(userid,pass){
        //alert(userid);
        update_last_activity_time(userid); 
          var result =  UserInfo.update({
              user_id: userid,
            }, {
              $set: {"password": pass}
            });
          
          return result;

      },

      save_user:function(userID,name,password,email){
        //alert(userid);
        var check_similar_mail_exists = UserInfo.find({email: email}).count();
        if(check_similar_mail_exists == 0){

          var result =  UserInfo.insert({
                      user_id:userID,
                      name: name,
                      email: email,
                      email_status: 0,
                      source: '',
                      password: password,
                      status: '',
                      summary:'',
                      theme_value: 3,
                      createdAt: Date.now() 
                    });
        }else{
          return "email_exists";
        }
          
        update_last_activity_time(userID); 
        
          return result;
      },



      check_for_google_login:function(getEmail,getName,getImageUrl,source){
        //alert(userid);
        var check_similar_mail_exists = UserInfo.find({email: getEmail , source: source}).fetch();
        if(check_similar_mail_exists[0]){

          
          if(check_similar_mail_exists[0].headline){
            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/feed',"userID": userID
              }

              update_last_activity_time(userID);

              return message;
          }
          else{

            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/signup',"userID": userID
              }
              update_last_activity_time(userID);

              return message;
}
        }else{

    var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);

                    var result =  UserInfo.insert({
                      user_id:userID,
                      name: getName,
                      email: getEmail,
                      email_status: 1,
                      source: source,
                      status: '',
                      summary:'',
                      profile_pic: getImageUrl,
                      theme_value: 3,
                      createdAt: Date.now() 
                    });

              var message = {
                "send_url": '/signup',"userID": userID
              }
              update_last_activity_time(userID);
              return message;

        }

      },


      check_for_facebook_login:function(getEmail,getName,getImageUrl,source){
        //alert(userid);
        var check_similar_mail_exists = UserInfo.find({email: getEmail , source: source}).fetch();
        if(check_similar_mail_exists[0]){

          if(check_similar_mail_exists[0].headline){
            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/feed',"userID": userID
              }

              update_last_activity_time(userID);

              return message;
          }
          else{

            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/signup',"userID": userID
              }
              update_last_activity_time(userID);

              return message;
}
        }else{

    var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);

                    var result =  UserInfo.insert({
                      user_id:userID,
                      name: getName,
                      email: getEmail,
                      email_status: 1,
                      source: source,
                      status: '',
                      summary:'',
                      profile_pic: getImageUrl,
                      theme_value: 3,
                      createdAt: Date.now() 
                    });

              var message = {
                "send_url": '/signup',"userID": userID
              }
              update_last_activity_time(userID);
              return message;

        }

      },

// **********************************blog Starting********************************
       'insert_blog':function(blog_id,blog_title,blog_description,Blog_publish_date,blog_image, user_id,is_draft,is_active){            
            update_last_activity_time(user_id); 
            var result =  Blog.insert({
                        blog_id:        blog_id, 
                        blog_creator_id:  user_id,
                        blog_title:         blog_title , 
                        blog_description:   blog_description , 
                        Blog_publish_date:  Blog_publish_date,
                        blog_image:     blog_image,
                        is_draft:       is_draft,
                        is_active:      is_active,
                        createdAt:      Date.now(),
                    });
            
          var result =Hub.insert({
          post_id:blog_id,
              post_creator_id:user_id,
              post_type:'new_blog',
          post_status:1,
          postActivityStatus:1,
              post_created_time: Date.now(),
              post_commentators:""
         });
          return result;
    },  

      change_blog_activation_status:function(blog_status,blog_id){
        var blog_creator_id = Blog.find({blog_id:blog_id}).fetch();
        if(blog_creator_id[0].blog_creator_id){
          update_last_activity_time(blog_creator_id[0].blog_creator_id); 
        }

        var result =  Blog.update({
                    blog_id: blog_id,
                  }, {
                    $set: {
                      'status': blog_status,
                  }
                  });
          
          return result;
      },

    'publish_blog':function(blog_id){

        var blog_creator_id = Blog.find({blog_id:blog_id}).fetch();
        if(blog_creator_id[0].blog_creator_id){
          update_last_activity_time(blog_creator_id[0].blog_creator_id); 
        }


        var newUser = Blog.find({blog_id: blog_id}).fetch();
          if(newUser[0]){
          var result = Blog.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                        is_active:      1, 
                    all_commented_users:"",
                        updateAT:       Date.now(),
                            }
            });
          var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
            Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":newUser[0].blog_creator_id,
                  "notification_for":newUser[0].blog_creator_id,
                  "notification_type":"blog_published",
                  "blog_published_date":newUser[0].Blog_publish_date,
                  "created_at":Date.now(),
                  "redirect_page":blog_id,
                  "redirect_component_id":blog_id,

                  "is_read":"0",
                });  
          }

          return result;
    },
    // update_blog
        update_blog:function(blog_id,blog_title,blog_description,Blog_publish_date,blog_image,is_draft,is_active){          
            var blog_creator_id = Blog.find({blog_id:blog_id}).fetch();
        if(blog_creator_id[0].blog_creator_id){
          update_last_activity_time(blog_creator_id[0].blog_creator_id); 
        }

        var newUser = Blog.find({blog_id: blog_id}).fetch();
          if(newUser[0]){
          var result = Blog.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                                blog_id:        blog_id, 
                        blog_title:         blog_title , 
                        blog_description:   blog_description , 
                        Blog_publish_date:  Blog_publish_date,
                        blog_image:     blog_image, 
                        is_draft:       is_draft, 
                        is_active:      is_active, 
                        updateAT:       Date.now(),
                            }
            });
          }
          return result;
        },
        remove_blog:function(blog_id){
          var blog_creator_id = Blog.find({blog_id:blog_id}).fetch();
        if(blog_creator_id[0].blog_creator_id){
          update_last_activity_time(blog_creator_id[0].blog_creator_id); 
        }

            var newUser = Blog.find({blog_id: blog_id}).fetch();
            if(newUser[0]){
          var result = Blog.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                                is_active:      0, 
                        updateAT:       Date.now(),
                            }
            });
          }
          return result;
        },

       blog_comments:function(comment_id,blog_id,comment_txt,comment_by,parent){
        //alert(userid);
        update_last_activity_time(comment_by); 
        
        var result = Comment.insert({

                      comment_id:comment_id,
                      blog_id: blog_id,
                      comment_type: 'orignal',

                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,

                      all_commentators:"",
                      commentActivityStatus: 0,
                      createdAt: Date.now() 

                    });

        var post_creator_id = Blog.find({"blog_id":blog_id}).fetch();
        // var author = post_creator_id[0].blog_creator_id;
        if(post_creator_id[0].blog_creator_id != comment_by){ 

          var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                  Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":comment_by,
                  "notification_for":post_creator_id[0].blog_creator_id,
                  "notification_type":"commment_on_blog_detail_thread_continued",
                  "redirect_page":blog_id,
                  "comment_txt":comment_txt,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_id,
                  "is_read":"0",
                });   
          var receiver_name = UserInfo.find({user_id:post_creator_id[0].blog_creator_id}).fetch();
          var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
          var notification_text = sender_name[0].name + " has commented on your blog";
          if(receiver_name[0].user_token){
            send_notification(post_creator_id[0].blog_creator_id,"Comments on Blog",notification_text,receiver_name[0].user_token); 
          }
      } 

        var all_commented_users_on_blog = post_creator_id[0].all_commented_users;
        
        if(all_commented_users_on_blog == ""){
           all_commented_users_on_blog = comment_by;
        }
         else if(!all_commented_users_on_blog.includes(comment_by)){
             all_commented_users_on_blog =all_commented_users_on_blog +","+ comment_by;
        }
          
               var result = Blog.update({
               _id: post_creator_id[0]._id,
             }, {
               $set: {
                                 all_commented_users: all_commented_users_on_blog, 
                         updateAT:       Date.now(),
                               }
             });
          
             var all_commented_users = all_commented_users_on_blog.split(",");
             for(var i=0;i<all_commented_users.length;i++){
             var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);  
             if(all_commented_users[i] != "" && all_commented_users[i]!=comment_by){
                  Notifications.insert({
                   "notifications_id":notifications_id,
                 "notification_by":comment_by,
                 "notification_for":all_commented_users[i],
                 "notification_type":"commment_on_blog_detail_thread_continued",
                 "redirect_page":blog_id,
                 "comment_txt":comment_txt,
                 "created_at":Date.now(),
                 "redirect_component_id":comment_id,
                 "is_read":"0",
                 });


              var receiver_name = UserInfo.find({user_id:all_commented_users[i]}).fetch();
              var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
              var notification_text = sender_name[0].name + " has commented in blog's thread";
              if(receiver_name[0].user_token){
                send_notification(all_commented_users[i],"Comments on Blogs thread",notification_text,receiver_name[0].user_token); 
              }

             }
                
             }
               
        


          return result;

      },

      like_blog_action:function(liked_by,detailed_blog_id){
        update_last_activity_time(liked_by); 
          var check_ifliked_before = Like.find({blog_id: detailed_blog_id, liked_by: liked_by, like_type: 'main_blog'}).fetch();     

        if(check_ifliked_before.length > 0){
          var like_id = check_ifliked_before[0].like_id;
          var result = Like.remove({ like_id: like_id }); 
        return result;
        }
        else{
          var like_id = 'like_event_'+ Math.floor((Math.random() * 2465789) + 1);
              Meteor.call('blog_likes',like_id,detailed_blog_id,liked_by, function(error,result){
              if(error){
                    console.log('error');
                }else{
                    console.log('event sucessfully liked');
                    }
              });
            }
            
      },
      perform_like_action:function(liked_by,comment_id,blog_id,comment_txt,comment_by,comment_type,parent){
      update_last_activity_time(liked_by); 
      var check_ifliked_before = Like.find({comment_id: comment_id, blog_id: blog_id, liked_by: liked_by}).fetch();  
          if(check_ifliked_before.length > 0){
        var like_id = check_ifliked_before[0].like_id;
        var result = Like.remove({ like_id: like_id }); 
        return result;
          }else{
                      var like_id = 'like_comment_'+ Math.floor((Math.random() * 2465789) + 1);
                      var result =  Like.insert({
                    like_id:like_id,
                      comment_id:comment_id,
                      blog_id: blog_id,
                      comment_type: comment_type,
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      liked_by: liked_by,
                      like_type: 'blog_comment',
                      parent: parent,
                      likedAt: Date.now() 
                    });

          var comment_creator = Comment.find({"comment_id":comment_id}).fetch();
          // if parent is comment id then the like is on nested comment

          if(comment_creator[0].comment_by != liked_by){
                var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                  var already_created_notification =Notifications.find({"notification_by":liked_by,
                          "notification_for":comment_creator[0].comment_by,
                      "notification_type":"like_on_comment",
                      "redirect_component_id":comment_creator[0].comment_id,
                      "redirect_page":blog_id}).fetch();    
                  if(already_created_notification.length == 0){   
                    Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":liked_by,
                  "notification_for":comment_creator[0].comment_by,
                  "notification_type":"like_on_comment",
                  "redirect_page":blog_id,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_creator[0].comment_id,
                  "is_read":"0",
                  });

              var receiver_name = UserInfo.find({user_id:comment_creator[0].comment_by}).fetch();
              var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
              var notification_text = sender_name[0].name + " has liked you comment";
              if(receiver_name[0].user_token){
                send_notification(comment_creator[0].comment_by,"Like on your comment",notification_text,receiver_name[0].user_token); 
              }


                  }else{
                    var result = Notifications.update({
                    _id: already_created_notification[0]._id,
                  }, {
                    $set: {
                                      "notification_updated_time": Date.now(), 
                                  }
                  });
                  }

            }
          return result;
          }
      },
     blog_comment_likes: function(like_id,comment_id,blog_id,comment_type,comment_txt,comment_by,liked_by,parent){
          update_last_activity_time(liked_by); 
          var result =  Like.insert({
                    like_id:like_id,
                      comment_id:comment_id,
                      blog_id: blog_id,
                      comment_type: comment_type,
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      liked_by: liked_by,
                      like_type: 'blog_comment',
                      parent: parent,
                      likedAt: Date.now() 
                    });

          var comment_creator = Comment.find({"comment_id":comment_id}).fetch();
          // if parent is comment id then the like is on nested comment

          if(comment_creator[0].comment_by != liked_by){
                var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                  var already_created_notification =Notifications.find({"notification_by":liked_by,
                          "notification_for":comment_creator[0].comment_by,
                      "notification_type":"like_on_comment",
                      "redirect_component_id":comment_creator[0].comment_id,
                      "redirect_page":blog_id}).fetch();    
                  if(already_created_notification.length == 0){   
                    Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":liked_by,
                  "notification_for":comment_creator[0].comment_by,
                  "notification_type":"like_on_comment",
                  "redirect_page":blog_id,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_creator[0].comment_id,
                  "is_read":"0",
                  });

              var receiver_name = UserInfo.find({user_id:comment_creator[0].comment_by}).fetch();
              var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
              var notification_text = sender_name[0].name + " has liked you comment";
              if(receiver_name[0].user_token){
                send_notification(comment_creator[0].comment_by,"Like on your comment",notification_text,receiver_name[0].user_token); 
              }

                  }else{
                    var result = Notifications.update({
                    _id: already_created_notification[0]._id,
                  }, {
                    $set: {
                                      "notification_updated_time": Date.now(), 
                                  }
                  });
                  }

            }

          // else like is on zeroth level comment 
          return result;
      },

       remove_blog_comment_likes: function(like_id){
        var likerId = Like.find({like_id:like_id}).fetch();
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }
        var result = Like.remove({ like_id: like_id });
        return result;
      },  

      blogs_comments_lvl_1:function(comment_id,blog_id,comment_txt,comment_by,parent){
        //alert(userid);
          update_last_activity_time(comment_by); 

          var result = Comment.find({
          comment_id: parent }).fetch();

  var check_string = comment_by;
  var Parent_commenter = result[0].comment_by;


var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

        if(result[0] && result[0].comment_by != comment_by){

                    var result_2 =  Notifications.insert({
                    "notifications_id": notification_id,
                  "notification_by": comment_by,
                  "notification_for": result[0].comment_by,
                  "notification_type": "commment_on_blog_detail_level_1",
                  "redirect_page": blog_id,
                  "comment_txt": comment_txt,
                  "created_at": Date.now(),
                  "redirect_component_id": comment_id,
                  "is_read": "0",
                  });   

              var receiver_name = UserInfo.find({user_id:result[0].comment_by}).fetch();
              var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
              var notification_text = sender_name[0].name + " has replied on your comment";
              if(receiver_name[0].user_token){
                send_notification(result[0].comment_by,"Replied on your comments",notification_text,receiver_name[0].user_token); 
              }

      var check_string = comment_by+result[0].comment_by;
                  }
      
      var newUser = Comment.find({ comment_type: 'reply' ,parent: parent },{blog_id: 1}).fetch();
           
            if(newUser.length > 0){

        // var check_string = comment_by;
        for(var i=0; i < newUser.length ; i++){

        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

        if(!check_string.includes(newUser[i].comment_by )){

                  var result_2 =  Notifications.insert({

                    "notifications_id": notification_id,
                  "notification_by": comment_by,
                  "notification_for": newUser[i].comment_by,
                  "notification_type":"commment_on_blog_detail_level_1",
                  "redirect_page": blog_id,
                  "comment_txt": comment_txt,
                  "created_at": Date.now(),
                  "redirect_component_id": comment_id,
                  "is_read":"0",

                  });   



              var receiver_name = UserInfo.find({user_id:newUser[i].comment_by}).fetch();
              var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
              var notification_text = sender_name[0].name + " has commented on your blog";
              if(receiver_name[0].user_token){
                send_notification(newUser[i].comment_by,"Comments on Blog",notification_text,receiver_name[0].user_token); 
              }

        }
          if(!check_string.includes(newUser[i].comment_by) ){
              check_string = check_string +','+newUser[i].comment_by;
              }

              // console.log(check_string);
            }
          }

          var result =  Comment.insert({
                      comment_id:comment_id,
                      blog_id: blog_id,
                      comment_type: 'reply',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
          return result;
      },

        remove_blog_likes: function(like_id){
          var likerId = Like.find({like_id:like_id}).fetch();
        
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }

        var result = Like.remove({ like_id: like_id });
      },

       blog_likes: function(like_id,blog_id,liked_by){
        update_last_activity_time(liked_by);  
          var result =  Like.insert({
                    like_id:like_id,
                      blog_id: blog_id,
                      liked_by: liked_by,
                      like_type: 'main_blog',
                      likedAt: Date.now() 
                    });
            var post_creator_id = Blog.find({"blog_id":blog_id}).fetch();

        if(post_creator_id[0].blog_creator_id != liked_by){ 
          var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
            var already_created_notification =Notifications.find({"notification_by":liked_by,"notification_for":post_creator_id[0].blog_creator_id,
                      "notification_type":"like_on_blog",
                      "redirect_component_id":like_id,
                      "redirect_page":blog_id}).fetch();      
              if(already_created_notification.length == 0){   
                Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":liked_by,
                  "notification_for":post_creator_id[0].blog_creator_id,
                  "notification_type":"like_on_blog",
                  "redirect_page":blog_id,
                  "created_at":Date.now(),
                  "redirect_component_id":like_id,
                  "is_read":"0",
                });  

                var receiver_name = UserInfo.find({user_id:post_creator_id[0].blog_creator_id}).fetch();
              var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
              var notification_text = sender_name[0].name + " has liked your blog";
              if(receiver_name[0].user_token){
                send_notification(post_creator_id[0].blog_creator_id,"Like on Blog",notification_text,receiver_name[0].user_token); 
              }


              }else{

                var result = Notifications.update({
                    _id: already_created_notification[0]._id,
                  }, {
                    $set: {
                                      "notification_updated_time": Date.now(), 
                                  }
                  });
              }
        }

          return result;
      },
      change_follow_status:function(follower,following,status){
        // console.log(follower+' '+following+' '+status);
        update_last_activity_time(follower);  
              var followers = Followers.find({follower:follower,following: following}).fetch();
      if(followers.length == 0){
        Followers.insert({
            follower: follower,
            following: following,
            is_follower: status,
            created_date:Date.now()
          });
      }
      else{

          var result = Followers.update({
              follower: follower,
              following: following,
            }, {
              $set: {
                                is_follower:      status, 
                        updateAT:       Date.now(),
                            }
            });
        }
        return result;
      },

  // **********************************blog Ending********************************

      /********* HUB STARTING **********/



        update_hub_post:function(currentUserId, post_id,post_txt){
          console.log(currentUserId+post_id+post_txt);
          
        update_last_activity_time(currentUserId);                   
        var old_comments = Hub.find({"post_id":post_id}).fetch();
        console.log(old_comments[0]);
          var result = Hub.update({
                _id: old_comments[0]._id,
              }, {
                $set: {
                                post_text: post_txt, 
                        editedAt:       Date.now(),
                              }
              });
          return result; 
      },

        saveOption:function(currentUserId,optionSelected,post_id,option_count){
          console.log(currentUserId+optionSelected+post_id);
          
        update_last_activity_time(currentUserId);                   
        var vote_id = "VoteId_"+Math.floor((Math.random() * 2465789) + 1);

        var result = PollOption.insert({
          vote_id: vote_id,
          vote_post: post_id,

              vote_by: currentUserId,
              option_count: option_count,
              vote_to: optionSelected,

          postActivityStatus:1,
              post_created_time: Date.now(),
         });
          return result;
      },


      'save_post':function(post_id,post_text,post_image_url,post_type,post_creator_id,commenting_status){
        update_last_activity_time(post_creator_id);   
        var result =Hub.insert({
          post_id:post_id,
          post_text:post_text,
              post_image_url:post_image_url,
              post_creator_id:post_creator_id,
              post_type:post_type,
          post_status:1,
          postActivityStatus:1,
          commenting_status:commenting_status,
          all_commentators:"",
              post_created_time: Date.now(),
              post_commentators:""
         });
        return result;
      },

      
      'save_metadata_post':function(post_id,post_text,featured_image,featured_title,source,posted_url,post_creator_id,commenting_status){
        update_last_activity_time(post_creator_id); 
        var result =Hub.insert({
          post_id:post_id,
          post_text:post_text,
              featured_image:featured_image,
              featured_title:featured_title,
              source:source,
              posted_url:posted_url,
              post_creator_id:post_creator_id,
              post_type:'url_metadata',
              all_commentators:"",
          post_status:1,
          postActivityStatus:1,
          commenting_status:commenting_status,
              post_created_time: Date.now(),
              post_commentators:""
         });
        return result;
      },

      async fetch_url_information(url){
       const data = await urlMetadata(url).then(
          function (metadata) { // success handler
       console.log(metadata);
       return metadata;
        },
        function (error) { // failure handler
          console.log(error)
         return error;
        }).then(
        function(success){
         return success;
        },function(error){
          console.log("log");
        })
        return data;
      },
      remove_hub_likes: function(like_id){
        var likerId = Like.find({like_id:like_id}).fetch();
        
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }
        var result = Like.remove({ like_id: like_id });
      },
       add_hub_like: function(like_id,post_id,liked_by){
          update_last_activity_time(liked_by);  
          var checkForAlreadyExists = Like.find({"post_id":post_id,"liked_by":liked_by}).count();
          if(checkForAlreadyExists==0){
          var result = Like.insert({
                    like_id:like_id,
                      post_id: post_id,
                      liked_by: liked_by,
                      likedAt: Date.now() 
                    });
            var post_id_on_which_like_is_done = post_id;
            // like on comment
            var like_type="post";
            if(post_id.includes("like_child_1_") || post_id.includes("like_child_2_")){
            // Like.find({post_id: post_id,liked_by: liked_by})
            console.log(post_id);
            if(post_id.includes("like_child_1_")){
            var comment_id = post_id.replace("like_child_1_",""); 
            }else{
            var comment_id = post_id.replace("like_child_2_","");   
            }
            console.log(comment_id);
            if(!comment_id.includes("_")){
            comment_id  = parseInt(comment_id);   
            }
            // _ user_709969_post1612720
            var fetch_post_id = Comment.find({comment_id:comment_id}).fetch();
            console.log(fetch_post_id);
            post_id_on_which_like_is_done = fetch_post_id[0].post_id; // Post Id from comments 
            like_type = "commment";
                         
            if(fetch_post_id[0].comment_by != liked_by){
                  var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                  var already_created_notification =Notifications.find({
                                        "notification_by":liked_by,
                                        "notification_for":fetch_post_id[0].comment_by,
                                      "notification_type":"like_on_hub_posted_comment",
                                      "redirect_component_id":post_id}).fetch();      
                  if(already_created_notification.length == 0){
                  Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":liked_by,
                  "notification_for":fetch_post_id[0].comment_by,
                  "notification_type":"like_on_hub_posted_comment",
                  "redirect_page":post_id_on_which_like_is_done,
                  "redirect_component_id":post_id,
                  "is_read":"0",
                });   


              var receiver_name = UserInfo.find({user_id:fetch_post_id[0].comment_by}).fetch();
              var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
              var notification_text = sender_name[0].name + " has liked your comment";
              if(receiver_name[0].user_token){
                send_notification(fetch_post_id[0].comment_by,"Like on Comment",notification_text,receiver_name[0].user_token); 
              }


                  }else{
                    // update
                    var result = Notifications.update({
                    _id: already_created_notification[0]._id,
                  }, {
                    $set: {
                                      "notification_updated_time": Date.now(), 
                                  }
                  });
                  } 
                   
            }
            }else{
             
            var post_creator_id = Hub.find({"post_id":post_id_on_which_like_is_done}).fetch();
            // var get_user_name = UserInfo.find({"user_id":post_creator_id[0].post_creator_id}).fetch();
            if(post_creator_id[0].post_creator_id != liked_by){
                // var liker = UserInfo.find({"user_id":liked_by}).fetch();
                // var like_string = liker[0].name + " liked on your "+like_type;
                  var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
            // Check Required
                  
                   var already_created_notification =Notifications.find({
                                        "notification_by":liked_by,
                                        "notification_for":post_creator_id[0].post_creator_id,
                                      "notification_type":"like_on_hub_posting",
                                      "redirect_page":post_id_on_which_like_is_done,
                                      "redirect_component_id":post_id}).fetch();      
                  if(already_created_notification.length == 0){
                    Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":liked_by,
                  "notification_for":post_creator_id[0].post_creator_id,
                  "notification_type":"like_on_hub_posting",
                  "redirect_page":post_id_on_which_like_is_done,
                  "redirect_component_id":post_id,
                  "is_read":"0",
                }); 
              

                var receiver_name = UserInfo.find({user_id:post_creator_id[0].post_creator_id}).fetch();
                var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
                var notification_text = sender_name[0].name + " has liked your post";
                if(receiver_name[0].user_token){
                  send_notification(post_creator_id[0].post_creator_id,"Like on Post",notification_text,receiver_name[0].user_token); 
                }

                }else{
                    var result = Notifications.update({
                    _id: already_created_notification[0]._id,
                  }, {
                    $set: {
                                      "notification_updated_time": Date.now(), 
                                  }
                  });
                } 
            }

            }

                return result;  
          }else{
              return "";
          }
          
      },
      update_commented_text:function(currentUserId, comment_id,comment_txt){
        update_last_activity_time(currentUserId);    
        console.log("Inside Update Commented Text");               
        console.log(comment_txt);               
        console.log(comment_id);               
        var old_comments = Comment.find({"comment_id":comment_id}).fetch();
          var result = Comment.update({
                _id: old_comments[0]._id,
              }, {
                $set: {
                        comment_txt: comment_txt, 
                          editedAt:       Date.now(),
                              }
              });
          return result;
      },
      remove_comment_from_comments:function(currentUserId, comment_id){
        console.log(comment_id);
        update_last_activity_time(currentUserId);

        var remove_commment = Comment.update({ 
            comment_id: comment_id,
          }, {  
            $set: {                
                     commentActivityStatus: 1,
                }
          });

        return remove_commment;
      },  

       remove_post_from_hub:function(currentUserId,post_id){
        console.log(post_id);
        update_last_activity_time(currentUserId);

        var result = Hub.update({ 
            post_id: post_id,
          }, {  
            $set: {                
                     postActivityStatus: 0,
                }
          });

        return result;
      },  

      hub_post_comments:function(comment_id,post_id,comment_txt,comment_by,parent){
        //alert(userid);
        update_last_activity_time(comment_by);  

        var result =  Comment.insert({
                      comment_id:comment_id,
                      post_id: post_id,
                      comment_type: 'hub_orignal',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,
                      all_commentators:"",
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
        var post_creator_id = Hub.find({"post_id":post_id}).fetch();

        if(post_creator_id[0].post_creator_id != comment_by){ 
          var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                  Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":comment_by,
                  "notification_for":post_creator_id[0].post_creator_id,
                  "notification_type":"commment_on_hub_post",
                  "redirect_page":post_id,
                  "comment_txt":comment_txt,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_id,
                  "is_read":"0",
                });  


                    var receiver_name = UserInfo.find({user_id:post_creator_id[0].post_creator_id}).fetch();
                var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
                var notification_text = sender_name[0].name + " has commented on your post";
                if(receiver_name[0].user_token){
                  send_notification(post_creator_id[0].post_creator_id,"Comments on your Post",notification_text,receiver_name[0].user_token); 
                }
        }

        var all_commentators = post_creator_id[0].all_commentators;
        if(all_commentators == ""){ 
            all_commentators = comment_by;
            }
        else if(!all_commentators.includes(comment_by)){
            all_commentators =all_commentators +","+ comment_by;
         }
         
        var result = Hub.update({
                _id: post_creator_id[0]._id,
              }, {
                $set: {
                                  all_commentators: all_commentators, 
                          updateAT:       Date.now(),
                              }
              });

            var all_commented_users = all_commentators.split(",");
            for(var i=0;i<all_commented_users.length;i++){
            var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);  
                 if(all_commented_users[i] != "" && all_commented_users[i]!=comment_by && post_creator_id[0].post_creator_id != all_commented_users[i]){
                 Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":comment_by,
                  "notification_for":all_commented_users[i],
                  "notification_type":"commment_on_hub_post",
                  "redirect_page":post_id,
                  "comment_txt":comment_txt,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_id,
                  "is_read":"0",
                  });  




                    var receiver_name = UserInfo.find({user_id:all_commented_users[i]}).fetch();
                var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
                var notification_text = sender_name[0].name + " has commented on your post";
                if(receiver_name[0].user_token){
                  send_notification(all_commented_users[i],"Comments on your Post",notification_text,receiver_name[0].user_token); 
                }

            }
          }
                
          return result;

      },
      hub_last_level_comments:function(comment_id,post_id,comment_txt,comment_by,parent){
        //alert(userid);
          update_last_activity_time(comment_by);  
          var result =  Comment.insert({
                      comment_id:comment_id,
                      post_id: post_id,
                      comment_type: 'hub_reply',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
        // Post Creator 
        /*var post_creator_id = Hub.find({"post_id":post_id}).fetch();
      
        if(post_creator_id[0].post_creator_id != comment_by){ 
          var notifications_id = 'notifications_id'+ Math.floor((Math.random() * 2465789) + 1);
                  Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":comment_by,
                  "notification_for":post_creator_id[0].post_creator_id,
                  "notification_type":"commment_on_hub_post_level_1",
                  "redirect_page":post_id,
                  "comment_txt":comment_txt,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_id,
                  "is_read":"0",
                });  
        }*/
        var comment_parent = Comment.find({"comment_id":parent}).fetch();
        console.log(comment_parent);
        var all_commentators = comment_parent[0].all_commentators;
        var parent_comment = comment_parent[0].comment_by;         
        if(all_commentators == ""){ 
            all_commentators = comment_by;
            }
        else if(!all_commentators.includes(comment_by)){
            all_commentators =all_commentators +","+ comment_by;
         }
        if(!all_commentators.includes(parent_comment)){
        all_commentators =all_commentators +","+ parent_comment;  
        }
        var result = Comment.update({
                _id: comment_parent[0]._id,
              }, {
                $set: {
                                  all_commentators: all_commentators, 
                          updateAT:       Date.now(),
                              }
              });

            var all_commented_users = all_commentators.split(",");
            for(var i=0;i<all_commented_users.length;i++){
            var notifications_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);  
                 if( all_commented_users[i] != "" && all_commented_users[i]!=comment_by){
                
                 Notifications.insert({
                    "notifications_id":notifications_id,
                  "notification_by":comment_by,
                  "notification_for":all_commented_users[i],
                  "notification_type":"commment_on_hub_post_continued_level_1",
                  "redirect_page":post_id,
                  "comment_txt":comment_txt,
                  "created_at":Date.now(),
                  "redirect_component_id":comment_id,
                  "is_read":"0",
                  });   


                  var receiver_name = UserInfo.find({user_id:all_commented_users[i]}).fetch();
                var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
                var notification_text = sender_name[0].name + " has replied on your comment";
                if(receiver_name[0].user_token){
                  send_notification(all_commented_users[i],"Comment's Reply ",notification_text,receiver_name[0].user_token); 
                }
            }
          }

          return result;
      },
      /********* HUB ENDING **********/

      /********* EVENT START **********/
      save_event:function(event_id,userid,ename,location,eventtype,start_date,end_date,cover_image,lat,long,description,invite_list,invite_type){
          update_last_activity_time(userid);  

          var result =  Event.insert({
                    event_id:event_id,
                      event_admin:userid,
                      event_name: ename,
                      event_location: location,
                      event_type: eventtype,
                      event_start_date: start_date,
                      event_end_date:end_date,
                      event_cover_image:cover_image,
                      // event_invite_type:event_invite,
                      event_lat:lat,
                      event_long:long,
                      description:description,
                      invite_list: invite_list,
                      invite_accepted: userid,
                      invite_rejected: "",
                      invite_type: invite_type,
                      is_active: 1,
                      createdAt: Date.now(), 
                    }); 

if(invite_type == 'Public'){
        var result = Hub.insert({
          post_id:event_id,
              post_creator_id:userid,
              post_type:'new_event',
          post_status:1,
          postActivityStatus:1,
              post_created_time: Date.now(),
              post_commentators:""
             });

}

if(invite_type == 'Private'){

    var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
        logged_in_user = userid;
  var invite_accepted_2 = invite_list.split(",");
  for(var i=0; i < invite_accepted_2.length ; i++){
    if(!invite_accepted_2[i].includes(logged_in_user) ){

      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: logged_in_user,
                      notification_for: invite_accepted_2[i],
                      notification_type: 'Private_Event_Invite',
                      event_id: event_id,
                      redirect_component: 0,
                      is_read: 0,
                      created_at: Date.now(),
                    });

   }
   }  

   } 

          return result;

      },

      update_event:function(eventId,userid,ename,location,eventtype,start_date,end_date,cover_image,lat,long,description,invite_list,invite_type){
        // var res=Emembers.remove({event_id: eventId });
        // for(i=0;i<emembers.length;i++){
        //  var result2=Emembers.insert({
        //      event_id:eventId,
        //      e_user_id:emembers[i],
        //      status:0,
        //      createdAt:Date.now()
        //  }); 
        // }
        update_last_activity_time(userid);  

        var result =  Event.update({
                    event_id: eventId,
                  }, {
                    $set: {
                      'event_name': ename,
                      'event_location': location,
                      'event_type': eventtype,
                      'event_start_date': start_date,
                      'event_end_date':end_date,
                      'event_cover_image':cover_image,
                      // 'event_invite_type':event_invite,
                      'event_lat':lat,
                      'event_long':long,
                      'description':description,
                      'invite_type': invite_type,
                      'invite_list': invite_list,
                      
                      'updatedAt': Date.now()}
                  });
          
          return result;
      },

      change_event_activation_status:function(event_status,event_id){
        var eventAdmin = Event.find({event_id:event_id}).fetch();
        if(eventAdmin[0]){
          if(eventAdmin[0].event_admin){
            update_last_activity_time(eventAdmin[0].event_admin);   
          }
        }
        var result =  Event.update({
                    event_id: event_id,
                  }, {
                    $set: {
                      'status': event_status,
                  }
                  });
          
          return result;
      },

      change_event_activation_status:function(event_status,event_id){
        var eventAdmin = Event.find({event_id:event_id}).fetch();
        if(eventAdmin[0]){
          if(eventAdmin[0].event_admin){
            update_last_activity_time(eventAdmin[0].event_admin);   
          }
        }

        var result =  Event.update({
                    event_id: event_id,
                  }, {
                    $set: {
                      'status': event_status,
                  }
                  });
          
          return result;
      },

        event_comments:function(comment_id,event_id,comment_txt,comment_by,parent){
        //alert(userid);
              
            update_last_activity_time(comment_by);
            var result = Event.find({
                        event_id: event_id}).fetch();

    if(result.length > 0){

      // var check_string = comment_by;

    // for(var i=0; i < newUser.length ; i++){
        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
        if(result[0].event_admin != comment_by){

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: result[0].event_admin,
                      notification_type: 'event_comment_lvl0',
                      event_id: event_id,

                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: event_id,
                      is_read: 0,
                      created_at: Date.now(),
                    });

                var receiver_name = UserInfo.find({user_id:result[0].event_admin}).fetch();
                var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
                var notification_text = sender_name[0].name + " has commented on your Event";
                if(receiver_name[0].user_token){
                  send_notification(result[0].event_admin,"Comments on Events ",notification_text,receiver_name[0].user_token); 
                }
                  }

          // if(check_string == ""){ 
          //    check_string = newUser[i].comment_by;
          //  }
          //  else if(!check_string.includes(newUser[i].comment_by) ){
          //    check_string = check_string +','+newUser[i].comment_by;
          //    }
        // }
      }
          var result =  Comment.insert({
                      comment_id:comment_id,
                      event_id: event_id,
                      comment_type: 'orignal',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
          return result;
      },
      
        event_comments_lvl_1:function(comment_id,event_id,comment_txt,comment_by,parent){
      
        update_last_activity_time(comment_by);
        
        var result = Comment.find({
          comment_id: parent }).fetch();

  var check_string = comment_by;
  var Parent_commenter = result[0].comment_by;


var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

        if(result[0] && result[0].comment_by != comment_by){

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: result[0].comment_by,
                      notification_type: 'event_comment_lvl1',
                      event_id: event_id,

                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: event_id,
                      is_read: 0,
                      created_at: Date.now(),
       });
       var receiver_name = UserInfo.find({user_id:result[0].comment_by}).fetch();
                var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
                var notification_text = sender_name[0].name + " has replied on your Comment";
                if(receiver_name[0].user_token){
                  send_notification(result[0].comment_by,"Replied on Comments ",notification_text,receiver_name[0].user_token); 
                }             
      var check_string = comment_by+result[0].comment_by;
                  }
      
      var newUser = Comment.find({ comment_type: 'reply' ,parent: parent },{event_id: 1}).fetch();
           
            if(newUser.length > 0){

        // var check_string = comment_by;
        for(var i=0; i < newUser.length ; i++){

        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

        if(!check_string.includes(newUser[i].comment_by )){

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: newUser[i].comment_by,
                      notification_type: 'event_comment_lvl1',
                      event_id: event_id,

                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: event_id,
                      is_read: 0,
                      created_at: Date.now(),
    });

                      var receiver_name = UserInfo.find({user_id: newUser[i].comment_by}).fetch();
                var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
                var notification_text = sender_name[0].name + " has replied on your Comment";
                if(receiver_name[0].user_token){
                  send_notification( newUser[i].comment_by,"Replied on Comments ",notification_text,receiver_name[0].user_token); 
                }  

        }
          if(!check_string.includes(newUser[i].comment_by) ){
              check_string = check_string +','+newUser[i].comment_by;
              }

              // console.log(check_string);
            }
          }


          var result =  Comment.insert({
                      comment_id:comment_id,
                      event_id: event_id,
                      comment_type: 'reply',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
          return result;
      },
        event_comment_likes: function(like_id,comment_id,event_id,comment_type,comment_txt,comment_by,liked_by,parent){
          update_last_activity_time(comment_by);
          var result =  Like.insert({
                    like_id:like_id,
                      comment_id:comment_id,
                      
                      event_id: event_id,
                      comment_type: comment_type,

                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      liked_by: liked_by,
                      like_type: 'event_comment',

                      parent: parent,
                      likedAt: Date.now() 
                    });

                var newUser = Notifications.find({
                                  notification_by: liked_by,
                                  notification_for: comment_by, 
                                  comment_id: comment_id,
                                  event_id: event_id,
                                }).fetch();

    if(newUser[0]){

        var result_2 = Notifications.update({
                    notification_id: newUser[0].notification_id,
                  },{
                    $set: {
                      is_read: 0,
                      like_status: 'Liked',
                      updated_at:  Date.now(),
                  }
                  });
      }else{
        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                       // var get_grp_id =  comment.find({
                        //     discussion_id: discussion_id,
                        // }).fetch();

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: liked_by,

                      notification_for: comment_by,
                      notification_type: 'event_like',
                      event_id: event_id,

                      like_id: like_id,
                      comment_id: comment_id,
                      like_status: 'Liked',

                      redirect_component: event_id,
                      is_read: 0,
                      created_at: Date.now(),
    });

          var receiver_name = UserInfo.find({user_id: comment_by}).fetch();
                var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
                var notification_text = sender_name[0].name + " has liked your Comment";
                if(receiver_name[0].user_token){
                  send_notification( comment_by,"Liked on Comments ",notification_text,receiver_name[0].user_token); 
                }  
             
      }

          return result;
      },
      
        remove_event_comment_likes: function(like_id,notification_id){
          
          var likerId = Like.find({like_id:like_id}).fetch();
        
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }

        var result = Like.remove({ like_id: like_id });

                  var result_2 = Notifications.update({
                    notification_id: notification_id,
                  },{
                    $set: {
                      is_read: 0,
                      like_status: 'Unliked',
                      updated_at:  Date.now(),
                  }
                  });

        return result;
      },

        event_likes: function(like_id,event_id,liked_by){
            update_last_activity_time(liked_by);  

          var result =  Like.insert({
                    like_id:like_id,
                      
                      event_id: event_id,
                      liked_by: liked_by,
                      like_type: 'main_event',

                      likedAt: Date.now() 
                    });

          return result;
      },

        remove_event_likes: function(like_id){
          var likerId = Like.find({like_id:like_id}).fetch();
        
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }

        var result = Like.remove({ like_id: like_id });
        return result;
      },

      event_people_invite_accepted:function(invite_accepted,event_id,invite_list,event_admin,logged_in_user){
        update_last_activity_time(event_admin);     
        var result =  Event.update({
                    event_id: event_id,
                  },{
                    $set: {
                      'invite_accepted': invite_accepted,
                      'invite_list': invite_list,
                      'updatedAt':  Date.now(),
                  }
                  }); 

      var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: logged_in_user,

                      notification_for: event_admin,
                      notification_type: 'event_join',
                      event_id: event_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
    });


              var receiver_name = UserInfo.find({user_id: event_admin}).fetch();
                var sender_name = UserInfo.find({"user_id":logged_in_user}).fetch(); 
                var notification_text = sender_name[0].name + " has joined your  Event";
                if(receiver_name[0].user_token){
                  send_notification( event_admin,"Event Accepted ",notification_text,receiver_name[0].user_token); 
                } 
          return result;
      },

      event_people_invite_rejected:function(invite_rejected,event_id,invite_list){
        var eventAdminId = Event.find({event_id:event_id}).fetch();
        
        if(eventAdminId[0]){
          if(eventAdminId[0].event_admin){
          update_last_activity_time(eventAdminId[0].event_admin);   
          }
        }

        var result =  Event.update({
                    event_id: event_id,
                  },{
                    $set: {
                      'invite_rejected': invite_rejected,
                      'invite_list': invite_list,
                      'updatedAt':  Date.now(),
                  }
                  });     
          return result;
      },
      add_user_in_invitation_list: function(event_id,userId,invite_list){
        update_last_activity_time(userId);  

        var result =  Event.update({
                    event_id: event_id,
                  },{
                    $set: {
                      'invite_list': invite_list,
                      'updatedAt':  Date.now(),
                  }
                  });     
          return result;
      },
       // ******************* EVENT ENDING**************************//

       // *******************Groups functions starting **************************//

          /******** GROUPS ADDITION *************/

      insert_Group_details: function(user_id,grp_image,grp_title,grp_type,grp_discription,grp_id)
      {
        update_last_activity_time(user_id);   
    var result = UserGroup.insert({
     grp_id: grp_id,
     grp_title: grp_title,
     admin: user_id,
         grp_type: grp_type,
         grp_discription: grp_discription,
         grp_image: grp_image,
         invite_list: "",
         invite_accepted: user_id,
         invite_rejected: "",
         requestee_list: "",
         activity_status: 1,
         createdAt: Date.now() 
        });
    return true;
    },  


    update_Group_details: function(user_id,grp_image,grp_title,grp_type,grp_discription,grp_id,activity_status)
      {
    
    update_last_activity_time(user_id);   
    
    var result = UserGroup.update({
        grp_id: grp_id,
      }, {
        $set: {
                 grp_title: grp_title,
                admin: user_id,
               grp_type: grp_type,
               grp_discription: grp_discription,
               grp_image: grp_image,
               activity_status: activity_status,
               UpdatedAt: Date.now(), 
        }
      });
    return true;
    },
        update_Group_activity: function(grp_id,activity_status)
      {
      var userGroupAdmin= UserGroup.find({grp_id: grp_id}).fetch();
      if(userGroupAdmin[0].admin){
        update_last_activity_time(userGroupAdmin[0].admin);   
      }

      var result = UserGroup.update({
        grp_id: grp_id,
      }, {
        $set: {
               "activity_status": activity_status,
               "lastUpdateAt": Date.now()
        }
      });
    return result;
    },      

           remove_discussion_from_group:function(currentUserId,discussion_id){
        console.log(discussion_id);
        update_last_activity_time(currentUserId);

        var result = Discussion.update({ 
            discussion_id: discussion_id,
          }, {  
            $set: {                
                     discussionActivityStatus: 0,
                }
          });

        return result;
      },  


  change_group_activation_status:function(grp_status,grp_id){
    var userGroupAdmin= UserGroup.find({grp_id: grp_id}).fetch();
      if(userGroupAdmin[0].admin){
        update_last_activity_time(userGroupAdmin[0].admin);   
      }


    var result = UserGroup.update({
        grp_id: grp_id,
      }, {
        $set: {
               status: grp_status,
        }
      });
          
          return result;
      },


        create_discussion: function(discussion_id,discussion_title,discussion_detail,discussion_creator,grp_id,grp_admin){
      
        update_last_activity_time(discussion_creator);  


      var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: discussion_creator,

                      notification_for: grp_admin,
                      notification_type: 'discussion_created',
                      grp_id: grp_id,
                      discussion_id: discussion_id,

                                        discussion_type:'text',
                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
    });

        var receiver_name = UserInfo.find({user_id: grp_admin}).fetch();
        var sender_name = UserInfo.find({"user_id":discussion_creator}).fetch(); 
        var notification_text = sender_name[0].name + " has start a Discussion in your Group";
        if(receiver_name[0].user_token){
          send_notification(grp_admin,"Discussion Created ",notification_text,receiver_name[0].user_token); 
        }

          var result =  Discussion.insert({
                            discussion_id:           discussion_id,
                      discussion_title:     discussion_title,
                      discussion_detail:   discussion_detail,
                      grp_admin:           grp_admin,
                      grp_id:             grp_id,
                      discussionActivityStatus:          1,
                      discussion_creator:  discussion_creator,
                      discussion_type:'text',

                      created_at: Date.now() 
                    });
          return result;


      },

  'save_metadata_post_group_discussion':function(discussion_id,discussion_title,featured_image,featured_title,source,posted_url,discussion_creator,grp_id,grp_admin){
        // update_last_activity_time(post_creator_id);
            var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: discussion_creator,

                      notification_for: grp_admin,
                      notification_type: 'discussion_created',
                      grp_id: grp_id,
                      discussion_id: discussion_id,
                      discussion_type:'url_metadata',

                      redirect_component: 0,
                      is_read: 0,
                      created_at: Date.now(),
    });

       var receiver_name = UserInfo.find({user_id: grp_admin}).fetch();
        var sender_name = UserInfo.find({"user_id":discussion_creator}).fetch(); 
        var notification_text = sender_name[0].name + " has start a Discussion in your Group";
        if(receiver_name[0].user_token){
          send_notification(grp_admin,"Discussion Created ",notification_text,receiver_name[0].user_token); 
        }


        var result =Discussion.insert({
          discussion_id:           discussion_id,
          discussion_title:     discussion_title,
          
          grp_admin:           grp_admin,
          grp_id:             grp_id,
          discussion_creator:  discussion_creator,

              featured_image:featured_image,
              featured_title:featured_title,
              source:source,
              discussionActivityStatus:1,
              posted_url:posted_url,
              discussion_type:'url_metadata',
              created_at: Date.now()

         });
        return result;
      },
      async fetch_url_information(url){
       const data = await urlMetadata(url).then(
          function (metadata) { // success handler
       console.log(metadata);
       return metadata;
        },
        function (error) { // failure handler
          console.log(error)
         return error;
        }).then(
        function(success){
         return success;
        },function(error){
          console.log("log");
        })
        return data;
      },

       fetch_group_details:function(grp_id){
          var result = UserGroup.find({grp_id: grp_id}).fetch();
          return result;
      },


      // groups discussion page
      
          discussion_comments:function(comment_id,discussion_id,grp_id,discussion_creator,grp_admin,comment_txt,comment_by,parent){
        //alert(userid);
        update_last_activity_time(comment_by);  
        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                var result_2 = Notifications.insert({

                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: discussion_creator,
                      notification_type: 'discussion_comment_lvl0',
                      grp_id: grp_id,
                      grp_admin: grp_admin,
                      discussion_id: discussion_id,
                      comment_txt: comment_txt,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
            });

         var receiver_name = UserInfo.find({user_id: discussion_creator}).fetch();
        var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
        var notification_text = sender_name[0].name + " has commented on your Discussion";
        if(receiver_name[0].user_token){
          send_notification(discussion_creator,"Discussion Comments ",notification_text,receiver_name[0].user_token); 
        }

        var logged_in_user = comment_by;
        var newUser = Comment.find({
          discussion_id: discussion_id,
          comment_type: 'Discussion',}).fetch();

            if(newUser.length > 0){

              var check_string = logged_in_user +','+ discussion_creator;
              
            

              for(var i=0; i < newUser.length ; i++){

        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
        
        if(!check_string.includes(newUser[i].comment_by )  ){
          // console.log('showing: ');

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: newUser[i].comment_by,
                      notification_type: 'discussion_comment_lvl0',
                      grp_id: grp_id,
                      grp_admin: grp_admin,
                      discussion_id: discussion_id,
                      comment_txt: comment_txt,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),

    });



         var receiver_name = UserInfo.find({user_id: newUser[i].comment_by}).fetch();
        var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
        var notification_text = sender_name[0].name + " has commented on your Discussion's thread";
        if(receiver_name[0].user_token){
          send_notification(newUser[i].comment_by,"Discussion Comments ",notification_text,receiver_name[0].user_token); 
        }

        }
        


          if(check_string == ""){
              check_string = newUser[i].comment_by;
            }
            else if(!check_string.includes(newUser[i].comment_by) ){
              check_string = check_string +','+newUser[i].comment_by;
            }

        

              }
            }

// var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

//                    var result_2 = Notifications.insert({
//                    notification_id: notification_id,
//                      notification_by: comment_by,

//                      notification_for: discussion_creator,
//                      notification_type: 'discussion_comment_lvl0',
//                      grp_id: grp_id,
//                      grp_admin: grp_admin,
//                      discussion_id: discussion_id,
//                      comment_txt: comment_txt,

//                      redirect_component: 0,
//                      is_read: 0,

//                      created_at: Date.now(),
//    });

              

        

          var result =  Comment.insert({
                      comment_id:comment_id,
                      discussion_id: discussion_id,
                      comment_type: 'Discussion',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      grp_id: grp_id,
                      discussion_creator: discussion_creator,
                      grp_admin: grp_admin,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
          return result;

      },
      
        discussion_comments_lvl_1:function(comment_id,discussion_id,grp_id,discussion_creator,grp_admin,comment_txt,comment_by,parent){
        //alert(userid);
        update_last_activity_time(comment_by); 
        var logged_in_user = comment_by;
if(discussion_creator != logged_in_user){
var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                var result_2 = Notifications.insert({

                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: discussion_creator,
                      notification_type: 'discussion_comment_lvl1',
                      grp_id: grp_id,
                      grp_admin: grp_admin,
                      discussion_id: discussion_id,
                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
            });

                var receiver_name = UserInfo.find({user_id: discussion_creator}).fetch();
        var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
        var notification_text = sender_name[0].name + " has replied on comment";
        if(receiver_name[0].user_token){
          send_notification(discussion_creator,"Someone Replied on comment ",notification_text,receiver_name[0].user_token); 
        }


        }
if(parent != discussion_creator){

var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

        var newUser = Comment.find({
          comment_id: parent }).fetch();

                var result_2 = Notifications.insert({

                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: newUser[0].comment_by,
                      notification_type: 'discussion_comment_lvl1',
                      grp_id: grp_id,
                      grp_admin: grp_admin,
                      discussion_id: discussion_id,
                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
            });


        var receiver_name = UserInfo.find({user_id: newUser[0].comment_by}).fetch();
        var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
        var notification_text = sender_name[0].name + " has replied on comment";
        if(receiver_name[0].user_token){
          send_notification(newUser[0].comment_by,"Someone Replied on comment ",notification_text,receiver_name[0].user_token); 
        }

}

                
        
        var newUser = Comment.find({
          discussion_id: discussion_id,
          comment_type: 'Discussion_reply',}).fetch();

            if(newUser.length > 0){
              var check_string = logged_in_user +','+ discussion_creator;
              for(var i=0; i < newUser.length ; i++){

        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
        if(!check_string.includes(newUser[i].comment_by )  ){

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: newUser[i].comment_by,
                      notification_type: 'discussion_comment_lvl1',
                      grp_id: grp_id,
                      grp_admin: grp_admin,
                      discussion_id: discussion_id,
                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
    });


        var receiver_name = UserInfo.find({user_id: newUser[i].comment_by}).fetch();
        var sender_name = UserInfo.find({"user_id":comment_by}).fetch(); 
        var notification_text = sender_name[0].name + " has replied on comment";
        if(receiver_name[0].user_token){
          send_notification(newUser[i].comment_by,"Someone Replied on comment ",notification_text,receiver_name[0].user_token); 
        }

        }
          if(check_string == ""){
              check_string = newUser[i].comment_by;
            }
            else if(!check_string.includes(newUser[i].comment_by) ){
              check_string = check_string +','+newUser[i].comment_by;
              }
              }
            }       
          var result =  Comment.insert({
                      comment_id:comment_id,
                      discussion_id: discussion_id,
                      comment_type: 'Discussion_reply',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      grp_id: grp_id,
                      discussion_creator: discussion_creator,
                      grp_admin: grp_admin,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
          return result;
      },

        discussion_comment_likes: function(like_id,comment_id,discussion_id,comment_type,comment_txt,comment_by,liked_by,parent){
update_last_activity_time(comment_by); 
var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                var result_2 = Notifications.insert({

                    notification_id: notification_id,
                      notification_by: liked_by,

                      notification_for: comment_by,
                      notification_type: 'discussion_comment_like',
                      discussion_id: discussion_id,
                      like_id: like_id,
                      comment_type: comment_type,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
            });
        
         var receiver_name = UserInfo.find({user_id: comment_by}).fetch();
        var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
        var notification_text = sender_name[0].name + " has liked your comment";
        if(receiver_name[0].user_token){
          send_notification(comment_by,"Someone Liked on your comment ",notification_text,receiver_name[0].user_token); 
        }

          var result =  Like.insert({
                    like_id:like_id,
                      comment_id:comment_id,
                      
                      discussion_id: discussion_id,
                      comment_type: comment_type,

                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      liked_by: liked_by,
                      like_type: 'discussion_comment_like',

                      parent: parent,
                      likedAt: Date.now() 
                    });
          return result;
      },  
      
        remove_discussion_comment_likes: function(like_id){
          var likerId = Like.find({like_id:like_id}).fetch();
        
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }

        var result = Like.remove({ like_id: like_id });
        return result;
      },

     discussion_likes: function(like_id,discussion_id,discussion_title,discussion_detail,discussion_creator,liked_by){
                update_last_activity_time(discussion_creator); 
                var newUser = Notifications.find({
                                  notification_by: liked_by,
                                  notification_for: discussion_creator, 
                                  discussion_id: discussion_id,
                                }).fetch();

    if(newUser[0]){

        var result_2 = Notifications.update({
                    notification_id: newUser[0].notification_id,
                  },{
                    $set: {
                      is_read: 0,
                      like_status: 'Liked',
                      updated_at:  Date.now(),
                  }
                  });
      }else{
        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
                       var get_grp_id = Discussion.find({
                            discussion_id: discussion_id,
                        }).fetch();

                var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: liked_by,

                      notification_for: discussion_creator,
                      notification_type: 'main_discussion_like',
                      grp_id: get_grp_id[0].grp_id,
                      discussion_id: discussion_id,
                      like_status: 'Liked',

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
                });

      var receiver_name = UserInfo.find({user_id: discussion_creator}).fetch();
        var sender_name = UserInfo.find({"user_id":liked_by}).fetch(); 
        var notification_text = sender_name[0].name + " has liked your discussion";
        if(receiver_name[0].user_token){
          send_notification(discussion_creator,"Liked on your discussion ",notification_text,receiver_name[0].user_token); 
        }
      }

          var result =  Like.insert({
                    like_id:like_id,
                      discussion_id: discussion_id,

                      discussion_title: discussion_title,

                      discussion_detail: discussion_detail,
                      discussion_creator: discussion_creator,
                      liked_by: liked_by,
                      like_type: 'Discussion_like',

                      likedAt: Date.now() 
                    });
          return result;
      },  
      
        remove_discussion_likes: function(like_id,notification_id){
            
            var likerId = Like.find({like_id:like_id}).fetch();
        
        if(likerId[0]){
          if(likerId[0].liked_by){
          update_last_activity_time(likerId[0].liked_by);   
          }
        }

                    var result_2 = Notifications.update({
                    notification_id: notification_id,
                  },{
                    $set: {
                      is_read: 0,
                      like_status: 'Unliked',
                      updated_at:  Date.now(),
                  }
                  });

        var result = Like.remove({ like_id: like_id });
        return result;
      },
      add_invites_group: function(grp_id,invited_list){
      var userGroupAdmin= UserGroup.find({grp_id: grp_id}).fetch();
      if(userGroupAdmin[0].admin){
        update_last_activity_time(userGroupAdmin[0].admin);   
      }
      var result = UserGroup.update({
                    grp_id: grp_id,
                  },{
                    $set: {
                      'invite_list': invited_list,
                      'invitedAt':  Date.now(),
                  }
                  });
        return result;
      },

    update_group_request: function(invite_accepted,grp_id,grp_admin,logged_in_user)
      {
      update_last_activity_time(logged_in_user);  
    // var logged_in_user = Session.get("userId");
    var result = UserGroup.update({
        grp_id: grp_id,
      }, {  
        $set: {                
                 invite_accepted: invite_accepted,
               UpdatedAt: Date.now(), 
            }
      });
    
      var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

    if(invite_accepted.includes(logged_in_user) ){
      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: logged_in_user,

                      notification_for: grp_admin,
                      notification_type: 'group_join',
                      grp_id: grp_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
    });
       var receiver_name = UserInfo.find({user_id: grp_admin}).fetch();
        var sender_name = UserInfo.find({"user_id":logged_in_user}).fetch(); 
        var notification_text = sender_name[0].name + " has join your group";
        if(receiver_name[0].user_token){
          send_notification(grp_admin,"New Group Member",notification_text,receiver_name[0].user_token); 
        }
      

    }else{
      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: logged_in_user,

                      notification_for: grp_admin,
                      notification_type: 'group_leave',
                      grp_id: grp_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
    });
    }
    return result;
    },


    update_group_request_invite: function(invite_list,grp_id,logged_in_user)
      {
        update_last_activity_time(logged_in_user);  
    var result = UserGroup.update({
        grp_id: grp_id,
      }, { 
        $set: {                
                 invite_list: invite_list,
               UpdatedAt: Date.now(), 
            }
      });

    var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

        // var result_2 = UserGroup.find({
        //            grp_id: grp_id,
        //          }).fetch();
        // console.log(result_2);
  var invite_accepted_2 = invite_list.split(",");
  for(var i=0; i < invite_accepted_2.length ; i++){
    if(!invite_accepted_2[i].includes(logged_in_user) ){

      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: logged_in_user,

                      notification_for: invite_accepted_2[i],
                      notification_type: 'Private_group_Invite',
                      grp_id: grp_id,

                      redirect_component: 0,
                      is_read: 0,
                      created_at: Date.now(),
    });

       var receiver_name = UserInfo.find({user_id: invite_accepted_2[i]}).fetch();
        var sender_name = UserInfo.find({"user_id":logged_in_user}).fetch(); 
        var notification_text = sender_name[0].name + " has invited you to Private group";
        if(receiver_name[0].user_token){
          send_notification(invite_accepted_2[i],"Private Group Invitation",notification_text,receiver_name[0].user_token); 
        }
    }
                                 
  }
      

    return result;
    },
    
    update_group_request_for_approval: function(requestee_list,grp_id,logged_in_user)
      {
        update_last_activity_time(logged_in_user);  
    var result = UserGroup.update({
        grp_id: grp_id,
      }, { 
        $set: {                
                 requestee_list: requestee_list,
               UpdatedAt: Date.now(), 
            }
      });

          var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);

                var newGroup = UserGroup.find({
                                grp_id: grp_id
                               }).fetch();

    if(requestee_list.includes(logged_in_user) ){
      var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: logged_in_user,

                      notification_for: newGroup[0].admin,
                      notification_type: 'public_group_join_request',
                      grp_id: newGroup[0].grp_id,

                      redirect_component: 0,
                      is_read: 0,

                      created_at: Date.now(),
    });

       var receiver_name = UserInfo.find({user_id: newGroup[0].admin}).fetch();
        var sender_name = UserInfo.find({"user_id":logged_in_user}).fetch(); 
        var notification_text = sender_name[0].name + " is the new member in your group";
        if(receiver_name[0].user_token){
          send_notification(newGroup[0].admin," New Group Member",notification_text,receiver_name[0].user_token); 
        }
    }
    return result;
    },

    make_user_member:function(group_id,logged_in_user,user_id){
      update_last_activity_time(logged_in_user);  
      var group_details = UserGroup.find({grp_id: group_id}).fetch();
      var requestee_list= group_details[0].requestee_list;
      var invite_accepted= group_details[0].invite_accepted;
      
      if(requestee_list.includes(user_id)){
          //remove requestee_list 
          var splitted_array = requestee_list.split(",");
          var final_requestee_list= "";
          for(var i=0;i<splitted_array.length;i++){
            if(splitted_array[i]==user_id){
              splitted_array.pop(user_id);
            }
            final_requestee_list=final_requestee_list+splitted_array[i]+",";
          } 
          if(splitted_array.length == 0){
          final_requestee_list="" ;
          }     
          else if(final_requestee_list != "" && final_requestee_list!= undefined){
          final_requestee_list = final_requestee_list.substring(0, final_requestee_list.length - 1);
          } 

          // insert accepted list
        if(invite_accepted == ""){ 
                  invite_accepted = user_id; 
        }                
        else{ 
                invite_accepted = invite_accepted + ',' +user_id;  
              } 


              var result = UserGroup.update({
        grp_id: group_id,
      }, {
        $set: {
               requestee_list: final_requestee_list,
               invite_accepted: invite_accepted,
               UpdatedAt: Date.now(), 
        }
      });


      }

      var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
       var grp_id = group_id;
         var newGroup = UserGroup.find({
                          grp_id: group_id
                          }).fetch();

    // if(requestee_list.includes(logged_in_user) ){
      var result_2 = Notifications.insert({
                      notification_id: notification_id,
                      notification_by: newGroup[0].admin,
                      notification_for: user_id,
                      notification_type: 'public_request_accepted',
                      grp_id: newGroup[0].grp_id,
                      redirect_component: newGroup[0].grp_id,
                      is_read: 0,
                      created_at: Date.now(),
                    });
      
       var receiver_name = UserInfo.find({user_id: user_id}).fetch();
        var sender_name = UserInfo.find({"user_id": newGroup[0].admin}).fetch(); 
        var notification_text = sender_name[0].name + " has accepted your request";
        if(receiver_name[0].user_token){
          send_notification(user_id,"New Group Member",notification_text,receiver_name[0].user_token); 
        }

      },

      // ******************* font_increase functions starting **************************//

        /*  save_font_increase_status: function(font_increase_status,logged_in_User)
      {
        update_last_activity_time(logged_in_user);  
   var result = UserInfo.update({
        user_id: logged_in_User,
      }, {  
        $set: {                
                 font_increase_status: font_increase_status,
            }
      });
    },*/

  // *******************Settings font_increase and color change starting **************************//

          save_font_increase_status: function(font_increase_status,logged_in_User)
      {
        update_last_activity_time(logged_in_User);
   var result = UserInfo.update({
        user_id: logged_in_User,
      }, {  
        $set: {                
                 font_increase_status: font_increase_status,
            }
      });
    },

        ChangeThemeColor: function(set_theme_value,logged_in_User)
      {
        update_last_activity_time(logged_in_User);
          var result = UserInfo.update({
        user_id: logged_in_User,
      }, {  
        $set: {                
                 theme_value: set_theme_value,
            }
      });
    },

      // ******************* font_increase functions Ending **************************//

      // ******************* Notification update functions starting **************************//

          update_notification_read_status: function(logged_in_User)
      {
        update_last_activity_time(logged_in_User);  
   var new_result = Notifications.find({ "notification_for":logged_in_User ,is_read: 0}).fetch();
     
     var save_ids = new Array();

   if(new_result[0]){

      for(var i=0; i<new_result.length; i++ ){
        save_ids.push(new_result[i].notification_id);
      }
   }

   for(var i=0;i<new_result.length; i++ ){
      var result = Notifications.update({
        notification_id: save_ids[i],
      }, {  
        $set: {                
                 is_read: 1,
            }
      });
    }
   },
    
      // ******************* Notification update functions Ending **************************//


      // ******************* Update user block status ( For admin ) Starting **************************//

       change_user_blocked_status: function(user_status,user_id)
      {
   var result = UserInfo.update({
        user_id: user_id,
      }, {  
        $set: {                
                 status: user_status,
            }
      });
    },

      // ******************* Update user block status ( For admin ) Ending **************************//



      // ******************* advertisement ( For admin ) Starting **************************//
        
                          
       save_promotion: function( promotion_id,promotion_title,promotion_type,promotion_url,promotion_content,promotion_start_date,promotion_end_date )
      {
        console.log('i am here');
var result = advertisement.insert({
                    promotion_id: promotion_id,
                      promotion_title: promotion_title,
                      promotion_start_date: promotion_start_date,
                      promotion_end_date: promotion_end_date,

                      promotion_type: promotion_type,
                      promotion_url: promotion_url,

                      promotion_content: promotion_content,
                      promotion_status: 'Active',
                      clicks_count: 0,

                      created_at: Date.now(),
                });
            
return result;
    },       
                          
       update_promotion: function( promotion_id,promotion_title,promotion_type,promotion_url,promotion_content,promotion_start_date,promotion_end_date )
      {
        // console.log('i am here');
        // console.log(promotion_id,promotion_title,promotion_type,promotion_url,promotion_content,promotion_start_date,promotion_end_date);
var result = advertisement.update({
            promotion_id: promotion_id,
          }, {  
            $set: { 
                   
                      promotion_title: promotion_title,
                      promotion_start_date: promotion_start_date,
                      promotion_end_date: promotion_end_date,

                      promotion_type: promotion_type,
                      promotion_url: promotion_url,

                      promotion_content: promotion_content,
                      // promotion_status: 'Active',
                      

                      updated_at: Date.now(),
                  }
                });
            
return result;
    },

     change_promotion_activation_status: function( promotion_status,promotion_id )
      {
       var result = advertisement.update({
            promotion_id: promotion_id,
          }, {  
            $set: {                
                     promotion_status: promotion_status,
                }
          });
        },

     updateCountOnPromotion: function( promotion_id,clicks_count)
      {
       var result = advertisement.update({
            promotion_id: promotion_id,
          }, {  
            $set: {                
                     clicks_count: clicks_count,
                }
          });
       return result;
        },

     changeAdminStatus: function(promotion_id )
      {
       var result = advertisement.update({
            promotion_id: promotion_id,
          }, {  
            $set: {                
                     promotion_status: 'Inactive',
                }
          });
       return result;
        },


    update_last_activity:function(userId){
      var newUser  =  UserInfo.find({"user_id":userId}).fetch();
        if(newUser[0]){
        var result =  UserInfo.update({
          _id: newUser[0]._id,
        }, {
          $set: {"last_activity_time": Date.now() }
        });
        }
        return "last_activity_time "+ Date.now();
    },

      // ******************* advertisement ( For admin ) Ending **************************//  




  //********************Start edit privacy, cookies & user agreement***********************************

  update_privacy:function(edit_privacy){

        var checkifPrivacyExist = Privacy.find({ edit_type: "privacy" }).fetch();
        console.log(checkifPrivacyExist);
    if(checkifPrivacyExist[0]){
      console.log("here 1");
    var result =  Privacy.update({
        _id: checkifPrivacyExist[0]._id,
      }, {
         $set: 
          {
        privacy_content: edit_privacy,
          updated_at: Date.now(),
      }
      });
    return result;
    }
    else{    
      console.log("here 2");
       var result = Privacy.insert({  
                   edit_type: "privacy",           
                     privacy_content: edit_privacy,
                     created_at: Date.now(),
          });
        return result;
    }
      //     var result = Privacy.update({
        //     edit_type: "privacy"
        //  }, {  
        //    $set: {                
        //              privacy_content: edit_privacy,
        //              updated_at: Date.now(),
        //        }
        //  });
        // return result;
  },  
 

  update_cookies:function(edit_privacy){

    var checkifPrivacyExist = Privacy.find({ edit_type: "cookies" }).fetch();
    if(checkifPrivacyExist[0]){
    var result =  Privacy.update({
        _id: checkifPrivacyExist[0]._id,
      }, {
          $set: 
          {

        privacy_content: edit_privacy,
          updated_at: Date.now(),
       }

      });
    return result;
    }
    else{    
       var result = Privacy.insert({  
                   edit_type: "cookies",           
                     privacy_content: edit_privacy,
                     created_at: Date.now(),
          });
        return result;
    }


      //     var result = Privacy.update({
        //     edit_type: "cookies"
        //  }, {  
        //    $set: {                
        //              privacy_content: edit_privacy,
        //              updated_at: Date.now(),
        //        }
        //  });
        // return result;
  },  


  update_useragreement:function(edit_privacy){

        var checkifPrivacyExist = Privacy.find({ edit_type: "useragreement" }).fetch();
    if(checkifPrivacyExist[0]){
    var result =  Privacy.update({
        _id: checkifPrivacyExist[0]._id,
      }, {
          $set: 
          {
        privacy_content: edit_privacy,
          updated_at: Date.now(),
      }
      });
    return result;
    }
    else{    
       var result = Privacy.insert({  
                   edit_type: "useragreement",           
                     privacy_content: edit_privacy,
                     created_at: Date.now(),
          });
        return result;
    }

      //     var result = Privacy.update({
        //     edit_type: "useragreement"
        //  }, {  
        //    $set: {                
        //              privacy_content: edit_privacy,
        //              updated_at: Date.now(),
        //        }
        //  });
        // return result;
  },  


  fetch_privacy_content:function(edit_type){
    var result = Privacy.find({ edit_type: edit_type }).fetch();
        return result;
  },  

  //********************End edit privacy, cookies & user agreement***********************************//




  //********************Start MEteor call for find ( removing Dejavu effect )***********************************

 
     FetchLikeDetails:function(post_id){  
  console.log('post_id: '+post_id);
  var result = Like.find({post_id: { $exists: true, $in: [post_id] } }).fetch();  
  console.log(result[0]);
  return result;  
},  


fetch_blog_details:function(blog_id){
var result = Blog.find({blog_id: blog_id}).fetch();  
return result;
},

FetchUserData:function(userId){
  var newUser = UserInfo.find({"user_id":userId}).fetch();
  return newUser; 
},


     get_user_information(user_id){
      var userInfo = UserInfo.find({"user_id":user_id}).fetch();
      return userInfo;
      },      

     get_medical_information(user_id){
      var result = UserMedical.find({user_id: user_id}).fetch();
      return result;
      },

     fetch_user_skills(skill){
      var userSkill =  UserSkill.find({"_id":skill}).fetch();
      return userSkill;
     },

     fetch_user_professional_details(professional){
var userSkill =  UserProfJr.find({"_id":professional}).fetch();
      return userSkill;       
     },

     fetch_user_educational_details(education_id){
         var result = UserEdu.find({'_id': education_id}).fetch();
         return result;
},

 fetch_user_archeivement:function(awd_id){
           var result = UserAward.find({"_id": awd_id }).fetch();
   return result;
       },

      fetch_group_infomation:function(grp_id){
              var result =  UserGroup.find({"grp_id": grp_id }).fetch();
          return result;
        },


        fetch_all_blogs:function(logged_in_user){
console.log('here: ');
      var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');              
      var allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{Blog_publish_date:{$lte:str}},{  status: {$ne: 'Inactive'} } ]},{sort: {Blog_publish_date: -1}}).fetch();
       console.log('fetch_all_blogs');
       console.log(allBlogs);
    return allBlogs;

  },

          event_comments_for_app:function(comment_id,event_id,comment_txt,comment_by,parent){
            update_last_activity_time(comment_by);
            var result = Event.find({
                        event_id: event_id}).fetch();

    if(result.length > 0){

      // var check_string = comment_by;

    // for(var i=0; i < newUser.length ; i++){
        var notification_id = 'Notify_'+ Math.floor((Math.random() * 2465789) + 1);
        if(result[0].event_admin != comment_by){

                    var result_2 = Notifications.insert({
                    notification_id: notification_id,
                      notification_by: comment_by,

                      notification_for: result[0].event_admin,
                      notification_type: 'event_comment_lvl0',
                      event_id: event_id,

                      comment_txt: comment_txt,
                      comment_id: comment_id,

                      redirect_component: event_id,
                      is_read: 0,
                      created_at: Date.now(),
                    });
                  }

          // if(check_string == ""){ 
          //    check_string = newUser[i].comment_by;
          //  }
          //  else if(!check_string.includes(newUser[i].comment_by) ){
          //    check_string = check_string +','+newUser[i].comment_by;
          //    }
        // }
      }
          var result =  Comment.insert({
                      comment_id:comment_id,
                      event_id: event_id,
                      comment_type: 'orignal',
                      comment_txt: comment_txt,
                      comment_by: comment_by,
                      parent: parent,
                      commentActivityStatus: 0,
                      createdAt: Date.now() 
                    });
          return result;

      },
      

        fetch_all_todays_event:function(logged_in_user){

    var mydate=new Date();
    str=moment(mydate).format('YYYY MM DD');

       var lists = Event.find({event_start_date:str, status: {$ne: 'Inactive'} }).fetch();
       
        var new_list = new Array();

      for(var i = 0; i< lists.length ; i++){

        var invite_type = invite_type;
        var invite_accepted = lists[i].invite_accepted;

        var invite_rejected = lists[i].invite_rejected;
        var invite_list = lists[i].invite_list;
        var invite_type = lists[i].invite_type;

        if(invite_type == 'Private'){
          if( (invite_list != ""  && invite_list != 0 && invite_list.includes(logged_in_user)) || (invite_accepted != ""  && invite_accepted != 0 && invite_accepted.includes(logged_in_user)) || (invite_rejected != ""  && invite_rejected != 0 && invite_rejected.includes(logged_in_user)) ){
                   new_list.push(lists[i]);
             }
        }
        else if(invite_type == 'Public'){
           new_list.push(lists[i]);
        }
      }

          console.log(new_list);
          return new_list.length;
        },


      fetch_all_connection_details:function(sent_to){
      var show_pending = FriendRequest.find({ $or: [ { $and: [ { sent_to: sent_to },
        { req_status: 1 } ] }, { $and: [{ sent_by: sent_to },{ req_status: 1 } ] } ] }).fetch();
      return show_pending.length;
      },
      PushNotifcationForApp:function(newDoc,logged_in_User){
      // console.log(newDoc);
      if(newDoc){
        var results = UserInfo.find({"user_id": logged_in_User}).fetch();
         // var store = newDoc.notification_type;

         // sssssssssssssssssssssssssssssssssssssssssssssss
                    var notification_type = newDoc.notification_type;
                    var comment_txt = newDoc.comment_txt;
                    // var logged_in_User = loggedInUsersName;
                    // var logged_in_User = loggedInUsersName;

                    var loggedInUsersName = results[0].name;
                    var user_token = results[0].user_token;

         // console.log('i love my india');
         // console.log(notification_type);
if(results[0].user_token){
                if(notification_type == 'event_join'){
      var name = loggedInUsersName+' Joined your event';

              if(newDoc[0].user_token){
             Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }
    else if(notification_type == 'event_comment_lvl1'){
      var name = loggedInUsersName+' Replied to your comment on event ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'event_comment_lvl0'){
      var name = loggedInUsersName+' has commented on your Event ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'event_like'){
      var name = loggedInUsersName+' liked on your comment on event';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'Friend_request'){
      var name = loggedInUsersName+' is now a connection';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'Friend_request_sent'){
      var name = loggedInUsersName+' sent you a ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'discussion_created'){
      var name = loggedInUsersName+' created a Discussion on ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm':newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'discussion_comment_lvl0'){
      var name = loggedInUsersName+' commented on your discussion ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'discussion_comment_lvl1'){
      var name = loggedInUsersName+' commented on discussion on';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'discussion_comment_like'){
      var name = loggedInUsersName+' liked your comment on  ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'main_discussion_like'){
      var name = loggedInUsersName+' like your discussion on ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'group_join'){
      var name = loggedInUsersName+' Joined your group ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'group_leave'){
      var name = loggedInUsersName+'  left your group ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'public_group_join_request'){
      var name = loggedInUsersName+' has requested to join your group ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'public_request_accepted'){
      var name = loggedInUsersName+' has accpted your request in group ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'Private_group_Invite'){
      var name = loggedInUsersName+' has invited you to his private group ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'blog_published'){
      var name = loggedInUsersName+' blog has been published with name ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'commment_on_blog_detail_thread_continued_level_1'){
      var name = loggedInUsersName+'  has commented on your blog ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'like_on_blog'){
      var name = loggedInUsersName+'  liked on your blog ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'commment_on_blog_detail_thread_continued'){
      var name = loggedInUsersName+' has commented on your blog ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'like_on_comment'){
      var name = loggedInUsersName+' liked on your blog ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'commment_on_blog_detail_level_1'){
      var name = loggedInUsersName+' replied in Blog on your post ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'like_on_hub_posted_comment'){
      var name = loggedInUsersName+' liked on your comment in hub post ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'like_on_hub_posting'){
      var name = loggedInUsersName+'  liked on hub post ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token}
                    }             
                }); 
              }
    }

    else if(notification_type == 'commment_on_hub_post'){
      var name = loggedInUsersName+' Commented on hub post ';
 
              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token: {'gcm' : newUser[0].user_token }
                    }             
                }); 
              }
    }

    else if(notification_type == 'commment_on_hub_post_continued_level_1'){
      var name = loggedInUsersName+' replied in hub on your post   ';

              if(newDoc[0].user_token){
              Push.send({
                    title: name,
                    text: comment_txt,
                    from: 'server',
                    badge: 1,
                query: {
                        token:{'gcm' :  newUser[0].user_token}
                    }             
                }); 
              }
    }
  }

  }
      // ssssssssssssssssssssssssssssssssssssssssssssssssss
      
      // return ;
      },


  //********************EndMEteor call for find ( removing Dejavu effect )***********************************



});




function update_last_activity_time(userId){
    var newUser  =  UserInfo.find({"user_id":userId}).fetch();
    if(newUser[0]){
    var result =  UserInfo.update({
        _id: newUser[0]._id,
      }, {
        $set: {"last_activity_time": Date.now() }
      });
    }

  }


function send_notification(userId,title,text,deviceToken){
      Push.send({
          title,
          text,
          from: 'push',
          badge: 1,
          query: {
            token: {'gcm' : deviceToken}
          }
        });
      console.log("Notification Fired for " + userId);
}