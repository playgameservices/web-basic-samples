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

login.scopes = 'https://www.googleapis.com/auth/games';
login.basePath = '/games/v1';

login.init = function() {
  // Read oauth client id from the manifest (needed for login)
  var manifest = chrome.runtime.getManifest();
  login.clientId = manifest.oauth2.client_id;

  // Need to add this 1 ms timeout to work around an odd but annoying bug
  window.setTimeout(login.trySilentAuth, 1);
};

login.handleAuthResult = function(auth) {
  console.log('We are in handle auth result');
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
  }
  if (auth) {
    console.log('Hooray! You\'re logged in!');
    // Show the PGS splash screen.
    login.authToken = auth;
    pgs.showSplashscreen();
    // Once player info is loaded, show a login toast.
    player.loadLocalPlayer().then(pgs.toast.login.bind(null, player));
    pgs.achievements.initialize();
    game.init();
  } else {
    login.showLoginDialog();
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
      login.handleAuthResult);
};

login.showLoginDialog=function() {
  gapi.auth.authorize(
      {
        client_id: login.clientId,
        scope: login.scopes,
        immediate: false
      },
      login.handleAuthResult);
};
