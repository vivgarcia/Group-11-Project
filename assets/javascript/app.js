//  Create variables to hold user input from text boxes
var breweryCity = "";
var breweryState = "";
var breweryPostal = "";
var breweryName = "";
var breweryType = "";
var breweryTags = "";

var queryURL = "https://api.openbrewerydb.org/breweries?";

//  Function to clear values from the form and reset the variables
function resetUserInput(){
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

//  Function to create new row and column for 
// function createNewResultRow(rowNumber) {
//   var newRow = $("<tr>").append(
//     $("<td>").text(trainName),
//     $("<td>").text(trainDest),
//     $("<td>").text(trainFreq),
//     $("<td>").text(moment(nextTrain).format("LT")),
//     $("<td>").text(tMinutesTillTrain),
//   );
// }

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
  console.log(hasInput);
  if (!hasInput) {
    // alert("Modal box will pop up to tell user they need to input some information");
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
        // alert("This section will update and alert the user that no breweries were found using their search parameters");
        $(".modal-title").text("");
        $(".modal-body").html("<p>Your search items returned no results. Please try again.</p>");
        $('#modalAlert').modal('show');
        $('#modalAlert').modal('handleUpdate');
        resetUserInput();
      } else {
        console.log(response[0].name);
        resetUserInput();
      }
    });
  }
});