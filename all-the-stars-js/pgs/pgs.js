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


pgs.toast = {};

pgs.toast.login = function(player) {
  var link = document.querySelector('link[rel="import"]');
  var content = link.import;

  // Grab the toast element, clone it, and append it to the main app UI.
  var el = content.querySelector('.toast-container');
  var toast = el.cloneNode(true);
  document.body.appendChild(toast);

  pgs.toast.title = document.createTextNode('');
  toast.querySelector('#title').appendChild(pgs.toast.title);

  pgs.toast.message = document.createTextNode('');
  toast.querySelector('#message').appendChild(pgs.toast.message);

  pgs.toast.icon = toast.querySelector('#icon-container');

  player.getProfileImg()
      .then(
          function(img) {
            img.className = 'toast-icon';
            pgs.toast.playerIcon = img;
            pgs.toast.icon.appendChild(img);
            pgs.toast.show('WELCOME', player.displayName);
  });
};

pgs.toast.fitMsg_ = function(node) {
  var fontsize = 18;
  node.style.fontSize = fontsize + 'px';
  while (fontsize >=13 && node.scrollWidth > node.clientWidth) {
    fontsize--;
    node.style.fontSize = fontsize + 'px';
  }
};

pgs.toast.getIcon_ = function(opt_iconUrl) {
  if (opt_iconUrl) {
    return pgs.util.getImg(opt_iconUrl)
        .then(function(icon) {
          icon.className = 'toast-icon';
          return icon;
        });
  } else {
    return Promise.resolve(pgs.toast.playerIcon);
  }
};

// Shows a toast to notify the player of login.
pgs.toast.show = function(title, message, opt_iconUrl) {
  pgs.toast.title.nodeValue = title;
  pgs.toast.message.nodeValue = message;
  pgs.toast.fitMsg_(pgs.toast.message.parentNode);

  pgs.toast.getIcon_(opt_iconUrl).then(function(icon){
    pgs.toast.icon.replaceChild(icon, pgs.toast.icon.firstChild);

    var toast = document.getElementsByClassName('toast')[0];
    toast.classList.add('shown');
    setTimeout(function() { toast.classList.remove('shown'); }, 6000);
  });
};


pgs.achievements = {};

pgs.achievements.path = '/games/v1/achievements';

/**
 * A map of AchievementId to AchievementDefinition.  See
 * https://developers.google.com/games/services/web/api/achievementDefinitions/list
 * for details.
 */
pgs.achievements.all = {};

/**
 * Downloads the list of achievements from PGS.  This must be called before
 * achievements can be unlocked.
 */
pgs.achievements.initialize = function() {
  return new Promise(function(resolve, reject) {
    gapi.client.request({
      path: pgs.achievements.path,
      callback: function(response) {
        if (response.kind === 'games#achievementDefinitionsListResponse') {
          for (var i = 0; i < response.items.length; i++) {
            pgs.achievements.all[response.items[i].id] = response.items[i];
          }
        }
      }
    });
  });
};

/**
 * Unlocks an achievement.  The ID that is passed must exist in the
 * pgs.achievements.all list.
 */
pgs.achievements.unlock = function(id) {
  return new Promise(function(resolve, reject) {
    gapi.client.request({
      path: pgs.achievements.path + '/' + id + '/unlock',
      method: 'POST',
      callback: function(response) {
        if (response.kind === 'games#achievementUnlockResponse') {
          if (response.newlyUnlocked || true) {
            // Show a toast for newly unlocked achievements.
            pgs.toast.show('Achievement Unlocked',
              pgs.achievements.all[id].name,
              pgs.achievements.all[id].unlockedIconUrl);
          }
        }
        resolve();
      }
    });
  });
};


pgs.util = {};

pgs.util.getImg = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
      if (this.status == 200) {
        var blob = this.response;
        var img = document.createElement('img');
        img.onload = function(e) {
          // Clean up.
          window.URL.revokeObjectURL(img.src);
        };
        img.src = window.URL.createObjectURL(blob);
        resolve(img);
      } else {
        reject(this.status);
      }
    };

    xhr.send();
  });
};
