const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  listing_url: { type: String  },
  name: { type: String},
  summary: { type: String},
  space: { type: String },
  description: { type: String},
  neighborhood_overview: { type: String},
  notes: { type: String},
  transit: { type: String},
  access: { type: String },
  interaction: { type: String},
  house_rules: { type: String},
  property_type: { type: String},
  room_type: { type: String },
  bed_type: { type: String },
  minimum_nights: { type: Number},
  maximum_nights: { type: Number},
  cancellation_policy: { type: String  },
  last_scraped: { type: Date},
  calendar_last_scraped: { type: Date},
  first_review: { type: Date},
  last_review: { type: Date},
  accommodates: { type: Number },
  bedrooms: { type: Number },
  beds: { type: Number},
});

module.exports = listingSchema;