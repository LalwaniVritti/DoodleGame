var gap=0
var num=30
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var direction
var doodle,doodleImage;
var ground, invisibleGround;
var platform1,platform2,platform3,platform4,platform5,platform6;

var platformGroup;
var p, pImage;


var score=0;
var jumpSound , checkPointSound, dieSound;
var gameOver, restart;


function preload(){
  
  doodleImage=loadImage("images/jack2.png");
  pImage = loadImage("images/platform.png");
  
  platform1 = loadImage("images/platform1.png");
  platform2 = loadImage("images/platform2.png");
  platform3 = loadImage("images/platform3.png");
  platform4 = loadImage("images/platform4.png");
  platform5 = loadImage("images/platform5.png");
  platform6 = loadImage("images/platform6.png");
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(500, 600);
  
  doodle = createSprite(250,300,20,50);
  
  doodle.addImage(doodleImage);
  doodle.scale = 1;
  doodle.setCollider("circle",0,30,10);
  //doodle.debug=true;
  doodle.depth=10000;
  
  p = createSprite(250,350);
  p.addImage(pImage);
  p.scale=0.5;
  
  gameOver = createSprite(250,250);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(250,300);
  restart.addImage(restartImg);
  

  gameOver.visible = false;
  restart.visible = false;
  invisibleGround = createSprite(250,600,500,10);
  invisibleGround.visible = false;
  platformGroup = new Group();
  
  score = 0;
}

function draw() {
  //doodle.debug = true;
  background('#F2F5B6');
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    doodle.collide(p)
    //score = score + Math.round(frameCount/100);

    // to restart the game frameCount can not be reset, so using frameRate
    score = score + Math.round(getFrameRate()/60)
    
    // //jump when the space key is pressed
    if(platformGroup.isTouching(doodle) && doodle.velocityY>5) {
      doodle.velocityY = -16;
       jumpSound.play();
    }
    
    if(keyDown("space")) {
      p.y=700;
      doodle.velocityY = -16;
       jumpSound.play();
      invisibleGround.velocityY=2
    }
 
    if(keyDown("left"))
      {
        doodle.x-=7
      }
    
    if(keyDown("right"))
      {
        doodle.x+=7
      }
    
    //add gravity
    doodle.velocityY = doodle.velocityY + 0.8
    doodle.collide(invisibleGround);
    spawnplatforms();
  
    if(doodle.y>500){
        gameState = END;
       dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0  
    doodle.velocityY = 2;
    platformGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    platformGroup.setLifetimeEach(-1);   

    //to restart the game click on restart
    if(mousePressedOver(restart)){
        reset();
    }
  }
  
  platformGroup.displace(invisibleGround)
  textSize(20);
  fill(0);
  text(" Score  :  " + score, 350,50);
  
  drawSprites();
}

function reset(){
  doodle.x = 250;
  doodle.y=300;
  p.y=350;
  gameState = PLAY;
  platformGroup.destroyEach();
  score = 0;
  restart.visible = false;
  gameOver.visible= false;
  doodle.velocityY = -5;
}



function spawnplatforms() {

  if(frameCount % num == 0) {
    xx=Math.round(random([50,100,200,300,400,500]))
    var platform = createSprite(xx,-10,150,20);
    platform.setCollider("rectangle",0,0,50,14);
    platform.velocityY = 4;
    //platform.debug=true
    platform.depth=0

    var r = Math.round(random(1,6))
    switch(r){
      case 1 : platform.addImage(platform1);
      platform.setCollider("rectangle",0,-5,50,14);
      break;
      case 2 : platform.addImage(platform2);
      break;
      case 3 : platform.addImage(platform3);
      break;
      case 4 : platform.addImage(platform4);
      break;
      case 5 : platform.addImage(platform5);
      break;
      case 6 : platform.addImage(platform6);
      break;
      default: break;
    }
 
    //assign scale and lifetime to the platform           
    platform.scale = 2;
    //platform.setCollider("rectangle",30,-100,600,20);
    platform.lifetime = 300;
    //add each platform to the group
    platformGroup.add(platform);
    num =num+gap
   
  if(frameCount% 200==0)
  {
    gap=gap+1
  }  
}

}

