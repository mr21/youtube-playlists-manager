// The client ID is obtained from the {{ Google Cloud Console }}
// at {{ https://cloud.google.com/console }}.
// If you run this code from a server other than http://localhost,
// you need to register your own client ID.
var OAUTH2_CLIENT_ID = '514381834459-gr3dgmesev8jflg5364piutqb6alb35b.apps.googleusercontent.com';
var OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  lg('googleApiClientReady()');
  gapi.auth.init(function() {
    lg('gapi.auth.init()');
    window.setTimeout(checkAuth, 1);
  });
}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
function checkAuth() {
  lg('checkAuth()');
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  lg('handleAuthResult()');
  lg(' > authResult:')
  lg(authResult)
  if (authResult.status.signed_in) {
    lg('   > true')
    $('.pre-auth').hide();
    $('.post-auth').show();
    loadAPIClientInterfaces();
  } else {
    lg('   > false')
    $('#login-link').click(function() {
      gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
    });
  }
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
function loadAPIClientInterfaces() {
  lg('loadAPIClientInterfaces()');
  gapi.client.load('youtube', 'v3', function() {
    lg('gapi.client.load()');
    handleAPILoaded();
  });
}
