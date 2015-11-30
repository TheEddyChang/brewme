$(function() {
	console.log('js working');
	//   $('#masonry-grid').masonry({
	// 	// options
	// 	itemSelector: '.grid-item',
	// 	columnWidth: 400
	// });
	//handlebars set up
	var $breweriesList = $('#breweries-list');
	var source = $('#breweries-template').html();
	var template = Handlebars.compile(source);
	var allBreweries;
	var postHtml = template({
		posts: allBreweries
	});

    //getting the value of location-city and storing it in a variable and sending it to server side
	// var userInput = $('#location-city').val();

	// var render = function() {
	// 	$breweriesList.empty();
	// 	var postHtml = template({ posts: allBreweries });
	// 	$breweriesList.append(postHtml);
	// };
	$('#search').on('submit', function() {
		event.preventDefault();
		console.log('hi');
		$.get('/search', function(data) { //calls back to server
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

	// $('#search').on('submit', function() {
	// 	event.preventDefault();
	// 	var userInput = $('#location-city').val();
	// 	$.ajax({
	// 			url: '/search',
	// 			type: 'POST',
	// 			data: {
	// 				'variable_name': userInput
	// 			},
	// 			success: function(html) {
	// 				alert('ok');
	// 			}
	// 		});
	// });

$(function() {
	$('#search').on('submit', function(){
		var userInput = $('#location-city').val();
		var parameters = { search: userInput};
		   $.get('/search', parameters, function(data) {
		   	$('#results').html(data);
		   });
	});
});


});