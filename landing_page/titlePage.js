$(document).ready(initializeApp);


/**
 * Apply click handlers and implement a loader when the user enters a search
 */
function initializeApp(){
    addClickHandler();
    //adds spinner when making ajax call
    $(document).ajaxStart(function(){
        $(".loader").show();
    });
    $(document).ajaxComplete(function(){
        $(".loader").hide();
    })
}

/**
 * Add click handler to search button
 */
function addClickHandler () {
    $(".submit").click(submitClicked);
    //when enter is pressed
    $(document).keyup(function(event) {
        if($("#food").is(":focus") && event.key == "Enter") {
            submitClicked();
        }
    });
}

/**
 * Once user presses submit, retrieve input and change page
 */
function submitClicked () {
    let returnedFood = retrieveInput();
    if(!returnedFood){
        $("#error").text("Please input a food item");
        return;
    }
    nutritionCallFromServer(returnedFood);
}

/**
 *  Changes the page to result page
 */
function changePage() {
    location.assign("../result_page/food.html")
}

/**
 * Will use session storage to store user input
 */
function retrieveInput () {
    let foodInput = $("#food").val();
    sessionStorage.setFood = foodInput;
    return foodInput;
}

/**
 * Make AJAX call to nutritionIX api with the user input
 * @param food, user's searched food
 */
function nutritionCallFromServer(food){
    let dataForServer = {
        "Content-Type": "application/x-www-form-urlencoded",
         "x-app-id": config.NUTRITION_ID,
         "x-app-key": config.NUTRITION_KEY,
        "x-remote-user-id": "0",
        "Cache-Control": "no-cache",
    };
    let options = {
        dataType: "json",
        url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
        headers: dataForServer,
        data: {
            "query": food
        },
        method: "post",
        success: function(response){
            localStorage.setItem("resp", JSON.stringify(response));
            changePage();
        },
        error: function(error){
            if (error.statusText === "Not Found") {
                $("#error").text("Database couldn't find " + food);
            }
        }
    }
    $.ajax(options);
 }

$(function() {
    $('input.autocomplete').autocomplete({
      data: {
        "Apple": null,
        "Chicken": null,
        "Taco": null,
        "Wings": null,
        "Burritos": null,
        "Cake": null,
        "Rice": null,
        "Pizza": null,
        "Curry": null,
        "Orange": null,
        "Beer": null,
        "Wine": null,
        "Burger": null,
        "Fish": null,
        "Ice Cream": null,
        "Strawberry": null,
        "Cheese": null,
        "Bread": null,
        "Chips": null,
        "Salsa": null,
        "String cheese": null,
        "Tofu": null,
        "Salad": null,
        "Ramen": null,
      }
    });
});