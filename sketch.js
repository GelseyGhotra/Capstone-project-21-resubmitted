var PLAY = 1;
var END = 0;
var gameState = PLAY;

var invisibleGround, background_1, backgroundImage;

var girl, girl_running, girl_collided;
var trashcanGroup, trashcan_1, trashcan_2, trashcan_3, trashcan_4;

var score;

var gameoverImg,gameOver, restartImg;
var jumpSound , checkPointSound, dieSound; 




function preload(){
    girl_running = loadAnimation("girl_running_1.png", "girl_running_2.png");
    girl_collided = loadAnimation("girl_fallen_over.png");

    backgroundImage = loadImage("deserted_street_background.png");

    invisibleGround = loadImage("ground2.png");
    
    trashcan_1 = loadImage("trashcan_1.png");
    trashcan_2 = loadImage("trashcan_2.png");
    trashcan_3 = loadImage("trashcan_3.png");
    trashcan_4 = loadImage("trashcan_4.png");
    
    restartImg = loadImage("restart_img.png");
    gameoverImg = loadImage("gameover_img.png");
    
    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("die.mp3");
    checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
 
  createCanvas(600, 400);

  background_1 = createSprite(600,200,600,200);
  background_1.addImage("background_1",backgroundImage);
  background_1.x = background_1.width /2;
  
  girl = createSprite(50,250,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("collided", girl_collided);
  

  girl.scale = 0.2;
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameoverImg);

  
  restart = createSprite(300,200);
  restart.addImage(restartImg);
  

  gameOver.scale = 0.2;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(200,300,400,10);
  invisibleGround.visible = false;
  
  
  //create trashcan Groups
  trashcanGroup = createGroup();
 

  
  girl.setCollider("circle",0,0,30);
  girl.debug = true;

  score = 0;
 
  
}

function draw() {
   
  background(180);
  //displaying score
  textSize(15);
  stroke("red");
  text("Score: "+ score, 500,50);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    background_1.velocityX = -(4 + 3* score/100);
    invisibleGround.velocityX = -(4 + 3* score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play();
    }
    
    if (background_1.x < 0){
      background_1.x = background_1.width/2;
    }

    if (invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& girl.y >= 160) {
        girl.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    girl.velocityY = girl.velocityY + 0.8;
  
  
    //spawn Trashcans on the ground
    spawnTrashcan();
    
    if(trashcanGroup.isTouching(girl)){

        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the girl animation
      girl.changeAnimation("collided", girl_collided);
    
     
     
      invisibleGround.velocityX = 0;
      background_1.velocityX = 0;
      girl.velocityY = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
     trashcanGroup.setLifetimeEach(-1);
 
    
     trashcanGroup.setVelocityXEach(0);
      
   }
  
 
  //stop girl from falling down
  girl.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}


function reset(){
  gameState = PLAY; 

  gameOver.visible = false;

  restart.visible = false;

  girl.changeAnimation("running", girl_collided);

  trashcanGroup.destroyEach();

  score = 0;

}


function spawnTrashcan(){
 if (frameCount % 60 === 0){
   var trashcan = createSprite(600,290,10,30);
   trashcan.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: trashcan.addImage(trashcan_1);
              break;
      case 2: trashcan.addImage(trashcan_2);
              break;
      case 3: trashcan.addImage(trashcan_3);
              break;
      case 4: trashcan.addImage(trashcan_4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the trashcans          
    trashcan.scale = 0.4;
    trashcan.lifetime = 300;
   
   //add each obstacle to the group
    trashcanGroup.add(trashcan);
 }
}
