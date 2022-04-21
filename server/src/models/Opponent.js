const mongoose = require("mongoose");

const OpponentSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
        middle: String
    },
    email: {type: String, required: true},
    signedupAt: { type: Date, required: true},
    currentGameID: String,
    gameHistory: [{ gameID: String, won: Boolean, tie: Boolean}],
}, { timestamps: true })

const Opponent = mongoose.model("Opponent", OpponentSchema);


module.exports = Opponent;