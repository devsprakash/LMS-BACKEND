const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const superAdminAuthenticate = require('../../middleware/super_admin_authenticate');
const { seat_booking_validator, ValidatorResult , delete_booking_validator } = require('../../validation/seat_booking.validator');
const { seatBooking, SeatBookingList, deleteBooking } = require('../controllers/seatbooking.controller');


router.post('/seatBooking' , seat_booking_validator , ValidatorResult , authenticate , seatBooking)
router.get('/seatBookingList' , superAdminAuthenticate , SeatBookingList )
router.delete('/delete_booking' , delete_booking_validator , ValidatorResult , superAdminAuthenticate , deleteBooking)


module.exports= router;