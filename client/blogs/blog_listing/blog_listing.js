
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from './../../../import/config.js';

import { Blog } from './../../../import/collections/insert.js';
import { UserInfo } from './../../../import/collections/insert.js';
import { Followers } from './../../../import/collections/insert.js';

import { Like } from './../../../import/collections/insert.js';
import { Comment } from './../../../import/collections/insert.js';
import { FriendRequest } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

Template.bloglist.onCreated(function eventlistOnCreated() {
  this.selected_tab = new ReactiveVar("all");
  this.blog_searching_text = new ReactiveVar("");

  this.all_blogs_count=new ReactiveVar(0);
  this.draft_blog_count=new ReactiveVar(0);
  this.blog_published_by_me_count=new ReactiveVar(0);
  this.coming_soon_count=new ReactiveVar(0);
  this.followers=new ReactiveVar(0);
  this.following=new ReactiveVar(0);

});
// Template.blog_listing.onCreated(function () {
//   this.documents = this.subscribe( 'documents' );
// });

// let all_likes;
// let all_comments;
// let all_blogs;
// let all_friends;
// let all_followers;


Template.bloglist.onDestroyed(function(){
  // all_likes.stop();
  // all_comments.stop();
  // all_friends.stop();
  // all_blogs.stop();
  // all_followers.stop();
})

Template.bloglist.onRendered(function(){
// all_blogs  =   Meteor.subscribe("all_blog_data");
// all_friends =    Meteor.subscribe("all_friend_users");
// all_likes = Meteor.subscribe("all_likes");
// all_comments = Meteor.subscribe("all_comments");
// all_followers = Meteor.subscribe("all_followers");

Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

  setTimeout(function(){ 
    var logged_in_User =  Session.get("userId");
    var result = UserInfo.find({user_id: logged_in_User}).fetch();
if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("body_bg");
       $('#blog_container').addClass("pink_background");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("body_bg");  
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("body_bg");
     $('#blog_container').addClass("blue_background");
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("body_bg");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("body_bg");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");
 $('#blog_container').addClass("default_background");
      $('.page_wh').addClass("body_bg");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");
             
     } 
  }
}, 1000);
   });


Template.blog_listing.helpers({

      user_is_admin(){
      var logged_in_user = Session.get("userId");
      // alert('logged_in_user: '+logged_in_user);
      if(logged_in_user == 'user_admin'){
        return true;
      }
      else{
        return false;
      }
  },

 // subscription: function() {
 //    return Template.instance().documents.ready();
 //  }
})
  Template.bloglist.helpers({
  
  user_is_admin(){
      var logged_in_user = Session.get("userId");
      // alert('logged_in_user: '+logged_in_user);
      if(logged_in_user == 'user_admin'){
        return true;
      }
      else{
        return false;
      }
  },

   check_blog_inactive_or_not(){
// alert('gvggv');
    var blog_id = this.blog_id;
    // alert(blog_id);
    Meteor.subscribe("all_blog_data", blog_id);
    var result = Blog.find({ blog_id: blog_id }).fetch();
    var status = result[0].status;
    // alert(logged_in_user+''+status);
    if( status == "" || status  == null || status == undefined ){
      return true;
    }
    else{
      return false;
    }

   },

/*
  fetchBlogData(){

      const t = Template.instance();
      const selected_tab = t.selected_tab.get(); 
      var allBlogs = "";

      const blog_search = new RegExp(t.blog_searching_text.get(),'i'); 
      var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');              
      const search = new RegExp(t.blog_searching_text.get(),'i');  

      allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{Blog_publish_date:{$lte:str}},{blog_title:search}]}).fetch();
      
       if(allBlogs){
        var array_length = allBlogs.length; 
        var blogsdata_search= new Array();;
        for(var i=0;i<array_length;i++)
        {   
            if(Session.get("userId")!=allBlogs[i].blog_creator_id){
            var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
            
            if(show_followers.length==1){
              blogsdata_search.push(allBlogs[i]);
              }              
            }else{
              blogsdata_search.push(allBlogs[i]);
            }
        }



        t.all_blogs_count.set(blogsdata_search.length);
        }

         draft_blogs_search = Blog.find({ $and:[{is_draft: 1},{blog_title:search},{blog_creator_id:Session.get("userId")} ]}).fetch();
         t.draft_blog_count.set(draft_blogs_search.length);
     
        published_by_me_searched = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_creator_id:Session.get("userId")},{blog_title: search} ,{Blog_publish_date:{$lte:str}}]}).fetch();
        t.blog_published_by_me_count.set(published_by_me_searched.length);

        coming_soon_searched = Blog.find({$and:[{Blog_publish_date:{$gt:str}},{is_draft: 0},{is_active: 1},{blog_creator_id:Session.get("userId")},{blog_title:search}]}).fetch();
        t.coming_soon_count.set(coming_soon_searched.length);

    if(selected_tab == "all"){
        var mydate=new Date();   
        var str=moment(mydate).format('YYYY-MM-DD');          
        allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_title:search},{Blog_publish_date:{$lte:str}}]}).fetch();
        var array_length = allBlogs.length; 
        var blogsdata= new Array();

        for(var i=0;i<array_length;i++)
        {   
            if(Session.get("userId")!=allBlogs[i].blog_creator_id){
            var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
            
            if(show_followers.length==1){
              blogsdata.push(allBlogs[i]);
              } 

            } else{
              blogsdata.push(allBlogs[i]);
            }
        }
        //for adding admin events start
        var result = Blog.find({
                                 $and:[
                                      { is_draft: 0 },
                                      { is_active: 1 },
                                      { blog_creator_id: 'user_admin' },
                                      { blog_title: search },
                                      { Blog_publish_date:
                                        { $lte:str }
                                      }
                                      ]
                                }).fetch();
        // console.log('result: ');
        // console.log(result);
        var result_length = result.length; 
        
        for( var i=0; i<result_length; i++ )
        {   
              blogsdata.push(result[i]);
        }
        //for adding admin events end
         
        $("#headline").text("All Blogs (" + blogsdata.length+ ")");
        t.all_blogs_count.set(blogsdata.length);
        console.log(allBlogs); 
        return blogsdata;
     }

     else if(selected_tab == "draft" ){
    allBlogs = draft_blogs_search;
    t.draft_blog_count.set(allBlogs.length);
      $("#headline").text("Drafts (" + allBlogs.length+ ")");
    }

    else if(selected_tab == "published_by_me"){
      allBlogs= published_by_me_searched;
      t.blog_published_by_me_count.set(allBlogs.length);
      $("#headline").text("Published by me (" + allBlogs.length+ ")");
    }

    else if(selected_tab == "coming_soon"){
        allBlogs =coming_soon_searched;
       t.coming_soon_count.set(allBlogs.length);
      $("#headline").text("Coming Soon (" + allBlogs.length+ ")");
    }
    console.log(allBlogs);
    return allBlogs;
  },*/
 fetchBlogData(){

      const t = Template.instance();
      const selected_tab = t.selected_tab.get(); 
      var allBlogs = "";

      const blog_search = new RegExp(t.blog_searching_text.get(),'i'); 
      var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD');              
      const search = new RegExp(t.blog_searching_text.get(),'i');  
      Meteor.subscribe("fetch_all_blogs_data");
      allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{Blog_publish_date:{$lte:str}},{blog_title:search},{  status: {$ne: 'Inactive'} } ]},{sort: {Blog_publish_date: -1}}).fetch();
      
       if(allBlogs){
        var array_length = allBlogs.length; 
        var blogsdata_search= new Array();;
        for(var i=0;i<array_length;i++)
        {   
            if(Session.get("userId")!=allBlogs[i].blog_creator_id){
              Meteor.subscribe("fetch_user_followers",Session.get("userId"), allBlogs[i].blog_creator_id);
            var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
            
            if(show_followers.length==1){
              blogsdata_search.push(allBlogs[i]);
              }              
            }else{
              blogsdata_search.push(allBlogs[i]);
            }
        }



        t.all_blogs_count.set(blogsdata_search.length);
        }
          Meteor.subscribe("fetch_all_user_blogs",Session.get("userId"));
         draft_blogs_search = Blog.find({ $and:[{is_draft: 1},{blog_title:search},{blog_creator_id:Session.get("userId")}, {  status: {$ne: 'Inactive'}} ]},{sort: {Blog_publish_date: -1}}).fetch();
         t.draft_blog_count.set(draft_blogs_search.length);
     
        published_by_me_searched = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_creator_id:Session.get("userId")},{blog_title: search} ,{Blog_publish_date:{$lte:str}}, {  status: {$ne: 'Inactive'}} ]},{sort: {Blog_publish_date: -1}}).fetch();
        t.blog_published_by_me_count.set(published_by_me_searched.length);

        coming_soon_searched = Blog.find({$and:[{Blog_publish_date:{$gt:str}},{is_draft: 0},{is_active: 1},{blog_creator_id:Session.get("userId")},{blog_title:search}, {  status: {$ne: 'Inactive'}} ]},{sort: {Blog_publish_date: -1}}).fetch();
        t.coming_soon_count.set(coming_soon_searched.length);

    if(selected_tab == "all"){
        var mydate=new Date();   
        var str=moment(mydate).format('YYYY-MM-DD');          
        allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_title:search},{Blog_publish_date:{$lte:str}}, {  status: {$ne: 'Inactive'}} ]},{sort: {Blog_publish_date: -1}}).fetch();
        var array_length = allBlogs.length; 
        var blogsdata= new Array();

        for(var i=0;i<array_length;i++)
        {   
            if(Session.get("userId")!=allBlogs[i].blog_creator_id){

              Meteor.subscribe("fetch_user_followers",Session.get("userId"), allBlogs[i].blog_creator_id);
            var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
            
            if(show_followers.length==1){
              blogsdata.push(allBlogs[i]);
              } 

            } else{
              blogsdata.push(allBlogs[i]);
            }
        }
        //for adding admin events start
        var result = Blog.find({
                                 $and:[
                                      { is_draft: 0 },
                                      { is_active: 1 },
                                      { blog_creator_id: 'user_admin' },
                                      { blog_title: search },
                                      { Blog_publish_date:
                                        { $lte:str }
                                      }, {  status: {$ne: 'Inactive'}} 
                                      ]
                                }).fetch();
        // console.log('result: ');
        // console.log(result);
        var result_length = result.length; 
        
        for( var i=0; i<result_length; i++ )
        {   
              blogsdata.push(result[i]);
        }
        //for adding admin events end
         
        $("#headline").text("All Blogs (" + blogsdata.length+ ")");
        t.all_blogs_count.set(blogsdata.length);
        console.log(allBlogs); 
        return blogsdata;
     }

     else if(selected_tab == "draft" ){
    allBlogs = draft_blogs_search;
    t.draft_blog_count.set(allBlogs.length);
      $("#headline").text("Drafts (" + allBlogs.length+ ")");
    }

    else if(selected_tab == "published_by_me"){
      allBlogs= published_by_me_searched;
      t.blog_published_by_me_count.set(allBlogs.length);
      $("#headline").text("Published by me (" + allBlogs.length+ ")");
    }

    else if(selected_tab == "coming_soon"){
        allBlogs =coming_soon_searched;
       t.coming_soon_count.set(allBlogs.length);
      $("#headline").text("Coming Soon (" + allBlogs.length+ ")");
    }
    console.log(allBlogs);
    return allBlogs;
  },
  fetchBlogData_for_admin(){
    const t = Template.instance();
    const selected_tab = t.selected_tab.get(); 
    var allBlogs = "";

    const blog_search = new RegExp(t.blog_searching_text.get(),'i'); 

      var mydate=new Date();         
      var str=moment(mydate).format('YYYY-MM-DD')              
      const search = new RegExp(t.blog_searching_text.get(),'i');  
      allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_title:search}]}).fetch();
       if(allBlogs){
        var array_length = allBlogs.length; 
        // var blogsdata_search= new Array();;
        // for(var i=0;i<array_length;i++)
        // {   
        //     if(Session.get("userId")!=allBlogs[i].blog_creator_id){
        //     var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
        //     if(show_followers.length==1){
        //       blogsdata_search.push(allBlogs[i]);
        //       }              
        //     }else{
        //       blogsdata_search.push(allBlogs[i]);
        //     }
        // } 
        t.all_blogs_count.set(array_length);
        }


         draft_blogs_search = Blog.find({ $and:[{is_draft: 1},{blog_title:search},{blog_creator_id:Session.get("userId")} ]}).fetch();
         t.draft_blog_count.set(draft_blogs_search.length);
     
        published_by_me_searched = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_creator_id:Session.get("userId")},{blog_title: search} ,{Blog_publish_date:{$lte:str}}]}).fetch();
        t.blog_published_by_me_count.set(published_by_me_searched.length);

        coming_soon_searched = Blog.find({$and:[{Blog_publish_date:{$gt:str}},{is_draft: 0},{is_active: 1},{blog_creator_id:Session.get("userId")},{blog_title:search}]}).fetch();
        t.coming_soon_count.set(coming_soon_searched.length);

    if(selected_tab == "all"){
      // alert("2");
        var mydate=new Date();   
        var str=moment(mydate).format('YYYY-MM-DD');          
        var allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1},{blog_title:search}]}).fetch();
        var array_length = allBlogs.length; 
        // var blogsdata= new Array();

      // for(var i=0;i<array_length;i++)
      //   {   
      //       if(Session.get("userId")!=allBlogs[i].blog_creator_id){
      //       var show_followers = Followers.find({follower:Session.get("userId"),following: allBlogs[i].blog_creator_id,is_follower:1}).fetch();
      //       if(show_followers.length==1){   
      //         blogsdata.push(allBlogs[i]);  
      //         }                 
      //       }else{      
      //         blogsdata.push(allBlogs[i]);    
      //       }   
      //   }    

        $("#headline").text("All Blogs (" + allBlogs.length+ ")");
        t.all_blogs_count.set(allBlogs.length);
        console.log(allBlogs); 
        return allBlogs;

     }else if(selected_tab == "draft" ){
    allBlogs = draft_blogs_search;
    t.draft_blog_count.set(allBlogs.length);
      $("#headline").text("Drafts (" + allBlogs.length+ ")");
    }else if(selected_tab == "published_by_me"){
      allBlogs= published_by_me_searched;
      t.blog_published_by_me_count.set(allBlogs.length);
      $("#headline").text("Published by me (" + allBlogs.length+ ")");
    }else if(selected_tab == "coming_soon"){
        allBlogs =coming_soon_searched;
       t.coming_soon_count.set(allBlogs.length);
      $("#headline").text("Coming Soon (" + allBlogs.length+ ")");
    }
    console.log(allBlogs);
    return allBlogs;
  },
  

  trim_content(content){
     if(content.length > 20){
         return content.substr(0, 20) +"...";
        }
        else{
        return content;
        }
  },
  all_blogs_count(){
    const t = Template.instance();
    return t.all_blogs_count.get();
  },draft_blog_count(){
    const t = Template.instance();
    return t.draft_blog_count.get();
  },blog_published_by_me_count(){
    const t = Template.instance();
    return t.blog_published_by_me_count.get();
  },coming_soon_count(){
    const t = Template.instance();
    return t.coming_soon_count.get();
  },
  changeDateFormat(){
            const t = Template.instance();
         // if(t.selected_tab.get()=="coming_soon"){
          var str = this.Blog_publish_date;
          var date = str.split("-")[2];
          var month = str.split("-")[1];
          var year = str.split("-")[0];
          var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
          return months[month-1]+ " " +date +", " +year;
         // }

/*
    var dt = new Date(this.Blog_publish_date);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);

   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's';
   } else if(minutes>= 1 && minutes<=60) {
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

  */
  /*    var date = new Date(this.Blog_publish_date);
    ddSplit[1]+'-'+ + '-' + ddSplit[2]
    var formatted = moment(date).format('MMM D,  YYYY');
    return Date.parse(new Date(formatted)).toString("MMMM yyyy");*/
  },
  blog_creator_image(){
    var creator_id = this.blog_creator_id;
    Meteor.subscribe("user_info_based_on_id",creator_id);
    var userInfo = UserInfo.find({"user_id":creator_id}).fetch();
    return userInfo[0].profile_pic;
  },
  blog_creator_details(){
     var creator_id = this.blog_creator_id;
     Meteor.subscribe("user_info_based_on_id",creator_id);
    var userInfo = UserInfo.find({"user_id":creator_id}).fetch();
    return userInfo;
  },
    fetch_all_followers(){
       var current_logged_in = Session.get("userId");
       Meteor.subscribe("fetch_all_followers",current_logged_in);
       var show_followers = Followers.find({following: current_logged_in,is_follower:1}).fetch();
         const t = Template.instance();
       t.followers.set(show_followers.length);
       return show_followers;
   },followers_count(){
      const t = Template.instance();
    return t.followers.get();
  },
   get_user_info(userId){
    Meteor.subscribe("user_info_based_on_id",userId);
    var userInfo = UserInfo.find({"user_id":userId}).fetch();
    return userInfo;
   },
   check_for_follower(){
    var weather_I_am_following_this_person=this.follower;
     var current_logged_in = Session.get("userId");
     Meteor.subscribe("check_for_follower",current_logged_in,weather_I_am_following_this_person);
    var show_followers = Followers.find({follower: current_logged_in,following:weather_I_am_following_this_person,is_follower:1}).fetch();
    if(show_followers.length==0){
    return 'Follow Back';
    }else{
      return 'Following';
    }
   },
   fetch_all_following(){
        var current_logged_in = Session.get("userId");
        Meteor.subscribe("fetch_all_following",current_logged_in);
       var show_following = Followers.find({follower: current_logged_in,is_follower:1}).fetch();
         const t = Template.instance();
       t.following.set(show_following.length);
       return show_following;
   },following_count(){
      const t = Template.instance();
    return t.following.get();
  },
   check_for_blog_creator_and_current_login_user(blog_creator_id){
        var current_logged_in = Session.get("userId");
        if(blog_creator_id == current_logged_in ){
          return true;
        }else{
          return false;
        }
   },
   show_like_count(blog_id){
       var liked_by = Session.get("userId");
       Meteor.subscribe("like_based_on_blog_id",blog_id);
        var result_count = Like.find({blog_id: blog_id,like_type: 'main_blog'}).count();
        return result_count;
   },
    fetch_count_total_level_zero_comments(blog_id){
      Meteor.subscribe("comment_based_on_blog_id",blog_id);
           var result = Comment.find({blog_id: blog_id, comment_type: 'orignal', commentActivityStatus: 0} ,{sort: {createdAt: -1}}).fetch();
      return result.length; 
     },
     blogs_written(user_id){
       var mydate=new Date();
          // var str=moment(mydate).format('DD MMMM, YYYY');
                var str=moment(mydate).format('YYYY-MM-DD');            
        var allBlogs = Blog.find({ $and:[{is_draft: 0},{is_active: 1}, {blog_creator_id:user_id},{Blog_publish_date:{$lte:str}}]}).fetch();
        return allBlogs.length;
     },
     mutual_connections(user_id){
      Meteor.subscribe("fetch_all_users_for_other_person",user_id)
      Meteor.subscribe("logged_user_in_user_friends",Session.get("userId"));

      var fetch_all_users_for_other_person = FriendRequest.find({ $or: [ { $and: [ { sent_to: user_id },{ req_status: 1 } ] }, { $and: [{ sent_by: user_id },{ req_status: 1 } ] } ] }).fetch();
      var logged_in_user_friends = FriendRequest.find({ $or: [ { $and: [ { sent_to: Session.get("userId") },{ req_status: 1 } ] }, { $and: [{ sent_by: Session.get("userId")  },{ req_status: 1 } ] } ] }).fetch();
      var mutual_friends= 0 ;
      var common_elements = new Array();
    for(var i=0;i<fetch_all_users_for_other_person.length;i++){
      var go_inside_for_check_user_id="";
        if(fetch_all_users_for_other_person[i].sent_by==user_id){
          go_inside_for_check_user_id= fetch_all_users_for_other_person[i].sent_to;
        }else{
          go_inside_for_check_user_id= fetch_all_users_for_other_person[i].sent_by;
        }
      for(var j=0;j<logged_in_user_friends.length;j++){
        if(go_inside_for_check_user_id == logged_in_user_friends[j].sent_by || go_inside_for_check_user_id == logged_in_user_friends[j].sent_to ){
          if(!common_elements.includes(go_inside_for_check_user_id))
          {
          common_elements.push(go_inside_for_check_user_id)
          mutual_friends++;
          }
          
            }
          }
    }
      return common_elements.length;
     },
     selected_tab(){
        const t = Template.instance();
      
      return t.selected_tab.get();
     }


  });


Template.bloglist.onRendered(function(){
  $('#all_blogs').click();
  setInterval(function(){ 
    var logged_in_User =  Session.get("userId");
    var result = UserInfo.find({user_id: logged_in_User}).fetch();
  if(result[0]){
    if(result[0].theme_value == '1'){
       $('body').addClass("make_bg_2");
       $('body').removeClass("make_bg_1");
       $('body').removeClass("make_bg_3");
      
      $('.page_wh').addClass("make_bg_2");  
      $('.page_wh').removeClass("make_bg_1");  
      $('.page_wh').removeClass("make_bg_3");  
     }    

    else  if(result[0].theme_value == '2'){
        $('body').addClass("make_bg_1");
        $('body').removeClass("make_bg_2");
        $('body').removeClass("make_bg_3");
    
        $('.page_wh').addClass("make_bg_1");
        $('.page_wh').removeClass("make_bg_2");
        $('.page_wh').removeClass("make_bg_3");
     }
  else  if(result[0].theme_value == '3'){
       $('body').addClass("make_bg_3");
       $('body').removeClass("make_bg_2");
      $('body').removeClass("make_bg_1");

      $('.page_wh').addClass("make_bg_3");
      $('.page_wh').removeClass("make_bg_2");
      $('.page_wh').removeClass("make_bg_1");
             
     } 
  }
}, 3000);
});

Template.bloglist.events({

      'click #activate':function()
  {
    var confirmation = confirm("Are you sure you want to deactivate this blog ?");

    if(confirmation == true){


    var blog_id =this.blog_id;
    // alert('event_id '+event_id);
    var blog_status = 'Inactive';
    Meteor.call('change_blog_activation_status',blog_status,blog_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('Blog is inactive and cant be found');
      }
      
     });
  }
  },

  'click #in_activate':function()
  {

    var confirmation = confirm("Are you sure you want to activate this blog again ?");

    if(confirmation == true){

    var blog_id =this.blog_id;
    // alert('event_id '+event_id);
    var blog_status = "";
    Meteor.call('change_blog_activation_status',blog_status,blog_id,function(error,result){
      if(error)
      {
          toastr.error('Error');
      }
      else{
          toastr.success('Blog is active');
      }
      
     });

    }

  },

    'click .Show_author':function(events){
   // alert('inside');
    var user_id = this.blog_creator_id;
    var logged_in_user = Session.get("userId");
    // alert(user_id+' '+logged_in_user);

    if(logged_in_user == user_id)
    {
          Router.go('/profile');    
    }
    else
    {
    user_id= Base64.encode(user_id);
    var url = '/view_profile/'+user_id;
    Router.go(url);
    }
  },

  'click #display_all_blogs':function(){
  $("#tdevent").show();
  $("#followers").hide();
  $("#following").hide();
},
'click #display_followers':function(){

  $("#followers").show();
  $("#tdevent").hide();
  $("#following").hide();
},'click #display_following':function(){

  $("#tdevent").hide();
  $("#followers").hide();
  $("#following").show();
},
  'click #all_blogs':function(event){    
  const t = Template.instance();
       t.selected_tab.set("all");
  },
  'click #draft_listing':function(event){
      const t = Template.instance();
       t.selected_tab.set("draft");

  },
  'click #published_by_me':function(event){
      const t = Template.instance();
       t.selected_tab.set("published_by_me");
  },
  'click #coming_soon':function(event){
        const t = Template.instance();
         t.selected_tab.set("coming_soon");
  },
  'click #create_blog_btn':function(event){
        Router.go('/create_blog');     
       },
  'click .edit_blog_btn': function(event){
    event.preventDefault();
    var blog_id = this.blog_id;
    blog_id= Base64.encode(blog_id);
    Session.clear("edit_new_blog_image_url");
    var url = '/edit_blog/'+blog_id;
    Router.go(url);    
},
  'click .remove_blog_btn':function(event){
    if(confirm("Are you sure you want to delete?")){
    event.preventDefault();
      var blog_id = this.blog_id;
    Meteor.call('remove_blog',blog_id,function(error,result){
      if(error){
        console.log("error");
      }else{
        console.log("Blog Removed");
      }
    });  
    }
  },
  'click #search_blogs':function(event){
        const t = Template.instance();
       t.blog_searching_text.set($("#search_all_text_conn").val());
  },
  'click .card-image,.card-title':function(event){
    var blog_id = this.blog_id;
    blog_id= Base64.encode(blog_id);

    var url = '/blog_detail/'+blog_id;
    Router.go(url);    
    return false;
  },
  'click .unfollow_users':function(){
      if(confirm("Unollow this user then you will not be able to receive Blog updates from this user. Sure you want to unfollow?")){
        Meteor.call('change_follow_status',Session.get("userId"),this.following,0,function(error,result){
                if(error){
                  console.log("Error");
                }else{
                  console.log("Success");
                }
          });
   }
  },
  'click .change_follow_status':function(){
             var current_user_id = Session.get("userId");
          var show_pending = Followers.find({following: this.follower,follower:current_user_id ,is_follower:1}).fetch();
         console.log(show_pending);
          var change_follow_status = 0;
          if(show_pending.length==0){
            change_follow_status=1;
            Meteor.call('change_follow_status',current_user_id,this.follower,change_follow_status,function(error,result){
                if(error){
                  console.log("Error");
                }else{
                  console.log("Success");
                }
          });
          }
       },
  'keyup input': function(event) {
      if (event.which === 13) {
       const t = Template.instance();
       t.blog_searching_text.set($("#search_all_text_conn").val());
      }
    }, 
    'click .redirect_to_profile':function(event){
      event.preventDefault();
    var user_id = Session.get("userId");
    user_id= Base64.encode(this.user_id);
    var url = '/view_profile/'+user_id;
    if(Session.get("userId") == this.user_id)
    {
      Router.go('/profile');    
    }
    else{
      Router.go(url);
    }

    }
})



