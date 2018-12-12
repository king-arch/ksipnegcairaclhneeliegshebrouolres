// GoogleMaps.init({
//   //'sensor': false, //optional
//   'key': 'AIzaSyBnQrXrRyWtQu7EKB9Hk1S10Gc6eQuamUo', //optional
//   'language': 'en',  //optional
//   'libraries': 'places'
// });
Meteor.startup(function() {
  GoogleMaps.load({
    key: 'AIzaSyBnQrXrRyWtQu7EKB9Hk1S10Gc6eQuamUo',
    libraries: 'places'  // also accepts an array if you need more than one
  });
});
