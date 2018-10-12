/*//Create an account on Firebase, and use the credentials they give you in place of the following
var config = {
  apiKey: "AIzaSyBajPcoloVgJTcE44NhPLvVsqnWG9RSBEE",
  authDomain: "simple-webrtc-video-chat.firebaseapp.com",
  databaseURL: "https://simple-webrtc-video-chat.firebaseio.com",
  projectId: "simple-webrtc-video-chat",
  storageBucket: "simple-webrtc-video-chat.appspot.com",
  messagingSenderId: "748074977719"
};
firebase.initializeApp(config);

var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'webrtc.websitebeaver@gmail.com'}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

function sendMessage(senderId, data) {
    var msg = database.push({ sender: senderId, message: data });
    msg.remove();
}

function readMessage(data) {
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    if (sender != yourId) {
        if (msg.ice != undefined)
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        else if (msg.sdp.type == "offer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
              .then(() => pc.createAnswer())
              .then(answer => pc.setLocalDescription(answer))
              .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
        else if (msg.sdp.type == "answer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    }
};

database.on('child_added', readMessage);

function showMyFace() {
  navigator.mediaDevices.getUserMedia({audio:true, video:true})
    .then(stream => yourVideo.srcObject = stream)
    .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer) )
    .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}*/

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