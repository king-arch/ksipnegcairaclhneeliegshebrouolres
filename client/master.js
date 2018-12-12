import { AbusiveContent } from './../import/collections/insert.js';

Template.registerHelper("check_for_abusive_comment_id",function(comment_id){
	var abusiveContent = AbusiveContent.find({post_id:comment_id}).count()
	return abusiveContent == 0;
})

