//  Create variables to hold user input from text boxes
var breweryCity = "";
var breweryState = "";
var breweryPostal = "";
var breweryName = "";
var breweryType = "";
var breweryTags = "";
var queryURL = "https://api.openbrewerydb.org/breweries?";
var authHeader = "Bearer " + API_KEY;

//  Function to clear values from the form and reset the variables
function resetUserInput() {
  //  Return all variables to original values for a new search
  breweryCity = "";
  breweryState = "";
  breweryPostal = "";
  breweryName = "";
  breweryType = "";
  breweryTags = "";
  queryURL = "https://api.openbrewerydb.org/breweries?";

  //  Clear user form values
  $("#by_city").val();
  $("#by_state").val();
  $("#by_postal").val();
  $("#by_name").val();
  $("#by_type").val();
  $("#by_tags").val();

  //  Clear dynamically created results
  $("#brewery_results").empty();
};

//  Yelp ajax call and creation of results
function reviewResults(yelpID, breweryID) {
  var queryURL3 = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + yelpID + "/reviews";
  $.ajax({
    url: queryURL3,
    method: "GET",
    headers: {
      "Authorization": authHeader,
    },
  }).then(function (response3) {
    console.log(response3);
    var newCol = $("<div>").addClass("col-md-5 border border-secondary rounded py-2 ml-1");
    newCol.html("<h5>Yelp Reviews</h5>");
    var newList = $("<ol>");
    $("#" + breweryID).append(newCol);
    for (let index = 0; index < response3.reviews.length; index++) {
      console.log(response3.reviews[index].text);
      var newListItem = $("<li>").text(response3.reviews[index].text);
      newList.append(newListItem);
    };
    newCol.append(newList);
  });
};

//  Function to create new row and columns for breweryObject Parameter passed
function createNewResult(breweryObject) {
  var newRow = $("<div>").addClass("row my-2").attr("id", breweryObject.id);
  var newCol = $("<div>").addClass("col-md-5 border border-secondary rounded py-2 mr-1");
  newCol.html(
    "<h5>" + breweryObject.name + "</h5>" +
    "<p>" + breweryObject.street + "</p>" +
    "<p>" + breweryObject.city + "</p>" +
    "<p>" + breweryObject.state + "</p>" +
    "<p>" + breweryObject.postal_code + "</p>" +
    "<a href='" + breweryObject.website_url + "' target='_blank'>" + breweryObject.website_url + "</a>"
  );
  newRow.append(newCol);
  newRow.append($("<div>").addClass("col-md-1"));
  $("#brewery_results").append(newRow);
  return breweryObject.id;
};

//  Function that runs when the submit button is clicked
$("#searchButton").on("click", function (event) {
  event.preventDefault();

  //  Code to make sure that the user has inputed some information
  var hasInput = false;
  $('.form-control').each(function () {
    if ($(this).val() !== "" && $(this).val() !== "Choose...") {
      hasInput = true;
    };
  });
  if (!hasInput) {
    $(".modal-title").text("Your Input is Required");
    $(".modal-body").html("<p>Please input at least one search item into the form.</p>");
    $('#modalAlert').modal('show');
    $('#modalAlert').modal('handleUpdate');
  } else {

    // Add user inputs to the API query string
    if ($("#by_city").val() !== "") {
      breweryCity = $("#by_city").val().toLowerCase().trim().replace(/ /g, "%20");
      queryURL = queryURL + "&by_city=" + breweryCity;
    };
    if ($("#by_state").val() !== "") {
      breweryState = $("#by_state").val().toLowerCase().trim().replace(/ /g, "%20");
      queryURL = queryURL + "&by_state=" + breweryState;
    };
    if ($("#by_postal").val() !== "") {
      breweryPostal = $("#by_postal").val().trim();
      queryURL = queryURL + "&by_postal=" + breweryPostal;
    };
    if ($("#by_brewery").val() !== "") {
      breweryName = $("#by_brewery").val().toLowerCase().trim().replace(/ /g, "%20");
      queryURL = queryURL + "&by_name=" + breweryName;
    };
    if ($("#by_type").val() !== "Choose...") {
      breweryType = $("#by_type").val().toLowerCase().trim().replace(/ /g, "%20");
      queryURL = queryURL + "&by_type=" + breweryType;
    };
    if ($("#by_tags").val() !== "") {
      breweryTags = $("#by_tags").val().toLowerCase().trim().replace(/ /g, "%20");
      queryURL = queryURL + "&by_tags=" + breweryTags;
    };

    //  API call to openbrewerydb
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      // Checks to make sure API call returned a JSON to use
      if (response.length === 0) {
        $(".modal-title").text("");
        $(".modal-body").html("<p>Your search items returned no results. Please try again.</p>");
        $('#modalAlert').modal('show');
        $('#modalAlert').modal('handleUpdate');
        resetUserInput();
      } else {
        resetUserInput();
        
        //  For loop to create list of identifed breweries based on user input
        for (let index = 0; index < response.length; index++) {
          createNewResult(response[index]);

          //  Function for performing initial yelp call
          setTimeout(function () {
            var resultName = response[index].name.replace(/ /g, "%20");
            var resultCity = response[index].city.replace(/ /g, "%20");
            var resultState = response[index].state.replace(/ /g, "%20");
            var resultID = response[index].id;
            console.log(resultName);
            var queryURL2 = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + resultName + "&location=" + resultCity + "," + resultState + "&sort_by=best_match&limit=5";

            // perform inital yelp search call and get id of brewery searched to get reviews
            $.ajax({
              url: queryURL2,
              method: "GET",
              headers: {
                "Authorization": authHeader,
              },
            }).then(function (response2) {
              console.log(response2);
              if(response2.businesses.length > 0){
                console.log(response2.businesses[0].id);
              reviewResults(response2.businesses[0].id, resultID);
              }
            });
          }, index * 700);
        };
      }
    }).then(function (finalResponse) {
      // do something with finalResponse
    })
      .catch(function (err) {
        // If any of the calls go wrong
        // do something to display to the user that something went wrong
      });
  }
});