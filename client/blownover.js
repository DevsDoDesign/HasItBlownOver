var map;

var addPoint = function(latLng, opts) {
	opts = opts || {};

	var title = opts.address + ' - ' + opts.rating + ' - ' + opts.message;

	return new google.maps.Marker({
		position: latLng,
		map: map,
		title: title
	})
};

Template.hello.greeting = function () {
	return "Welcome to blownover.";
};

Template.hello.events({
	'click input' : function () {
		// template data, if any, is available in 'this'
		console.log("You pressed the button");
	}
});


Template.input.events({
	'click button': function() {
		console.log('add', this);
		var location, rating, message;
		location = $('#input-postcode').val();
		rating = parseInt($('#input-rating').val(), 10) || 1;
		message = $('#input-message').val();

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': location }, function(result, status) {
			console.log('res', result);
			if (status == google.maps.GeocoderStatus.OK) {
				addPoint(result[0].geometry.location, {
					address: result[0].formatted_address,
					message: message,
					rating: rating
				});
			}
			else {
				alert('Invalid Geocoder Request: '+status);
			}
		});
	}
});


Template.map.rendered = function() {
	console.log('OMG', this);
	var mapOptions = {
		center: new google.maps.LatLng(50.800999, -1.090736),
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(this.find('#map'), mapOptions);

	setTimeout(function() {
		var myLatlng = new google.maps.LatLng(50.800999, -1.090736);
		addPoint(myLatlng, {
			address: '',
			message: 'New Zombie Location!',
			rating: 8
		});
	}, 8000);
}

