const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing');
const Booking = require('./models/booking');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');

const MONGO_URL = "mongodb://127.0.0.1:27017/vicinity";

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// Use express-session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
}));

// Use connect-flash middleware
app.use(flash());

// Middleware to make flash messages available in the response
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});

// Create a route for booking
app.post("/listings/booking", async (req, res) => {
    try {
        // Create a new booking using the request body
        const newBooking = new Booking(req.body.listing);

        // Save the new booking to the database
        await newBooking.save();

        // Set a success message using flash
        req.flash('success_message', 'Your booking has been successfully completed!');

        // Redirect back to the same page (or a specific page to show the message)
        res.redirect("/listings/book"); // You can redirect to the page where the form is
    } catch (error) {
        // Handle any errors
        console.error("Error creating booking:", error);
        req.flash('error_message', 'There was an error while processing your booking.', error);
        res.redirect("/listings/book"); // Redirect to the form page with an error message
    }
});


// Create a route for add new listing
app.post("/listings/admin/new", async (req, res) => {
    try {
        // Create a new booking using the request body
        const newListing = new Listing(req.body.listing);

        // Save the new booking to the database
        await newListing.save();

        // Set a success message using flash
        req.flash('success_message', 'Your new Listing has been successfully Added!');

        // Redirect back to the same page (or a specific page to show the message)
        res.redirect("/listings/admin/newListing"); // You can redirect to the page where the form is
    } catch (error) {
        // Handle any errors
        console.error("Error creating booking:", error);
        req.flash('error_message', 'There was an error while adding your new listing.');
        res.redirect("/listings/admin/newListing"); // Redirect to the form page with an error message
    }
});

//create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings/book");
});

//open admin dashboard
app.get("/listings/adminDashboard" , async(req , res) => {
    try {
        res.render("./listings/adminDashboard.ejs");
    } catch (err) {
        res.status(500).send('Server Error');
    }
})

//open new listing
app.get("/listings/admin/newListing" , async(req , res) => {
    try {
        res.render("./listings/new.ejs");
    } catch (err) {
        res.status(500).send('Server Error');
    }
})

// Admin Dashboard booking Route
app.get("/listings/admin/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch all bookings
        res.render("./listings/bookings.ejs", { bookings });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//deleting booking route
app.delete('/listings/delete-booking/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.redirect("/listings/admin/bookings");
    } catch (err) {
        res.status(500).send('Server Error');
    }
});



app.get("/", (req, res) => {
    res.send("hi, i am root");
});

//users show all strings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/userListings.ejs", { allListings });
});

//users show listing
app.get("/listings/:id" , async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/userShow.ejs" , {listing});
})

//new Route
app.get("/listings/book", (req, res) => {
    res.render("listings/book.ejs");
});

//admin edit listings-> show all listing
app.get("/listings/admin/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
});

//Show Route
app.get("/listings/admin/:id", async (req, res) => {
    let { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
    }

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("./listings/show.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Server error");
    }
});



//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings/admin/listings");
})







// app.get("/testlisting" ,async (req,res) => {
//     let samplelisting = new Listing({
//         title: "new palace",
//         description: "very interesting palace",
//         price: 2000,
//         location: "Rajasthan",
//         country: "India"
//     });

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("testing sucessfull");
// });

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});