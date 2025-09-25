🏠 Nesto – Property Listing & Booking Website

Nesto is a full-stack property listing and booking platform built on the MVC architecture.
It allows users to browse properties, view details, and make bookings with a secure login/signup authentication system.

This project is developed using Node.js, Express, MongoDB, and EJS for dynamic rendering.

🚀 Features

* User Authentication
-> Login & Signup functionality
-> Secure password storage with hashing
-> Session-based authentication

* Property Listings
-> Add new property listings (for admins/owners)
-> Browse properties with images, titles, and descriptions
-> View individual property details

* Booking System
-> Book available properties
-> Manage user bookings
-> My Bookings page

* MVC Architecture
-> Models – MongoDB schemas for users, properties, and bookings
-> Views – EJS templates for UI
-> Controllers – Handle logic between views and models

* Responsive UI
-> Built with Bootstrap / CSS
-> Works across devices

🛠️ Tech Stack

Frontend – EJS, HTML, CSS, Bootstrap
Backend – Node.js, Express.js
Database – MongoDB (Mongoose ODM)
Authentication – Passport.js / bcrypt (for hashing passwords)
Architecture – MVC (Model-View-Controller)

* PROJECT STRUCTURE
Nesto/
│
├── models/            # MongoDB models (User, Listing, Booking)
├── routes/            # Express route handlers
├── controllers/       # Controllers for handling logic
├── views/             # EJS templates
│   ├── listings/      # Property-related views
│   ├── bookings/      # Booking-related views
│   ├── users/         # Auth views (login, signup)
│   └── layouts/       # Boilerplate layouts
├── public/            # Static assets (CSS, JS, images)
├── app.js             # Main application entry
├── package.json       # Dependencies & scripts
└── README.md          # Project documentation

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/nesto.git
cd nesto

2️⃣ Install dependencies
npm install

3️⃣ Setup Environment Variables
Create a .env file in the root directory and add:
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

4️⃣ Run the application
npm start

🏗️ Future Improvements

Role-based access (Admin, User, Owner)
Advanced search & filters for properties
Payment gateway integration
Google/Facebook OAuth login
Reviews & Ratings for properties

Website Link : https://nesto-snrt.onrender.com/listings


