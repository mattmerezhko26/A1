require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const ListingDB = require('./modules/listingsDB.js');
const db = new ListingDB();
const HTTP_PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

app.post('/api/listings', async (req, res) => {
  try {
    const newListing = await db.addListing(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add listing', details: err.message });
  }
});

app.get('/api/listings', async (req, res) => {
  try {
    const { page = 1, perPage = 10, name } = req.query;
    const listings = await db.getAllListings(Number(page), Number(perPage), name);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listings', details: err.message });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching listing', details: err.message });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  try {
    const updated = await db.updateListing(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating listing', details: err.message });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    const deleted = await db.deleteListing(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting listing', details: err.message });
  }
});

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
});
