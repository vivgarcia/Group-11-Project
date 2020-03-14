//  Create object to hold user input from text boxes
var breweryState = "";
var breweryCity = "";
var breweryZipcode = "";
var breweryName = "";
var breweryTag = "";
var breweryType = "";

var queryURL = "https://api.openbrewerydb.org/breweries?";

//  Function that runs when the submit button is clicked
$("#searchButton").on("click", function (event) {
  event.preventDefault();

  //  Code to make sure at the user has inputed some information
  var hasInput = false;
  $('.form-control').each(function () {
    if ($(this).val() !== "") {
      hasInput = true;
    }
  });
  console.log(hasInput);
  if (!hasInput) {
    alert("Modal box will pop up to tell user they need to input some information");
  } else {
    // Add user inputs to the API query string
    if ($("#by_state").val() !== "") {
      breweryState = $("#by_state").val().toLowerCase().trim().replace(/ /g, "%20");
      console.log(breweryState);
      queryURL = queryURL + "&by_state=" + breweryState;
      console.log(queryURL);
    };
    if ($("#by_city").val() !== "") {
      breweryCity = $("#by_city").val().toLowerCase().trim().replace(/ /g, "%20");
      console.log(breweryCity);
      queryURL = queryURL + "&by_city=" + breweryCity;
      console.log(queryURL);
    };
    // breweryName = $("#by_name").val();
    // breweryPostal = $("#by_postal").val();
    // breweryType = $("#by_type").val();
    // breweryTag = $("#by_tag").val();

    //  API call to openbrewerydb
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      
      // Checks to make sure API call returned a JSON to use
      if (response.length === 0) {
        alert("This section will update and alert the user that no breweries were found using their search parameters")
      } else {
        console.log(response[0].name);
        //  Return all variables to original values for a new search
        breweryState = "";
        breweryCity = "";
        // breweryZipcode = "";
        // breweryName = "";
        // breweryTag = "";
        // breweryType = "";
        queryURL = "https://api.openbrewerydb.org/breweries?"
      }
    });
  }
});