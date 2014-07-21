<?php
/**
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

require_once('./GameHandler.php');

$output = array();
try {
  $handler = new GameHandler($_REQUEST['userId'], $_REQUEST['tempKey']);
  $handler->verifyXSToken(  $_COOKIE['xstokencookie'] , $_REQUEST['xstoken']);
  if ($_REQUEST['action'] == 'login') {
    $output = $handler->loginUser($_POST['code']);
  } else if ($_REQUEST['action'] == 'submitScore') {
    $output = $handler->submitScore($_POST['scoreVal']);
  } else if ($_REQUEST['action'] == 'getHighScores') {
    $output = $handler->getHighScores();
  }
  $output['status'] = 'success';
} catch (Exception $e) {
  $output = array('status' => 'failure', 'message' => $e->getMessage());
}

print json_encode($output);
