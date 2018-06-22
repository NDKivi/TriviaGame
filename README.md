# TriviaGame
UMN Coding Boot Camp JavaScript 2

## Basic Requirements
A trivia game where questions are displayed one by one to the user who must respond fast enough.
1. User has a set time to answer each question (a set time per question).
2. The answer to the question is shown for a set time then the next question is automatically displayed.
3. This continues until all questions are through (right, wrong, or unanswered) when the overall results are displayed.

## Theme
__???__

## Display
* On all screens: heading with name of game

### Game start screen
* Start button
* Instructions

### Question screen
* Time remaining
* Question prompt
* List of potential answers

### Answer right/wrong screen
* Time that was left to answer that question
* Question prompt
* Message whether right or wrong or ran out of time
* Correct answer

### Game end screen
* Tally of right
* Tally of wrong
* Tally of unanswered
* Start over button

## Technical plan
* Store questions in an array of objects
    * Create a constructor for the object
    * Store the question prompt as a string
    * Store potential answers as an array of strings (so that the number of potential responses is flexible)
    * Store the correct response as an integer (the index of the response array)
* Use an enumeration to track the game state
    * States include:
        * The start of the game
        * Answering question
        * Seeing the answer/rightOrWrong page
        * The end of the game
* Store the time for each question in a const variable
* Store the time to see the answer in a const variable
* Store number right, number wrong, and number unanswered in "global" integer variables

## Display functions
* Write the question prompt and potential answers to the screen
* Write the correct answer to the preceding question along with a message (right/wrong/timesup)
* Write the start screen instructions and button
* Write the game over screen with a display of number right, wrong and timesup

## Style
* variable names in camel case
* when displaying a particular variable, generally use the same name for the element ID (or sometimes class) except make it all lower case separated by dashes (Twitter style)

## Enhancements (if there is time)
* Questions get pulled from the question array at random until they are all gone (so the order of the questions will be different each time)
* Have a larger set of questions and only pull a random subset for a given round
* Display potential responses in a randomized order

## TODO: countdown timer for each question