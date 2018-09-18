$(document).ready(initializeApp);

let foodInput = null;

/**
 * apply click handlers once document is ready
 * @param {}
 */
function initializeApp () {
    addClickHandler();
}

/**
 * autofill complete
 */
$(function() {
    $('input.autocomplete').autocomplete({
        // can ajax nutri api for list, but unable too
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

/**
 * Applies click handler to the submit button
 */
function addClickHandler () {
    $(".submit").click(submitClicked);
    //when enter is pressed
    $(document).keyup(function(event) {
        if ($("#food").is(":focus") && event.key == "Enter") {
            retrieveInput();
            changePage();
        }
    });
}

/**
 * Once user presses submit, get input and change page
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
 *  Changes the page  
 */
function changePage() {
    location.assign("../result_page/food.html")
}
/**
 * Will use session storage to get user
 * input
 */
function retrieveInput () {
    foodInput = $("#food").val();
    sessionStorage.setFood = foodInput;
    return foodInput;
}


function nutritionCallFromServer(food){
    let dataForServer = {
        "Content-Type": "application/x-www-form-urlencoded",
         "x-app-id": "0657689d",
         "x-app-key": "1c577a065dc2109313e314fdb410b965",
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