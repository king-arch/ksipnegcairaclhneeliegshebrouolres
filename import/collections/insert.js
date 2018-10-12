import { Mongo } from 'meteor/mongo';
 
export const UserInfo = new Mongo.Collection('user_info');                                              
export const UserSkill = new Mongo.Collection('user_skill');                                         
export const UserProfJr = new Mongo.Collection('user_profjr');                                   
export const UserEdu = new Mongo.Collection('user_edu');                                          
export const UserAward = new Mongo.Collection('user_award');                                    
export const UserMedical = new Mongo.Collection('user_medical');                                   
                                                                                             
export const FriendRequest = new Mongo.Collection('friend');                               
export const Message = new Mongo.Collection('message');                                  
export const UserGroup = new Mongo.Collection('user_group');                              
export const GroupRequest = new Mongo.Collection('group_request');                          
export const Chatroom = new Mongo.Collection('chatroom');                                   
export const VideoSession = new Mongo.Collection('video_session');                                   
export const AudioSession = new Mongo.Collection('audio_session');                                   


export const Event = new Mongo.Collection('event');   
export const Emembers = new Mongo.Collection('event_members');                                   
export const Comment = new Mongo.Collection('comment');                                   
export const Like = new Mongo.Collection('like'); 
export const Followers = new Mongo.Collection('followers'); 
export const Discussion = new Mongo.Collection('discussion'); 


export const Blog = new Mongo.Collection('blog');                                   
export const Hub = new Mongo.Collection('hub');                                   
export const Notifications = new Mongo.Collection('notifications');                                   
export const advertisement = new Mongo.Collection('advertisement');                                   
export const PollOption = new Mongo.Collection('PollOption');                                   
export const Privacy = new Mongo.Collection('privacy');                                   

