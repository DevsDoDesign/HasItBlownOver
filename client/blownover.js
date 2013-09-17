var map;

var addPoint = function(latLng) {
	return new google.maps.Marker({
		position: latLng,
		map: map,
		title: 'New Zombie Location!'
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
		addPoint(myLatlng);
	}, 8000);
}

