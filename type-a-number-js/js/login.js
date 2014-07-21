/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 9/28/12
 * Time: 11:11 AM
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

/**
 * This function allows us to load up the game service via the discovery doc
 * and makes calls directly through the client library instead of needing
 * to specify the REST endpoints.
 */
login.loadClient = function() {

  // Load up /games/v1
  gapi.client.load('games','v1',function(response) {
    player.loadLocalPlayer();
    achManager.loadData();
    leadManager.preloadData();
    welcome.loadUp();
    game.init();
    challenge.tryToLoad();
  });

  // Load up v1management
  gapi.client.load('gamesManagement','v1management', function(response) {
    welcome.dataLoaded(welcome.ENUM_MANAGEMENT_API);
  });

  // Load up /plus/v1
  gapi.client.load('plus','v1', function(response) {
    welcome.dataLoaded(welcome.ENUM_PLUS_API)
  });

};


login.handleAuthResult = function(auth) {
  console.log('We are in handle auth result', auth);
  if (auth && auth.error == null) {
    console.log('Hooray! You\'re logged in! ', auth );
    $('#loginDiv').fadeOut();
    login.loadClient();
  } else {
    if (auth && auth.hasOwnProperty('error')) {
      console.log('Login failed because: ', auth.error);
    }
    $('#loginDiv').fadeIn();
  }
};


login.showLoginDialog=function() {
  console.log('Trying not-so-silent auth');
  gapi.auth.signIn();
};

login.logout = function() {
  gapi.auth.signOut();
  achManager.clearData();
  friendsTable.clearData();
  leadManager.clearData();
  challenge.clearData();
  player.clearData();
  welcome.userSignOut();
  $('#loginDiv').fadeIn();
};

