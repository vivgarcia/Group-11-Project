//  Create variables for input boxes

var breweryState = "";
var breweryCity = "san%20diego";
var breweryZipcode = "";
var breweryName = "";
var breweryTag = "";
var breweryType = "";
var userInputarray =  ["", "", "", "", "", ""];

var queryURL = "https://api.openbrewerydb.org/breweries?by_tags=patio";

//  Function that runs when the submit button is clicked
// $("#user-input").on("click", function (event) {
//   event.preventDefault();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    console.log(response[0].name);
  });
// });