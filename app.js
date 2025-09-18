const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //one week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
    next();
}); 

//DB Connection.
main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Nesto");
}

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)

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