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

require_once 'google-api-php-client/src/Google_Client.php';
require_once 'google-api-php-client/src/contrib/Google_GamesService.php';

class GameHandler
{
  /* @var $pdo PDO */
  private $pdo;

  /* @var $client Google_Client */
  private $client;

  /* @var $games google_GamesService */
  private $games;

  /* @var $clientIsReady bool */
  private  $clientIsAuthed;

  /* @var $appVals array */
  private $appVals;




  /**
   * Constructor for the GameHandler. If you have a userId and tempKey from
   * a previously successful login, pass it to the constructor and it will use that
   * to look up the user's OAuth 2.0 token in the database. Otherwise,
   * you'll need to perform a loginUser call.
   *
   * @param null $userId = The user's Google+ ID, if we know it yet
   * @param null $tempKey = The user;'s
   */
  function __construct($userId = NULL, $tempKey = NULL) {
    // If this were a real app, you would put this AppConstants file far
    // away from your htdocs tree
    $this->appVals = parse_ini_file("./outside-your-htdocs-folder/AppConstants.ini", true);
    $this->clientIsAuthed = false;
    $this->connectToDatabase();
    if ($userId && $tempKey) {
      $this->setupApiClientForUser($userId, $tempKey);
    }
  }

  /**
   * Connects to the database, and assigns it to our pdo variable
   */
  private function connectToDatabase()
  {
    // Will throw a PDO exception if it fails
    $this->pdo = new PDO('mysql:host=' . $this->appVals['db']['host'] . ';dbname=' . $this->appVals['db']['name'],
      $this->appVals['db']['user'], $this->appVals['db']['pass']);
  }

  /**
   * Generates an un-authed Google_Client APIClient that we can use to query
   * the service, after we give it a bearer token
   */
  private function setupApiClient($redirectUri = 'postmessage') {
    $this->client = new Google_Client();
    $this->client->setClientId($this->appVals['api']['clientId']);
    $this->client->setClientSecret($this->appVals['api']['clientSecret']);
    $this->client->setDeveloperKey($this->appVals['api']['apiKey']);
    $this->client->setRedirectUri($redirectUri);
    $this->games = new google_GamesService($this->client);
  }

  /**
   * Create a big random string we can use as a unique identifier
   *
   * @return string - A big 64-character alphanumeric string
   */
  private function generateTempKey()
  {
    $str = base64_encode(openssl_random_pseudo_bytes(48));
    return $str;
  }

  /**
   * Makes sure the client is authed before we do anything. Throws an exception
   * otherwise
   *
   * @return bool - Pretty much only tue
   * @throws Exception - Thrown if APIClient is not authorized
   */
  private function verifyClientIsReady()
  {
    if ($this->clientIsAuthed) {
      return true;
    } else {
      throw new Exception("Attempting to make a client call without setting up the client.
      Please pass in an OAuth 2.0 code, or a tempKey and userID.");
    }

  }

  /**
   * Adds the user to a database and generates a temp key
   *
   * @param $playerId -- The playerID we get from calling players/me
   * @param $accessToken -- The access token we'll save for future calls
   * @return string -- Returns a tempKey we can use to identify the user later
   */
  private function addUserToDatabase($playerId, $accessToken)
  {
    $tempKey = $this->generateTempKey();
    $statement = $this->pdo->prepare('
      INSERT INTO users (temp_key, user_id, bearer_token)
      VALUES (:tempKey, :userId, :bearerToken)
      ON DUPLICATE KEY UPDATE temp_key = :tempKey, bearer_token = :bearerToken');
    $varArray = array(':tempKey'=>$tempKey, ':userId'=>$playerId, ':bearerToken'=>$accessToken);
    $statement->execute($varArray);
    $rowsAffected = $statement->rowCount();
    if ($rowsAffected > 0) {
      return $tempKey;
    }
    return '';
  }

  /**
   * Grabs our bearer token for this user from our database, assuming everything
   * looks kosher
   *
   * @param $userId - The player's userID from a players/me call
   * @param $tempKey - The big random string we're using to verify the user
   * @return string - The bearer token we can use to auth the API Client
   */
  private function getBearerTokenForTempKey($userId, $tempKey) {

    // Query the database
    $statement = $this->pdo->prepare('
      SELECT * FROM users
      WHERE user_id = :userId AND temp_key = :tempKey AND last_modified > NOW() - :expiration
    ');
    $varArray = array(':userId' => $userId, ':tempKey' => $tempKey, ':expiration' => 3600);
    $statement->execute($varArray);
    $result = $statement->fetch(PDO::FETCH_ASSOC);

    if ($result) {
      return $result['bearer_token'];
    }
    return '';
  }

  /**
   *
   * Given the userID and a tempKey, get an authorized API Client that we can
   * use to query the service
   *
   * @param $userId - The player's userID from a players/me call
   * @param $tempKey - The big random string we're using to verify the user
   * @throws Exception -- Throws an exception if the user can't be found
   */
  private function setupApiClientForUser($userId, $tempKey)
  {
    $bearerToken = $this->getBearerTokenForTempKey($userId, $tempKey);
    if ($bearerToken != '') {
      $this->setupApiClient();
      $this->client->setAccessToken($bearerToken);
      $this->clientIsAuthed = true;
    } else {
      throw new Exception('Couldn\'t get auth token for this temp key!');
    }
  }


  /**
   * Verifies a score value here on the server
   *
   * @param $scoreVal - The user submitted score
   * @return int - The verified user score
   * @throws InvalidArgumentException if the score is outside of 0-9999. Or
   * not an integer
   */
  private function getVerifiedScore($scoreVal)
  {
    // Is this overkill for testing an int range? Perhaps, but the filter_var
    // function is useful
    $optionsAndFlags = array(
      'options' => array(
        'min_range' => 0,
        'max_range' => 9999
      ),
      'flags' => FILTER_NULL_ON_FAILURE,
    );
    $verifiedScore = filter_var($scoreVal,FILTER_VALIDATE_INT, $optionsAndFlags);
    if (is_null($verifiedScore)) {
      throw new InvalidArgumentException('Was expecting score between 0 and 9999. Got ' .$scoreVal);
    }

    return $verifiedScore;

  }

  /**
   * Get a list of high scores from the games service
   *
   * @return array - An array of score objects
   */
  public function getHighScores() {

    $this->verifyClientIsReady();

    $response = $this->games->scores->listScores($this->appVals['game']['leaderboardId'],
                                                 'social',
                                                 'daily');

    return array('data' => $response);
  }

  /**
   * Submit the user's score to a high score list
   *
   * @param $scoreVal integer - The user-submitted score
   * @return array - A response object
   */
  public function submitScore($scoreVal) {
    $scoreVal = $this->getVerifiedScore($scoreVal);
    $this->verifyClientIsReady();
    $response = $this->games->scores->submit($this->appVals['game']['leaderboardId'],
                                             $scoreVal);


    return array('data' => $response);

  }

  /**
   * Signs in the user, given an OAuth 2.0 single-use code
   *
   * @param $authCode - The single-use code
   * @param string $redirectUri - The redirect URI we're using for our
   * application. Defaults to 'postmessage' to handle client-side flows
   * @throws Exception
   * @return array - A response object that will probably include the player
   */
  public function loginUser($authCode, $redirectUri = 'postmessage') {
    $this->setupApiClient($redirectUri);
    $this->client->authenticate($authCode);
    if ($this->client->getAccessToken()) {
      $this->clientIsAuthed = true;
      // By default, $response is an associative array. If you want to make
      // it an object (which I prefer), change 'use_objects' in config.php
      $response = $this->games->players->get('me');
      $tempKey = $this->addUserToDatabase($response['playerId'], $this->client->getAccessToken());
      return array('player' => $response, 'tempKey' => $tempKey);
    }
    throw new Exception('Sorry. Wasn\'t able to log you in with this auth code.');
  }

  /**
   * In the case of server-side login, gets an Auth URL from the client
   */
  public function createAuthUrlForServerSide($redirectPage) {
    $this->setupApiClient($redirectPage);
    $this->client->setScopes(array('https://www.googleapis.com/auth/games'));
    return $this->client->createAuthUrl();

  }

  /**
   * Verifies that our two keys match to prevent any XSRF micheviousness
   *
   * @param $sessionKey -- The random key from the session
   * @param $formkey -- The random key from the form
   * @return bool -- true if they match
   * @throws Exception -- Thrown if nothing matches
   */
  public function verifyXSToken($sessionKey, $formkey)
  {
    if ($sessionKey == $formkey) return true;
    throw new Exception('Cross-site forgery token doesn\'t match:' . $sessionKey . ' and ' . $formkey);
  }



}

