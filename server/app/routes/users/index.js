var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

var User = require('mongoose').model('User');

router.get("/", function (req, res, next) {
	User.find()
	.then(function (users) {
		users = users.map(function (user) {
			return _.omit(user.toJSON(), ['salt', 'password']);
		});
		res.json(users);
	});
});

router.get('/:userId', function (req, res) {
	res.json(_.omit(req.foundUser.toJSON(), ['salt', 'password']));
});

router.post('/:userId/addSong', function(req, res, next){
	console.log(req.body);
	res.status(200).send();
});

router.param('userId', function (req, res, next, userId) {
	User.findById(userId)
	.then(function (user) {
		req.foundUser = user;
		next();
	})
	.then(null, next);
});
