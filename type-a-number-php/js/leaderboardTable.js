/**
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

var leaderboardTable = leaderboardTable || {};

/**
 * Got our results from the server!
 *
 * @param response - An array of items that we can use to fill out our table.
 */
leaderboardTable.dataReceived = function(response)
{
  utils.checkForErrors(response);
  if (response.status == "success") {
    $('#leaderboardTable tbody').html('');
    console.log(response)
    if (response.data.hasOwnProperty('items')) {
      for (var i=0; i<response.data.items.length; i++) {
        var $leaderboardRow = leaderboardTable.buildTableRowFromData(response.data.items[i]);
        $leaderboardRow.appendTo($('#leaderboardTable tbody'));
      }
    }
    $('#leaderboardResults').fadeIn();
  }
};


/**
 * Take a leaderboard score object and convert it into a nice HTML table row
 *
 * @param rowObj
 * @return {*} - A jQuery-created table row
 */
leaderboardTable.buildTableRowFromData = function(rowObj) {
  var scorePlayer = rowObj.player;
  var $tableRow = $('<tr></tr>');
  var $rankCell = $('<td></td>').text(rowObj.formattedScoreRank);
  var $iconCell = $('<td></td>')
      .append($('<img />')
      .prop('src', scorePlayer.avatarImageUrl + '?sz=75')
  );
  var $nameCell = $('<td></td>').text(scorePlayer.displayName);
  var $scoreCell = $('<td></td>').text(rowObj.formattedScore);
  $tableRow.append($rankCell).append($iconCell).append($nameCell).append($scoreCell);
  return $tableRow;
};


/**
 * The user asked to see high scores. Let's start the call to the server
 */
leaderboardTable.showTable = function() {
  console.log("Show table clicked");
  // Technically, I could make this call client-side.
  // Doing it all server-side, however, demonstrates how to make an authenticated
  // call on the server.
  $.post('server/ServerRequests.php',
      {action: 'getHighScores', tempKey: login.tempKey, userId: player.userId,
       xstoken: xstoken},
      leaderboardTable.dataReceived,
      'json'
  );


};