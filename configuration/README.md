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
#### Web App
To build a web app version of this
1. You will need to have mongo installed, or be using a database hosting service such as mongolab.
2. You will need to run ```npm install```
3. You will need to specify the webapp build in the configuration file located in the root directory of the app. 
4. To run the program locally, you don't need to 
#### Android
#### iOS

Deploying using Heroku

## Contribute
If this seems like an interesting project, and you would like to contribute feel free to Fork down this repository and mess with it.