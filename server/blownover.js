
Meteor.startup(function() {

});

Meteor.publish('zombies', function() {
	return Zombies.find();
});
