const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const { seat_booking_validator, ValidatorResult } = require('../../validation/seat_booking.validator');
const { seatBooking } = require('../controllers/seatbooking.controller');


router.post('/seatBooking' , seat_booking_validator , ValidatorResult , authenticate , seatBooking)


module.exports= router;