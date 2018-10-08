$(document).ready(initializeApp);

let previousInfoWindow = false;
let previousRoute = false;
let map;

/**
 * Apply click handlers to elements and display food name
 */
function initializeApp(){
    let foodName = sessionStorage.getItem("setFood").toLowerCase();
    applyClickHandler();
    $("#foodName").text(`You searched for: ${foodName}`);
}

/**
 * Apply click handlers to html elements
 */
function applyClickHandler(){ 
    $("#findMore").click(showMap);
    $(".backToList").click(backToList);
    $(".reset").click(startOver);
    $("#logo").click(startOver);
    $(".tablinks").click(openTab);
    $("#pac-input").hide();
    modalActivity();
    openTab({
        target: {
            innerHTML: "Nutrition",
        },
        currentTarget: $(".tab .tablinks:nth-child(1)")[0]
    })


}

/**
 * Function that handles case when user presses on either Nutrition or Yelp Tab
 * @param event, the click event that occurs when user presses on nutrition or yelp
 */
function openTab(event){
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    let target;
    if(event.target.className === "fa fa-cutlery" || event.target.innerText === "Nutrition" || event.target.innerHTML === "Nutrition"){
        target = "nutrition";
        $(".list").hide();
        $(".backToList").hide();
    }
    else{
        target = "yelp";
        //if user pressed on restaurant, show back button, hide list
        if($(".info").css("display") === "block"){
            $(".backToList").show();
            $(".list").hide();
        }
        else{
            $(".list").show();
        }
        if($("#findMore").css("display") === "inline-block"){
            $(".list").hide();
        }

    }
    $("." + (target).toLowerCase()).css("display", "block");
    event.currentTarget.className += " active";
}

/**
 * when user presses back arrow, return back to list
 */
function backToList(){
    $(".backToList").hide();
    $(".noYelpInfo").hide();
    $(".info").hide();
    $(".list").show();
}

/**
 * shows directions modal when user presses get Directions button
 */
function modalActivity(){
    let modal = document.getElementById("directionModal");
    $("#directions").click(function(){
        $(".modal").show();
    });
    $(".okBtn").click(function(){
        $(".modal").hide();
    });
    window.onclick = function(event){
        if (event.target == modal){
            $(".modal").hide();
        }
    }
}


/**
 * Make a function to autosubmit the input data
 * Target the searchbar with the id pac-input
 * focus on 
 * Trigger the input equivalent to the enter button
 */
function submitFormData(){
    let input = document.getElementById("pac-input");
    try {
        google.maps.event.trigger(input, "focus");
    } finally {
        google.maps.event.trigger(input, "keydown", { keyCode: 13 });
    }
}


/**
 * Make a function that hides the picture with an id of pic, shows the map
 * with an id of map. 
 * fill the search bar with the variable foodInput
 * set a timeout to submit the form data after a short delay 1 second
 * Hide the spinner
 */
function showMap(){
    $("#findMore").hide();
    $(".list").show();
    $("#pic").hide();
    $("#map").show();
    foodInput = sessionStorage.getItem("setFood");
    $("#pac-input").val(foodInput);
    setTimeout(submitFormData, 1000);
    $(".loader").show();
}

/**
 * Make a function that creates a new google map attached to the div with the 
 * id of map, cet the center to the origin, zoom to 13, and mapTypeId to roadmap.
 */

function initAutocomplete(){
    let userLocation = {
        lat: 0,
        lng: 0
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        mapTypeId: "roadmap"
    });

    let infoWindow = new google.maps.InfoWindow;
    //this is gives us the current location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            userLocation.lat = position.coords.latitude;
            userLocation.lng = position.coords.longitude;
            map.setCenter(pos);
            let marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: "../img/blue-dot.png",
            });
            marker.setMap(map);
            previousInfoWindow = infoWindow;
        }, function(){ 
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } 
    else{
        // Browser doesn"t support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    // Create the search box and link it to the search bar element with the id of pac-input.
    let input = document.getElementById("pac-input");
    let searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", function () {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", function(){
        let places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        $(".loader").hide();
        // Clear out the old markers.
        markers.forEach(function(marker){
            marker.setMap(null);
        });
        markers = [];

        let bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                return;
            }

            let infoWindow = new google.maps.InfoWindow({
                content: `${place.name}`,
                pixelOffset: new google.maps.Size(0, 0)
            });


            let markerLocation = new google.maps.Marker({
                map: map,
                icon: "../img/red-circle.png",
                title: place.name,
                position: place.geometry.location
            });

            //create a list of restaurants
            let listItem = $("<div>").addClass("listItem");
            let generalOrgInfo = $("<div>").addClass("generalOrgInfo");
            let orgName = $("<div>").addClass("orgName").text(place.name);
            let orgAddress = $("<div>").addClass("orgAddress").text("\u2022" + " " + place.formatted_address);
            let distance = $("<div>").addClass("distance").text("\u2022" + " " + getDistance(userLocation.lat, userLocation.lng, place.geometry.viewport.f.b, place.geometry.viewport.b.b) + " miles");
            generalOrgInfo.append(orgName);
            generalOrgInfo.append(orgAddress);
            generalOrgInfo.append(distance);
            listItem.append(generalOrgInfo);
            $(".list").append(listItem);

            //add click handlers to the markers
            markerLocation.addListener("click", function(){
                $(".list").css("display", "none");
                $(".backToList").css("display", "inline-block");
                previousInfoWindow.close();
                infoWindow.open(map, markerLocation);
                previousInfoWindow = infoWindow;
                // break the address up into street address , city
                const arrayOfString = place.formatted_address.split(",");
                const address = arrayOfString[0];
                const cityName = arrayOfString[1];
                const name = place.name;

                // send the relevant data to make the Yelp ajax call
                // send the relevant info to Google Directions
                requestYelpData(name, address, cityName);
                navigator.geolocation.getCurrentPosition(function(position){
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    displayRoute(pos, place.formatted_address);
                })
            });

            //when user hovers over marker location, change color of marker to white
            markerLocation.addListener("mouseover", function(){
                markerLocation.setIcon("../img/wht-circle.png");
                listItem.css("background-color", "lightgrey");
            })
            markerLocation.addListener("mouseout", function(){
                markerLocation.setIcon("../img/red-circle.png");
                listItem.css("background-color", "white");

            })


            //add click handlers to each list item that shows on map
            listItem.on("click", function(){
                $(".yelp").hide();
                $(".list").hide();
                $(".backToList").css("display", "inline-block");
                previousInfoWindow.close();
                infoWindow.open(map, markerLocation);
                previousInfoWindow = infoWindow;
                // break the address up into street address , city
                const arrayOfString = place.formatted_address.split(",");
                const address = arrayOfString[0];
                const cityName = arrayOfString[1];
                const name = place.name;

                // send the relevant data to make the Yelp ajax call
                // send the relevant info to Google Directions
                requestYelpData(name, address, cityName);
                navigator.geolocation.getCurrentPosition(function(position){
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    displayRoute(pos, place.formatted_address);
                })
            });

            //add hover handler to listItem that changes marker location to white 
            listItem.hover(function(){
                markerLocation.setIcon("../img/wht-circle.png");
            }, function(){
                markerLocation.setIcon("../img/red-circle.png");
            })

            // Create a marker for each place.
            markers.push(markerLocation);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

/**
 * Called when not able to look up location, opens up info window
 * @param browserHasGeolocation, passing from initAutocomplete/geolocation
 * @param infoWindow, information that shows on display markers
 * @param pos, position
 */
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn\"t support geolocation.");
    infoWindow.open(map);
}

/**
 * Display the route on the map
 * @param origin, user's geolocation
 * @param destination, restaurant location
 */
function displayRoute(origin, destination) {
    $("#direction").empty();
    let service = new google.maps.DirectionsService;
    let display = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById("direction")
    });
    service.route({
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
        avoidTolls: true,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, function (response, status) {

        if (status === "OK") {
            if (previousRoute) {
                //here we set previous route to null so it clears the previous route
                previousRoute.setMap(null);
            }
            //saved reference of the previous route so we could erase from the map when new destination is clicked
            previousRoute = display;
            display.setDirections(response);
        } else {
            alert("Could not display directions due to: " + status);
        }
    });
}

/**
 * Calculates the distance between two destinations
 * @param result, distance of two destinations
 */
function computeTotalDistance(result) {
    let total = 0;
    let myroute = result.routes[0];
    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    // it displays in km, in future we will converting to miles
    document.getElementById("total").innerHTML = total + " km";
}


/**
 * callback function. when user presses start logo, go
 * back to first screen
 */
function startOver() {
    location.assign("../landing_page/index.html");
    sessionStorage("setFood", "");
}

/**
 * Returns distance between 2 (lat, lng) points. Utilize this so there's no use for Google Maps
 * API to return distance (saves API calls)
 * @param {*} latitudeFrom 
 * @param {*} longitudeFrom 
 * @param {*} latitudeTo 
 * @param {*} longitudeTo 
 * @return miles between 2 points
 */
function getDistance(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo){
    let earthRadius = 3958.755866;
    let dLat = deg2rad(latitudeTo-latitudeFrom);  // deg2rad below
    let dLon = deg2rad(longitudeTo-longitudeFrom); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(latitudeFrom)) * Math.cos(deg2rad(latitudeTo)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return (earthRadius * angle).toFixed(2);
}

/**
 * Helper function for getDistance()
 * @param deg, degree 
 * @return radians of a given degree
 */
function deg2rad(deg)  {
    return deg * Math.PI / 180;
 }