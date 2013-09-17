var map
,	service
;

var Zombies = new Meteor.Collection('zombies');

var icons = {
	'pub': 'PubPin',
	0: 'ZombieLevel0',
	1: 'ZombieLevel1',
	2: 'ZombieLevel2',
	3: 'ZombieLevel3',
	4: 'ZombieLevel4',
	5: 'ZombieLevel5',
	6: 'ZombieLevel6',
	7: 'ZombieLevel7',
	8: 'ZombieLevel8',
	9: 'ZombieLevel9',
	10: 'ZombieLevel10'
};

var addZombieAttack = function(opts) {
	var title = opts.address + ' - ' + opts.severity;
	if (opts.message) title += ' - ' + opts.message;

	// Zombies.insert({
	// 	position: opts.position,
	// 	severity: opts.severity,
	// 	address: opts.address,
	// 	message: opts.message
	// });

	var icon = icons[opts.severity];

	addPoint(opts.position, icon, title);
};

var addPoint = function(position, icon, title) {
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		title: title || '',
		icon: { url: 'pins/'+icon+'.png' }
	});

	google.maps.event.addListener(marker, 'click', function() {
		var infoWindow = new google.maps.InfoWindow({
			content: title
		});

		infoWindow.open(map, marker);
	});
};

var addPubs = function(latLng, opts) {
	service.nearbySearch({
		location: latLng,
		radius: 500,
		types: ['bar']
	}, function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			results.forEach(function(result) {
				addPoint(result.geometry.location, icons.pub, result.name);
			});
			map.setZoom(14);
		}
	});
};

Template.hello.greeting = function () {
	return "Welcome to blownover.";
};

Template.hello.events({
	'click button' : function () {
		addPubs(new google.maps.LatLng(50.800999, -1.090736));
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
				result = result[0];
				addZombieAttack({
					position: result.geometry.location,
					severity: rating,
					address: result.formatted_address,
					message: message
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
		addZombieAttack({
			position: myLatlng,
			address: '38 Edmund',
			message: 'New Zombie Location!',
			severity: 8
		});
	}, 1000);
	service = new google.maps.places.PlacesService(map);
};

