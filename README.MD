# README

# Project: JavaScript - Tic-Tac-Toe #

This is my student solution to The Odin Project's [Tic-Tac-Toe project](https://www.theodinproject.com/lessons/tic-tac-toe-javascript).  The goal was to create a JavaScript-only version of tic-tac-toe that could be played by clicking squares directly in the browser.  This project was designed as a way to practice factory functions and immediately invoked function expressions (IIFEs), 

## Project Post-Mortem ##

This project feels like a somewhat awkward intermediary between initially learning about constructors, IIFEs, etc. and moving on to the more standard Class template of organization - which is the next lesson in The Odin Project's curriculum.  I wanted to attempt the project as directed and did get good practice using IIFEs and function expressions, but I imagine the code would be a lot cleaner were this project designed with Classes. 

Creating the AI opponent was not as challenging as I expected: I did make it a "dumb" opponent which chooses its squares at random, and I am sure a savvy AI that makes choices based on the board state would be much more complex.  The player turn and computer turn share most of the same logic within a single function, and it was setting up checks for when it was actually the computer's turn that turned out to be the hardest part of this first AI pass. 

## Challenges ##

In previous projects, I primarily used function declarations and avoided nesting functions, and  I also used the global scope much too freely.  The first directive in this project was to have as little global code as possible, which I did a much better job of than in past projects.  I have two IIFEs and one factory function in the global scope: `Gameboard`, `Player`, and `PlayGame`.  `Gameboard` ended up being a bit bloated compared to the other two: it may have been better to separate types of `Gameboard` functions into functions like `GameboardState` and `GameboardInteraction` to more clearly define their purposes.

An ongoing challenge I'm still struggling with is deciding when to use function declarations (`function namedFunction() { ... }`) versus function expressions (`const myFunction = () => { ... }`) versus IIFEs (`(() => { ... })()`) versus variable-assigned IIFEs (`const myFunction = (() => { ... })()`).  I made `Gameboard` and `PlayGame` IIFEs because they both had local variables I wanted to be assigned as soon as the page loaded.  I tried to pimarily use variable-assigned function expressions within these IIFEs mostly as practice, as I am more comfortable with function declarations on the whole.  However, outside of functions being called before they are declared - since declarations are hoisted and expressions are not - I don't always know which is better to use in a given scenario.

Another challenge I ran into was really understanding the return value of a factory function: it was somewhat by chance that the first approach I took to creating my `Gameboard.rows` return value worked as expected, but when I initially created it I didn't fully understand why it worked and why other variations might not.  The value of `Gameboard.rows` points at a nested array where we store the markers players have added to the board: the array starts off empty and when a mark is added, it is pushed to the correct location in the array.  Because we are pushing updates to the array, and `Gameboard.rows` points to this array, functions outside of `Gameboard` are able to access the updated values.  

However, when I attempted to move the array assignment to a local function in `Gameboard` and make the initialized value `undefined` (by simply initializing `let rows` in `Gameboard`), outside functions could only ever access the `undefined` value of `Gameboard.rows` and did not get the updated array.  This is because `Gameboard.rows` was returning the initial value assigned at initialization: it was not a getter function for returning the current value of `rows`.  The reason it happens to work with the array version is that our initial value is the same array at the same point in memory, and we are just pushing elements into this array.  

A better version of this would not return `rows` directly, but would use a getter function to return it: after encountering this error, I updated `Gameboard` to use this method instead, so that external functions access `Gameboard.getRows()` and internal functions with access to `rows` directly merely call it.  This was a baffling error when first encountered, but learning why it occurred helped me understand factory function returns much better.

I also found out at the very end of the project, by testing in Chrome instead of Firefox, that `alert()` takes priority in certain browsers and will activate before some code even when it's invoked after.  The last square clicked before a victory condition did not appear in Chrome because the `alert()` popped up and prevented my `innerText` and `classList` changes.  Placing the function that called the `alert()` without a `setTimeout(), 0` resolved this issue.

## Screenshots ##

![Desktop view screenshot](/images/tictactoe_desktop_start_game.png)
![Desktop view screenshot](/images/tictactoe_desktop_mid_game.png)
![Mobile view screenshot](/images/tictactoe_mobile_mid_game.png)

## To Do ##

As mentioned in the post-mortem above, this project feels like it would greatly benefit from being written with Classes: after I progress through The Odin Project's Classes lessons, I would like to return and possibly rewrite this project to incorporate Classes.  Initially I was going to leave most of the features listed below for that future rewrite, but ended up implementing them as they were good practice.

The elements I would most like to change in the future, besides adding Classes, are the default pop-ups: I've used shortcuts for the "replay?" and "pick an empty square" messages -- `confirm()` and `alert()`, respectively -- and would prefer these were custom messages added to the DOM instead.  This would not only look better and provide a better user experience, but it would cause fewer timing issues with some of my JavaScript-assigned styles which were appearing after the `alert()` pop-up before `setTimeout()` was added.  The `setTimeout()` fix is not perfect - very occasionally the `alert()` will still run before the DOM adjustment.  I've kept the defaults for now as making custom messages was a less interesting and helpful challenge than building an AI opponent.

If I do return to this project and rework it heavily enough, I'd also attempt to make the AI less random and more dependent on the current board state.

- [X] Let players set their names
- [X] Let players choose their marker (instead of just "X" and "O")
- [X] Allow replay after game end (clear game board but keep names and markers)
- [X] Track scores and maintain through replays
- [X] Add computer / AI opponent
- [X] Let players play single-player against AI or 2-player local
- [] Let players choose their square background color
- [X] Only show current player info box on mobile
- [ ] Make currentPlayer check more consistent and player-object-related
- [ ] Rewrite IIFEs and factory functions as Classes
- [ ] Rewrite pop-ups alerts as in-DOM messages
- [ ] Improve AI logic to pick squares based on board state

## Technologies ##

This Tic-Tac-Toe project was built with HTML, CSS, and JavaScript.  The layout uses CSS Grid and Flexbox.  The font is [Signika from Google Fonts](https://fonts.google.com/specimen/Signika?query=signika).