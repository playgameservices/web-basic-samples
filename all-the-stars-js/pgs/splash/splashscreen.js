/**
 * User: kenobi
 * Date: 01/25/2015
 *
 * Copyright 2015 Google Inc. All Rights Reserved.
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

window.addEventListener("load", function() {
  setupSplash_();
  setupWindowTransitions_();
});

// Sets up various elements (app icon, name, etc) in the splash screen.
var setupSplash_ = function() {
  var manifest = chrome.runtime.getManifest();

  // Create an 80x80 icon based on the icon specified in the manifest.
  var appIcon = document.createElement('img');
  appIcon.src = chrome.runtime.getURL(manifest.icons['128']);
  appIcon.width = 80;
  appIcon.height = 80;

  // Get the app title.
  var appTitle = document.createTextNode(manifest.name);

  // Insert the app icon and title into the splash screen.
  document.querySelector('#appIcon').appendChild(appIcon);
  document.querySelector('#appTitle').appendChild(appTitle);
};

// Sets up window transitions for the splash screen.
var setupWindowTransitions_ = function() {
  window.setTimeout(
      function() {
        document.querySelector('#splash0').classList.add('hidden');
        document.querySelector('#splash1').classList.add('hidden');
      },
      2000);
  window.setTimeout(window.close, 5000);
};
