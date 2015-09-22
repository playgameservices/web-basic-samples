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
  // Cancel just closes the logout window.
  document.querySelector("#cancel").onclick = function() { window.close(); };
  // OK logs out, then sends a confirmation to the main app window.
  document.querySelector("#ok").onclick = function() {
    logout_().then(
        function() {
          chrome.runtime.sendMessage({confirmLogout:true});
          window.close();
        });
  };
  document.querySelector('#player-email')
      .appendChild(document.createTextNode(player.email || player.displayName));
});

function logout_() {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    var url = "https://accounts.google.com/o/oauth2/revoke?token=" +
        authToken.access_token;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('Logout successful!');
        chrome.identity.removeCachedAuthToken(
            {token: authToken.access_token},
            resolve);
        window.close();
      }
    };
    console.log('Sending logout request');
    xhr.open("GET", url);
    xhr.send(null);
  });
};
