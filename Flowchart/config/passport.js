const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const TwoFAStartegy = require('passport-2fa-totp').Strategy;
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const User = require("../app/Models/User");

module.exports = function (passport) {
       passport.use(
                new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
                                    User.findOne({
                                         where: {email: email},
                                         attributes: ['name', 'email', 'password']
                                    }).then(checkUser => {
                                            if (!checkUser) {
                                                return done(null, false, { message: 'That email is not registered' })
                                            }
                                       // Match password
                                            const user = {
                                            name: checkUser.get('name'),
                                            email: checkUser.get('email'),
                                            password: checkUser.get('password')
                                            }
                                            bcrypt.compare(password, user.password, (err, isMatch) => {
                                                   if (err) throw err
                                                   if (isMatch) {
                                                   return done(null, user)
                                                   } else {
                                                   return done(null, false, { message: 'Incorrect password' })
                                                   }
                                            })
                                     })
               })
  )
  
      passport.use('tfa-user', new TwoFAStartegy({
        usernameField: 'email',
        passwordField: 'password',
        codeField: 'code',
    }, (email, password, done) => {
        User.findOne({'email': email}).catch(error =>
            done(error)).then((user) => {
            if (!user) {
                let message = 'incorrect login';
                console.log(message);

                return done(null, false, {
                    message: message,
                });
            } else if (user.validPassword(password)//((user.password === cryptography.hash(password, user.salt))
                // && (user.block !== true)
                && (user.tfaOn === true)) {
                let message = '2fa enabled and pass is valid';
                console.log(message);
                return done(null, user);//{ user, type: 'user' });
            }

            console.log('incorrect login');
            return done(null, false, {
                message: 'incorrect login',
            });
        });
    }, (user, done) => {
        if (user.secretTfa) {
            console.log('decoding');
            const secret = GoogleAuthenticator.decodeSecret(user.secretTfa);
            done(null, secret, 30);
        } else
            done(new Error('Google Authenticator is not setup yet.'));

    }));
    
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser((email, done) => {
    User.findOne({
          where: {email: email}
           }).then(checkUser => {
                const name = checkUser.get('name');
                done(null, checkUser.name)
          })
  })
}