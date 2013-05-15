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



leadManager.preloadData = function() {
  gapi.client.request({
    path: login.basePath + '/leaderboards',
    callback : function(data) {
      console.log('Leaderboard data', data);
      if (data.kind == 'games#leaderboardListResponse' &&
          data.hasOwnProperty('items')) {
        for (var i =0; i<data.items.length; i++) {
          leadManager.leaderboards[data.items[i].id] = data.items[i];
        }
      }
      leadManager.preloaded = true;
      welcome.dataLoaded(welcome.ENUM_LEADERBOARDS);
    }
  });
};

leadManager.getLeaderboardObject = function(leadId)
{
  return leadManager.leaderboards[leadId];
};



leadManager.gotScore = function(receivedScore, difficulty, callback)
{
  var leaderboardId = (difficulty == game.EASY) ? constants.LEADERBOARD_EASY : constants.LEADERBOARD_HARD;

  gapi.client.request({
    path: login.basePath + '/leaderboards/' + leaderboardId + '/scores',
    method: 'post',
    params: {leaderboardId: leaderboardId, score: receivedScore },
    callback: function(data) {
      console.log('Data from submitting high score is ', data);
      var newWeeklyHighScore = false;
      if (data.hasOwnProperty('beatenScoreTimeSpans')) {
        for (var i=0; i<data.beatenScoreTimeSpans.length; i++) {
          if (data.beatenScoreTimeSpans[i] == 'WEEKLY') {
            console.log('Hooray! New weekly high score!');
            newWeeklyHighScore = true;
            leaderboardWidget.show(leaderboardId);
            //TODO: Update our internal model as well
          } else {
          }
        }
      }
      callback(newWeeklyHighScore);

    }
  });



};