//  Create variables to hold user input from text boxes
var breweryCity = "";
var breweryState = "";
var breweryPostal = "";
var breweryName = "";
var breweryType = "";
var breweryTags = "";
var queryURL = "https://api.openbrewerydb.org/breweries?";

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

//  Function to create new row and columns for breweryObject Parameter passed
function createNewResult(breweryObject) {
  var newRow = $("<div>").addClass("row my-2").attr("id", breweryObject.id);
  var newCol = $("<div>").addClass("col-md-6 border border-secondary rounded py-2");
  newCol.html(
    "<p>" + breweryObject.name + "</p>" +
    "<p>" + breweryObject.street + "</p>" +
    "<p>" + breweryObject.city + "</p>" +
    "<p>" + breweryObject.state + "</p>" +
    "<p>" + breweryObject.postal_code + "</p>" +
    "<a href='" + breweryObject.website_url + "' target='_blank'>" + breweryObject.website_url + "</a>"
  );
  newRow.append(newCol);
  $("#brewery_results").append(newRow);
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
      console.log(breweryCity);
      queryURL = queryURL + "&by_city=" + breweryCity;
      console.log(queryURL);
    };
    if ($("#by_state").val() !== "") {
      breweryState = $("#by_state").val().toLowerCase().trim().replace(/ /g, "%20");
      console.log(breweryState);
      queryURL = queryURL + "&by_state=" + breweryState;
      console.log(queryURL);
    };
    if ($("#by_postal").val() !== "") {
      breweryPostal = $("#by_postal").val().trim();
      console.log(breweryPostal);
      queryURL = queryURL + "&by_postal=" + breweryPostal;
      console.log(queryURL);

    };
    if ($("#by_brewery").val() !== "") {
      breweryName = $("#by_brewery").val().toLowerCase().trim().replace(/ /g, "%20");
      console.log(breweryName);
      queryURL = queryURL + "&by_name=" + breweryName;
      console.log(queryURL);
    };
    if ($("#by_type").val() !== "Choose...") {
      breweryType = $("#by_type").val().toLowerCase().trim().replace(/ /g, "%20");
      console.log(breweryType);
      queryURL = queryURL + "&by_type=" + breweryType;
      console.log(queryURL);
    };
    if ($("#by_tags").val() !== "") {
      breweryTags = $("#by_tags").val().toLowerCase().trim().replace(/ /g, "%20");
      console.log(breweryTags);
      queryURL = queryURL + "&by_tags=" + breweryTags;
      console.log(queryURL);
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
        for (let index = 0; index < response.length; index++) {
          createNewResult(response[index]);

          setTimeout(function () {
            var authHeader = "Bearer " + API_KEY;
            var queryURL2 = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + response[index].name + "&location=" + response[index].city + "," + response[index].state;


            // perform yelp search call
            $.ajax({
              url: queryURL2,
              headers: {
                "Authorization": authHeader,
              },
            })
          }, index * 250)
        };
      }
    })


      .then(function (finalResponse) {
        // do something with finalResponse
      })
      .catch(function (err) {
        // If any of the calls go wrong
        // do something to display to the user that something went wrong
      });
  }
});