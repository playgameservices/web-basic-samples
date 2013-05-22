/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 9/28/12
 * Time: 11:15 AM
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
var player = player || {};

player.displayName = '';
player.profileUrl = '';
player.userId = '';

player.loadLocalPlayer = function() {
  var request = gapi.client.games.players.get({playerId: 'me'});
  request.execute(function(response) {
    console.log('This is who you are ', response);
    $('#welcome #message').text('Welcome, ' + response.displayName + '!');
    $('#logoutLink').show();
    player.displayName = response.displayName;
    player.profileUrl = response.avatarImageUrl;
    player.userId = response.playerId;
    console.log('This is the player object', player);
    welcome.dataLoaded(welcome.ENUM_PLAYER_DATA);
  });
};

