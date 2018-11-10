const express = require("express");
const router = express.Router();

// Import Routes Version
import V1 from './v1/main.js';

// Welcome Message
router.get("/", function (req, res) {
  res.status(200).json({
    status: 200,
    message: 'owshine, healty!.'
  })
})

// // Version Use
router.use('/v1', V1);

module.exports = router;