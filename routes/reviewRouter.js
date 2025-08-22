const express = require('express')
const { getAllReviews } = require('../controllers/reviewController')

const router = express.Router();

router.get('/all', getAllReviews);

module.exports = router;