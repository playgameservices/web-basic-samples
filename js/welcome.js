/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 9/28/12
 * Time: 11:24 AM
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


var welcome = welcome || {};

welcome.leaderboards_loaded = false;
welcome.achievement_defs_loaded = false;
welcome.achievement_progress_loaded = false;
welcome.player_data_loaded = false;
welcome.challenge_loaded = false;
welcome.management_APIs_loaded = false;
welcome.plus_APIs_loaded = false;

// And an enum
welcome.ENUM_LEADERBOARDS = 1;
welcome.ENUM_ACHIEVEMENT_DEFS = 2;
welcome.ENUM_ACHIEVEMENT_PROGRESS = 3;
welcome.ENUM_PLAYER_DATA = 4;
welcome.ENUM_CHALLENGE_DATA = 5;
welcome.ENUM_MANAGEMENT_API = 6;
welcome.ENUM_PLUS_API = 7;

// TODO: This has gotten large enough it probably could use a little refactoring
welcome.dataLoaded = function(whatData) {
  if (whatData == welcome.ENUM_LEADERBOARDS) {
    welcome.leaderboards_loaded = true;
  } else if (whatData == welcome.ENUM_ACHIEVEMENT_DEFS) {
    welcome.achievement_defs_loaded = true;
  } else if (whatData == welcome.ENUM_ACHIEVEMENT_PROGRESS) {
    welcome.achievement_progress_loaded = true;
  } else if (whatData == welcome.ENUM_PLAYER_DATA) {
    welcome.player_data_loaded = true;
  } else if (whatData == welcome.ENUM_CHALLENGE_DATA) {
    welcome.challenge_loaded = true;
  } else if (whatData == welcome.ENUM_MANAGEMENT_API) {
    welcome.management_APIs_loaded = true;
  } else if (whatData == welcome.ENUM_PLUS_API) {
    welcome.plus_APIs_loaded = true;
  }
  welcome.activateButtonsIfReady();

};

welcome.activateButtonsIfReady = function()
{
  if (welcome.leaderboards_loaded &&
      welcome.achievement_defs_loaded &&
      welcome.achievement_progress_loaded &&
      welcome.player_data_loaded &&
      welcome.challenge_loaded &&
      welcome.management_APIs_loaded &&
      welcome.plus_APIs_loaded)
  {
    $('#welcome input').attr('disabled',false);
    // Go right to a challenge if there's one already
    if (challenge.isActive)
    {
      welcome.startGame(challenge.difficulty);
    }
  }

};

welcome.userSignOut = function() {
  welcome.leaderboards_loaded = false;
  welcome.achievement_defs_loaded = false;
  welcome.achievement_progress_loaded = false;
  welcome.player_data_loaded = false;
  welcome.challenge_loaded = false;
  $('#welcome input').attr('disabled',true);
  $('#welcome').fadeOut();
};

welcome.loadUp = function() {
  $('#welcome').fadeIn();
  $('#pageHeader').text('Type-a-Number!');
};

welcome.showAchievements = function() {
  $('#welcome').fadeOut();
  achievementTable.loadUp();
};

welcome.showLeaderboards = function() {
  $('#welcome').fadeOut();
  leaderboardsTable.showAllLeaderboards();
};

welcome.startGame = function(difficulty) {
  $('#welcome').fadeOut();
  game.startGame(difficulty);
};

welcome.seeFriends = function() {
  $('#welcome').fadeOut();
  friendsTable.showBuddies();
};

welcome.showAdmin = function() {
  $('#welcome').fadeOut();
  admin.loadUp();
};

