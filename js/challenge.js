/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 3/12/13
 * Time: 2:21 PM
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
 */
"use strict";

var challenge = challenge || {};

challenge.isActive = false;
challenge.scoreToBeat = 0;
challenge.challenger = "";
challenge.difficulty = 0;

challenge.tryToLoad = function()
{
  // Let's see if there's anything to parse here.
  var challengeString = challenge.getURLParameter('gamedata');
  if (challengeString && challengeString != 'null') {
    console.log("Received challenge string ", challengeString);
    var decodedString = atob(challengeString);
    console.log("Decoded as ", decodedString);
    var challengeObject = JSON.parse(decodedString);
    console.log("Parsed into ",challengeObject);
    // We should always be careful to not trust this data completely!
    if (challengeObject != null &&
        challengeObject.hasOwnProperty('scoreToBeat') &&
        challengeObject.hasOwnProperty('challenger') &&
        challengeObject.hasOwnProperty('difficulty')) {
      challenge.isActive = true;
      challenge.scoreToBeat = challengeObject.scoreToBeat;
      challenge.challenger = challengeObject.challenger;
      challenge.difficulty = challengeObject.difficulty;
    }
  }
  welcome.dataLoaded(welcome.ENUM_CHALLENGE_DATA);
};

// Taken from StackOverflow. Feel free to swap out with your own!
challenge.getURLParameter = function(name) {

  return (decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  ));
};

challenge.generateChallenge = function()
{
  var challengeObject = {'difficulty': game.difficulty,
    'scoreToBeat': game.finalScore,
    'challenger': player.displayName
  };

  return challengeObject;

};

challenge.resetIncomingChallenge = function() {
  challenge.challenger = "";
  challenge.difficulty = 0;
  challenge.isActive = false;

};
