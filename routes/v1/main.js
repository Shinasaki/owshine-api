const express = require("express");
const router = express.Router();

import Player from './player';
import Import from './import';


// Welcome Message
router.get("/", function (req, res) {


  res.status(200).json({
    status: 200,
    message: 'owshine version1, healty!.'
  })
})

router.use('/player', Player);
router.use('/import', Import);

module.exports = router;