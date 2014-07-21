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

var game = game || {};

/**
 * Reset the game!
 */
game.resetGame = function()
{
  $('#gameMessageArea').text('Go ahead! Enter a score between 0 and 9999!');
  $('#submitScoreButton').val('Submit Score');
  $('#scoreRequestTF').attr('disabled', false);
  $('#scoreRequestTF').val('');
  game.gameOver = false;
};

/**
 * Given an array of unbeaten scores, return the one for today
 *
 * @param unbeatenScoresArray
 * @return {*} - An object that includes today's unbeaten score
 */
game.getUnbeatenScoreObjectForToday = function(unbeatenScoresArray)
{
  for (var i=0; i<unbeatenScoresArray.length; i++) {
    if (unbeatenScoresArray[i].timeSpan == 'DAILY') {
      return unbeatenScoresArray[i];
    }
  }
};

/**
 * A callback once our score submission has been handled by the server
 *
 * @param response - A reponse that tells us if this is a new daily high score or not
 */
game.submitScoreComplete = function(response)
{
  console.log(response);
  utils.checkForErrors(response);
  if (response.status == 'success') {
    if (response.data.hasOwnProperty('beatenScoreTimeSpans') &&
        response.data.beatenScoreTimeSpans.indexOf('DAILY') >-1 ) {
      $('#gameMessageArea').text('Woo hoo! New high score today!');
    } else if (response.data.hasOwnProperty('unbeatenScores')) {
     var todaysHighScore = game.getUnbeatenScoreObjectForToday(response.data.unbeatenScores);
      if (todaysHighScore) {
        $('#gameMessageArea').text('Nice try, but you didn\'t beat today\'s score of ' +
        todaysHighScore.formattedScore + '.');
      }
    }
  }
};

/**
 * Submit our score to the server!
 */
game.submitScore = function()
{

  var requestedScore = parseInt($('#scoreRequestTF').val());
  if (isNaN(requestedScore)) return;

  // Normally, I would do client-side validation here. But let's skip it so
  // we can do it all on the server side.

  $.post('server/ServerRequests.php',
      {action: 'submitScore', tempKey: login.tempKey, userId: player.userId,
        scoreVal: requestedScore, xstoken: xstoken},
      game.submitScoreComplete,
      'json'
  );
};

/**
 * A quick initialize function
 */
game.readyToStart = function ()
{
  game.resetGame();
  $('#gameArea').fadeIn();
};

