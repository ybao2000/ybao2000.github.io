// we get the context from html
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.fillStyle = "white";
var myInterval;
var WIDTH = 400;
var HEIGHT = 500;
var score = 0;    // this is going to be the score you made
var frameCount = 0; // this is to count of frames, because we need this to add more enemies
var isLost = false;
var background_music = document.getElementById("background_music");
var bullet_music = document.getElementById("bullet_music");
var btnStart = document.getElementById("btnStart");
var logo = document.getElementById("logo");
var level = 0;
var scoreLevel = 50;
var start = true;

// this is the list for enemy1
var imgList_enemy1 = [];
img_enemy1 = new Image();
img_enemy1.src = "img/enemy1.png";
imgList_enemy1.push(img_enemy1);
img_explosion = new Image();
img_explosion.src = "img/explosion_effect2.png";
imgList_enemy1.push(img_explosion);

var imgList_enemy2 = [];
img_enemy2 = new Image();
img_enemy2.src = "img/enemy2.png";
imgList_enemy2.push(img_enemy2);
img_enemy2_2 = new Image();
img_enemy2_2.src = "img/enemy2_2.png";
imgList_enemy2.push(img_enemy2_2);
img_enemy2_3 = new Image();
img_enemy2_3.src = "img/enemy2_3.png";
imgList_enemy2.push(img_enemy2_3);
img_enemy2_4 = new Image();
img_enemy2_4.src = "img/enemy2_4.png";
imgList_enemy2.push(img_enemy2_4);  
imgList_enemy2.push(img_explosion);

imgList_boss = [];
img_boss = new Image();
img_boss.src = "img/boss.png";
imgList_boss.push(img_boss);
img_boss_2 = new Image();
img_boss_2.src = "img/boss_2.png";
imgList_boss.push(img_boss_2);
img_boss_3 = new Image();
img_boss_3.src = "img/boss_3.png";
imgList_boss.push(img_boss_3);
img_boss_4 = new Image();
img_boss_4.src = "img/boss_4.png";
imgList_boss.push(img_boss_4);
img_boss_5 = new Image();
img_boss_5.src = "img/boss_5.png";
imgList_boss.push(img_boss_5);
img_boss_6 = new Image();
img_boss_6.src = "img/boss_6.png";
imgList_boss.push(img_boss_6);
imgList_boss.push(img_explosion);

class Background {
  constructor() {
    this.img = new Image();
    this.img.src = "img/background1.jpg";
    this.img.top = 0;
  }
  
  draw() {
    ctx.drawImage(this.img, 0, this.img.top, WIDTH, HEIGHT);
    ctx.drawImage(this.img, 0, this.img.top - HEIGHT, WIDTH, HEIGHT);
  }

  update() {
    this.img.top++;
    if (this.img.top > HEIGHT){
      this.img.top = 0;
    }
    this.draw();
  }
}

// we are going to define a Player class
class Player {
  // you need a constructor
  constructor(id, x, y){
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 40;
    // we need to convert src into image
    this.img = new Image();
    this.img.src = "img/player.png";
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);     
  }
}

class Enemy {
  constructor(id,type, x, y, speed){
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  adjustPosition() {
    // we adjust the x, don't let x to be too left, or too right
    if (this.x < this.width){
      this.x = this.width;
    }
    else if(this.x > WIDTH - this.width){
      this.x = WIDTH - this.width;
    }
  }
  updatePosition() {
    this.y += this.speed;
    return this.y <= HEIGHT;
  }
  draw() {
    ctx.drawImage(this.imgList[this.hp_max-this.hp], this.x, this.y, this.width, this.height);     
  }
}

class Enemy1 extends Enemy {
  constructor(id, x, y, speed){
    super(id, 1, x, y, speed);
    this.width = 28;
    this.height = 35;
    this.imgList = imgList_enemy1;
    this.hp = 1;  
    this.hp_max = 1;
    this.score = 1; 
    this.adjustPosition();
  }
}

class Enemy2 extends Enemy {
  constructor(id, x, y, speed){
    super(id, 2, x, y, speed);
    this.width = 45;
    this.height = 35;
    this.imgList = imgList_enemy2;
    this.hp = 4;  
    this.hp_max = 4;
    this.score = 5; 
    this.adjustPosition();
  }
}

class Boss extends Enemy {
  constructor(id, x, y, speed){
    super(id, 3, x, y, speed);
    this.width = 106;
    this.height = 104;
    this.imgList = imgList_boss;
    this.hp = 6;  
    this.hp_max = 6;
    this.score = 10; 
    this.adjustPosition();
  }
}

class Bullet {
  constructor(id, x, y, speed){
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 12;
    this.height = 22;
    this.img = new Image();
    this.img.src = "img/bullet.png";
  }
  updatePosition() {
    this.y -= this.speed;
    return this.y >= 0;
  }   
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);     
  } 
}

function addBullet(){
  var id = Math.random();
  var x = player.x + player.width/2;
  var y = player.y;
  var bullet = new Bullet(id, x, y, 10);
  bullet_music.muted = false;
  bullet_music.currentTime =0;
  bullet_music.play();
  bulletList[id] = bullet;
}
// we are going to randomly generate the enmey
// probability - enemy1 appear frequently, enemy2, boss
function addRandomEnemy(){
  var id = Math.random();
  var x = WIDTH * Math.random();
  var num = Math.floor(Math.random() * 10) + 1;
  if (num <= 5){  // if num = 1, 2, 3, 4, 5
    enemy = new Enemy1(id, x, 0, 5+level);
  }
  else if(num <= 8){  // if num = 6, 7, 8
    enemy = new Enemy2(id, x, 0, 3+level);
  }
  else {  // if num = 9, 10
    enemy = new Boss(id, x, 0, 2+level);
  }
  enemyList[id] = enemy;
}

function checkCollision(entity1, entity2){
  var left1 = entity1.x;
  var top1 = entity1.y;
  var right1 = entity1.x + entity1.width;
  var bottom1 = entity1.y + entity1.height;
  var left2 = entity2.x;
  var top2 = entity2.y;
  var right2 = entity2.x + entity2.width;
  var bottom2 = entity2.y + entity2.height;
  return (left1 > left2 && left1 < right2 && top1 > top2 && top1 < bottom2) ||
          (right1 > left2 && right1 < right2 && top1 > top2 && top1 < bottom2) ||
          (left1 > left2 && left1 < right2 && bottom1 > top2 && bottom1 < bottom2) ||
          (right1 > left2 && right1 < right2 && bottom1 > top2 && bottom1 < bottom2) ||
          (left2 > left1 && left2 < right1 && top2 > top1 && top2< bottom1) ||
          (left2 > left1 && left2 < right1 && bottom2 > top1 && bottom2 < bottom1)||
          (right2 > left1 && right2 < right1 && top2 > top1 && top2 < bottom1) ||
          (right2 > left1 && right2 < right1 && bottom2 > top1 && bottom2 < bottom1);
}

// we are going to update Player using mouse
document.onmousemove = function(mouse) {
  mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
  mouseY = mouse.clientY - canvas.getBoundingClientRect().top;

  //makesure mouseX, mouseY are always inside the canvas
  if(mouseX < player.width/2){
    mouseX = player.width/2;
  }
  else if (mouseX > WIDTH - player.width/2){
    mouseX = WIDTH - player.width/2;
  }
  if (mouseY < player.height/2){
    mouseY = player.height/2;
  }
  else if(mouseY > HEIGHT - player.height/2){
    mouseY = HEIGHT - player.height/2;
  }

  player.x = mouseX - player.width/2;
  player.y = mouseY - player.height/2;
}

var background = new Background();
var player = new Player(0, 180, HEIGHT);
var bulletList = {};
var enemyList = {};

// we are going to use startNewGame() to reset every thing
function startNewGame(){
  isLost = false;
  frameCount = 0;
  score = 0;
  enemyList = {}; // reset enemey list
  bulletList = {};  // reset bullet list
  background_music.play();
}

function update() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT); // this is to clean up everything
  background.update();
  frameCount++;   // every time update, just increate frameCount by 1
  if (frameCount % (55-5*level) === 0)   // if frameCount = 100, 200, 300, ..., add enemy, every 4 secs
  {
    addRandomEnemy();
  }

  if (frameCount % 10 === 0) // every 10 updates, we shoot bullet
  {
    addBullet();
  }

  for(var id in bulletList){
    var bullet = bulletList[id];
    if(bullet.updatePosition()){
      bullet.draw();
    }
    else {
      // we need to destroy the bullet
      delete bulletList[id];
      continue;
    }
    // check bullet with enemeies
    for(var id2 in enemyList){
      enemy = enemyList[id2];
      if(checkCollision(bullet, enemy)){
        // score += 1;
        // delete enemyList[id2];
        delete bulletList[id];
        enemy.hp--;
        break;
      }
    }
  }

  // you need to learn how to loop through enemyList
  for(var id in enemyList){
    var enemy = enemyList[id];
    if(enemy.hp <= 0){
      var newScore = score + enemy.score;
      if (score < scoreLevel && newScore > scoreLevel){
        level++;
        scoreLevel += 50;
      }
      score = newScore;
      delete enemyList[id];
      continue;
    }
    if(enemy.updatePosition()){
      enemy.draw();
    }
    else{
      delete enemy;
      continue;   // continue means don't execute the afterwards code
    }
    
    // if player collides with enemey, stop the game
    if(checkCollision(enemyList[id], player)){
      // console.log("Collision!")
      isLost = true;
      break;
    }
  }
  
  if (isLost) {
    clearInterval(myInterval);
    background_music.pause();
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillText("Game over!", 120, 300);
    ctx.restore();
    btnStart.style.display = "block";
    logo.style.display = "block";
  }
  else{
    player.draw();
  }
  ctx.fillText("score: " + score, 150, 25);
}

function onStart() {
  logo.style.display = "none";
  btnStart.style.display = "none";

  startNewGame();
  myInterval = setInterval(update, 40);  // 40 milli-seconds, 1 second = 1000 ms, 1 sec => 25 times
}

background.img.onload = function() {
  background.draw();
}