const express = require("express");
const router = express.Router();

import Player from '../../models/player';
import msg from './msg';
import axios from 'axios';
import isEmpty from 'lodash.isempty';
import fs from 'fs';

router.get("/", function (req, res) {

  const file = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const temp = file[2].data || null;

  if (!temp) return res.status(400).json(msg.isfail('', 'data not found'));

  const data = temp.map((key, index) => {
    return {
      tag: key.tag,
      rank: key.rank,
      portrait: key.portrait
    }
  });

  addPlayer(data);




  // var count = 0;
  // for (let key in data) {
  //   count++;
  //   let item = data[key].tag;

  //   axios.get(`https://ow-api.com/v1/stats/pc/us/${req.body.payload}/profile`).then((resp) => {

  //     const data = resp.data;

  //     // check tag notfound.
  //     if (data.error) {
  //       console.log('[SKIP] Tag Not Found.');
  //     }

  //     const format = { // format data to create
  //       tag: data.name,
  //       rating: data.rating,
  //       portrait: data.icon,
  //       profile: {}
  //     }

  //     // check tag is exist.
  //     Player.findOneAndUpdate({
  //       tag: format.tag
  //     }, {
  //       $set: format
  //     }, {
  //       new: true,
  //       upsert: true
  //     }, (err, data) => { // response

  //       // check mongoose is error
  //       if (err) return res.status(400).json(msg.isfail(data, err));

  //       console.log('[SUCCESS]');
  //       console.log(format);

  //     });

  //   }).catch(err => { // catch error
  //     console.log(err)
  //     // continue;
  //   })

  //   if (count >= data.length) {
  //     return res.status(200).json({
  //       status: 200,
  //       message: 'Success'
  //     });
  //   }
  // }



  // return res.status(200).json({
  //   status: 200,
  //   message: file[2]
  // });

})


async function addPlayer(data) {
  data.forEach(item => {

    axios.get(`https://ow-api.com/v1/stats/pc/us/${item.tag}/profile`).then((resp) => {
      const data = resp.data;

      // check tag notfound.
      if (data.error) {
        console.log('[SKIP] Tag Not Found.');
        return;
      }

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

        console.log('[SUCCESS]');
        console.log(format);

      });

    }).catch(err => { // catch error
      console.log('[ERROR SKIP]');
      return;
    })

  })
}


module.exports = router;