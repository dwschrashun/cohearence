function getYouTubeUrl (title, artist) {
	console.log("getting TY Url", gapi.client);
	return gapi.client.load("youtube", "v3").then(function (err) {
		console.log("error?", err);
		console.log("yt client?", gapi.client);
		var q = `${artist} - ${title}`;
	  	var request = gapi.client.youtube.search.list({
	    	q: q,
	    	part: 'snippet'
	  	});
	  	console.log("the request:", request);
  		return request;
	}).then(function(response) {
	  	console.log("YT API RESPONSE:", response);
	    // var str = JSON.stringify(response.result);
	    return response.result;
  	}).then(null, function (err) {
  		console.log("ERROR in yt request", err);
  	});

  	// return new Promise (function (resolve, reject) {
  	// 	request.execute(function(response) {
	  // 		console.log("YT API RESPONSE:", response);
	  //   	var str = JSON.stringify(response.result);
	  //   	return resolve(str);
  	// });

}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.

var OAUTH2_CLIENT_ID = "20757556090-hk3pvocfvd4ev4jvodg55k11454647k9.apps.googleusercontent.com";
var OAUTH2_SCOPES = [
	'https://www.googleapis.com/auth/youtube'
];

function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  console.log("AUTH RESULT:", authResult);
  if (authResult && !authResult.error) {
    //on success
  } else {
  	//on failure
  }
}

//how do we store our api keys securely on the extension?????
function youTubeInit () {
	console.log("initializing YT");
	// var apiKey = "20757556090-hk3pvocfvd4ev4jvodg55k11454647k9.apps.googleusercontent.com";
	// gapi.client.setApiKey(apiKey);
	gapi.auth.init(function() {
		console.log("init callback");
		window.setTimeout(checkAuth, 1);
	});
}

