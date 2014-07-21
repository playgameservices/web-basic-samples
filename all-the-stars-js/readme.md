# Collect All the Stars

A sample application that demonstrates a simple case of loading and saving
a user's information to the cloud. Also demonstrates conflict management.
Works with the corresponding applications available for iOS and Android.

## A note on the cloud save conflict resolution logic

This test application was designed to demonstrate a typical use of cloud save:
keeping track of the number of stars earned in a level, and making sure a user
doesn't lose progress from one device to the next. In most mobile games, a user
can only gain stars in a level; they'll never lose any. The conflict resolution
logic is built around this assumption. In the case where the same level from two
data sets has different numbers of stars, the larger number always wins.

That being said, this is a test application, so we do allow you to save a
smaller number of stars than what the user had before. The conflict resolution
logic doesn't really take this into account.

Also, note that in a real game, you should attempt to load and save cloud save
data without requiring an explicit action from your user.

## Code

You can find the code that runs the game in the `js` directory. The following
files are located there:

* `constants.js` contains the OAuth 2.0 client ID
* `game.js` handles the simple game logic and the button display
* `index.js` registers click handlers for index.html. It is not inline to meet
  content security policy of chrome packaged apps.
* 'inventory.js` stores the player's inventory, and converts it to a cloud
  save format (via JSON-encoding and Base64-encoding)
* `login.js` handles most of the initial login logic
* `main.js` is used only when packing in a chrome apps to launch the app window.
* `model.js` handles inventory management and performs all of the interaction
  with the cloud. This is probably the most interesting file for you to look at
* `player.js` simply handles loading the player information so we can say hello.


## Running the sample application

To run Collect All the Stars on your own server, you will need to create
your own version of the game in the Play Console. Once you have done that,
you will copy over your application and client IDs into your
`js/constants.js` file. To follow this process, perform the following steps:

1. Create your own application in the Play Console, as described in our [Developer
Documentation](https://developers.google.com/games/services/console/enabling). Make
sure you follow the "Web" instructions for creating your Client ID and linking
your application.
2. If you have already created this application in the Play Console (because you
have created and run the Android or iOS version of the gamne, for example), you
can re-use your current version of the game. You just need to...
    * Link the web version of your game, as described in the "Link Your Platform-
    Specific Apps" section of the console documentation
    * Create a separate Client ID for the web version of the game, as described in
    the "Create a Client ID" section of the Console documentation.
3. Make a note of your Client ID and Application ID as described in the
documentation
4. Replace some of the constants defined in the application.
    * In the `constants.js` file, replace the following constants:
        * `constants.CLIENT_ID` (Replace this with your OAuth2.0 Client ID)

That's it! Your application should be ready to run! (This application does
not make use of achievements or leaderboards)

That's it! Your application should be ready to run!

## Running the sample as a Chrome Packaged App

[Chrome Packaged Apps](https://developer.chrome.com/apps) enable apps to be
written using HTML/JS/CSS, and this sample can be run with identical source
for both hosted and packaged apps.

1. Follow steps for running the sample application on a hosted server.
2. From the [Google API console](https://code.google.com/apis/console)
  `API Access` section, create a client ID for a chrome app. See
  [Chrome Apps Identity](https://developer.chrome.com/apps/app_identity.html)
  for how to obtain a stable app ID by adding a `key` to `manifest.json`.
3. Edit the `manifest.json` file and add your client ID from the API console.

That's it! Your application should be ready to run!

## Troubleshooting

**I see a some kind of `400 bad request` error in my JavaScript console when
calling `GET https://accounts.google.com/o/oauth2/auth...`. What does that
mean?**

This could be due to a number of different causes, but probably the most
common one is a `redirect_uri_mismatch` error. This happens when the location
from which you are serving your application doesn't match up with the
`JavaScript origins:` field in your OAuth2.0 Client ID settings. For instance...

 * You're trying to load your app from a "file://" location. (You need to specify
 a http or https origin.)
 * You have your `http://` and `https://` mixed up. (For instance, you're loading
 from `http://localhost/` and you accidentally specified your JavaScript origin as
 `https://localhost`.)
 * Just a plain ol' mismatch. (For instance, you're loading from `http://www.mytestserver.com`
 and you specified your JavaScript origin as `https://localhost`.)

To fix any of these issues...

1. Go to your application in the Play Developer Console's Game services page.
2. Click the "This game is linked to the API console project called '<Your app
name>'" link at the bottom of the page. This will take you to the Google
API Console.
3. Click on the "API Access" tab on the left.
4. Find the "Client ID for web applications" section, click on the "Edit Settings..."
link to the right, and then add or edit your JavaScript origins so they match
the location from which you are serving your application.

## Known issues

This section will be filled out more once we hear from you.

[![Analytics](https://ga-beacon.appspot.com/UA-46743168-1/playgameservices/all-the-stars-js)](https://github.com/playgameservices/all-the-stars-js)