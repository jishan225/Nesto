const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{ listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//DB Connection.
main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Nesto");
}

//validation Listing schema
const validationListing = (req, res, next) => {
    let {error} = listingSchems.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//validate review 
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index route
app.get("/listings", wrapAsync(async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings", {allListings});
}));
// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the ocean",
//         price: 1200,
//         location: "Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("success testing");
// });

//New ROUTE
app.get("/listings/new", (req, res) =>{
   res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings", validationListing, wrapAsync(async(req, res, next) =>{
    // if(!req.body.listing){
    //     throw new ExpressError(404, "Send valid data for listing");
    // }
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
})
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit.ejs", {listing});
}));

//Update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    try {
        let {id} = req.params;
        
        // Convert string URL to proper image object structure
        if (req.body.Listing.image && typeof req.body.Listing.image === 'string') {
            req.body.Listing.image = {
                filename: "listingimage",
                url: req.body.Listing.image
            };
        }
        
        console.log("Update data:", req.body.Listing); // Debug log
        
        await Listing.findByIdAndUpdate(id, {...req.body.Listing});
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).send("Server error");
    }
}));


//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//post reviews route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

   res.redirect(`/listings/${id}`);
}));

app.get("/", (req, res) => {
    res.send("hola amigo");
});

app.all("/*path", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});


// Error Handler Middleware.
app.use((err, req, res, next) =>{
    let {statusCode=500, message="somehing went wrong!"} = err;
    res.render("listings/error.ejs", {message});
});



app.listen(3000, () => {
    console.log("server is listening at port 3000!!");
    
});