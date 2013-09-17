var map
,	service
,	currentGeolocationPosition
;

Meteor.subscribe('zombies');

var icons = {
	'pub': 'PubPin',
	'current': 'CurrentPin',
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

	var icon = icons[opts.severity];

	var position = new google.maps.LatLng(opts.position.lat, opts.position.lng);

	addPoint(position, icon, title);
};

var addPoint = function(position, icon, title) {
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		title: title || '',
		icon: icon ? { url: 'pins/'+icon+'.png' } : null
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
			map.setCenter(latLng);
			map.setZoom(15);
		}
	});
};

// Template.hello.greeting = function () {
// 	return "Welcome to blownover.";
// };

Template.findPubs.events({
	'click button' : function () {
		addPubs(currentGeolocationPosition);
	}
});


Template.input.events({
	'click button': function() {
		console.log('add', this);

		var $location = $('#input-postcode'),
			$rating = $('#input-rating'),
			$message = $('#input-message');

		var location = $location.val(),
			rating = parseInt($rating.val(), 10),
			message = $message.val();

		if ( ! location) return alert('Please provide a postcode of the attack');
		if (isNaN(rating)) return alert('Please provide the severity level');

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': location }, function(result, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				result = result[0];

				Zombies.insert({
					position: {
						lat: result.geometry.location.ob,
						lng: result.geometry.location.pb
					},
					severity: rating,
					address: result.formatted_address,
					message: message,
					created: new Date().getTime(),
				});

				$location.val('');
				$rating.val('');
				$message.val('');
			}
			else {
				alert('Invalid Geocoder Request: '+status);
			}
		});
	}
});


Template.map.rendered = function() {
	var self = this;

	navigator.geolocation.getCurrentPosition(function(location) {
		currentGeolocationPosition = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

		var mapOptions = {
			disableDefaultUI: true,
			center: currentGeolocationPosition,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(self.find('#map'), mapOptions);

		setTimeout(function() {
			addPoint(currentGeolocationPosition, 'CurrentPin', 'You\'re here!');
		}, 1000);

		service = new google.maps.places.PlacesService(map);

		Meteor.call('checkTwitter');

		Zombies.find().observe({
			added: function(zombie) {
				addZombieAttack(zombie);
			}
		});

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

	});
};

Template.stream.zombies = function() {
	return Zombies.find({}, { limit: 10 });
};

