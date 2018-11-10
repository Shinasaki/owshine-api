const express = require("express");
const router = express.Router();

import Player from '../../models/player';
import axios from 'axios';
import isEmpty from 'lodash.isempty';
import msg from './msg';


// get all player
router.get("/", function (req, res) {
  Player.find({}).sort({
    rating: -1
  }).limit(100).exec((err, data) => {
    if (data.error) return res.status(400).json(msg.isEmpty(data, err))

    return res.status(200).json({
      status: 200,
      message: data
    });
  });
});

router.get("/count", function (req, res) {
  Player.find({}).count().exec((err, data) => {
    if (data.error) return res.status(400).json(msg.isEmpty(data, err))

    return res.status(200).json({
      status: 200,
      message: data
    });
  });
});

router.get("/count/rank", function (req, res) {
  Player.find({
    rating: {
      $gt: 0
    }
  }).count().exec((err, data) => {
    if (data.error) return res.status(400).json(msg.isEmpty(data, err))

    return res.status(200).json({
      status: 200,
      message: data
    });
  });
});

router.post("/", (req, res) => { // insert & sort


  if (isEmpty(req.body) || !req.body.payload) return res.status(400).json({
    status: 400,
    message: 'bad request, payload must not empty'
  });


  axios.get(`https://ow-api.com/v1/stats/pc/us/${req.body.payload}/profile`).then((resp) => {

    const data = resp.data;

    // check tag notfound.
    if (data.error) return res.status(400).json(msg.isEmpty(data, data.err))

    const format = { // format data to create
      tag: data.name,
      rating: data.rating,
      portrait: data.icon,
      profile: {}
    }

    // check tag is exist.
    Player.findOneAndUpdate({
      tag: format.tag
    }, {
      $set: format
    }, {
      new: true,
      upsert: true
    }, (err, data) => { // response

      // check mongoose is error
      if (err) return res.status(400).json(msg.isfail(data, err));

      // if player is unrank resp --> unrank
      if (data.rating > 0) {

        // get user ranking
        Player.find({
          rating: {
            $gt: data.rating
          }
        }).countDocuments().exec((err, data) => {
          if (err) return res.status(400).json(msg.isfail(data, err));

          Player.find({
            rating: {
              $gt: 0
            }
          }).countDocuments((err, count) => {

            return res.status(201).json({ // success
              status: 201,
              message: {
                ranking: data + 1,
                profile: format,
                count: count
              }
            });

          });

        });

      } else {

        Player.find({
          rating: {
            $gt: 0
          }
        }).countDocuments((err, count) => {

          return res.status(201).json({ // success
            status: 201,
            message: {
              ranking: 'unrank',
              profile: format,
              count: count
            }
          });

        });

      }
    });

  }).catch(err => { // catch error
    return res.status(400).json({
      status: 400,
      message: err.data || err
    });
  })



})


module.exports = router;