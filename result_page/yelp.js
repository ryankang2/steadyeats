/**
* Function that pulls yelp API with keyword/address search and current location (city)
* @param name, name of the organization
* @param address, address of organization
* @param city, city of where organization is located
*/
function requestYelpData (name, address, city){
    $(".row").css("display", "block");
    let customUrl = "https://yelp.ongandy.com/businesses/matches";
    let key = {
        api_key: "8omc0Yh_VpsNVtwSesxDrxKYNBTjSx4unT_tUQKxv7FpvWGn9QmAhpI2XlvNHaN3NDrwdY2UahjFHb5Qu6KhuzlLFQ04LzbCJT1BocPCAAiMEJpovT3fWX4IoKtXW3Yx",
        name: name,
        address1: address,
        city: city,
        state: "CA",
        country: "US",
    }
    let yelpAPI = {
        data: key,
        url: customUrl,
        method: "POST",
        dataType: "json",
        success: function(response){
            if(response.businesses.length === 0){                
                $(".yelp").hide();
                $(".noYelpInfo").show();
            }
            else{
                let businessId= response.businesses[0].id;
                getYelpDetails(businessId);
            }
        },
        error: function (error) {
            console.log("error from requestYelpData: ", error);
        }
    }

    $.ajax(yelpAPI)
}

/**
 * use business id from last ajax call to get more info on business
 * @param id, business id we got from previous call
 */
function getYelpDetails(id){
    let customUrl = "https://yelp.ongandy.com/businesses/details";
    let key = {
        api_key: "9bPpnQ55-8I0jLR62WqbyvBAv20IJ-zF-WJs7YJgLqZeRqokQg2L995TrDHKUVXEmRblz6We2EMClsxkS4vbfmRLLP5G1cPcV5FFX0fzSi388ha6a1qsHR5J97dWW3Yx",
        id: id,
      }
    let yelpAPI = {
        crossDomain: true,
        headers: {
            "Authorization": "Basic Og==",
            "Cache-Control": "no-cache",
        },
        data: key,
        url: customUrl,
        method: "POST",
        dataType: "json",
        success:  createYelpDisplay,
        error: function(error){
            console.log("error from getYelpDetails: ", error);
        }
    }
    $.ajax(yelpAPI)
}

/**
 * Function the displays the data to dom dynamically
 * @param resposne, the Yelp Response object that has business information
 */
function createYelpDisplay(response){
    let name = response.name;
    $(".name").text(name);
    let phone = response.display_phone;
    $(".phone").text(phone);
    let price = response.price;
    let reviewCount = response.review_count;
    let rating = response.rating;
    $(".reviews").text( ` ${price}, ${reviewCount} reviews, ${rating}/5 stars`)
    let link = response.url;
    $(".link").text("View on Yelp").attr("href", link).attr("target", "_blank");
    let displayAddress = response.location.address1 + ", " + 
                        response.location.city + ", " + response.location.state;
    $(".address").text(displayAddress);
    let businessImage = response.image_url;
    $("#yelpImage").attr("src", businessImage);
    let openStatus = response.hours[0].is_open_now;
    if(openStatus) {
        $(".openOrClosed").text("OPEN NOW").css("color","green");
    } else {
        $(".openOrClosed").text("CLOSED NOW").css("color","red");
    }
    $("#goThere").addClass("scale-in");
    $(".yelpLoader").hide();
    $(".yelp").show();

}