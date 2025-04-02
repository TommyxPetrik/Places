const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    description: { type: String, maxlength: 300 },
    users: { type: Number, default: 0 },
    usersids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subplacesCount: { type: Number, default: 0 },
    subplaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subplace" }],
    createdAt: { type: Date, default: Date.now }
});

// Middleware, ktorý sa spustí po update
placeSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const subplaceCount = doc.subplaces.length;
        await doc.updateOne({ subplacesCount: subplaceCount });
    }
});

const PlaceModel = mongoose.model("Place", placeSchema);
module.exports = PlaceModel;
