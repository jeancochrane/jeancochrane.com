title: 2021 Predictions 
slug: 2021-predictions 
template: work
category: code
type: work
order: 1
summary: A real-time web game for making New Year's Eve predictions with friends.
thumbnail: /static/images/work/predictions/predictions.png
work_url: https://predictions.netlify.app/2021/
code_url: https://github.com/jeancochrane/predictions

For the past few years my house has run a game at our New Year's party where everyone writes predictions on sticky notes and puts them on the wall. It's a fun way to celebrate the end of the year and speculate  about upcoming trends and events. In 2020 we couldn't gather in person for obvious reasons so I built out a simple virtual version of the game.

There are three real-time components to the app: sticky note predictions, chat messages, and copies of each user's cursor to show you where they are on the screen. The cursors are particularly helpful because while only the user who posted a prediction can delete it, any user can move any prediction around on the screen, which creates a fun sense of controlled chaos. All three components are managed via websockets in a React app on the frontend and Django Channels on the backend.

![GIF of the game in action](/static/images/work/predictions/predictions.gif)

The 2021 game has now been archived, meaning the link above is fully static. We're hoping to run new editions in future years, pandemic or not, because it's a great way to include long-distance friends in a New Year's party. 
