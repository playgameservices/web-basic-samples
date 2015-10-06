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

model.getStarsFor = function(world, level) {
  return model.inv.getStarsFor(world, level);
};

model.setStarsFor = function(world, level, newNum){
  model.inv.setStarsFor(world, level, newNum);
  // Activate achievements when the user reaches a predetermined number of
  // stars.
  switch (model.inv.countMyStars()) {
  case 8:
    pgs.achievements.unlock(constants.ACH_OCTASTAR);
    break;
  case 16:
    pgs.achievements.unlock(constants.ACH_HEXADECASTAR);
    break;
  case 32:
    pgs.achievements.unlock(constants.ACH_DOTRIACONTASTAR);
    break;
  case 64:
    pgs.achievements.unlock(constants.ACH_TETRAHEXACONTASTAR);
    break;
  case 128:
    pgs.achievements.unlock(constants.ACH_OCTAICOSAHECTASTAR);
    break;
  }
};
