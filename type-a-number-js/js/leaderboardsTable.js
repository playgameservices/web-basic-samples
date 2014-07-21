/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 10/1/12
 * Time: 3:12 PM
 * Used to display multiple leaderboards
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

var leaderboardsTable = leaderboardsTable || {};

leaderboardsTable.showAllLeaderboards = function() {
  leaderboardsTable.clearOut();
  if (leadManager.preloaded) {
    $.each(leadManager.leaderboards, function(id, leadObject) {
      var $leaderboardRow = leaderboardsTable.buildLeaderboardsRowFromData(leadObject);
      $leaderboardRow.appendTo($('#leaderboardsTable tbody'));
    });
    $('#leaderboards').fadeIn();
  }
  $('#pageHeader').text('Leaderboards');
};

leaderboardsTable.buildLeaderboardsRowFromData = function(leadObj) {
  var $tableRow = $('<tr></tr>');
  var leaderboardIcon = (leadObj.iconUrl) ? leadObj.iconUrl : 'img/genericLeaderboard.png';
  var $iconCell = $('<td></td>')
      .append($('<img />')
      .prop('src', leaderboardIcon).addClass('medIcon')
  );
  var $nameCell = $('<td></td>').text(leadObj.name);
  var $viewButtonCell = $('<td></td>')
      .append($('<input type="button" />')
      .prop('value', 'View')
      .click(function() {leaderboardsTable.selectLeaderboard(leadObj.id)})
  );
  $tableRow.append($iconCell).append($nameCell).append($viewButtonCell);

  return $tableRow;
};

leaderboardsTable.selectLeaderboard = function(leaderboardId)
{
  $('#leaderboards').hide();
  leaderboardTable.showLeaderboard(leaderboardId, leaderboardTable.BACK_TO_ALL_LEADERBOARDS);

};

leaderboardsTable.clearOut = function() {
  $('#leaderboardsTable tbody').html('');
};

leaderboardsTable.goBack = function() {
  $('#leaderboards').fadeOut();
  welcome.loadUp();

};