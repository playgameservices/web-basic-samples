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

'use strict';

var pgs = pgs || {};

// Shows a splash screen with intro graphics and PGS branding.
pgs.showSplashscreen = function() {
  var windowOptions = {
    bounds: {width: 420, height:210},
    frame: 'none',
    hidden: true,
    resizable: false
  };

  chrome.app.window.create(
      'pgs/splash/splashscreen.html',
      windowOptions,
      function(appWindow) {
        if (appWindow) {
          appWindow.show();
        } else {
          console.error(chrome.runtime.lastError);
        }
      });
};

// Shows a toast to notify the player of login.
pgs.showToast = function(player) {
  var link = document.querySelector('link[rel="import"]');
  var content = link.import;

  // Grab the toast element, clone it, and append it to the main app UI.
  var el = content.querySelector('.toast-container');
  var toast = el.cloneNode(true);
  document.body.appendChild(toast);

  // Customize the toast with the player's name and profile image.
  var playerName = document.createTextNode(player.displayName);
  toast.querySelector('#player-name').appendChild(playerName);
  player.getProfileImg()
      .then(
          function(img) {
            img.className = "player-icon";
            toast.querySelector('#profile-pic').appendChild(img);
            // Show the toast.
            toast = document.getElementsByClassName('toast')[0];
            toast.classList.add('shown');
            setTimeout(function() { toast.classList.remove('shown'); }, 6000);
          });
};

// Shows a dialog that enables the player to log out of PGS.
pgs.showLogoutDialog = function() {
  var windowOptions = {
    bounds: {width: 315, height:210},
    frame: 'none',
    hidden: true,
    resizable: false
  };

  chrome.app.window.create(
      'pgs/logout/logout.html',
      windowOptions,
      function(appWindow) {
        if (appWindow) {
          chrome.runtime.onMessage.addListener(
              function(request, sender, sendResponse) {
                if (request.confirmLogout) {
                  window.close();
                }
              });
          appWindow.contentWindow.player = player;
          appWindow.contentWindow.authToken = login.authToken;
          appWindow.show();
        } else {
          console.error(chrome.runtime.lastError);
        }
      });
};
