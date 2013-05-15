/**
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

var admin = admin || {};
admin.scoresReset = 0;
admin.leaderboards = [];

admin.loadUp = function() {
   $('#adminPanel').fadeIn();
};

admin.resetAchievements = function() {
  gapi.client.request({
    path: login.adminPath + '/achievements/reset',
    method: 'post',
    callback : function(data) {
      console.log('Achievement reset response: ', data);
      if (data.kind == 'gamesManagement#achievementResetAllResponse') {
        // We should probably actually analyze the data here.
        var namesOfAchievements = [];
        if (data.hasOwnProperty('results')) {
          for (var i=0; i<data.results.length; i++) {
            namesOfAchievements.push(achManager.getNameForId(data.results[i].definitionId));
          }
        }
        // Reload our data
        achManager.loadData();
        alert('Achievements ' + namesOfAchievements.join(', ') + ' have all been reset.');
      } else {
        alert("Something odd is going on...");
      }
    }
  });
};

admin.resetScores = function() {
  admin.scoresReset = 0;
  admin.leaderboards = [constants.LEADERBOARD_EASY, constants.LEADERBOARD_HARD];
  for (var i=0; i<admin.leaderboards.length; i++) {
    gapi.client.request({
      path: login.adminPath + '/leaderboards/' + admin.leaderboards[i] + '/scores/reset',
      method: 'post',
      callback : function(data) {
        console.log('Score reset response: ', data);
        if (data.kind == "gamesManagement#playerScoreResetResponse") {
          admin.scoresReset++;
          if (admin.scoresReset >= admin.leaderboards.length) {
            alert('All ' + admin.scoresReset + ' leaderboard scores have been reset');
          }
        }
      }
    });
  }
};


admin.goBack = function() {
  $('#adminPanel').fadeOut();
  welcome.loadUp();

};