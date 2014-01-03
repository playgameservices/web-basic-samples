# Type-a-Number Challenge

A sample application that demonstrates some simple achievements (normal, hidden,
and incremental), as well as leaderboards. It also demonstrates Interactive
Posts and Deep-Linking, allowing you to challenge your friends to beat your
score on either the web or mobile version.

## Code

You can find the code that runs the game in the `js` directory. The following
files are located there:

* `achievementManager.js` handles most of the game logic around achievements
* `achievementTable.js` displays the table when you click the "View Achievements"
  button
* `achievementWidget.js` displays the little "Achievement unlocked!" widget at
  the bottom of the page
* `challenge.js` contains some simple logic to display the challenge received
  via Interactive Posts
* `constants.js` contains some constants that you will want to change for your
  application
* `friendsTable.js` shows the "Find my friends!" page
* `game.js` handles the simple game logic and creates the "Beat my score!"
 Interative Post
* `leaderboardManager.js` handles most of the game logic around leaderboards
* `leaderboardsTable.js` displays the "All leaderboards" table
* `leaderboardTable.js` displays the high scores for an individual leaderboard
* `leaderboardWidget.js` dispalys the little "New high score!" widget at the
bottom of the page
* `login.js` handles most of the initial login logic
* `player.js` simply handles loading the player information so we can say hello.
* `utils.js` has a function to roll a random number, and determine if a number
  is prime
* `welcome.js` manages the simple logic around the welcome page

* `linkPage/index.php` is a server-generated page that populates its schema.org
data (i.e. the stuff with the `itemprop` attributes) based on the parameters
passed to it. This allows you to create a custom description when
generating your Interactive Post. The JavaScript will send any actual players
to your main page.

## Running the sample application

To run the Type-a-Number Challenge on your own server, you will need to create
your own version of the game in the Play Console. Once you have done that,
you will create achievements and leaderboards for this game, then copy over
all client IDs, achievement IDs and leaderboard IDs to your own
`js/constants.js` file. To follow this process, perform the following steps:

1. If you have already created this application in the Play Console (because you
have created and run the Android or iOS version of the game, for example), you can
skip steps 2 through 5 below. All you will need to do is...
    * Create a separate Client ID for the web version of the game, as described in
    the "Create a Client ID" section of the [Console Documentation](https://developers.google.com/games/partners/console/).
    * Link the web version of your game, as described in the "Link Your Platform-
    Specific Apps" section of the console documentation
2. Create your own application in the Play Console, as described in our [Developer
Documentation](https://developers.google.com/games/partners/console/). Make
sure you follow the "Web" instructions for creating your Client ID and linking
your application.
3. Make a note of your Client ID and Application ID as described in the
documentation
4. Create your own Achievements and Leaderboards as described in the
[Achievements](https://developers.google.com/games/partners/common/concepts/achievements)
and [Leaderbords](https://developers.google.com/games/partners/common/concepts/leaderboards)
documentation. You are free to create you own Achievements and Leaderboards,
but if you want to match the ones in this sample application, they are...
    * Achievements:
        * Prime: Receive a score that is a prime number
        * Bored: Play 10 games (Incremental achievement)
        * Humble: Request a score of 0
        * Don't Get Cocky, Kid: Request a score of 9999
        * OMG U R TEH UBER LEET!: Receive a score of 1337 (hidden achievement)
        * Really Bored: Play 100 games (Incremental achievement)
    * Leaderboards:
        * Hard mode
        * Easy mode
5. Feel free to use any score value for your achievements (we tended to keep
them between 10 and 75 points per achievement). If you want placeholder icons,
<http://lorempixel.com> is a great resource.
6. Once that's done, you'll want to replace some of the constants defined in the
application.
    * In the `constants.js` file, replace the following constants:
        * `constants.CLIENT_ID` (Replace this with your OAuth2.0 Client ID)
        * `constants.APP_ID` (Replace this with your Application ID)
    * In the same `constants.js` file, replace the following constants with the
    IDs for the corresponding achievements that you created:
        * `constants.ACH_PRIME`
        * `constants.ACH_BORED`
        * `constants.ACH_HUMBLE`
        * `constants.ACH_COCKY`
        * `constants.ACH_LEET`
        * `constants.ACH_REALLY_BORED`
    * Finally, replace the following constants with the IDs for the
    corresponding leaderboards that you created:
        * `constants.LEADERBOARD_EASY`
        * `constants.LEADERBOARD_HARD`
7. To get Interactive Posts working properly, make sure you change your
`constants.LINK_PAGE_BASE` to the URL of your link page. And make sure you
change the redirect Javascript in your `linkPage/index.php` file.

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

1. Go to your application in the Play Console's Game services page.
2. Click the "This game is linked to the API console project called '<Your app
name>'" link at the bottom of the page. This will take you to the Google
API Console.
3. Click on the "API Access" tab on the left.
4. Find the "Client ID for web applications" section, click on the "Edit Settings..."
link to the right, and then add or edit your JavaScript origins so they match
the location from which you are serving your application.

## Known issues

* Game is ugly :)
* Game does not conform to Play game services branding recommendations
  (no game controller, achievement, or leaderboard icon)
* "Incremental" achievement progress doesn't get updated locally


[![Analytics](https://ga-beacon.appspot.com/UA-46743168-1/playgameservices/type-a-number-js)](https://github.com/playgameservices/type-a-number-js)