import express from 'express';
import mustache from 'mustache-express';
import passport from 'passport';
import session from 'express-session';

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

const app = express();

app.set('views', './views');
app.set('view engine', 'mustache');
app.engine('html', mustache());

app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());

const users = {};

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => done(null, users[id]));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    let user = users[profile.id];
    if (user) {
      console.log(`found user ${JSON.stringify(user.displayName)}!`);
    } else {
      console.log(`creating user ${JSON.stringify(profile.displayName)}!`);
      user = profile;
    }
    users[user.id] = user;
    return done(null, user);
  },
));

app.get('/', (req, res) => {
  const currentSession = req.session.passport || {};
  const user = users[currentSession.user] || {};
  console.log('GET /', user);
  return res.render('index.html', { name: user.displayName });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/'),
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
