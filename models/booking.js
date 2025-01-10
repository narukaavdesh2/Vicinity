const mongoose = require('mongoose');

// Define the schema for a booking
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Email format validation
    },
    phoneNumber: {
        type: String,
        required: true // Phone number is required
    },
    propertyAddress: {
        type: String,
        required: false // Property address is optional (not required)
    },
    propertyType: {
        type: String,
        required: false, // Property type is optional (not required)
        enum: ['farm-house', 'apartment', 'villa', 'private-room', 'bungalow', 'commercial-purpose', 'other'] // Allowed property types
    },
    otherProperty: {
        type: String,
        required: false //not required
    },
    services: {
        type: [String],
        required: false, // Services are optional
        enum: ['property-management', 'digital-marketing', 'consulting-services', 'service-for-guests', 'service-for-clients', 'other'] // Allowed services
    },
    otherService: {
        type: String,
        required: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create a model from the schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
