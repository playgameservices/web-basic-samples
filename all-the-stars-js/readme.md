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


## Running the sample as a Chrome Packaged App

[Chrome Packaged Apps](https://developer.chrome.com/apps) enable apps to be
written using HTML/JS/CSS.  To begin, you will need to create your own version
of the game in the Play Console. Once you have done that, you will create a
Chrome Webstore entry for your application and place the resulting client IDs
and keys into your `manifest.json` file. To follow this process, perform the
following steps:

1. Follow the
   [packaging instructions](https://developer.chrome.com/extensions/packaging#creating)
   to locally package your copy of all-the-stars.  You will end up with a crx
   file and a key file.  Note the instructions on the latter half of the page
   for uploading the crx to the Web Store; you'll need those later when you want
   to publish your game.
2. Load the crx into chrome.  You can do this by going to the
   chrome://extensions page and dragging the crx that was created in Step 1 into
   Chrome.
3. Find the new entry on the extensions page for your app, and note the ID.  It
   will be a long string of letters, like "cfhblmkcgnkbkbobakpeikejjgjjlfhi".
4. Create your application in the Play Console, as described in our [Developer
   Documentation](https://developers.google.com/games/services/console/enabling).
   If you have already created this application in the Play Console (because you
   have created and run the Android or iOS version of the gamne, for example), you
   can re-use your current version of the game.
5. Link your chrome app to your new PGS entry.
    * On the "Linked apps" section, click "Chrome" to link a chrome app.
    * Under "Chrome Application ID", enter the app ID from step 3.
6. Authorize your app and get a client ID.
    * Click "Authorize Your App" on the next screen.  Confirm that the
      app ID is correct.
    * You should see a message noting that your Client ID was successfully
      linked.  Note the Client ID.  You'll need it for the next step.
7. Replace the client ID in the application.
    * In the `manifest.json` file, replace the `oauth2.client_id` with your
      Client ID from step 6.
8. Follow the instructions on the
   [packaging instructions](https://developer.chrome.com/extensions/packaging#creating)
   page to update your app, now that you have added the client ID.
9. Load the crx into chrome.

That's it! Your application should be ready to run!

## Troubleshooting

** My application won't allow me to log in!**

This is normally the result of some piece of the app identity being out-of-sync.
* Check that your app ID is correct.
  * Make sure the app ID listed on the chrome://extensions page matches that
  listed on the linked app page of your PGS dashboard.  If it doesn't, you may
  have forgotten to provide the key file when packaging the app.
* Check that your app's client ID is correct.
  * If you see oauth failures in the javascript console of your app, you may
    have the wrong client ID.  Make sure the client ID listed in the
    `oauth2.client_id` property of your app's manifest.json matches the client
    ID listed in your PGS dashboard.  Re-package your app and try again.
* Check that you haven't confused the app ID and the client ID.

## Known issues

This section will be filled out more once we hear from you.

[![Analytics](https://ga-beacon.appspot.com/UA-46743168-1/playgameservices/all-the-stars-js)](https://github.com/playgameservices/all-the-stars-js)
