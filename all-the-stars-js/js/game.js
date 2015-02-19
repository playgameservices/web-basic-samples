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

var game = game || {};

game.STATE_WAITING_FOR_INIT_LOAD = 0;
game.STATE_READY = 1;
game.STATE_WAITING_FOR_CLOUD = 2;
game.state = game.STATE_WAITING_FOR_INIT_LOAD;
game.currentWorld = 1;

game.init = function() {
  $('#game').fadeIn();
  if (login.loggedIn) {
    $('#loadSave').fadeIn();
    $('#login').fadeOut();
  } else {
    $('#loadSave').fadeOut();
    $('#login').fadeIn();
  }
  game.refreshInterface();
  model.loadCloudSave(game.refreshInterface);
};

game.refreshInterface = function() {
  $("#worldLabel").text("World " + game.currentWorld);
  for (var i=1; i<=12; i++) {
    var starNum = model.getStarsFor(game.currentWorld, i);
    var starText = new Array(starNum + 1).join("\u2605") +
        new Array(5-starNum + 1).join("\u2606");

    var $buttonHtml = $("<p></p>").html("Level " + game.currentWorld + "-" + i
       + "<br>" + starText);
    $("#level" + i).html($buttonHtml);
  }
 };


game.loadCloudSave = function() {
  model.loadCloudSave(game.refreshInterface);
};

game.saveToCloud = function() {
  model.saveToCloud(game.refreshInterface);
};

game.levelClick = function(whatLevel) {
  var starNum = model.getStarsFor(game.currentWorld, whatLevel);
  starNum = starNum + 1;
  if (starNum > 5) starNum = 0;
  model.setStarsFor(game.currentWorld, whatLevel, starNum);
  game.refreshInterface();

};

game.pickWorld = function(delta) {
  game.currentWorld = game.currentWorld + delta;
  if (game.currentWorld < 0) game.currentWorld = 20;
  if (game.currentWorld > 20) game.currentWorld = 0;
  game.refreshInterface();

};
