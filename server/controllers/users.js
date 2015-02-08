var User = require('./../models/user');
var watson = require('watson-developer-cloud-alpha');
var Twitter = require('twitter');

module.exports = (function() {
  return {
    index: function (req, res) {
      res.render('index');
    },

    create: function (req, res) {
    	var that = this;
    	User.findOne({ email_address: req.body.email_address }, function (err, user) {
    		if (user === null) {
    			var user = new User(req.body);
    			user.created_at = new Date();
    			user.save(function (err) {
    				console.log('success');
    				// res.redirect('/users/' + user._id);
    			})
    		}
    		else {
    			console.log('login');
    			// res.redirect('/users/' + user._id);
    		}
    		that.askQuestions(req, res);
    	})
    },

    show: function (req, res) {
    	var users = {};
    	User.findOne({ _id: req.params.id }, function (err, user) {
    		users.me = user;
    		User.find({}, function (err, all_users) {
    			console.log(all_users);
    			res.render('listings', { users: all_users });
    		})
    	})
    },

    askQuestions: function (req, res) {
    	console.log('test', req.body);
    	var client = new Twitter({
    		consumer_key: "lvkLsjQeEdG6rc79UYxWU2If0",
    		consumer_secret: "UjGxFYq6uW6yT8P9mKjCecTh7Z5nSTyZJt627iHzFjo0rQhNkw",
    		access_token: "477984503-qL6CsibDDG4ZhBVDG58rvh8vEFUlP7xtOHyDAFqN",
    		access_secret: "cnikg67hRcA9mbO0h5n6BHJAh9mDPgry9rIQyHX503Drr"
    	});

    	var params = { screen_name: req.body.email_address };
    	var my_tweets = client.get('statuses/users_timeline', params, function (error, tweets, response) {
    		// console.log('ERROR', error);
    		// console.log('tweets', tweets);
    		// console.log('response', response);
    		if (!error) {
    			console.log(tweets);
    			return tweets;
    		}
    	});

    	var user_modeling = watson.user_modeling({
    		username: 'ac7eeb81-13d6-45b3-ab09-2112c23d8d31',
       		password: '7EduDrdA6JZs',
    		version: 'v2'
    	});

    	user_modeling.profile({
    		text: "The ideal of a coach is of a man whose game plan is for a life, not just 40 minutes of basketball, who believes his job is to instill something in his players other than just a good stance on defense.Smith was that ideal.He called his method the Carolina Way, but really his principles guided people far beyond the reaches of Chapel Hill. Smith showed his peers how to truly be a coach and his players how to be men.They didn't necessarily love him, the other coaches, at least not when they were competing against him. Saint Dean, they'd say mockingly, angered and admittedly jealous about the special dispensation Smith seemed to receive. A young Mike Krzyzewski once wondered why it seemed his rival had a different set of rules, especially with ACC officials, and well, we can all chuckle at that irony of that now, can't we?Smith's Four Corners offense -- the stall tactic that eventually gave birth to the shot clock -- was brilliant, no doubt, but absolutely maddening to coach against.But mostly they didn't dislike him so much as they hated playing against him. He won so much and so easily -- with just one losing season, his first, during his 36-year tenure at Carolina. He had 27 20-win seasons, back when that benchmark was the true measure of success, and a top-three ACC finish in each of his final 33 years.Smith didn't collect national championship trophies quite like John Wooden, but his program was no less a dynasty. The Tar Heels made 26 NCAA tournament appearances under him, rolling up 65 wins." }, 
    		function (err, response) {
                console.log('test');
    			if (err) {
    				console.log('error', err);
    			}
    			else {
                    console.log(response.tree.children[0]);
    				User.findOne({ email_address: req.body.email_address }, function (err, user) {
                        console.log('found');
    					user.consc = response.tree.children[0];
    					user.excite = response.tree.children[1];
    					user.self = response.tree.children[2];
                        console.log(user);
    					user.save(function (err) {
    						console.log('success');
    						res.redirect('/users/' + user._id);
    					})
    				})
    			}
    	});
    }

  }
})();