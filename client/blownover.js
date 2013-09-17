var map
,	service
;

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

	var infowindow = new google.maps.InfoWindow({
	  content: opts.position.toString()
	});

	var marker = new google.maps.Marker({
		position: opts.position,
		map: map,
		title: title,
		icon: {
			url: 'pins/'+icons[opts.severity]+'.png',
		}
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
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
				addZombieAttack({
					position: result.geometry.location
				});
			});
		}
	});
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
				result = result[0];
				addZombieAttack({
					position: result.geometry.location,
					severity: rating,
					address: result.formatted_address,
					message: message
				});

				addPubs(result.geometry.location);
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

	map.set('styles', [
		{
			featureType: 'road',
			elementType: 'geometry.fill',
			stylers: [
				{ color: '#343F53' }
			]
		}, {
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [
				{ color: '#202733' }
			]
		}, {
			featureType: 'landscape',
			elementType: 'geometry',
			stylers: [
				{ color: '#141820' }
			]
		}, {
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [
				{ color: '#323D51' }
			]
		}, {
			featureType: 'poi',
			elementType: 'label.fill',
			stylers: [
				{ color: '#000000'}
			]
		}, {
			featureType: 'poi',
			elementType: 'label.stroke',
			stylers: [
				{ color: '#B3D1FF' },
				{ visibility: 'off' }
			]
		}, {
			featureType: 'transit.line',
			elementType: 'geometry',
			stylers: [
				{visibility: 'off' }
			]
		},{
			featureType: 'transit.line',
			elementType: 'label',
			stylers: [
				{visibility: 'off' }
			]
		}, {
			featureType: 'water',
			elementType: 'geometry',
			stylers: [
				{ color: '#202834' }
			]
		}, {
			featureType: 'water',
			elementType: 'label',
			stylers: [
				{ color: '#202834' }
			]
		}, {
			featureType: 'administrative',
			elementType: 'labels.text.stroke',
			stylers: [
				{ color: '#000000' }
			]
		}, {
			featureType: 'administrative',
			elementType: 'labels.text.fill',
			stylers: [
				{ color: '#84A1D3' }
			]
		}, {
			featureType: 'all',
			elementType: 'labels.text.stroke',
			stylers: [
				{ color: '#000000' }
			]
		}, {
			featureType: 'all',
			elementType: 'labels.text.fill',
			stylers: [
				{ color: '#84A1D3' }
			]
		}
	]);
	// gradientMap = document.getElementById('map');
	// gradientMap = $('.gm-style > ')
	// GradientMaps.applyGradientMap(gradientMap, '#000000, #9fc2ff');


	setTimeout(function() {
		var myLatlng = new google.maps.LatLng(50.800999, -1.090736);
		addZombieAttack({
			position: myLatlng,
			address: '',
			message: 'New Zombie Location!',
			severity: 8
		});
	}, 1000);
	service = new google.maps.places.PlacesService(map);
};

