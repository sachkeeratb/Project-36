//Create variables here
var dog, dogIMG, deadDogIMG, happyDog, database, washingDogIMG;
var feed, addFood, fedTime, lastFed, foodOBJ, foodS, foodStock;;
var changingGameState, readingGameState, currenttime;

var gameState = "hungry";

function preload()
{
  //load images here
  
  dogIMG = loadImage("images/Dog.png");

  happyDog = loadImage("images/HappyDog.png");

  deadDogIMG = loadImage("images/deadDog.png");

  garden = loadImage("Images/Garden.png");

  washroom = loadImage("Images/Wash Room.png");

  bedroom = loadImage("Images/Bed Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 1000);

  foodOBJ = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  fedTime=database.ref('fedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val;
  });

  dog=createSprite(800,200,150,150);
  dog.addImage(dogIMG);
  dog.scale = 0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {  
  background(46,139,87);

  currentTime=hour();

  if(currentTime===(lastFed+1)){
    update("playing");
    foodOBJ.garden();
  }else if(currentTime===(lastFed+2)){
    update("sleeping");
    foodOBJ.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodOBJ.washroom();
  }else{
    update("hungry");
    foodOBJ.display();
  }

  if(gameState === "hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  } else{
    feed.show();
    addFood.show();
    dog.addImage(dogIMG);
  }

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodOBJ.updateFoodStock(foodS);
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(dogIMG);

  foodOBJ.updateFoodStock(foodOBJ.getFoodStock()-1);
  database.ref('/').update({
    Food:foodOBJ.getFoodStock(),
    fedTime:hour(),
    gameState: "hungry"
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}