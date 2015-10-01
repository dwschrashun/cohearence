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