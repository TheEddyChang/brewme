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
					var lng = brewery.location.lng;
					var name = brewery.name;
					var address = brewery.location.formattedAddress;
					var number = brewery.contact.formattedPhone;
				    var marker = new google.maps.Marker({
						position: new google.maps.LatLng(lat, lng),
						map: map,
						title: brewery.name,

					});
					//when user clicks a marker
					marker.info = new google.maps.InfoWindow({
						content: '<b>' + name + '</b>' + '<br>' + address + '<br>' + number
					});
					google.maps.event.addListener(marker, 'click', function() {
						marker.info.open(map, marker);
					});
				});
			});
		};
		createMap();
		fetchBrewData();
	});



});