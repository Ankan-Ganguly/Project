var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
//create feed and lastFed variable here
var feed, lastFed, fedTime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  var fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })
 
  //write code to display text lastFed time here
  if (lastFed>=12){
    fill(255,255,254);
    textSize(15);
    text("Last Feed: "+ lastFed%12 +"P.M.", 350, 30);
  }
    else if(lastFed == 0){
      fill(255,255,254);
    textSize(15);
      text("Last Feed: 12 A.M.", 350, 30);
    }
   else{
    fill(255,255,254);
    textSize(15);
     text("Last Feed: "+ lastFed, 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  //write code here to update food stock and last fed time
  var foodStock=foodObj.getFoodStock();
  if(foodStock <= 0){
    foodObj.updateFoodStock(0);
  }
  else{
    foodObj.updateFoodStock(foodStock-1);
  }
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime: hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

