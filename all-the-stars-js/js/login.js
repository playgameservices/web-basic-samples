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
login.loggedIn = false;


login.scopes = 'https://www.googleapis.com/auth/games https://www.googleapis.com/auth/appstate';
login.basePath = '/games/v1';
login.appStatePath = '/appstate/v1';

login.init = function() {
  // Need to add this 1 ms timeout to work around an odd but annoying bug
  window.setTimeout(login.trySilentAuth, 1);
};

login.handleAuthResult = function(auth) {
  console.log('We are in handle auth result');
  if (auth) {
    console.log('Hooray! You\'re logged in!');
    $('#loginDiv').fadeOut();
    player.loadLocalPlayer();
    game.init();
  } else {
    $('#loginDiv').fadeIn();
  }
};

login.trySilentAuth = function() {
  console.log('Trying silent auth');
  gapi.auth.authorize(
      {
        client_id: constants.CLIENT_ID,
        scope: login.scopes,
        immediate: true
      },
      login.handleAuthResult);
};

login.showLoginDialog=function() {
  gapi.auth.authorize(
      {
        client_id: constants.CLIENT_ID,
        scope: login.scopes,
        immediate: false
      },
      login.handleAuthResult);
};

