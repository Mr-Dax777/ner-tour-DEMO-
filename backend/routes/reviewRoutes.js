const express = require('express');
const router = express.Router();

const { addReview } = require('../controllers/reviewController');

// POST /api/locations/:id/reviews - add a review for a location
router.post('/:id/reviews', addReview);

module.exports = router;