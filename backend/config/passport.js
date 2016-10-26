/*
 /!* global User *!/
 'use strict';

 let passport = require('passport');
 let LocalStrategy = require('passport-local').Strategy;
 let bcryptjs = require('bcryptjs');

 passport.serializeUser(function (user, done) {
 done(null, user.id);
 });

 passport.deserializeUser(function (userId, done) {
 User.findOne({id: userId})
 .exec(
 (err, user) => {
 done(null, user);
 }
 );
 });

 passport.use(new LocalStrategy({
 usernameField: 'email',
 passwordField: 'password'
 },
 function (email, password, done) {
 User.findOne({
 email: email
 },
 function (err, user) {
 if (err) {
 return done(err);
 }

 if (!user) {
 return done(null, false, {message: 'Incorrect email.'});
 }

 bcryptjs.compare(password, user.password, function (err, res) {
 if (err) {
 return done(err);
 }

 if (!res) {
 return done(null, false, {
 message: 'Invalid Password'
 });
 }

 return done(null, user);
 });
 });
 }
 ));
 */
