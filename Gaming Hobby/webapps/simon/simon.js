//init variables
var level = 0;
var highScore = 0;
var userClickedPattern = [];
userChosenColour = "";
var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow"]; 
var started = false;
var enable = false;


//push random colour to game pattern
function newColour(){
    userClickedPattern = [];
    var randomChosenColour = buttonColours[nextSequence()];
    gamePattern.push(randomChosenColour);
    $("#"+randomChosenColour).fadeOut(150).fadeIn(150);
    playSound(randomChosenColour);
}

//generate a random number
function nextSequence(){
    var randomNumber = Math.floor(Math.random() * 4);
    return randomNumber;
}

//playback the current game pattern then move to new colour
function playSequence(){
    enable = false; //disable button clicking for duration of sequence
    level++;
    $("#level").text("Level:" + " " + level); //update level display
    var currentSequence = gamePattern;
    var numberToPlay = gamePattern.length;
    var wait = (numberToPlay * 600) + 600; //length of gamePattern + 1
    var i = 0;

    playLoop();
    
    function playLoop(){
        var t = setTimeout(function(){
            $("#"+currentSequence[i]).fadeOut(150).fadeIn(150);
            playSound(currentSequence[i]);
            i++;
            if(i < numberToPlay){
                playLoop();
            }
        }, 600);
    }

    setTimeout(function(){
        enable = true; //re-enable button after pattern finishes playing
        newColour();
    }, wait);

}

//play sound based on colour
function playSound(name){

    switch (name) {

    case ("blue"):
    var blue = new Audio("sounds/blue.mp3");
    blue.play();
    break;

    case ("red"):
    var red = new Audio("sounds/red.mp3");
    red.play();
    break;

    case ("green"):
    var green = new Audio("sounds/green.mp3");
    green.play();
    break;

    case ("yellow"):
    var yellow = new Audio("sounds/yellow.mp3");
    yellow.play();
    break;

    case ("wrong"):
    var wrong = new Audio("sounds/wrong.wav");
    wrong.play();
    break;

    default: console.log(name);

    }

}

//when any key is pressed start new game and reset everything to default
$(document).keypress(function(event){
    if(started === false) {
        console.log("starting new game");
        newGame();
    }
});

//also start via press on title
function start(){
    if(started === false) {
        console.log("starting new game");
        newGame();
    }
}

//when a button is clicked
$(".btn").on("click", function(){
    userChosenColour = this.id;
    if(started === true && enable === true) { //check if game has started and is not playing pattern
        $("#"+userChosenColour).addClass("pressed");
        setTimeout(function(){
            $("#"+userChosenColour).removeClass("pressed");
        }, 100);
        playSound(userChosenColour);
        userClickedPattern.push(userChosenColour);
        checkAnswer(userClickedPattern.length);
    }
});

//compare user pattern to current game pattern
function checkAnswer(currentLevel) {
    var a = currentLevel - 1;

    //checks most recent press and if incorrect
    if(userClickedPattern[a] != gamePattern[a]) {
        console.log("wrong");
        started = false;
        enable = false;
        setTimeout(function () { //goto game over screen after short delay
          $("#title").text("Game Over!");
          playSound("wrong");
          $("body").addClass("game-over");
          $(".simon-unit").addClass("game-over-fade");
          if(level > highScore){
            highScore = level - 1;
            $("#highscore").text("Best:" + " " + highScore);
            setTimeout(function () { //add effect to start button

            }, 200);
          }
        }, 200);
    }
    
    //checks most recent press
    else {
    console.log("correct");

        //if number of inputs is the same as game length, progress game
        if (userClickedPattern.length == gamePattern.length) {
        console.log("next");
        playSequence(); //play current sequence
        }
    } 
}

//resets variables and styling then picks a new colour after a short delay
function newGame(){
    level = 1;
    $("#level").text("Level:" + " " + level); 
    gamePattern = [];
    userClickedPattern = [];
    started = true;
    enable = true;
    $("body").removeClass("game-over");
    $(".simon-unit").removeClass("game-over-fade");
    $("#title").text("Simon");
    setTimeout(function(){
        newColour();
    }, 200);
    
}