
Meteor.startup(function() {

});

Meteor.publish('zombies', function() {
	return Zombies.find({}, {
		sort: { created: -1 }
		// limit: 1
	});
});
