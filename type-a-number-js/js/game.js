/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 10/1/12
 * Time: 3:43 PM
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

game.EASY = 0;
game.HARD = 1;

game.difficulty = game.EASY;
game.gameOver = false;
game.finalScore = -1;

// Just a little function to help restrict our textfield to 4-digit numbers
game.init = function()
{
  $('#scoreRequestTF').keypress(function(e) {
    var a = [];
    var k = e.which;

    for (var i = 48; i < 58; i++)
      a.push(i);

    if (!($.inArray(k,a)>=0))
      e.preventDefault();

    if ($('#scoreRequestTF').val().length >= 4) {
      e.preventDefault();
    }
  })
};


game.startGame = function (difficultyLevel)
{
  game.difficulty = difficultyLevel;
  game.resetGame();
  $('#game').fadeIn();

};

game.showChallenge = function()
{
  if (challenge.isActive && challenge.difficulty == game.difficulty) {
    $("#challengeArea").text("Incoming challenge! Beat " + challenge.challenger
        + "'s score of " + challenge.scoreToBeat).show();
  } else {
    $("#challengeArea").hide();
  }
};

game.resetGame = function()
{
  if (game.difficulty == game.EASY) {
    $('#pageHeader').text('Type-a-Number (Easy)');
  } else {
    $('#pageHeader').text('Type-a-Number (Hard)');
  }
  $('#gameMessageArea').text('What score do you think you deserve?');
  $('#gameBragArea').hide();
  $('#submitScoreButton').val("Request Score");
  game.showChallenge();
  var $scoreRequestTF = $('#scoreRequestTF');
  $scoreRequestTF.attr('disabled', false);
  $scoreRequestTF.val('');
  game.gameOver = false;

};

game.checkChallenge = function()
{
  if (challenge.isActive && challenge.difficulty == game.difficulty) {
    if (game.finalScore > challenge.scoreToBeat) {
      $('#challengeArea').text('Challenge beaten! Good work!');
    } else {
      $('#challengeArea').text('Challenge not beaten.');
    }
    challenge.resetIncomingChallenge();
  }

};

game.requestScore = function()
{

  if (game.gameOver) {
    game.resetGame();
  } else {

    var $scoreRequestTF = $('#scoreRequestTF');
    var requestedScore = parseInt($scoreRequestTF.val());
    if (isNaN(requestedScore)) return;
    requestedScore = Math.min(9999, Math.max(requestedScore, 0));
    achManager.scoreRequested(requestedScore);

    if (game.difficulty == game.EASY) {
      game.finalScore = requestedScore;
      $("#gameMessageArea").text("Well, okay then. Your final score is " + game.finalScore);
    } else {
      game.finalScore = Math.ceil(requestedScore/2.0);
      $("#gameMessageArea").text("What, you thought it would be that easy? Your final score is " + game.finalScore);
    }

    game.checkChallenge();

    achManager.scoreReturned(game.finalScore);
    leadManager.gotScore(game.finalScore, game.difficulty, game.scoreCallback);

    $('#submitScoreButton').val("Play Again");
    $scoreRequestTF.attr('disabled', true);

    game.gameOver = true;

  }

};

game.populateBragButton = function() {
  // Let's generate the deep-link ID so we can link on mobile devices

  var challengeObject = challenge.generateChallenge();

  // Let's JSONify it
  var challengeString = JSON.stringify(challengeObject);
  challengeString = btoa(challengeString);
  var linkUrl = constants.LINK_PAGE_BASE + "?gamedata=" + challengeString;

  // If we wanted, we could also have a different link for the calltoaction
  // url along with the contenturl. Right now, for simplicity, I just have both
  // links going to, which supplies the Schema.org content (if you're a robot)
  // or directs back to the game page (if you're not)

  gapi.interactivepost.render('bragButton',
    {'clientid': constants.CLIENT_ID,
      'calltoactionurl': linkUrl,
      'calltoactiondeeplinkid': challengeString,
      'contenturl': linkUrl,
      'contentdeeplinkid': challengeString,
      'calltoactionlabel': 'PLAY',
      'prefilltext': 'Can you beat my score?',
      'cookiepolicy': 'single_host_origin'
  }
  );

};


game.scoreCallback = function(newHighScore) {
  console.log("New high score? " + newHighScore);
  if (newHighScore) {
    game.populateBragButton();
    $('#bragButton').show();
    $('#bragMessage').text("New high score this week! Challenge your friends?");
  } else {
    $('#bragButton').hide();
    $('#bragMessage').text("Not a new weekly high score. Keep trying!");
  }
  $('#gameBragArea').fadeIn();
};

game.showLeaderboard = function()
{
  var leaderboardToShow;
  if (game.difficulty == game.EASY) {
    leaderboardToShow = constants.LEADERBOARD_EASY
  } else {
    leaderboardToShow = constants.LEADERBOARD_HARD;
  }

  leaderboardTable.showLeaderboard(leaderboardToShow, leaderboardTable.BACK_TO_GAME);
  $('#game').hide();

};


game.back = function()
{
  $('#game').hide();
  welcome.loadUp();
};



