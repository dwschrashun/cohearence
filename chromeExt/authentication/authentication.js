// var oauth = ChromeExOAuth.initBackgroundPage({
//   'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
//   'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
//   'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
//   'consumer_key': 'anonymous',
//   'consumer_secret': 'anonymous',
//   'scope': 'https://docs.google.com/feeds/',
//   'app_name': 'blueberryScrobbler'
// });

// function callback(resp, xhr) {
//   console.log('hey');
// }

// function onAuthorized() {
//   var url = 'http://localhost:1337';
//   var request = {
//     'method': 'GET',
//     'parameters': {'alt': 'json'}
//   };
//   // Send: GET https://docs.google.com/feeds/default/private/full?alt=json
//   oauth.sendSignedRequest(url, callback, request);
// }

// oauth.authorize(onAuthorized);