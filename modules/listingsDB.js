require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../modules/listingSchema.js');

class ListingDB {
  constructor() {
    this.ListingModel = mongoose.model('listingsAndReviews', Listing, 'listingsAndReviews');//here we are creating the model for the collection
  }

  async initialize() {
    try {
      await mongoose.connect(process.env.MONGODB_CONN_STRING);
      console.log('MongoDB Connected');
    } catch (err) {
      console.error('Error connecting to MongoDB', err);
      throw err;
    }
  }

  async addListing(listingData) {
    try {
      const newListing = new this.ListingModel(listingData);
      return await newListing.save();
    } catch (error) {
      throw new Error('Error adding ' + error.message);
    }
  }

  async getAllListings(page = 1, perPage = 10, name) {
    try {
      let filter = {};//making this empty by default cuz returns all listings
      if (page < 1) {
        page = 1;
      } else {
        page = parseInt(page);
      }
      if (perPage < 1) {
        perPage = 1;
      } else {
        perPage = parseInt(perPage);
      }
      if (name) { //case sensative match
        filter.name = name;
      }
      const listings = await this.ListingModel.find(filter).skip((page - 1) * perPage).limit(perPage);
      const total = await this.ListingModel.countDocuments(filter);
      return { listings, total, pages: total / perPage, page };
    } catch (err) {
      throw new Error('Failed to get ' + err.message);
    }
  }

  async getListingById(id) {
    try {
      return await this.ListingModel.findById(id);
    } catch (error) {
      throw new Error('Error fetching ' + error.message);
    }
  }

  async updateListing(id, updateData) {
    try {
      return await this.ListingModel.findByIdAndUpdate(id, updateData, { new: true }); //finds listing by id and updates it 
    } catch (error) {
      throw new Error('Error updating ' + error.message);
    }
  }

  async deleteListing(id) {
    try {
      return await this.ListingModel.findByIdAndDelete(id);//basically deletes listing by id
    } catch (error) {
      throw new Error('Error deleting ' + error.message);
    }
  }
}

module.exports = ListingDB;
