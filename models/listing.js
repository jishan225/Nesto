const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "C:\\Users\\aman\\Downloads\\8efec4b4-00ce-4842-bdc5-0aafd4bae05d.jpg",
            set: (v) => v === "" ? "C:\\Users\\aman\\Downloads\\8efec4b4-00ce-4842-bdc5-0aafd4bae05d.jpg" : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }] 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
