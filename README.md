# Klondike Solitaire

Working web-based solitaire.  

## Features:

* Regular dar and drop interface.
* Wheel button click sends card to final stack.
* Undo, limited to 10 steps (to save memory).
  
It is not visually great, the *favicon* is the default from React, the buttons are plain and the cards are whatever I managed to pick from the web.

## Build and deploy

This app was developped with [Create React App](https://create-react-app.dev/).  It assumes you have [NodeJS](https://reactjs.org/) installed.

1. Download or clone a copy of this repository.
2. In the root of the project, run `npm install` to download all the dependencies required and install them.
3. To build, run `npm run build`.   This will create a folder within the project called `build`.
4. Copy the contents of the `build` folder (not the `build` folder itself) to a new folder in a web server.
5. Point any browser to the location of that folder.  It should inmediately start a new game.
  
It can also be run in develoment mode by doing:

1. Do steps 1 and 2 as above
2. Run `npm start`. This will compile and launch the application in development mode using the default browser in your system.



