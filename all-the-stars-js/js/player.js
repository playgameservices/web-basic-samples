/**
 * Created with IntelliJ IDEA.
 * User: kerp
 * Date: 5/11/13
 * Time: 1:47 PM
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

var player = player || {};

player.displayName = '';
player.profileUrl = '';
player.userId = '';
player.email = '';

player.loadLocalPlayer = function() {
  var pgsProfile = new Promise(function(resolve, reject) {
    gapi.client.request({
      path: login.basePath + '/players/me',
      callback: function(data) {
        console.log('This is who you are ', data);
        $('#welcome #message').text('Welcome, ' + data.displayName + '!');
        $('#logoutLink').show();
        player.displayName = data.displayName;
        player.profileUrl = data.avatarImageUrl;
        player.userId = data.playerId;
        console.log('This is the player object', player);
        resolve();
      }
    });
  });

  var userProfile = new Promise(function(resolve, reject) {
    chrome.identity.getProfileUserInfo(
        function(userInfo) {
          player.email = userInfo.email;
          resolve();
        });
  });

  return Promise.all([pgsProfile, userProfile]);
};

// Adds a size option to the FIFE URL.
var addFifeSize = function(url) {
  var a = document.createElement('a');
  a.href = url;
  // TODO(kenobi): account for different resolution displays
  a.pathname = a.pathname.replace(/^(.*)\/([^/]*)/, '$1/s92-c/$2');
  return a.href;
};

// Retrieves a player's profile image via xhr.
player.getProfileImg = function() {
  return pgs.util.getImg(addFifeSize(player.profileUrl));
};
