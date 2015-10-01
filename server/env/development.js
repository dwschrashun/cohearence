module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/scrobbler",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "bbcH8898n2h5jzELoTZbJO90D",
    "consumerSecret": "0XOb5OMKWKjrdjgl75A4LuDdfiyr5S00c5wAfZlZpKuUZPPCd1",
    "callbackUrl": "http://127.0.0.1:1337/auth/twitter/callback"
  },
  "FACEBOOK": {
    "clientID": "INSERT_FACEBOOK_CLIENTID_HERE",
    "clientSecret": "INSERT_FACEBOOK_CLIENT_SECRET_HERE",
    "callbackURL": "INSERT_FACEBOOK_CALLBACK_HERE"
  },
  "GOOGLE": {
    "clientID": "20757556090-hk3pvocfvd4ev4jvodg55k11454647k9.apps.googleusercontent.com",
    "clientSecret": "sK1Mj8R1XqTLdcgCpFnZnpFM",
    "callbackURL": "http://127.0.0.1:1337/auth/google/callback"
  }
};
