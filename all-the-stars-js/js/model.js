/**
 * Created with IntelliJ IDEA.
 * User: kerp
 * Date: 5/11/13
 * Time: 1:56 PM
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

var model = model || {};
model.inv = new Inventory();
model.INVENTORY_SLOT = 0;
model.lastCloudSaveVersion = '';

/**
 * Note that the states APIs used in this file are deprecated.
 * Clients wishing to implement saved game functionality should
 * instead use the Saved Games API described here:
 * https://developers.google.com/games/services/common/concepts/savedgames?hl=en
 */
model.loadCloudSave = function(callback) {
  console.log("Loading cloud save data");
  gapi.client.request({
    path: login.appStatePath + '/states/' + model.INVENTORY_SLOT,
    callback: function(response, rawResponse) {
      console.log('Cloud get response: ', response, rawResponse);
      var responseObject = JSON.parse(rawResponse);
      if (responseObject.gapiRequest.data.status == 404) {
        // Looks like there's no data. Must be our first time playing
        model.inv.loadEmpty();
      } else {
        console.log('Here is your saved game ', response);
        if (response.kind == ('appstate#getResponse') &&
            response.hasOwnProperty('data')) {
          model.inv.loadDataFromCloud(response.data);
          model.lastCloudSaveVersion = response.currentStateVersion;
        } else {
          // Loading the game failed.  This occurs if the user didn't log in.
          model.inv.loadEmpty();
        }
      }
      callback();
    }
  });
};

model.beginMergeResolve = function(originalCallback) {
  gapi.client.request({
    path: login.appStatePath + '/states/' + model.INVENTORY_SLOT,
    callback: function(response) {
        if (response.kind == ('appstate#getResponse') &&
            response.hasOwnProperty('data')) {

          // Merge the two sets of data
          var serverData = new Inventory();
          serverData.loadDataFromCloud(response.data);
          var mergedData = new Inventory();
          for (var world=1; world<=20; world++) {
            for (var level=1; level<=12; level++) {
              var maxStars = Math.max(model.inv.getStarsFor(world, level),
                                      serverData.getStarsFor(world, level));
              if (maxStars > 0) {
                mergedData.setStarsFor(world, level, maxStars);
              }
            }
          }
          console.log("This is my merged data  " , mergedData);
          model.lastCloudSaveVersion = response.currentStateVersion;
          model.inv = mergedData;
          model.saveToCloud(originalCallback);
        } else {
          console.log("Something really strange is going on");
        }
    }
  });
};

model.saveToCloud = function(callback) {
  console.log("Saving to cloud", atob(model.inv.getCloudSaveData()));
  var paramsObj = {};
  if (model.lastCloudSaveVersion != '') {
    paramsObj['currentStateVersion'] = model.lastCloudSaveVersion;
  }
  gapi.client.request({
    path: login.appStatePath + '/states/' + model.INVENTORY_SLOT,
    params: paramsObj,
    body: {
      kind: 'appstate#updateRequest',
      data: model.inv.getCloudSaveData()
    },
    method: 'put',
    callback: function (data, rawResponse) {
      console.log('Cloud update response: ', data, rawResponse);
      var responseObject = JSON.parse(rawResponse);

      if (responseObject.gapiRequest.data.status == 409) {
        // Uh-oh! Conflict
        console.log("We appear to be out of date");
        model.beginMergeResolve(callback)
        //model.requestUpdatedStateForMerging(objectToSave);
      } else if (data.kind == "appstate#writeResult") {
        // We'll want to look for an error
        if (!data.hasOwnProperty('error')) {
          // We need to update our version, and we'll save
          // our inventory
          model.lastCloudSaveVersion = data.currentStateVersion;
          callback();
        }
      }
    }
  });
};

model.getStarsFor = function(world, level) {
  return model.inv.getStarsFor(world, level);
};

model.setStarsFor = function(world, level, newNum){
  model.inv.setStarsFor(world, level, newNum);
  // Activate achievements when the user reaches a predetermined number of 
  // stars.  Mapping achievement IDs to more meaningful constants for 
  // readability is left as an exercise for the reader.
  switch (model.inv.countMyStars()) {
  case 8:
    pgs.achievements.unlock('CgkImq-v4t4UEAIQAQ');
    break;
  case 16:
    pgs.achievements.unlock('CgkImq-v4t4UEAIQAg');
    break;
  case 32:
    pgs.achievements.unlock('CgkImq-v4t4UEAIQAw');
    break;
  case 64:
    pgs.achievements.unlock('CgkImq-v4t4UEAIQBA');
    break;
  case 128:
    pgs.achievements.unlock('CgkImq-v4t4UEAIQBQ');
    break;
  }
};
