$(document).ready(initializeApp);

/**
 * Once DOM is ready, get nutrition from server and add animations
 * to submit and reset button
 */
function initializeApp(){
    let response = localStorage.getItem("resp");
    $(".submit").addClass("scale-in");
    $("#reset").addClass("scale-in");
    displayFood(JSON.parse(response));

}

/**
 * Displays picture of food to client and calls to storeNutritionToDOM and displayChart
 * @param jsonResponse, food item the user searched for
 */
function displayFood(jsonResponse){
    let src = jsonResponse.foods[0].photo.highres;
    if(!src){
        src = "../img/no_image.png";
    }
    let img = $("<img>").attr("src", src);
    $("#pic").append(img);    
    storeNutritionToDOM(jsonResponse.foods[0]);
    displayChart(jsonResponse.foods[0]);
}


/**
 * Updates DOM with nutrition facts
 * @param foodObj, the food object retrieved from nutrition api
 */
function storeNutritionToDOM (foodObj) {
   $(".serving").text(foodObj.serving_qty + " " + foodObj.serving_unit);
   $(".calories").text(foodObj.nf_calories + " cal");
   $(".carbohydrate").text(foodObj.nf_total_carbohydrate + " g");
   if(foodObj.nf_dietary_fiber === null){
       foodObj.nf_dietary_fiber = 0;
   }
   $(".fiber").text(foodObj.nf_dietary_fiber + " g");
   if(foodObj.nf_protein === null){
       foodObj.nf_protein = 0;
   }
   $(".protein").text(foodObj.nf_protein + " g");
   if(foodObj.nf_total_fat === null){
       foodObj.nf_total_fat = 0;
   }
   $(".fat").text(foodObj.nf_total_fat + " g");
   if(foodObj.nf_saturated_fat === null){
       foodObj.nf_saturated_fat = 0;
   }
   $(".saturatedFat").text(foodObj.nf_saturated_fat + " g");
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

/**
 * Displays Percent Daily Value bar graph
 * @param foodObj, food item to show nutrient information for 
 */
function displayChart(foodObj){
    let caloriePercent = parseFloat(foodObj.nf_calories/2000).toFixed(2) * 100;
    let cholPercent = parseFloat(foodObj.nf_cholesterol/300).toFixed(2) * 100;
    let carbPercent = parseFloat(foodObj.nf_total_carbohydrate/300).toFixed(2) * 100;
    let fiberPercent = parseFloat(foodObj.nf_dietary_fiber/25).toFixed(2) * 100;
    let fatPercent = parseFloat(foodObj.nf_total_fat/65).toFixed(2) * 100;
    let sodiumPercent = parseFloat(foodObj.nf_sodium/2400).toFixed(2) * 100;
    let satFatPercent = parseFloat(foodObj.nf_saturated_fat/20).toFixed(2) * 100;
    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Percent Daily Value"
        },
        axisY: {
            title: "Daily Value(DV) %"
        },
        data: [{        
            type: "column",  
            showInLegend: true, 
            legendMarkerColor: "grey",
            legendText: "Percent Daily Values are based on a 2,000 calorie diet.",
            dataPoints: [      
                { y: caloriePercent, label: "Calories" },
                { y: carbPercent,  label: "Carbohydrates" },
                { y: fiberPercent,  label: "Fiber" },
                { y: fatPercent,  label: "Fat" },
                { y: satFatPercent,  label: "Saturated Fat" },
                { y: sodiumPercent, label: "Sodium" },
                { y: cholPercent,  label: "Cholesterol"},
            ]
        }]
    });
    chart.render();
}