$(document).ready(function() {
	console.log('js working');
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

	// function to display map on the page
	var createMap = function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 37.78,
				lng: -122.44
			},
			zoom: 2
		});
	};


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
		var fetchBrewData = function() {

			$.get('/search', parameters, function(data) { //calls back to server
				console.log(data);
				var userInput = $('#location-city').val();
				// window.location.href="server.js?data=" + userInput;

				allBreweries = data.breweries;


				var postHtml = template({
					posts: allBreweries
				});
				//append html to the view
				$breweriesList.append(postHtml);


				//iterate through breweries to create map markers

				allBreweries.forEach(function(brewery) {
					var lat = brewery.location.lat;
					console.log(brewery.location.lat);
					var lng = brewery.location.lng;
					console.log(brewery.location.lng);
					new google.maps.Marker({
						position: new google.maps.LatLng(lat, lng),
						map: map,
						title: brewery.name,

					});


				});
				infowindow = new google.maps.InfoWindow();

				function onItemClick(event, pin) {
					// Create content  
					var contentString = pin.data.text + "<br /><br /><hr />Coordinate: " + pin.location.lng + "," + pin.location.lat;

					// Replace our Info Window's content and position 
					infowindow.setContent(contentString);
					infowindow.setPosition(pin.position);
					infowindow.open(map);
				}

			});
		};
		createMap();
		fetchBrewData();


	});



});