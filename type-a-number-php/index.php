<?php
/**
 *
 * This file simply generates a random string, passes it as a session cookie,
 * and also injects it into the page. This can help protect against XSRF
 * attacks
 *
 * In real life, you'd probably use a template system.
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

  $randomBit = md5(rand());

  // Set this as a session cookie
  setcookie('xstokencookie', $randomBit);

  // Yeah, in real-life, you would probably use a template engine.
  // Anyway, note the var xstoken="..." line near the bottom of the page

?>

<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <title></title>
  <link rel="stylesheet" href="css/main.css">
  <meta name="google-signin-clientid" content="123456789012.apps.googleusercontent.com" />
  <meta name="google-signin-cookiepolicy" content="single_host_origin" />
  <meta name="google-signin-callback" content="signinCallback" />
  <meta name="google-signin-scope" content="https://www.googleapis.com/auth/games" />
</head>
<body>
<header>
  <p id="pageHeader">Type-a-Number, Ajax-y version!</p>
</header>
<div role="main">
  <div id="loginDiv" style="display: none;">Welcome! <a href="javascript:login.showLoginDialog()"><img src="img/gplus_signin_normal.png"></a></div>

  <div id="gameArea" style="display: none;">
    <div id="message">Welcome, playername!</div>
    <div id="gameMessageArea"></div>
    <input type="text" id="scoreRequestTF"/><br/>
    <input type="button" id="submitScoreButton" value="Submit Score" onclick="game.submitScore()" /><br/>
    <div id="leaderboardArea">
      <input type="button" id="showHighScoresButton" value="See High scores" onclick="leaderboardTable.showTable()"/><br/>
      <div id="leaderboardResults" style="display: none;">
        <table id="leaderboardTable">
          <thead>
          <tr>
            <th>Rank</th>
            <th>Avatar</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
          </thead>
          <tbody>
          </tbody>
        </table>

      </div>

    </div>


  </div>
  <div id="errorDisplay" style="color:#ff2042"></div>

</div>


<!-- JavaScript at the bottom for fast page loading -->
<script>
  // This call is specified by the google-signin-callback in our meta tag
  var signinCallback = function(auth) {
    login.handleAuthResult(auth)
  };
  // This will change every time!
  var xstoken = "<?= $randomBit ?>";

</script>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.0.min.js"><\/script>')</script>

<script src="js/constants.js"></script>
<script src="js/leaderboardTable.js"></script>
<script src="js/login.js"></script>
<script src="js/game.js"></script>
<script src="js/player.js"></script>
<script src="js/utils.js"></script>

<script src="https://apis.google.com/js/client.js"></script>


<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script>
  var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
  (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g,s)}(document,'script'));
</script>
</body>
</html>

