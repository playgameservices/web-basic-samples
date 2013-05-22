/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 10/1/12
 * Time: 3:11 PM
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

var leadManager = leadManager || {};
leadManager.preloaded = false;
leadManager.leaderboards = {};


/**
 * This really just loads up the leaderboard definitions. Not the scores
 * themselves
 */
leadManager.preloadData = function() {

  var request = gapi.client.games.leaderboards.list();
  request.execute(function(response) {
    console.log('Leaderboard data', response);
    if (response.kind == 'games#leaderboardListResponse' &&
        response.hasOwnProperty('items')) {
      for (var i =0; i<response.items.length; i++) {
        leadManager.leaderboards[response.items[i].id] = response.items[i];
      }
    }
    leadManager.preloaded = true;
    welcome.dataLoaded(welcome.ENUM_LEADERBOARDS);
  });
};

leadManager.getLeaderboardObject = function(leadId)
{
  return leadManager.leaderboards[leadId];
};



leadManager.gotScore = function(receivedScore, difficulty, callback)
{
  var leaderboardId = (difficulty == game.EASY) ? constants.LEADERBOARD_EASY : constants.LEADERBOARD_HARD;
  var request = gapi.client.games.scores.submit(
      {leaderboardId: leaderboardId,
      score: receivedScore}
  );
  request.execute(function(response) {
    console.log('Data from submitting high score is ', response);
    var newWeeklyHighScore = false;
    if (response.hasOwnProperty('beatenScoreTimeSpans')) {
      for (var i=0; i<response.beatenScoreTimeSpans.length; i++) {
        if (response.beatenScoreTimeSpans[i] == 'WEEKLY') {
          console.log('Hooray! New weekly high score!');
          newWeeklyHighScore = true;
          leaderboardWidget.show(leaderboardId);
          //TODO: Update our internal model as well
        } else {
        }
      }
    }
    callback(newWeeklyHighScore);
  });
};