
//a prime number is any whole number greater than 1 that is only evenly divisible by itself and 1
//a perfect number is any whole number that is equal to the sum total of its divisors

var num = 0; //current number to check
var max = 0; //maximum number to check
const limit = 500; //limit of calculation

//wait for document to be ready
//add click handler for start button
$(document).ready(function() {
    clear();
    document.getElementById("inst").append(" (limit " + limit + ")");
    $("#start").click(function(){
        clear();
        start();
    });
});

//clear page of previous results
function clear(){
    document.getElementById("method").innerHTML = "";
    document.getElementById("prime").innerHTML = "";
    document.getElementById("prires").innerHTML = "";
    document.getElementById("perfect").innerHTML = "";
    document.getElementById("perres").innerHTML = "";
};

//run primecalc for each even number up to the max specified
//failsafe at 500
function start(){
    clear();
    max = document.getElementById("maximum").value;
    document.getElementById("prime").innerHTML = "Prime numbers:";
    document.getElementById("perfect").innerHTML = "Perfect numbers:";
    
    if (max <= limit && max <= 500) {
        document.getElementById("method").innerHTML = "Calculating Prime and Perfect numbers up to "+ max +". . .";
        for(var i = 1; i <= max; i++){
            num = i;
        primeCalc(num);
        };
    };
};


//determine if number is prime
//if true, print number to new line
function primeCalc(num) {
    
    var chk = 1;
    var pri = [];

    console.log("new number");

    //divide num by each int starting at 1
    //record even divisors in var pri
    for (var i = 1; i <= num; i++){
        console.log("new calc");
        console.log("num: " + num);
        console.log("i: " + i);
        
        chk = num % i;
        
        console.log("check: " + chk);
        
        if (chk == 0){
            pri.push(i);
            console.log("pri: " + pri);
        };
    };

    //if num is prime, print num
    if (pri.length == 2){
        $("#prires").append(num + " ");
    };
    
    //check if num is perfect, using discovered divisors
    perfectCalc(pri, num);
};

//check if number is perfect
function perfectCalc(div, prime){
    console.log("div: " + div);
    var per = 0;
    div.forEach(element => {
        per = per + element; 
    });
    
    //if perfect found, print perfect
    if(prime * 2 == per){
        $("#perres").append(num + " ");
    };
    console.log("per: " + per);
};

