/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 9/28/12
 * Time: 11:20 AM
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

// achievementBoard -- responsible for displaying the "Achievements" table

var achievementTable = achievementTable || {};


achievementTable.loadUp = function() {
  achievementTable.clearOut();
  if (achManager.preloaded) {
    $.each(achManager.achievements, function(id, achObject) {
      var $achievementRow = achievementTable.buildTableRowFromData(achObject);
      $achievementRow.appendTo($('#achievementsTable tbody'));
    })
  }
  $('#achievements').fadeIn();
  $("#pageHeader").text("Achievements");
};

achievementTable.buildTableRowFromData = function(achObject) {
  var $tableRow = $('<tr></tr>');
  var $achievementName = $('<td></td>').text(achObject.name).addClass('achievementName');
  var $achievementDescrip = $('<td></td>').text(achObject.description).addClass('achievementDescrip');
  var $achievementURL = '';
  if (achObject.achievementState == 'REVEALED') {
    $achievementURL = achObject.revealedIconUrl;
    if (achObject.achievementType == "INCREMENTAL" &&
        achObject.hasOwnProperty('formattedCurrentStepsString')) {
      var progressText = '(' + achObject.formattedCurrentStepsString + '/' +
          achObject.formattedTotalSteps + ')';
      var $progressThingie = $('<div></div>').text(progressText);
      $achievementDescrip.append($progressThingie);
    }

  } else if (achObject.achievementState == 'UNLOCKED') {
    $achievementURL = achObject.unlockedIconUrl;
  } else if (achObject.achievementState == 'HIDDEN') {
    $achievementURL = 'img/Question_mark.png';
    // While we're add it, let's change the name and description
    $achievementName.text('Hidden');
    $achievementDescrip.text('This mysterious achievement will be revealed later');
  }
  var $achievementImage = $('<img />').attr('src', $achievementURL).attr('alt', achObject.achievementState)
      .addClass('medIcon').appendTo($('<td></td>'));
  $tableRow.append($achievementName).append($achievementDescrip).append($achievementImage);

  return $tableRow;
};

achievementTable.goBack = function() {
  $('#achievements').fadeOut();
  welcome.loadUp();

};

achievementTable.clearOut = function() {
  $('#achievementsTable tbody').html('');
};