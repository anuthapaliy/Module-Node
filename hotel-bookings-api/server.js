const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
// create a new booking
app.post("/bookings", (request, response) => {
  const newBooking = request.body;

  // level 2 - simple validation, for this level, your server must reject requests to create bookings if:
  //  any property is missing or empty
      for (const property in newBooking) {
        if (!newBooking[property]){
          return response.status(400).json({ error: "All booking properties are required." })
        }
      }

      // level 4 - advanced validation
      // check if the email address is valid(booking should be rejected if email address is not valid and checkoutDate is not after check in date)
      if (!validator.isEmail(newBooking.email)) {
        return response.status(400).json({ error: "Invalid email address." })
      }

      if (!moment(newBooking.checkOutDate).isAfter(newBooking.checkInDate)) {
        return response.status(400).json({ error: "Check-out date must be after check-in date."})
      }
  // Assign an ID to the new booking
  newBooking.id = bookings.length + 1;
  bookings.push(newBooking);
  response.status(201).json(newBooking);
})

// Read one booking, specified by an ID
  app.get("/bookings/:id", (request, response) => {
    const bookingId = parseInt(request.params.id);
    const booking = bookings.find((booking)=> booking.id == bookingId);
    if (booking) {
      response.json(booking);
    } else {
      response.status(404).json({ error: "Booking not found "});
    }
  });

  // Delete a booking specified by an Id
    app.delete("/bookings/:id", (request, response) => {
        const bookingId = parseInt(request.params.id);
        const index = bookings.findIndex((booking) =>booking.id === bookingId);
    if (index !== -1) {
      bookings.splice(index, 1);
      response.status(204).end();
    } else {
      response.status(404).json({ error: "Booking not found" });
    }
    });

    // search by date-level 3
      app.get("/bookings/search", (request, response) => {
        const searchDate = request.query.date;
        if(!searchDate || !moment(searchDate, "YYYY-MM-DD", true).isValid()) {
          return response
          .status(400)
          .json({ error: "Invalid date format, please provide date in YYYY-MM-DD format." });
        }

        const filteredBookings = bookings.filter(
          (booking) =>
          moment(searchDate).isBetween(booking.checkInDate, booking.checkOutDate, null, "[]" )
          );
          response.json(filteredBookings);
      });

      // level-5 - free-text search
        app.get("/bookings/search", (request, response) => {
        const searchTerm = request.query.term;
        if (!searchTerm) {
      return response.status(400).json({ error: "please provide a search term."})
        }

        const filteredBookings = bookings.filter((booking) => {
          const emailMatch = booking.email.includes(searchTerm);
          const firstNameMatch = booking.firstName.includes(searchTerm);
          const surnameMatch = booking.surname.includes(searchTerm);
          return emailMatch || firstNameMatch || surnameMatch;
        })
        response.json(filteredBookings);
      })

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
