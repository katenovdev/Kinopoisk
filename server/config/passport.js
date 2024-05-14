const passport = require('passport')
const User = require('../auth/user')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    },
    function(email, password, done){
        User.findOne({email}).then(user => {
            if(user.password){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    return done(err)
                }
                if(result){
                    return done(null, user)
                }
            })
        }else{
            return done('user not found')
        }
        }).catch(e => {
            return done(e)
        })
    }
))

// passport.use(new GoogleStrategy({
//     clientID: '',
//     clientSecret: '',
//     callbackURL: "http://localhost:8000/api/auth/google",
//     scope: ['openid', 'email', 'profile']
//   },
//   async function(accessToken, refreshToken, profile, cb) {
//     const user = await User.find({googleId: profile.id})
//     const newUser = await new User({
//         googleId: profile.id,
//         full_name: profile.displayName,
//         email: profile.emails[0].value
//     }).save()
//       return cb(null, newUser);
//   }
// ));

passport.serializeUser(function(user,done){
    done(null, user._id)
})

passport.deserializeUser(function(id, done){
    User.findById(id).then((user, error) => {
        done(error, user)
    })
})  