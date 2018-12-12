Template.test.onRendered(function(){
var myData = [{
  tag: 'Apple iPhone',
}, {
  tag: 'Microsoft Windows Phone',
}, {
  tag: 'Google Android Phone',
}]
$('.yyy').material_chip({
  data: myData
});
});

    

Template.test.events({
'click #save_chip':function(){
    var data= $('.yyy').material_chip('data');
    for(var i=0;i<data.length;i++){
        console.log(data[i].tag);    
    }
}
// alert("save_chip");

});

/*
var MODERATOR_CHANNEL_ID = 'ABCDEF'; // channel-id
var MODERATOR_SESSION_ID = 'XYZ';    // room-id
var MODERATOR_ID         = 'JKL';    // user-id
var MODERATOR_SESSION    = {         // media-type
    audio: true,
    video: true
};
var MODERATOR_EXTRA      = {};   


var moderator     = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
moderator.session = MODERATOR_SESSION;
moderator.userid  = MODERATOR_ID;
moderator.extra   = MODERATOR_EXTRA;
moderator.open({
    dontTransmit: true,
    sessionid   : MODERATOR_SESSION_ID
});

// same code can be used for participants
// (it is optional) 
moderator.onstreamid = function(event) {
    // got a clue of incoming remote stream
    // didn't get remote stream yet

    var incoming_stream_id = event.streamid;

    YOUR_PREVIEW_IMAGE.show();

    // or
    YOUR_PREVIEW_VIDEO.show();
};

// same code can be used for participants
// it is useful
moderator.onstream = function(event) {
    // got local or remote stream
    // if(event.type == 'local')  {}
    // if(event.type == 'remote') {}

    document.body.appendChild(event.mediaElement);

    // or YOUR_VIDEO.src = event.blobURL;
    // or YOUR_VIDEO.src = URL.createObjectURL(event.stream);
};

// same code can be used for participants
// it is useful but optional
moderator.onstreamended = function(event) {
    event.mediaElement.parentNode.removeChild(event.mediaElement);
};

var participants = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
participants.join({
    sessionid: MODERATOR_SESSION_ID,
    userid   : MODERATOR_ID,
    extra    : MODERATOR_EXTRA,
    session  : MODERATOR_SESSION
});*/