// ============================================================
// 
// Project: Yeti
// David Russell (C) 2025
// 
// ============================================================

//has game begun?
let begin = false;

//on title screen?
let tscreen = false;

//current level
let dfloor = 0;

//number of moves
let moves = 0;

//how many walls to generate
let numWalls = 100;

//how many monsters to generate
let numMon = 4;

//level data
let level = {
  w : 40,
  h : 40,
  entx : 0,
  enty : 0,
  extx : 0,
  exty : 0,
};

//experience values
const expTable = {
  1 : 0,
  2 : 30,
  3 : 60,
  4 : 120,
  5 : 240,
  6 : 480,
  7 : 960,
  8 : 1920,
  9 : 3840,
  10 : 7680,
  11 : 15360,
  11 : 30720,
  12 : 61440,
  13 : 122880,
  14 : 245760,
  15 : 491520,
  16 : 983040,
  17 : 1966080,
  18 : 3932160,
  19 : 7864320,
  20 : 15728640,
};

//walls
let wall = {
  x : [],
  y : [],
};

//doors
let door = {
  x : [],
  y : [],
};

//floors
let floor = {
  x : [],
  y : [],
};

//monster data
const monData = [
  rat = {
    name : 'Rat',
    t : 'R',
    gxp : 10,
    thp : 2,
    atk : 3,
    def : 3,
    dmin : 1,
    dmax : 2,
    delay : 0,
    logi : "ra",
  },
  bat = {
    name : 'Bat',
    t : 'B',
    gxp : 10,
    thp : 3,
    atk : 4,
    def : 4,
    dmin : 1,
    dmax : 3,
    delay : 0,
    logi : "ra",
  },
  snake = {
    name : "Snake",
    t : 'S',
    gxp : 20,
    thp : 4,
    atk : 5,
    def : 5,
    dmin : 2,
    dmax : 3,
    delay : 1,
    logi : "ga",
  },
  zombie = {
    name : "Zombie",
    t : 'Z',
    gxp : 25,
    thp : 6,
    atk : 4,
    def : 4,
    dmin : 2,
    dmax : 5,
    delay : 2,
    logi : "rh",
  },
  skeleton = {
    name : "Skeleton",
    t : 'K',
    gxp : 15,
    thp : 4,
    atk : 5,
    def : 5,
    dmin : 1,
    dmax : 4,
    delay : 0,
    logi : "rh",
  },
];

//loot data
const lootData = [
  gold = {
    t : "$",
  },
];

//player
let player = {
  name : "Player",
  x : 0,
  y : 0,
  thp : 10,
  chp : 10,
  exp : 0,
  lvl : 1,
  atk : 5,
  def : 5,
  dmin : 2,
  dmax : 4,
  gold : 0,
};

//player default
let pdef = {
  name : "Player",
  x : 0,
  y : 0,
  thp : 10,
  chp : 10,
  exp : 0,
  lvl : 1,
  atk : 6,
  def : 6,
  dmin : 2,
  dmax : 4,
  gold : 0,
};

//live monster array
let mon2 = [];

//loot array
let loot = [];

//start or title screen on launch
title();
// start();

$(document).keydown(function(key) {
  //if on title screen, detect keys
  if (tscreen == true){
    //1
    if (key.which == 49){
    };
    //2
    if (key.which == 50){
    };
    //enter
    if (key.which == 13){
      end();
      start();
    };
  };
});


//keyboard key detection and action (keybinds)
$(document).keydown(function(key) {
  //if game started, detect movement keys
  if (begin == true){
    //left arrow || num 4
    if (key.which == 37 || key.which == 100){
      moveP(player, "l");
    };
    //up arrow || num 8
    if (key.which == 38 || key.which == 104){
      moveP(player, "u");
    };
    //right arrow || num 6
    if (key.which == 39 || key.which == 102){
      moveP(player, "r");
    };
    //down arrow || num 2
    if (key.which == 40 || key.which == 98){
      moveP(player, "d");
    };
    //num 5
    if (key.which == 101){
      moveP(player, "c");
    };
    //num 7
    if (key.which == 103){
      moveP(player, "ul");
    };
    //num 9
    if (key.which == 105){
      moveP(player, "ur");
    };
    //num 1
    if (key.which == 97){
      moveP(player, "dl");
    };
    //num 3
    if (key.which == 99){
      moveP(player, "dr");
    };
  };
});

//moves game to simulate camera movement
//centres camera on player
function movCam(){
  console.log("move camera");
  let x = (10 - player.x) * 64; 
  let y = (5 - player.y) * 64;
  document.getElementById("game").style.translate = x + 'px ' + y + 'px';
};

//resets camera back to top left
function rstCam(){
  console.log("reset camera");
  document.getElementById("game").style.translate = '0px 0px';
};

//when new game is pressed
$(".newgame").on("click", function(){
  start();
});

//when quit is pressed
$(".quit").on("click", function(){
  end();
});

//when help is pressed
$(".help").on("click", function(){
  window.location.assign("./help.html");
});

function start(){
  dispGame();
  tscreen = false;
  dfloor = 1;
  clearLevel();
  rstPlr();
  drawLevel();
  begin = true;
  movCam();
  $("#game").removeClass("game-title");
  $("#game").addClass("game");
};

function end(){
  tscreen = false;
  begin = false;
  dfloor = 0;
  clearLevel();
  rstPlr();
};

//clears visual level data but preserves stats
function clearLevel(){
  noGrey();
  remPlr();
  remExt();
  remEnt();
  cleanupMons();
  cleanupLoot();
  remWalls();
  remDoors();
  remFloors();
  remHud();
  remText();
  remLight(player);
  $(".square").removeClass("dark");
};

//generate a new level, preserve character data
function nextLevel(){
  dfloor++;
  if(dfloor == 2){
    win();
  } else {
    clearLevel();
    drawLevel();
  };

};

//generate and draws level data
function drawLevel(){
  noGrey();
  createRoom();
  addWalls();
  addDoors();
  addFloors();
  setEnt();
  plcPlr();
  addPlr();
  setExt();
  numMon = Math.floor(Math.random() * (3) + 1);
  genMon2();
  plcMon2();
  addHud();
  $(".square").addClass("dark");
  addLight(player);
};

function rstPlr(){
  player = pdef;
};

function dispTitle(){
  $("#game").addClass("game-title");
  $("#game").removeClass("game");
};

function dispGame(){
  $("#game").addClass("game-title");
  $("#game").removeClass("game");
};

function colorTitle(){
  for(let h = 19; h <= 22; h++){
    for(let v = 7; v <= 7; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("monster");
    };
  };
  for(let h = 12; h <= 29; h++){
    for(let v = 10; v <= 10; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("rgb-grey");
    };
  };

  for(let h = 21; h <= 27; h++){
    for(let v = 20; v <= 20; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("loot");
    };
  };

  for(let h = 15; h <= 19; h++){
    for(let v = 20; v <= 20; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("player");
    };
  };

  for(let h = 1; h <= 40; h++){
    for(let v = 23; v <= 23; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("player");
    };
  };

  for(let h = 1; h <= 40; h++){
    for(let v = 35; v <= 38; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("rgb-grey");
    };
  };

}

//title screen
function title(){
  clearLevel();
  dispTitle();
  colorTitle();
  tscreen = true;

  $("#7-19").text("Y");
  $("#7-20").text("E");
  $("#7-21").text("T");
  $("#7-22").text("I");

  $("#10-12").text("T");
  $("#10-13").text("h");
  $("#10-14").text("e");

  $("#10-16").text("A");
  $("#10-17").text("d");
  $("#10-18").text("v");
  $("#10-19").text("e");
  $("#10-20").text("n");
  $("#10-21").text("t");
  $("#10-22").text("u");
  $("#10-23").text("r");
  $("#10-24").text("e");

  $("#10-26").text("G");
  $("#10-27").text("a");
  $("#10-28").text("m");
  $("#10-29").text("e");

  $("#20-15").text("P");
  $("#20-16").text("r");
  $("#20-17").text("e");
  $("#20-18").text("s");
  $("#20-19").text("s");

  $("#20-21").text("E");
  $("#20-22").text("N");
  $("#20-23").text("T");
  $("#20-24").text("E");
  $("#20-25").text("R");

  $("#23-17").text("T");
  $("#23-18").text("o");

  $("#23-20").text("B");
  $("#23-21").text("e");
  $("#23-22").text("g");
  $("#23-23").text("i");
  $("#23-24").text("n");

  $("#35-12").text("(");
  $("#35-13").text("C");
  $("#35-14").text(")");

  $("#35-16").text("C");
  $("#35-17").text("o");
  $("#35-18").text("p");
  $("#35-19").text("y");
  $("#35-20").text("r");

  $("#35-21").text("i");
  $("#35-22").text("g");
  $("#35-23").text("h");
  $("#35-24").text("t");

  $("#35-26").text("2");
  $("#35-27").text("0");
  $("#35-28").text("2");
  $("#35-29").text("5");

  $("#38-15").text("D");
  $("#38-16").text("a");
  $("#38-17").text("v");
  $("#38-18").text("e");

  $("#38-20").text("R");
  $("#38-21").text("u");
  $("#38-22").text("s");
  $("#38-23").text("s");
  $("#38-24").text("e");
  $("#38-25").text("l");
  $("#38-26").text("l");

};

//on victory
function win(){

  rstCam();
  clearLevel();
  allGrey();
  dispTitle();

  begin = false;

  const g = player.gold;
  const score = g.toString();

  $("#15-13").text("C");
  $("#15-14").text("O");
  $("#15-15").text("N");
  $("#15-16").text("G");
  $("#15-17").text("R");
  $("#15-18").text("A");
  $("#15-19").text("T");
  $("#15-20").text("U");

  $("#15-21").text("L");
  $("#15-22").text("A");
  $("#15-23").text("T");
  $("#15-24").text("I");
  $("#15-25").text("O");
  $("#15-26").text("N");
  $("#15-27").text("S");
  $("#15-28").text("!");

  $("#18-17").text("Y");
  $("#18-18").text("O");
  $("#18-19").text("U");

  $("#18-21").text("W");
  $("#18-22").text("I");
  $("#18-23").text("N");
  $("#18-24").text("!");

  $("#24-17").text("G");
  $("#24-18").text("O");
  $("#24-19").text("L");
  $("#24-20").text("D");

  $("#24-21").text(":");
  $("#24-22").text("");
  $("#24-23").text(score.charAt(0));
  $("#24-24").text(score.charAt(1));

};

//on defeat
function loose(){
  clearLevel();
  allGrey();
  rstCam();
  dispTitle();

  begin = false;

  $("#15-16").text("G");
  $("#15-17").text("A");
  $("#15-18").text("M");
  $("#15-19").text("E");

  $("#15-21").text("O");
  $("#15-22").text("V");
  $("#15-23").text("E");
  $("#15-24").text("R");
  $("#15-25").text("!");

};

//place player south of entrance
function plcPlr(){
  player.x = level.entx;
  player.y = level.enty + 1;
};

//add grey to level
function allGrey(){

  const horiz = level.w;
  const vert = level.h;

  for(let h = 1; h <= horiz; h++){
    for(let v = 1; v <= vert; v++){
      let change = v + "-" + h;
      $("#" + change).addClass("rgb-grey");
    };
  };
};

//remove grey from level
function noGrey(){

  const horiz = level.w;
  const vert = level.h;

  for(let h = 1; h <= horiz; h++){
    for(let v = 1; v <= vert; v++){
      let change = v + "-" + h;
      $("#" + change).removeClass("rgb-grey");
      $("#" + change).removeClass("back-grey");
      $("#" + change).removeClass("player");
      $("#" + change).removeClass("monster");
      $("#" + change).removeClass("door");
      $("#" + change).removeClass("floor");
      $("#" + change).removeClass("wall");
      $("#" + change).removeClass("exit");
      $("#" + change).removeClass("entry");
      $("#" + change).removeClass("loot");
    };
  };
};

//clear all text from level
function remText(){

  const horiz = level.w;
  const vert = level.h;

  for(let h = 1; h <= horiz; h++){
    for(let v = 1; v <= vert; v++){
      let change = v + "-" + h;
      $("#" + change).text("");
    };
  };
};

//draw HUD elements
function addHud(){
  let chp = player.chp;
  let thp = player.thp;
  let xp = player.exp;
  let lv = player.lvl;
  let gold = player.gold;
  let nl = expTable[player.lvl + 1];
  let bars = 20;
  if(player.chp < player.thp){
    bars = ((player.chp / player.thp) * 10) * 2;
    bars = Math.floor(bars);
  };
  for(let c = 1; c <= 20; c++){
    $(".hp" + c).removeClass("back-yellow");
  };
  for(let i = 1; i <= bars; i++){
    $(".hp" + i).addClass("back-yellow");
  };
  $(".hp").text("HP: " + chp + " / " + thp);
  $(".lv").text("LVL: " + lv);
  $(".xp").text("EXP: " + xp + " / " + nl);
  $(".gd").text("Gold: " + gold);
  $(".fl").text("Floor: " + dfloor);
  $(".stats").removeClass("back-black");
  $(".stats").addClass("back-grey");
};

//clear HUD elements
function remHud(){
  $(".hp").text("");
  $(".lv").text("");
  $(".xp").text("");
  $(".gd").text("");
  $(".fl").text("");
  $(".bseg").removeClass("back-yellow");
  $(".stats").removeClass("back-grey");
  $(".stats").addClass("back-black");
};

//add lighting around given entity
function addLight(ent){

  let x = ent.x;
  let y = ent.y;

  const dir = ["c", "u", "r", "l", "d", "ur", "ul", "dr", "dl"];

  dir.forEach(element => {
    let xy = getDirCoords(ent, element);
    $("#" + xy[1] + "-" + xy[0]).removeClass("dim dark");
    $("#" + xy[1] + "-" + xy[0]).addClass("lit");
  });

  //get top of ring
  for(y = -2; y < -1; y++){
    for(x = -2; x < 3; x++){
      let ly = y + ent.y;
      let lx = x + ent.x;
      $("#" + ly + "-" + lx).removeClass("lit dark");
      $("#" + ly + "-" + lx).addClass("dim");
    };
  };

  //get left side of ring
  for(x = -2; x < -1; x++){
    for(y = -1; y < 2; y++){
      let ly = y + ent.y;
      let lx = x + ent.x;
      $("#" + ly + "-" + lx).removeClass("lit dark");
      $("#" + ly + "-" + lx).addClass("dim");
    };
  };

  //get right side of ring
  for(x = 2; x < 3; x++){
    for(y = -1; y < 2; y++){
      let ly = y + ent.y;
      let lx = x + ent.x;
      $("#" + ly + "-" + lx).removeClass("lit dark");
      $("#" + ly + "-" + lx).addClass("dim");
    };
  };

  //get bottom of ring
  for(y = 2; y < 3; y++){
    for(x = -2; x < 3; x++){
      let ly = y + ent.y;
      let lx = x + ent.x;
      $("#" + ly + "-" + lx).removeClass("lit dark");
      $("#" + ly + "-" + lx).addClass("dim");
    };
  };
};

//remove lighting around given entity
function remLight(ent){

  let x = ent.x;
  let y = ent.y;

  const dir = ["c", "u", "r", "l", "d", "ur", "ul", "dr", "dl"];

  dir.forEach(element => {
    let xy = getDirCoords(ent, element);
    $("#" + xy[1] + "-" + xy[0]).removeClass("lit dim");
    $("#" + xy[1] + "-" + xy[0]).addClass("dark");
  });

    //get top of ring
    for(y = -2; y < -1; y++){
      for(x = -2; x < 3; x++){
        let ly = y + ent.y;
        let lx = x + ent.x;
        $("#" + ly + "-" + lx).removeClass("lit dim");
        $("#" + ly + "-" + lx).addClass("dark");
      };
    };

    //get left side of ring
    for(x = -2; x < 3; x++){
      for(y = -1; y < 2; y++){
        let ly = y + ent.y;
        let lx = x + ent.x;
        $("#" + ly + "-" + lx).removeClass("lit dim");
        $("#" + ly + "-" + lx).addClass("dark");
      };
    };

    //get right side of ring
    for(x = 2; x < 3; x++){
      for(y = -1; y < 2; y++){
        let ly = y + ent.y;
        let lx = x + ent.x;
        $("#" + ly + "-" + lx).removeClass("lit dim");
        $("#" + ly + "-" + lx).addClass("dark");
      };
    };

    //get bottom of ring
    for(y = 2; y < 3; y++){
      for(x = -2; x < 3; x++){
        let ly = y + ent.y;
        let lx = x + ent.x;
        $("#" + ly + "-" + lx).removeClass("lit dim");
        $("#" + ly + "-" + lx).addClass("dark");
      };
    };

};

//generate and print entrance
function genEnt(){

  let x = 0;
  let y = 0;

  for(let i = 0; i < 1;){
    //gen ent location
    x = Math.floor(Math.random() * (level.w) + 1);
    y = Math.floor(Math.random() * (level.h) + 1);

    if(checkLoc(x, y) == false){
      level.enty = y;
      level.entx = x;
      addEnt();
      i = 1;
      break;
    };
  };
};

//place and print entrance inside floor
function setEnt(){

  let x = 0;
  let y = 0;

  for(let i = 0; i < 1;){
    //pick random location on floor
    rnd = Math.floor(Math.random() * (floor.x.length));

    x = floor.x[rnd];
    y = floor.y[rnd];

    if(checkLoc(x, y) == false && checkLoc(x, y + 1) == false){
      level.enty = y;
      level.entx = x;
      addEnt();
      i = 1;
      break;
    };
  };
};

//generate and print exit
function genExt(){

  let x = 0;
  let y = 0;

  for(let i = 0; i < 1;){
    //gen exit location
    x = Math.floor(Math.random() * (level.w) + 1);
    y = Math.floor(Math.random() * (level.h) + 1);

    if(checkLoc(x, y) == false){
      level.exty = y;
      level.extx = x;
      addExt();
      i = 1;
      break;
    };
  };
};

//place and print exit inside floor
function setExt(){

  let x = 0;
  let y = 0;

  for(let i = 0; i < 1;){
    //pick random location on floor
    rnd = Math.floor(Math.random() * (floor.x.length));

    x = floor.x[rnd];
    y = floor.y[rnd];

    if(checkLoc(x, y) == false){
      level.exty = y;
      level.extx = x;
      addExt();
      i = 1;
      break;
    };
  };
};

function addExt(){
  $("#" + level.exty + "-" + level.extx).text(">");
  $("#" + level.exty + "-" + level.extx).addClass("exit");
};

function remExt(){
  $("#" + level.exty + "-" + level.extx).text("");
  $("#" + level.exty + "-" + level.extx).removeClass("exit");
};

function addEnt(){
  $("#" + level.enty + "-" + level.entx).text("<");
  $("#" + level.enty + "-" + level.entx).addClass("entry");
};

function remEnt(){
  $("#" + level.enty + "-" + level.entx).text("");
  $("#" + level.enty + "-" + level.entx).removeClass("entry");
};

//randomly generate 'num' of walls (trees in a forest)
function genRndWalls(num){
  for(let i = 0; i < num; i++){
    let y = Math.floor(Math.random() * level.h + 1);
    // console.log(genY);
    wall.y.push(y);
    let x = Math.floor(Math.random() * level.w + 1);
    // console.log(genX);
    wall.x.push(x);    
  };
};

//generate a random rectangle room within bounds
//accepts coords to specify placement location in grid
function createRoom(dx, dy){

  //location for upper left room corner
  let xloc = 0;
  let yloc = 0;

  let room = {
    x : [],
    y : [], 
  };

  //select room size from 8x8 to 12x12 (internal 6x6 to 10x10)
  let w = Math.floor(Math.random() * 6 + 7);
  let h = Math.floor(Math.random() * 6 + 7);

  //if suppled coords, use them for room location
  if (dx && dy){
    xloc = dx;
    yloc = dy;
  }
  else{
    //choose random location for room's top left corner
    xloc = Math.floor(Math.random() * (level.w - w + 1)) + 1;
    yloc = Math.floor(Math.random() * (level.h - h + 1)) + 1;
  };

  console.log("ROOM size: " + w + "x" + h + " loc: x" + xloc + " y" + yloc);

  //top (left to right)
  for (let i = xloc; i < (xloc + w); i++){
    room.x.push(i);
    room.y.push(yloc);
  };

  //left wall (top down)
  for (let i = (yloc + 1); i < (yloc + (h - 1)); i++){
    room.y.push(i);
    room.x.push(xloc);
  };

  //right wall (top down)
  for (let i = (yloc + 1); i < (yloc + (h - 1)); i++){
    room.y.push(i);
    room.x.push(xloc + (w - 1));
  };

   //bottom (left to right)
  for (let i = xloc; i < (xloc + w); i++){
    room.x.push(i);
    room.y.push(yloc + (h - 1));
  };

  //floor (top to bottom)
  for (let a = (yloc + 1); a < (yloc + (h - 1)); a++){
    let yax = a;
    //floor (left to right)
    for (let b = (xloc + 1); b < (xloc + (w - 1)); b++){
      floor.x.push(b);
      floor.y.push(yax);
    };

  };

  //make random door in room
  makeDoor(xloc, yloc, w, h, room);

  //add room to wall array
  wall = room;

};

//adds a random door to room
function makeDoor(xloc, yloc, w, h, room){

  //carinal direction for door
  let pool = [0,1,2,3];
  let loc = 0;

  //prevent door spawning on outer bound
  if(xloc == 1){
    loc = pool.indexOf(2);
    pool.splice(loc, 1);
  } if(yloc == 1){
    loc = pool.indexOf(0);
    pool.splice(loc, 1);
  } if(xloc + w - 1 == 40){
    loc = pool.indexOf(3);
    pool.splice(loc, 1);
  } if(yloc + h - 1 == 40){
    loc = pool.indexOf(1);
    pool.splice(loc, 1);
  };

  if (pool.length == 0){
    return;
  };

  let rng = Math.floor(Math.random() * pool.length);
  dir = pool[rng];
  
  // console.log("pool: " + pool + "dir: " + dir);
  
  //door variables
  let pos = 0;
  let spc = 0;
  let grd = 0;
  let doorx = 0;
  let doory = 0;

  //door in top
  if (dir == 0){
    //pos in wall exluding corner
    pos = Math.floor(Math.random() * (w - 2) + 1);
    //space before
    spc = xloc;
    //grid position
    grd = pos + spc;
    //calculated door x and y coords
    doorx = grd;
    doory = yloc;

  //door in bottom
  } else if (dir == 1){
    //pos in wall exluding corner
    pos = Math.floor(Math.random() * (w - 2) + 1);
    //space before
    spc = xloc;
    //grid position
    grd = pos + spc;
    //calculated door x and y coords
    doorx = grd;
    doory = yloc + (h - 1);
  
  //door in left
  } else if (dir == 2){
    //pos in wall exluding corner
    pos = Math.floor(Math.random() * (h - 2) + 1);
    //space before
    spc = yloc;
    //grid position
    grd = pos + spc;
    //calculated door x and y coords
    doorx = xloc;
    doory = grd;

  //door in right
  } else if (dir == 3){
    //pos in wall exluding corner
    pos = Math.floor(Math.random() * (h - 2) + 1);
    //space before
    spc = yloc;
    //grid position
    grd = pos + spc;
    //calculated door x and y coords
    doorx = xloc + (w - 1);
    doory = grd;

  };

  //add new door to existing door and floor arrays
  door.x.push(doorx);
  door.y.push(doory);
  floor.x.push(doorx);
  floor.y.push(doory);

  insertDoor(doorx, doory);

  //find x and y coords in room array and splice space for door
  function insertDoor(doorx, doory){

    let len = room.x.length;

    for(let i = 0; i < len; i++){
      if(doorx == room.x[i]){ 
        //if matching x found, check y
        if (doory == room.y[i]){ 
          room.x.splice(i, 1);
          room.y.splice(i, 1);
        };
      };
    };
  };

  // console.log("pos: " + pos + " spc: " + spc + " grd: " + grd + " grda: " + grda);

};

//print all walls
function addWalls(){
  for(let i = 0; i < wall.x.length; i++){
    $("#" + wall.y[i] + "-" + wall.x[i]).text("");
    $("#" + wall.y[i] + "-" + wall.x[i]).addClass("wall");
  };
};

//remove all walls
function remWalls(){
  for(let i = 0; i < wall.x.length; i++){
    $("#" + wall.y[i] + "-" + wall.x[i]).text("");
    $("#" + wall.y[i] + "-" + wall.x[i]).removeClass("wall");
  };

  wall = {
    y : [],
    x : [],
  };

};

//print specific door
function addDoor(){
  for(let i = 0; i < door.x.length; i++){
    $("#" + door.y[i] + "-" + door.x[i]).text("+");
    $("#" + door.y[i] + "-" + door.x[i]).addClass("door");
  };
};

//find and remove specific door from coordinates 'x' and 'y'
function remDoor(x, y){
  let len = door.x.length;
  for(let i = 0; i < len; i++){
    if(x == door.x[i]){ 
      //if matching x found, check y
      if (y == door.y[i]){ 
        //if matching y found, both coords must match
        //remove door from array and print
        $("#" + door.y[i] + "-" + door.x[i]).text("");
        $("#" + door.y[i] + "-" + door.x[i]).removeClass("door");
        door.x.splice(i, 1);
        door.y.splice(i, 1);
      };
    };
  };
};

//print all doors
function addDoors(){
  for(let i = 0; i < door.x.length; i++){
    $("#" + door.y[i] + "-" + door.x[i]).text("+");
    $("#" + door.y[i] + "-" + door.x[i]).addClass("door");
  };
};

//remove all doors
function remDoors(){
  for(let i = 0; i < door.x.length; i++){
    $("#" + door.y[i] + "-" + door.x[i]).text("");
    $("#" + door.y[i] + "-" + door.x[i]).removeClass("door");
    $("#" + door.y[i] + "-" + door.x[i]).removeClass("floor");
  };

  door = {
    y : [],
    x : [],
  };

};

//print all floors
function addFloors(){
  for(let i = 0; i < floor.x.length; i++){
    $("#" + floor.y[i] + "-" + floor.x[i]).addClass("floor");
  };
};

//remove all floors
function remFloors(){
  for(let i = 0; i < floor.x.length; i++){
    $("#" + floor.y[i] + "-" + floor.x[i]).removeClass("floor");
  };

  floor = {
    y : [],
    x : [],
  };

};

//select random monster from pool array and add to active monster array
function genMon2(){

    //generate number of monsters based upon numMon setting
    for (i = 0; i < numMon; i++){

      //pick a random monster from types
      const types = Object.keys(monData).length;
      let pick = Math.floor(Math.random() * (types));
    
      //asign that type to live monster array
      mon2[i] = Object.create(monData[pick]);
    
      //set moves, hp and live status
      mon2[i].chp = mon2[i].thp;
      mon2[i].live = true;
      mon2[i].mv = 0;

    };

};

//place monsters somwhere on floor
function plcMon2(){

  let cmon = 0;

  //place each monster in active array
  for(n = 0; n < mon2.length; n++){
    cmon = n;

    //gen random coords for monster, check if free
    for(let i = 0; i < 1;){
      //pick random location on floor
      rnd = Math.floor(Math.random() * (floor.x.length));
  
      x = floor.x[rnd];
      y = floor.y[rnd];
  
      if(checkLoc(x, y) == false){
        mon2[cmon].x = x;
        mon2[cmon].y = y;
        addMon2(mon2[cmon]);
        i = 1;
        break;
      };
  
      i = 0;
  
    };

  };

};

//defeat target entity monster
function delMon2(ent){
  remMon2(ent);
  ent.x = 0;
  ent.y = 0;
  ent.live = false;
};

//add target entity monster
function addMon2(ent){
  $("#"+ ent.y + "-" + ent.x).text(ent.t);
  $("#"+ ent.y + "-" + ent.x).addClass("monster");
};

//remove target entity moster
function remMon2(ent){
  $("#"+ ent.y + "-" + ent.x).text("");
  $("#"+ ent.y + "-" + ent.x).removeClass("monster");
};

//remove all mosters
function remAllMon2(){
  for(let i = 0; i < mon2.length; i++){
    $("#"+ mon2[i].y + "-" + mon2[i].x).text("");
    $("#"+ mon2[i].y + "-" + mon2[i].x).removeClass("monster");
  };
};

//remove all active monsters from game and array
function cleanupMons(){
  remAllMon2();
  mon2 = [];
};

//check if coords match player position
//return true on match and false if not
function checkPlayer(x, y){
  if (x == player.x && y == player.y){
    return true;
  } else {
    return false;
  };
};

//check if coords match any monster position
//return true on match and false if not
function checkMon(x, y){

  //for each active monster
  for(let i = 0; i < mon2.length; i++){

    //check coords and return if match found
    if (x == mon2[i].x && y == mon2[i].y){
      return true;
    };

  };

  //if not match found, return false
  return false;

};

//check if coords match any monster position
//return true on match and false if not
function checkLoot(x, y){

  //for each active monster
  for(let i = 0; i < loot.length; i++){

    //check coords and return if match found
    if (x == loot[i].x && y == loot[i].y){
      return true;
    };

  };

  //if not match found, return false
  return false;

};

//check if coords match exit position
//return true on match and false if not
function checkExt(x, y){
  if (x == level.extx && y == level.exty){
    // console.log("exit!");
    return true;
  } else {
    return false;
  };
};

//check if coords match entrance position
//return true on match and false if not
function checkEnt(x, y){
  if (x == level.entx && y == level.enty){
    // console.log("entrance!");
    return true;
  } else {
    return false;
  };
};

//for a given entity 'ent' and direction 'dir' returns coords for that direction
function getDirCoords(ent, dir){

  let x = 0;
  let y = 0;

  if (dir == "u"){
    x = ent.x;
    y = ent.y - 1;
  };
  if (dir == "d"){
    x = ent.x;
    y = ent.y + 1;
  };
  if (dir == "l"){
    x = ent.x - 1;
    y = ent.y;
  };
  if (dir == "r"){
    x = ent.x + 1;
    y = ent.y;
  };
  if (dir == "ul"){
    x = ent.x - 1;
    y = ent.y - 1;
  };
  if (dir == "ur"){
    x = ent.x + 1;
    y = ent.y - 1;
  };
  if (dir == "dl"){
    x = ent.x - 1;
    y = ent.y + 1;
  };
  if (dir == "dr"){
    x = ent.x + 1;
    y = ent.y + 1;
  };
  if (dir == "c"){
    x = ent.x;
    y = ent.y;
  };

  return [x, y];

};

//checks given coordinates 'x' and 'y' for any object
//returns true if an object is found, false if empty
function checkLoc(x, y){

  //check for player
  let chkpl = checkPlayer(x, y);

  //check for player
  let chkmo = checkMon(x, y);

  //check for entrance
  let chken = checkEnt(x, y);

  //check for entrance
  let chkex = checkExt(x, y);

  //check for walls
  let chkwa = checkArry(x, y, wall);

  //check for walls
  let chkdo = checkArry(x, y, door);

  if(chkpl == false && chkmo == false && chken == false && chkex == false && chkwa == false && chkdo == false){
    return false;
  };
    
  return true;
  
};

//checks given cardinal direction 'dir' from given entity 'ent' for object
function checkDir(ent, dir){

  let x = 0;
  let y = 0;

  if (dir == "u"){
    x = ent.x;
    y = ent.y - 1;
  };
  if (dir == "d"){
    x = ent.x;
    y = ent.y + 1;
  };
  if (dir == "l"){
    x = ent.x - 1;
    y = ent.y;
  };
  if (dir == "r"){
    x = ent.x + 1;
    y = ent.y;
  };
  if (dir == "ul"){
    x = ent.x - 1;
    y = ent.y - 1;
  };
  if (dir == "ur"){
    x = ent.x + 1;
    y = ent.y - 1;
  };
  if (dir == "dl"){
    x = ent.x - 1;
    y = ent.y + 1;
  };
  if (dir == "dr"){
    x = ent.x + 1;
    y = ent.y + 1;
  };

  if(checkPlayer(x, y)){
    return "player";
  };

  if(checkMon(x, y)){
    return "mon";
  };

  if(checkArry(x, y, wall)){
    return "wall";
  };

  if(checkArry(x, y, door)){
    return "door";
  };

  if(checkExt(x, y)){
    return "exit";
  };

  if(checkEnt(x, y)){
    return "ent";
  };

  if(checkLoot(x, y)){
    return "loot";
  };

  return "empty";

};

//checks for object at given coords 'x' and 'y' for given array 'arry'
//returns true if object found at coords, else return false if no object
function checkArry(x, y, arry){
  
  //object to check for obstruction
  let len = arry.x.length;

  //cycle through each x for match of given 'x'
  for(let i = 0; i < len; i++){
    if(x == arry.x[i]){ 
      //if matching x found, check y
      if (y == arry.y[i]){ 
        //if matching y found, both coords must match
        return true;
      };
    };
  };

  //after cycling though all arry and no object found, return false
  return false;

};

//given direction from entity, finds the target of an attack
//returns target array
function getTarget(ent, dir){

  let x = 0;
  let y = 0;

  let target = [];

  if (dir == "u"){
    x = ent.x;
    y = ent.y - 1;
  };
  if (dir == "d"){
    x = ent.x;
    y = ent.y + 1;
  };
  if (dir == "l"){
    x = ent.x - 1;
    y = ent.y;
  };
  if (dir == "r"){
    x = ent.x + 1;
    y = ent.y;
  };
  if (dir == "ul"){
    x = ent.x - 1;
    y = ent.y - 1;
  };
  if (dir == "ur"){
    x = ent.x + 1;
    y = ent.y - 1;
  };
  if (dir == "dl"){
    x = ent.x - 1;
    y = ent.y + 1;
  };
  if (dir == "dr"){
    x = ent.x + 1;
    y = ent.y + 1;
  };

  //for each active monster
  for(let i = 0; i < mon2.length; i++){

    //check coords and return if match found
    if (x == mon2[i].x && y == mon2[i].y){
      target = mon2[i];
      return target;
    };

  };

  //for the player
  if (x == player.x && y == player.y){
    target = player;
    return target;
  };
  
};

//find loot at given coords and return array position in loot array
function lookupLoot(x, y){

  let len = loot.length;

  //cycle through each x for match of given 'x'
  for(let i = 0; i < len; i++){
    if(x == loot[i].x){ 
      //if matching x found, check y
      if (y == loot[i].y){ 
        //if matching y found, both coords must match
        return loot[i];
      };
    };
  };
};


//print player
function addPlr(){
  $("#"+ player.y + "-" + player.x).text("@");
  $("#"+ player.y + "-" + player.x).addClass('player');
};

//erase player
function remPlr(){
  $("#"+ player.y + "-" + player.x).text("");
  $("#"+ player.y + "-" + player.x).removeClass('player');
};

//player movement logic, 
//checks for blockers and interactions upon movement
function moveP(ent, dir){
  //check if game started
  if (begin == true){

    if(dir == "c"){
      moves++;
      monTurn();
      return;
    };

    //check if destination is in bounds
    if(checkBounds(ent, dir)){

      //check for object at destination
      let check = checkDir(ent, dir);

      if (check == "player"){
        // console.log("found player!");
        return;

      } else if (check == "mon"){
        // console.log("found monster!");
        //attack monster
        let target = getTarget(ent, dir);
        attack(ent, target);
        moves++;
        monTurn();
        return;

      } else if (check == "wall"){
        console.log("found wall");
        return;

      } else if (check == "door"){
        console.log("found door");
        openDoor(dir);
        return;

      } else if (check == "exit"){
        console.log("found exit!");
        nextLevel();
        return;

      } else if (check == "ent"){
        console.log("found entrance!");
        return;

      } else if (check == "loot"){
        let lc = getDirCoords(ent, dir);
        let lt = lookupLoot(lc[0], lc[1]);
        getLoot(lt);
        remLoot(lt);
        addHud();
        console.log("found " + lt.t + lt.qty);
      };

      //allow movement
      remPlr();
      remLight(ent);
      move1(ent, dir);
      movCam();
      addEnt();
      addExt();
      addAllLoot();
      addPlr();
      addLight(ent);
      moves++;
      monTurn();

    };
  };
};

//monsters turn
function monTurn(){

  //each active monster takes a turn
  for(let i = 0; i < mon2.length; i++){

    //if still live, take turn
    if (mon2[i].live == true){
      if(mon2[i].mv == mon2[i].delay){
        mon2[i].mv = 0;
        moveM(mon2[i]);
      } else {
        mon2[i].mv++;
      };

    };

  };

};

//monster movement logic, 
//checks for blockers and interactions upon movement
function moveM(ent){
  //check if game started
  if (begin == true){

    let dir = monMoveDir(ent);

    if(dir == "c"){
      return;
    };

    //check if move is in bounds
    if(checkBounds(ent, dir)){

      let check = checkDir(ent, dir);

      if (check == "player"){
        // console.log("found player!");
        //attack player
        let target = getTarget(ent, dir);
        attack(ent, target);
        return;

      } else if (check == "mon"){
        // console.log("found monster!");
        return;

      }else if (check == "wall"){
        // console.log("found wall!");
        return;

      } else if (check == "door"){
        // console.log("found door!");
        return;

      }else if (check == "exit"){
        // console.log("found exit!");
        return;

      } else if (check == "ent"){
        // console.log("found entrance!");
        return;
      };
      
      if (check == "empty"){
          //allow movement
          remMon2(ent);
          move1(ent, dir);
          addAllLoot();
          addMon2(ent);
      };

    };
  };
};

//move entity 'ent' one tile in direction 'dir'
function move1(ent, dir){
  if(dir == "u"){
    ent.y -= 1;
  } else if(dir == "d"){
    ent.y += 1;
  } else if(dir == "l"){
    ent.x -= 1;
  } else if(dir == "r"){
    ent.x += 1;
  } else if(dir == "ul"){
    ent.x -= 1;
    ent.y -= 1;
  } else if(dir == "ur"){
    ent.x += 1;
    ent.y -= 1;
  } else if(dir == "dl"){
    ent.x -= 1;
    ent.y += 1;
  } else if(dir == "dr"){
    ent.x += 1;
    ent.y += 1;
  };
};

//checks if entity movement will be out of level bounds
//returns true if within bounds, return false if move is out of bounds
function checkBounds(ent, dir){
  if(dir == "u"){
    if (ent.y != 1){
      return true;
    };
  } else if(dir == "d"){
    if (ent.y != level.h){
      return true;
    };
  } else if(dir == "l"){
    if (ent.x != 1){
      return true;
    };
  } else if(dir == "r"){
    if (ent.x != level.w){
      return true;
    };
  } else if(dir == "ul"){
    if (ent.x != 1 && ent.y != 1){
      return true;
    };
  } else if(dir == "ur"){
    if (ent.x != level.w && ent.y != level.h){
      return true;
    };
  } else if(dir == "dl"){
    if (ent.x != 1 && ent.y != level.h){
      return true;
    };
  } else if(dir == "dr"){
    if (ent.x != level.w && ent.y != level.h){
      return true;
    };
  };
  return false;
};

//when moving (bumping) into a door
function openDoor(dir){

  //grab coords of door
  let d = getDirCoords(player, dir);
  let x = d[0];
  let y = d[1];

  //remove door
  console.log("opening door!");
  remDoor(x, y);

};

//when moving (bumping) into another entity monster/player
function attack(ent, tar){

  //roll for attack chance to hit
  //if attack == defense, hit chance is 50%
  //if attack is double defense, then hit chance is max
  let hitChance = (ent.atk / (tar.def * 2)) * 100;
  let hitRoll = Math.floor(Math.random() * (100) + 1);
  //chance to hit min 5%, max 95%
  if (hitChance < 5){
    hitChance = 5;
  };
  if (hitChance > 95){
    hitChance = 95;
  };

  console.log(ent.name + " attacks " + tar.name + " (hit chance: " + hitChance + "%)");

  if(hitRoll <= hitChance){
    //roll for damage
    let damage = Math.floor(Math.random() * (ent.dmax) + (ent.dmin));
    let life = tar.chp;
    console.log(ent.name + " hits " + tar.name + " for " + damage + " damage");
    life = life - damage;
    tar.chp = life;
    addHud();
  } else {
    console.log(ent.name + " misses " + tar.name);
  };

  //if monster defeated, remove monster and award experience
  if(tar != player && tar.chp <= 0){
    console.log(tar.name + " defeated!");
    console.log("Player gains " + tar.gxp + " experience!");
    dropLoot(tar);
    delMon2(tar);
    player.exp += tar.gxp;
    levelUp();
    addHud();
  };

  //if player defeated, game over
  if(tar == player && tar.chp <= 0){
    console.log(tar.name + " has been defeated!");
    console.log("Game Over.");
    loose();
  };

};

//checks for player level and applies level up stats
function levelUp(){
  if (player.exp >= expTable[player.lvl + 1]){
    player.lvl++;
    player.thp += 5;
    player.chp += 5;
    player.atk += 2;
    player.def += 2;
    console.log("Level Up! " + player.name + " is now Level " + player.lvl);
  };
};

//current entity (monster/chest etc.) drops loot randomly in empty space around it
function dropLoot(ent){

  //chance to drop loot (50%)
  let n = Math.floor(Math.random() * 2);

  if(n > 0){

  //check which locations are free around entity
  const check = ["u", "r", "l", "d", "ur", "ul", "dr", "dl"];
  let free = [];

  check.forEach(element => {
    if (checkDir(ent, element) == "empty"){
      free.push(element);
    };
  });

  //coordinates to drop loot on
  let c = Math.floor(Math.random() * free.length);

  //create random amount of gold in array
  loot.push(Object.create(lootData[0]));
  let k = loot.length - 1;
  loot[k].qty = Math.floor(Math.random() * 3) + 1;
  let coords = getDirCoords(ent, free[c]);
  loot[k].x = coords[0];
  loot[k].y = coords[1];
  
  //draw all loot on level
  addAllLoot();

  };

};

//draw all loot
function addAllLoot(){
  for(let i = 0; i < loot.length; i++){
    $("#" + loot[i].y + "-" + loot[i].x).text(loot[i].t);
    $("#" + loot[i].y + "-" + loot[i].x).addClass("loot");
  };
};

function remAllLoot(){
  for(let i = 0; i < loot.length; i++){
    $("#" + loot[i].y + "-" + loot[i].x).text("");
    $("#" + loot[i].y + "-" + loot[i].x).removeClass("loot");
  };
};

//remove all loot from game and array
function cleanupLoot(){
  remAllLoot();
  loot = [];
};


//remove specific loot 'l' from array
function remLoot(l){
  $("#" + l.y + "-" + l.x).text("");
  $("#" + l.y + "-" + l.x).removeClass("loot");
  l.x = 0;
  l.y = 0;
};

//add specific loot 'l' at to inventory
function getLoot(lt){
  if(lt.t == "$"){
    player.gold += lt.qty;
  };
};

//monster entity movement direction logic based on monster logi
function monMoveDir(ent){

  let dir = "";

  let disx = Math.abs(player.x - ent.x);
  let disy = Math.abs(player.y - ent.y);

  // console.log(disx + " " + disy);

  if(ent.logi == "ra"){
    if (disx <= 4 && disy <= 4){
      dir = movToPlr(ent);
    } else {
      dir = movRnd();
    };
  } else if (ent.logi == "ga"){
    if (disx <= 6 && disy <= 6){
      dir = movToPlr(ent);
    } else {
      dir = "c";
    };
  } else if (ent.logi == "rh"){
    if (disx <= 8 && disy <= 8){
      dir = movToPlr(ent);
    } else {
      dir = movRnd();
    };
  };

  return dir;

};

//generate random direction
function movRnd(){
  let dir = "";
  //gen random direction
  let rng = Math.floor(Math.random() * 9);
  if (rng == 1){
    dir = "u";
  };
  if (rng == 2){
    dir = "d";
  };
  if (rng == 3){
    dir = "l";
  };
  if (rng == 4){
    dir = "r";
  };
  if (rng == 5){
    dir = "ul";
  };
  if (rng == 6){
    dir = "ur";
  };
  if (rng == 7){
    dir = "dl";
  };
  if (rng == 8){
    dir = "dr";
  };
  if (rng == 0){
    dir = "c";
  };
  return dir;
};

//generate direction towards player
function movToPlr(ent){

  let dir = "";

  let disx = player.x - ent.x;
  let disy = player.y - ent.y;

  // console.log("distance to player:" + " x " + disx + " y " + disy)
  
  //check cardinally first
  //player above
  if (disx == 0 && disy < 0){
    dir = "u";
  //player below
  } else if (disx == 0 && disy > 0) {
    dir = "d";
  //player left
  } else if (disy == 0 && disx < 0){
    dir = "l";
  //player right
  } else if (disy == 0 && disx > 0) {
    dir = "r";

  //check diagonally
  //player nw
  } else if (disx < 0 && disy < 0){
    dir = "ul";
  //player ne
  } else if (disx > 0 && disy < 0) {
    dir = "ur";
  //player sw
  } else if (disx < 0 && disy > 0){
    dir = "dl";
  //player se
  } else if (disx > 0 && disy > 0) {
    dir = "dr";
  };

  // console.log(dir);
  return dir;

};