/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 9/28/12
 * Time: 11:17 AM
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
 */

"use strict";

// Achievements manager -- responsible for loading and granting achievements

var achManager = achManager || {};

achManager.achievements = {};
achManager.preloaded = false;


// We actually need to make two calls to load achievements.
// One of which loads up the achievement definitions, and the second
// loads up which achievements the player actually earned
achManager.loadData = function() {
  var request = gapi.client.games.achievementDefinitions.list();
  request.execute(function(response) {
    console.log('Achievement definitions', response);
    if (response.kind == 'games#achievementDefinitionsListResponse' &&
        response.hasOwnProperty('items')) {
      for (var i =0; i<response.items.length; i++) {
        achManager.achievements[response.items[i].id] = response.items[i];
        // Will be overwritten later if we have achievement data
        achManager.achievements[response.items[i].id].achievementState = response.items[i].initialState;
      }
      welcome.dataLoaded(welcome.ENUM_ACHIEVEMENT_DEFS);
      achManager.loadAchievementsEarnedByPlayer();

    }
  });
};

achManager.loadAchievementsEarnedByPlayer = function() {
  var request = gapi.client.games.achievements.list({playerId: 'me'});
  request.execute(function(response) {
    console.log('Your achievement data: ', response);
    if (response.kind == 'games#playerAchievementListResponse' &&
        response.hasOwnProperty('items')) {
      for (var i=0; i<response.items.length; i++) {
        var nextAch = response.items[i];
        achManager.achievements[nextAch.id].achievementState = nextAch.achievementState;
        if (nextAch.hasOwnProperty('formattedCurrentStepsString')) {
          achManager.achievements[nextAch.id].formattedCurrentStepsString = nextAch.formattedCurrentStepsString;
        }
      }
      welcome.dataLoaded(welcome.ENUM_ACHIEVEMENT_PROGRESS);
    } else {
      console.log("**Unexpected response **", response);
    }
  });

  achManager.preloaded = true;

};

achManager.scoreRequested = function(requestedValue) {
  if (requestedValue == 0) {
    achManager.unlockAchievement(constants.ACH_HUMBLE);
  } else if (requestedValue == 9999) {
    achManager.unlockAchievement(constants.ACH_COCKY);
  }

};

achManager.scoreReturned = function(receivedValue) {
  if (receivedValue == 1337) {
    achManager.unlockAchievement(constants.ACH_LEET);
  } else if (receivedValue > 1 && utils.isPrime(receivedValue)) {
    achManager.unlockAchievement(constants.ACH_PRIME);
  }
  achManager.submitProgress(constants.ACH_BORED, 1);
  achManager.submitProgress(constants.ACH_REALLY_BORED, 1);

};

achManager.getNameForId = function(achId)
{
  return achManager.achievements[achId].name;
};

achManager.submitProgress = function(achId, amount)
{
  var request = gapi.client.games.achievements.increment(
      {achievementId: achId,
      stepsToIncrement: amount}
  );
  request.execute(function(response) {
    console.log('Data from incrementing achievement is ', response);
    // Let's updated our locally cached version
    achManager.achievements[achId].currentSteps = response.currentSteps;
    achManager.achievements[achId].formattedCurrentStepsString = String(response.currentSteps);
    if (response.newlyUnlocked ) {
      achievementWidget.showAchievementWidget(achId);
    } else {
      console.log('You either haven\'t unlocked ' + achManager.achievements[achId].name
          + ' yet, or you unlocked it already.');
    }
  });
};


achManager.unlockAchievement = function(achId)
{
  var request = gapi.client.games.achievements.unlock(
      {achievementId: achId}
  );
  request.execute(function(response) {
    console.log('Data from earning achievement is ', response);
    if (response.newlyUnlocked ) {
      achievementWidget.showAchievementWidget(achId);
      // Let's refresh our data here, while we're at it
      achManager.loadAchievementsEarnedByPlayer();
    } else {
      console.log('You unlocked ' + achManager.achievements[achId].name + ' but you already unlocked it earlier.');
    }
  });

};

