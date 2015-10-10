//this function is not getting called, since i can't figure out how to deal with the youtube client promise system
function getYouTubeUrl (title, artist) {
	// console.log("getting TY Url", gapi.client.youtube);
	var q = `${artist} - ${title}`;
  	var request = gapi.client.youtube.search.list({
    	q: q,
    	part: 'snippet',
    	type: 'video',
    	videoCategoryId: "Music"
  	});
  	// console.log("the request:", request);
	return new Promise (function (resolve) {
		request.execute(function(response) {
			console.log("response?", response);
			// if (err) {
			// 	console.log("ERR", err);
			// 	return reject(err);	
			// }
		  	// console.log("YT API RESPONSE:", response);
		    var id = response.result.items[0].id.videoId;
		    console.log("video id to send to router", id);
		    return resolve(id);
  		});
	});
}

//how do we store our api keys securely on the extension?????
function youTubeInit () {
	// console.log("initializing YT");
	var apiKey = "AIzaSyDFtbzUzDbzN4jGBqEf-tUN1CDVwaOt0Vc";
	gapi.client.setApiKey(apiKey);
	gapi.client.load("youtube", "v3").then(function (err){
		// console.log("error?", err);
		// console.log("yt client?", gapi.client.youtube.search.list);
	});
	// gapi.auth.init(function() {
	// 	console.log("init callback");
	// 	window.setTimeout(checkAuth, 1);
	// });
}


//not using oauth! yet...

// // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// // If the currently logged-in Google Account has previously authorized
// // the client specified as the OAUTH2_CLIENT_ID, then the authorization
// // succeeds with no user intervention. Otherwise, it fails and the
// // user interface that prompts for authorization needs to display.

// var OAUTH2_CLIENT_ID = "20757556090-hk3pvocfvd4ev4jvodg55k11454647k9.apps.googleusercontent.com";
// var OAUTH2_SCOPES = [
// 	'https://www.googleapis.com/auth/youtube'
// ];

// function checkAuth() {
//   gapi.auth.authorize({
//     client_id: OAUTH2_CLIENT_ID,
//     scope: OAUTH2_SCOPES,
//     immediate: true
//   }, handleAuthResult);
// }

// // Handle the result of a gapi.auth.authorize() call.
// function handleAuthResult(authResult) {
//   console.log("AUTH RESULT:", authResult);
//   if (authResult && !authResult.error) {
//     //on success
//   } else {
//   	//on failure
//   }
// }


