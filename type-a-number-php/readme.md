# Game Services Sample Using PHP

A sample application that demonstrates using some AJAX-y methods to sign in
and make calls to Google Play games services from a server (in this case running
PHP / MySQL) instead of from the client.

## The official Sign-In button

You'll probably notice this application uses a simple graphic instead of the
official [Google+ Sign-In button](https://developers.google.com/+/web/signin/).
This is because this sample application assumes your game might be running in an
environment (for example, Flash or Unity) where placing a `<span>` or a `<div>`
on top of your game's canvas might be difficult.

If you were _actually_ developing a game that consisted of nothing but some
basic HTML, you should use the official Google+ Sign-In button.

## How sign-in works

In the [purely JavaScript](https://github.com/playgameservices/type-a-number-js)
version of the Type-a-Number challenge, you might recall
that you used the `gapi.client.authorize()` call to get an OAuth 2.0 token
for the player and store it within the `gapi` object. Then, you simply made all
calls to the games service using `gapi.client`, and the gapi class
automatically attached your auth token to any calls it made.

In this version, we change the response_type in the `gapi.client.authorize()` call
to `code`, which gives us not an OAuth 2.0 access token, but a one-time-use code that
the client can send to the server. The server exchanges this code for an OAuth 2.0
access token, which it stores in a database on the server. The server then sends
the player's userID and a large randomly-generated string back to the client --
the client never gets a copy of the OAuth 2.0 token.

For all future calls to the server, the client sends along the player's userID
and the large randomly-generated string. The server can verify the userID by
making sure the large random string matches what's in the database, and if it
needs to make any calls to the game service on behalf of the user, can do so
by retrieving the OAuth 2.0 token as well from the database.

### What this approach does and doesn't permit

The sign-in process in this example demonstrates how you can ensure, on the server,
that this user is really who they claim they are. It would be very difficult
for a malicious user to misrepresent themselves as another player if you are
signing in the user with this server-based single-use-code technique.

The sign-in process does **not**, however, stop a malicious user from making
their own calls to the Games Service from the client (i.e. cheating their way
onto a leaderboard). But if they're going to cheat, they have to do it as
themselves, and expose themselves as good-for-nothing cheaters in front of their
friends and loved ones.

## Client Code

You can find the code that runs the game client in the `js` directory. The following
files are located there:

* `constants.js` includes constants that the game needs -- in this case, just the
game's OAuth 2.0 Client ID.
* `game.js` handles the simple game logic.
* `leaderboardTable.js` displays displaying the high scores for an individual leaderboard.
* `login.js` handles most of the initial login logic.
* `player.js` simply handles loading the player information so we can say hello.
* `utils.js` has a function to check and see if there are any errors from the
server.

## Server Code

You can find the code that runs the game server in the `server` directory. The
following files are located there:

* `GameHandler.php` is the main class that handles all of the server logic. This
includes..
    * Taking the one-time-use OAuth 2.0 code, exchanging it for an access_token,
     then storing it in the database with the userId and a large random string
     (via the `loginUser` function)
    * Verifying the userId and random string matches what's in the database and,
     if so, authorizing the Google API Client with the OAuth 2.0 access token that
     was stored in the database (via the `setupApiClientForUser` function)
     * Submitting a high score to the leaderboard service, but only after verifying
     it on the server (via the `submitScore` function)
     * Note that `GameHandler.php` assumes that you have a sister directory named
     `google-api-php-client` which contains the Google APIs PHP Client library,
     which you can retrieve from [here](https://code.google.com/p/google-api-php-client/)
* `SampleAppConstants.ini` is a sample ini file that contains some important
     constants. This contains sensitive information (like your client secret),
     so in a real application, you want to put this outside of your htdocs tree.
* `ServerRequests.php` simply processes the AJAX requests and makes the appropriate
     call to the `GameHandler` object.

Finally, `index.php` generates the initial landing page. Note that this page
is mostly serving up plain ol' HTML, except for the fact that the server
generates a large random string, and passes that to the browser both as a
session cookie, and directly in the page as a JavaScript variable. This is
used to help defend against cross-site request forgeries. (For more information,
be sure to read the [game services client-server login
documentation](https://developers.google.com/games/services/web/serverlogin#step_8_protect_yourself_against_cross-site_forgery_attacks)
on the topic.)

## Running the sample application

To run this sample application in your own environment, perform the following
steps:

1. Get the latest [Google APIs Client Library for PHP](https://code.google.com/p/google-api-php-client/)
and extract it into your `server` directory.
  + We recommend you retrieve this using `svn`, to ensure you always have the
  latest version. (e.g. `svn checkout http://google-api-php-client.googlecode.com/svn/trunk/ google-api-php-client`)
  + Alternately, you can get the gzip file from the downloads page.
  Please make sure you download version 0.6.2 or later (updated June 3, 2013),
  as the `GameService` contrib file does not exist in earlier versions.

2. This application assumes you have PHP/MySQL already running on your server.
Create a `users` table with the following setup:

        CREATE TABLE IF NOT EXISTS `users` (
          `temp_key` varchar(128) NOT NULL,
          `user_id` varchar(64) NOT NULL,
          `bearer_token` varchar(1024) NOT NULL,
          `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

3. Create your own application in the Play Console, as described in the [Create
  Client IDs](https://developers.google.com/games/partners/console/) portion of
  the documentation. Make   sure you follow the "Web" instructions for creating
  your Client ID and linking your application.
    + If you've already set up your own version of the Type-a-Number sample
    application, you can repurpose that application here. Either create a new
    linked application (which will give you a new client ID), or add your
    test server to your list of Javascript Origins in the APIs Console (which
    will let you re-use your current client ID)
4. When you link your Web application, ensure the hostname matches the server
  from which you'll be testing your application. (e.g. http://localhost/ or
  https://www.mytestserver.com). Also, make sure that you have the right protocol
  (`http` vs. `https`)
5. Make a note of your Client ID and Client Secret as described in the documentation
6. Create a Leaderboard as described in the
  [Leaderbords](https://developers.google.com/games/partners/common/concepts/leaderboards)
  documentation. Give it a creative name like "High scores".
7. Once that's done, you'll want to replace the following constants defined in the
`SampleAppConstants.ini` file.
    * In the `api` section, replace the following:
        * `clientId` (Replace this with your OAuth2.0 Client ID)
        * `clientSecret` (Replace this with your OAuth2.0 Client secret)
    * In the `db` section, replace the following:
        * `user` (Replace this with your MySQL username)
        * `pass` (Replace this with your MySQL password)
        * `host` (Replace this with your MySQL hostname)
        * `name` (Replace this with the name of the MySQL database you're using.)
    * In the `game` section, replace the following:
        * `leaderboardId` (Replace this with the ID of the leaderboard you created
        in the previous step.)
8. Move your `AppConstants.ini` file **outside** of your htdocs tree. This contains
  sensitive information and it shouldn't be located anywhere where it could
  accidentally be displayed to the user.
9. Update the constructor in your GameHandler file to point to the new location
  of `AppConstants.ini`.

That's it! Your application should be ready to run!

## Troubleshooting

**I see a some kind of `400 bad request` error in my JavaScript console when
calling `GET https://accounts.google.com/o/oauth2/auth...`. What does that
mean?**

This could be due to a number of different causes, but probably the most
common is a `redirect_uri_mismatch` error. This happens when the location
from which you are serving your application doesn't match up with the
`JavaScript origins:` field in your OAuth2.0 Client ID settings. For instance...

 * You're trying to load your app from a "file://" location. (You need to specify
 a http or https origin.)
 * You have your `http://` and `https://` mixed up. (For instance, you're loading
 from `http://example.com/` and you accidentally specified your JavaScript origin as
 `https://example.com`.)
 * Just a plain ol' mismatch. (For instance, you're loading from `http://www.mytestserver.com`
 and you specified your JavaScript origin as `https://localhost`.)

To fix any of these issues...

1. Go to your application in the Developer Console's Game services page.
2. Click the "This game is linked to the API console project called '<Your app
name>'" link at the bottom of the page. This will take you to the Google
API Console.
3. Click on the "API Access" tab on the left.
4. Find the "Client ID for web applications" section, click on the "Edit Settings..."
link to the right, and then add or edit your JavaScript origins so they match
the location from which you are serving your application.

**I'm able to log in okay, but I'm getting an "Application ID not found" error
when trying to access the game service. Why is that?**

Most likely, this is happening because you forgot to add your account to the
list of test accounts. Follow the "Enabling accounts for testing" section of
the developer documentation.

## Known issues

* Game doesn't include all of the features of the JavaScript version of the
  Type-a-Number challenge. (No achievements, only one level, etc.)
* Game is ugly :)

## Special thanks

Thanks to Ian Barber for cleaning up the majority of our PHP code. Any remaining
errors you find are probably mine.

[![Analytics](https://ga-beacon.appspot.com/UA-46743168-1/playgameservices/type-a-number-php)](https://github.com/playgameservices/type-a-number-php)