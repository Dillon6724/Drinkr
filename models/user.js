var mongoose          = require('mongoose'),
    Schema            = mongoose.Schema,
    bcrypt            = require('bcrypt'),
    SALT_WORK_FACTOR  = 10;

/* define the schema */
var userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});


/* create the model */
var User = mongoose.model('user', userSchema);

userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/* exporting the user model */
module.exports = User;
