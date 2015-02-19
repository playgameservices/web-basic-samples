/**
 * Created with IntelliJ IDEA.
 * User: kerp
 * Date: 5/11/13
 * Time: 1:46 PM
 *
 * Copyright 2013 Google Inc. All Rights Reserved.
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

login.userId = '';
login.clientId = '';
login.loggedIn = false;
login.authToken = null;

login.scopes = 'https://www.googleapis.com/auth/games https://www.googleapis.com/auth/appstate';
login.basePath = '/games/v1';
login.appStatePath = '/appstate/v1';

login.init = function() {
  // Read oauth client id from the manifest (needed for login)
  var manifest = chrome.runtime.getManifest();
  login.clientId = manifest.oauth2.client_id;

  // Need to add this 1 ms timeout to work around an odd but annoying bug
  window.setTimeout(login.trySilentAuth, 1);
};

login.handleAuthResult = function(silent, auth) {
  console.log('We are in handle auth result');
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message);
  }
  if (auth) {
    console.log('Hooray! You\'re logged in!');
    // Show the PGS splash screen.
    login.authToken = auth;
    login.loggedIn = true;
    pgs.showSplashscreen();
    player.loadLocalPlayer().then(pgs.showToast.bind(null, player));
    game.init();
  } else if (silent) {
    // If silent auth failed, try showing the login dialog.
    login.showLoginDialog();
  } else {
    // User did not grant login.  Just start the game without login.
    game.init();
  }
};

login.trySilentAuth = function() {
  console.log('Trying silent auth');
  gapi.auth.authorize(
      {
        client_id: login.clientId,
        scope: login.scopes,
        immediate: true
      },
      login.handleAuthResult.bind(null, true));
};

login.showLoginDialog=function() {
  gapi.auth.authorize(
      {
        client_id: login.clientId,
        scope: login.scopes,
        immediate: false
      },
      login.handleAuthResult.bind(null, false));
};

login.revokeAuth = function() {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    var url = "https://accounts.google.com/o/oauth2/revoke?token=" +
        login.authToken.access_token;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('Logout successful!');
        chrome.identity.removeCachedAuthToken(
            {token: login.authToken.access_token},
            resolve);
        login.loggedIn = false;
      }
    };
    console.log('Sending logout request');
    xhr.open("GET", url);
    xhr.send(null);
  });
};
