/**
 *
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


"use strict";

var login = login || {};


login.loggedIn = false;
login.tempKey = '';


/**
 * Login is complete! Let's load up our player object and tell the game we're
 * ready to go
 *
 * @param data
 */
login.serverLoginComplete = function(data) {
  console.log("This is what I got back from the server ", data);
  utils.checkForErrors(data);
  if (data.status == 'success') {
    login.tempKey = data.tempKey;
    if (login.loggedIn == false) {
      player.setupPlayer(data.player);
      game.readyToStart();
      login.loggedIn = true;
    }
  }
};


/**
 * Sign-in by taking our one-time OAuth 2.0 code and giving it to our server
 * to exchange for an OAuth 2.0 token
 *
 * @param code
 */
login.serverLoginWithCode = function(code) {
  $.post('server/ServerRequests.php',
      {action: 'login', code: code, xstoken: xstoken},
      login.serverLoginComplete,
      'json'
  );
};

/**
 * A callback once client-side sign-in is done. If it works, great! If it doesn't, let's
 * try showing the login link
 * @param auth
 */
login.handleAuthResult = function(auth) {
  console.log('We are in handle auth result', auth);
  if (auth && auth.error == null) {
    console.log('Hooray! We\'ve got a valid code');
    login.serverLoginWithCode(auth.code);
    $('#loginDiv').fadeOut();
    // We are going to silently sign-in again in 45 minutes, to ensure that the
    // user's token doesn't expire on the server.
    setTimeout(gapi.auth.signIn, 1000 * 60 * 45);

  } else {
      if (auth && auth.hasOwnProperty('error')) {
        console.log("Not signed in because: ", auth.error);
      }
      $('#loginDiv').fadeIn();
  }
};




/**
 * Sign in by showing the standard OAuth 2.0 dialog (required if you've never
 * signed in before, or scopes have changed)
 */
login.showLoginDialog=function() {
  gapi.auth.signIn();
};



