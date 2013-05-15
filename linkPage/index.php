<?php
/**
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

$gamedata = $_GET['gamedata'];
$descrip = '';
if ($gamedata) {
  $gameObject = json_decode(base64_decode($gamedata));
  $level = 'Easy';
  if ($gameObject->difficulty > 0) {
    $level = 'Difficult';
  }
  $descrip = ' I just got a score of ' . htmlentities($gameObject->scoreToBeat,ENT_COMPAT,"UTF-8")
    . ' on the ' . $level . ' level of the Type-a-Number challenge. Can you beat my score?';
}

?>
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
<!-- Why is this page in a different directory, you might ask? Because this
  needs to be displayed publicly for the Share dialog to process it properly,
  and this was the easiest way for me to deploy it in my IDE.
  You don't necessarily need to do this. -->

<!-- This section is used to populate the share dialog. It's not ever seen by
  the user. -->
<div itemscope itemtype ="http://schema.org/Thing" style="display: none">
    <div id="schemaName" itemprop="name">Can you beat my score?</div>
    <div itemprop="image"><img src="480.jpeg"></div>
    <div itemprop="description"><?= $descrip ?></div>
</div>

Get ready, player!

<script>
  // If a player visits here for real, we can just redirect them to the game
  // page with the gamedata parameters in the URL.

  // We could also just build all of the above functionality (i.e. creating an
  // invisible itemscope area to generate a custom post) into our main game
  // page, so that this extra redirection step isn't necessary.
  // And in a production game, you might want to consider doing that.

  window.location.href = 'http://www.example.com/mygame/index.html?' + window.location.search.substring(1);




</script>

</body>
</html>

