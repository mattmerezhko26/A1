require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../modules/listingSchema.js');

class ListingDB {
  constructor() {}

  async initialize() {
    try {
      await mongoose.connect(process.env.MONGODB_CONN_STRING);
      console.log('MongoDB Connected');
    } catch (err) {
      console.log("Error connecting to MongoDB", err);
      throw err;
    }
  }

  async addListing(listingData) {
    try {
      const ListingModel = mongoose.model('listingsAndReviews', Listing, 'listingsAndReviews');
      const newListing = new ListingModel(listingData);
      return await newListing.save();
    } catch (error) {
      throw new Error('Error adding listing: ' + error.message);
    }
  }

  async getAllListings(page = 1, perPage = 10, name) {
    try {
      page = Math.max(1, parseInt(page, 10));
      perPage = Math.max(1, parseInt(perPage, 10));

      const filter = name ? { name: new RegExp(name, 'i') } : {};  
      const ListingModel = mongoose.model('listingsAndReviews', Listing, 'listingsAndReviews');
      const listings = await ListingModel.find(filter)
        .skip((page - 1) * perPage)
        .limit(perPage);
      const totalListings = await ListingModel.countDocuments(filter);

      return {
        listings,
        totalListings,
        totalPages: Math.ceil(totalListings / perPage),
        currentPage: page
      };
    } catch (error) {
      throw new Error('Error fetching listings: ' + error.message);
    }
  }
}

module.exports = ListingDB;
