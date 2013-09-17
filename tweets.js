Meteor.methods({
	checkTwitter: function () {
		var results = HTTP.get(
			"http://twitcher.steer.me/search",
			{
				query: 'q=%23pompeyzombie'
			},
			function(err, results) {
				results = JSON.parse(results.content).statuses;

				results.forEach(function(result) {
					var text = result.text.replace('#pompeyzombie', '')
					,	id = result.id
					;

					if ( ! Zombies.find({ tweet_id: id }).count()) {
						var severity = text.match(/[0-9]+\/10/);

						if (severity) {
							var textParts = text.split(/ [0-9]+\/10 /);
							var postcode = textParts[0] ? textParts[0].trim() : null;
							var message = textParts[1] ? textParts[1].trim() : null;

							var postcodeUrl = postcode.replace(' ', '+');

							var geo = HTTP.get('http://maps.googleapis.com/maps/api/geocode/json?&sensor=false&address=' + postcodeUrl);
							geo = JSON.parse(geo.content);

							if (geo.results[0]) {
								Zombies.insert({
									position: geo.results[0].geometry.location,
									severity: severity[0],
									address: postcode,
									message: message,
									tweet_id: id
								});
							}
						}
					}
				});
			}
		);
	}
});