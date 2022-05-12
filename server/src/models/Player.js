import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const PlayerSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true },
        last: { type: String, required: false },
    },
    company: String,
    position: String,
    foundFrom: String,
    email: {type: String, required: [true, "Please provide an e-mail"], unique: true, match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please provide a valid e-mail"]},
    password: {type: String, required: false, minlength: 6, select: false},
    signedupAt: { type: Date, required: true},
    permissions: Array,
    currentGameID: String,
    resetPasswordExpire: Date,
    resetPasswordToken: String,
    gameHistory: [{ gameID: String, won: Boolean, tie: Boolean}],
    allGameIDs: Array,
    isGoogle: Boolean,
}, { timestamps: true })

// Called before saved to DB
// Checks if password was modified and hashes it 
PlayerSchema.pre("save", async function (next){
    if (!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

})

// Checks password on login
PlayerSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
}

// Provides signed JWT
PlayerSchema.methods.getSignedJWT = function(){
    return jwt.sign({ id: this._id, permissions: this.permissions, allGameIDs: this.allGameIDs }, process.env.JWT_SECRET)
}

// Creates reset token and expiry date
PlayerSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // 10 mins

    return resetToken;

}

const Player = mongoose.model("Player", PlayerSchema);

export default Player;