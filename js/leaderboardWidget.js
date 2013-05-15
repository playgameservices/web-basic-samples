/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 10/1/12
 * Time: 5:00 PM
 * The "OMG! New High Score!" widget that appears at the bottom of the page
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

var leaderboardWidget = leaderboardWidget || {};

leaderboardWidget.show = function(leadId)
{
  var leaderboardObject = leadManager.getLeaderboardObject(leadId);


  // Let's populate the little widget
  var iconUrl =   (leaderboardObject.iconUrl) ? leaderboardObject.iconUrl : 'img/genericLeaderboard.png';
  $('#leadUnlocked img').prop('src', iconUrl);
  $('#leadUnlocked #leadName').text(leaderboardObject.name);
  $('#leadUnlocked').css({top: '250px', opacity: '1.0'});
  $('#leadUnlocked').show();
  $('#leadUnlocked').delay(3000).animate({top: '50px', opacity: 0.1}, 500, function() {
    $('#leadUnlocked').hide();
  });

};