var breweryCity = "san%20diego"
var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + breweryCity;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  console.log(response);
  console.log(response[0].name);
});
