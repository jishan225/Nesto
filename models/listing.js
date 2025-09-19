const mongoose = require("mongoose");
const Review = require("./review.js");
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
            default: '/placeholders/no-image.jpg',
            set: (v) => v === "" ? '/placeholders/no-image.jpg' : v,
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

//mongoose post middleware

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
     await Review.deleteMany({_id: {$in: listing.reviews}});  
    }  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
