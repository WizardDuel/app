#Wizard Duel - This project is currently still under construction.
##About Wizard Duel
Wizard Duel is an open source realtime rpg/strategy game built on the MEAN stack with SocketIO, and Ionic. Feel free to checkout the working version of the battle at [Heroku](https://wizardduel.herokuapp.com/)

As a player you take the place of a wizard with the ability to use magical abilities to fight your opponent.

##Overview
The game play is based around the simple cycle typified by fencing: Attack - Parry - Riposte. In addition to these three basic operations, there are spells to provide buffs to your defense or to restore health.

## Game Mechanics
### Joining the game
When joining the game, users will be automatically matched with anyone else who happens to be looking for a game at the same time.

### The Attack Cycle
If an attack is originated against a player they are given visual notification that the oppent has begun chanelling an attack (This is reffered to as the attack power up). The defending player then has an opportunity to parry or riposte the attack. If no parry or riposte spell is cast before the attack time of the riposte spell

##Views
There are three major components to this application.

Views:
- Profile view: currently under construction.
- Home view: supports match making

## Setup Instructions:
###Build

To build a web app version of the app that will run on your local machine type the following command into the command line:
```npm run build```
Note: this will not work on windows based machines.

#### Web App
To run the web app in the dev environmnet run ```npm start``` from the command line, and then navigate to [http://localhost:8100](http://localhost:8100) in your browser.

If you would like to make a production change the values in the .config.js file in the configuration folder to match your needs.

#### Android
To build the app for android, navigate to the client directory of the application and enter the following ionic commands:

1. ```ionic add platform android```
2. ```ionic build platform android```
3. ```ionic run platform android```

If you don't have a device availble use ```emulate``` instead fo the ```run``` command. You may need to configure emulators on your local machine in order for that command to run.

#### iOS
To build the app for iOS, navigate to the client directory of the application and enter the following ionic commands:

1. ```ionic add platform iOS```
2. ```ionic build platform iOS```
3. ```ionic run platform iOS```

If you don't have a device availble use ```emulate``` instead fo the ```run``` command. You may need to configure emulators on your local machine in order for that command to run.

Note you need to have an Mac to run this iOS build.

Deploying using Heroku

## Contribute
If this seems like an interesting project, and you would like to contribute feel free to check out the code. Although not currently inplace style and linting checks will in the future be done with Travis CI.