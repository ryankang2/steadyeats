$(document).ready(initializeApp);

let food = sessionStorage.getItem("setFood");
let response = localStorage.getItem("resp");

/**
 * Once DOM is ready, get nutrition from server and add animations
 * to submit and reset button
 */
function initializeApp(){
    $(".submit").addClass("scale-in");
    $("#reset").addClass("scale-in");
    displayFood(JSON.parse(response));
}

function displayFood(jsonResponse){
    let src = jsonResponse.foods[0].photo.highres;
    if(!src){
        src = "../img/noimage.png";
    }
    let img = $("<img>").attr("src", src);
     $("#pic").html(img);
    storeNutritionToDOM(jsonResponse.foods[0])
}


/**
 * Updates DOM with nutrition facts
 * @param  {} foodObj the food object retrieved from nutrition api
 */
function storeNutritionToDOM (foodObj) {
   $(".serving").text(foodObj.serving_qty + " " + foodObj.serving_unit);
   $(".calories").text(foodObj.nf_calories + " cal");
   $(".carbohydrate").text(foodObj.nf_total_carbohydrate + " g");
   $(".protein").text(foodObj.nf_protein + " g");
   $(".fat").text(foodObj.nf_total_fat + " g");
   if(foodObj.nf_sugars === null){
    foodObj.nf_sugars = 0;
   }
   $(".sugar").text(foodObj.nf_sugars + " g");
   if(foodObj.nf_sodium === null){
    foodObj.nf_sodium = 0;
   }
   $(".sodium").text(foodObj.nf_sodium + " mg");
   if(foodObj.nf_cholesterol === null){
    foodObj.nf_cholesterol = 0;
   }
   $(".cholesterol").text(foodObj.nf_cholesterol + " mg");
}