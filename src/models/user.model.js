const mongoose = require("mongoose");
const crypto = require("crypto");
const { type } = require("os");
const {Schema} = mongoose;


const userSchema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, lowercase: true, trim: true, required: true, unique: true},
    createdAt: {type: Date, default: Date.now(), immutable: true},
    password: {type: String, required: true, length: {min: 10}, required: true},
    password_repeat: {type: String, required: true, length: {min: 10}, required: true},
    userrole: {type: String, default: "user"},
    subplaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subplace"}],
    karma: {type: Number, default: 0},
    salt: { type: String }

});

userSchema.pre('save', function (next) {
    if (this.password !== this.password_repeat) {
        return next(new Error('Heslá sa nezhodujú'));
    }

    this.salt = crypto.randomBytes(16).toString('hex'); 

    this.password = this.hashPassword(this.password); 
    this.password_repeat = undefined; 
    next(); 
});

userSchema.methods.hashPassword = function (password) {
    return crypto
        .createHmac('sha256', this.salt) 
        .update(password) 
        .digest('hex');
};

userSchema.methods.comparePassword = function (candidatePassword) {
    const hashedPassword = this.hashPassword(candidatePassword); 
    return hashedPassword === this.password; 
};

userSchema.methods.sayHi = function () {
    console.log("Hi my name is: " + this.name);
    
}

userSchema.virtual("namedEmail").get(function(){
    return `${this.name} <${this.email}>`;
})

userSchema.post("save", function(doc, next) {
    doc.sayHi();
    next();
})

module.exports = mongoose.model("User", userSchema);