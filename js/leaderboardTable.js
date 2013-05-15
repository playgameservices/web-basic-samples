/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 10/1/12
 * Time: 3:12 PM
 * Used to display a single leaderboard, vs. a leaderboard picker
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

var leaderboardTable = leaderboardTable || {}

leaderboardTable.BACK_TO_GAME = 1;
leaderboardTable.BACK_TO_ALL_LEADERBOARDS = 2;

leaderboardTable.goBackTo = leaderboardTable.BACK_TO_ALL_LEADERBOARDS

leaderboardTable.showLeaderboard = function(leaderboardId, backDestination)
{
  leaderboardTable.goBackTo = backDestination;
  console.log("I am going to show leaderboard ", leaderboardId);
  $('#leaderboardTable tbody').html('');
  gapi.client.request({
    path: login.basePath + '/leaderboards/' + leaderboardId + '/scores/social',
    params: {leaderboardId: leaderboardId,
      timeSpan: 'weekly'
      },
    callback: function(data){
      console.log('This is your data: ', data);
      if (data.hasOwnProperty('items')) {
        for (var i=0; i<data.items.length; i++) {
          var $leaderboardRow = leaderboardTable.buildTableRowFromData(data.items[i]);
          $leaderboardRow.appendTo($('#leaderboardTable tbody'));
        }
      }
      $('#leaderboard').fadeIn();
    }

  });
  $('#pageHeader').text(leadManager.getLeaderboardObject(leaderboardId).name);

};


leaderboardTable.buildTableRowFromData = function(rowObj) {
  var scorePlayer = rowObj.player;
  var $tableRow = $('<tr></tr>');
  var $iconCell = $('<td></td>')
      .append($('<img />')
      .prop('src', scorePlayer.avatarImageUrl + '?sz=75')
  );
  var $nameCell = $('<td></td>').text(scorePlayer.displayName);
  var $scoreCell = $('<td></td>').text(rowObj.formattedScore);
  $tableRow.append($iconCell).append($nameCell).append($scoreCell);

  return $tableRow;
};

leaderboardTable.goBack = function() {
  $('#leaderboard').hide();
  if (leaderboardTable.goBackTo == leaderboardTable.BACK_TO_ALL_LEADERBOARDS) {
    $('#leaderboards').fadeIn();
  } else {
    $('#game').fadeIn();
  }

};