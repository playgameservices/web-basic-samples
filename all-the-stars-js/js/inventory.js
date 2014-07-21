/**
 * Created with IntelliJ IDEA.
 * User: kerp
 * Date: 5/11/13
 * Time: 2:08 PM
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

function Inventory() {
  var myInv = {};

  this.getStarsFor = function(world, level)  {
    var key = world + "-" + level;
    if (myInv.hasOwnProperty(key)) {
      return myInv[key];
    } else {
      return 0;
    }
  };

  this.setStarsFor = function(world, level, newStarNum) {
    var key = world + "-" + level;
    myInv[key] = newStarNum;
  };

  this.loadEmpty = function() {
    myInv = {};
  };

  this.loadDataFromCloud = function(cloudSaveData) {
    var cloudSaveObject = JSON.parse(atob(cloudSaveData));
    if (cloudSaveObject['version'] != '1.1') {
      myInv = {};
    } else {
      myInv = cloudSaveObject['levels'];
    }
  };

  this.getCloudSaveData = function() {
    var cloudSaveObject = {'version': '1.1', 'levels': myInv};
    return btoa(JSON.stringify(cloudSaveObject));
  };


}
