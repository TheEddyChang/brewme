$(document).ready(function() {
	console.log('js working');
	//handlebars set up
	var $breweriesList = $('#breweries-list');
	var source = $('#breweries-template').html();
	var template = Handlebars.compile(source);
	var $results2 = $('#results2');
	var allBreweries;
	var postHtml = template({
		posts: allBreweries
	});

	// function empty() {
	// 	$results.empty();
	// }

	//empty variable to put favorite breweries in
	var brewerys = [];
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
	createMap();
	
	$('#search').on('submit', function() {
		event.preventDefault();
		$breweriesList.empty();
		$results2.empty();
		//$results2.empty();

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
				//var brewerieslength = allBreweries.length;
				console.log(allBreweries.length);
                var postHtml = template({
					breweries: allBreweries
				});
				//append html to the view
				$breweriesList.append(postHtml);
			    //iterate through breweries to create map markers
				//var bounds = new google.maps.LatLngBounds();
				$results2.append("Your search returned " + allBreweries.length + " results!");

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
					bounds.extend(marker.position);
					//map locaton adjusts to where markers are
					
					//when user clicks a marker
					marker.info = new google.maps.InfoWindow({
						content: '<b>' + name + '</b>' + '<br>' + address + '<br>' + number
					});
					google.maps.event.addListener(marker, 'click', function() {
						//infowindow.close();
						
						marker.info.open(map, marker);
						
					});
					
					
					
				});
			
				
				map.fitBounds(bounds);
			});
        


		};
		

		fetchBrewData();
		

	});


//change color of button after it gets clicked
	$("#breweries-list").on("submit", "#add", function(event) {
		event.preventDefault();
		$(this).html("Added to Favorites!");
		var breweryId = $(this).attr("data-id");
		console.log(breweryId);
        var brewHtml = $('#brewery-' + breweryId);
        //post request to create new brewery
		$.post('/api/brewerys', {foursquare_id: breweryId}, function(data) {
			console.log(data);
		    var breweryMongoId = data._id;
		    //var breweryName = data.name;
		    $.ajax ({
		    	type:'PUT',
		    	url: '/api/users/favorites',
		        data: {brewery_id: breweryMongoId},
		        success: function(data){//waiting for res.json from server side
		        	console.log(data);
		        }

		    }); 
	

		});

	});

	
//user to leave comments on favorite list
	// $('body').on('submit', '.comment-form', function(event) {
	// 	console.log("FORM SUBMITTING!");
	// 	event.preventDefault();
	// 	var favoriteId = $(this).attr("data-id");
	// 	var newComment = $(this).serialize();
	// 	//post request to create ne comment
	// 	$.post('/api/users/favorites', newComment, function(data) {
	// 		console.log(data);
	// 	});

	// });
//git checkout master--git merge comments--git push master--git push heroku master
});


//things to work on
//1. validations
//2. testing
//3. leaving comments
