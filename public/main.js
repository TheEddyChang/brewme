	  
    function initMap() {
    	var map;
		map = new google.maps.Map(document.getElementById("map"), {
			center: {
				lat: 37.78,
				lng: -122.44
			}, //{ lat: 37.78, lng: -122.44 }
			zoom: 8
		});
		
    }

$(document).ready(function() {
	console.log('js working');
	var googlemap = initMap();
    

  

	//handlebars set up
	var $breweriesList = $('#breweries-list');
	var source = $('#breweries-template').html();
	var template = Handlebars.compile(source);
	var allBreweries;
	var postHtml = template({
		posts: allBreweries
	});



	// var render = function() {
	// 	$breweriesList.empty();
	// 	var postHtml = template({ posts: allBreweries });
	// 	$breweriesList.append(postHtml);
	// };
	$('#search').on('submit', function() {
		event.preventDefault();
		$breweriesList.empty();
		console.log('hi');
		//gets value of user input from form
		var userInput = $('#location-city').val();
		//sends variable back to server side
		var parameters = {
			search: userInput
		};
		//added 'parameters' as a parameter
		$.get('/search', parameters, function(data) { //calls back to server
			console.log(data);
			var userInput = $('#location-city').val();
			// window.location.href="server.js?data=" + userInput;

			allBreweries = data.breweries;

			var postHtml = template({
				posts: allBreweries
			});
			$breweriesList.append(postHtml);
		});
	});





});