const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const District = require('../models/district');
const checkAuth = require('../middleware/checkAuth');


router.get('/',checkAuth ,(req, res, next) => {
    District.find()
    .select("id name state")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            Districts: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    state: doc.state,
                    request: {
                        type:"GET",
                        url: "https://localhost:5000/District/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
     
}
);
router.post('/',checkAuth ,(req, res, next) => {
   
    const district = new District({
        _id:  new mongoose.Types.ObjectId(),
        name: req.body.name,
        state: req.body.state,
    });
    district.save();
    res.status(201).json({
        message: 'Add District',
        addedDistrict: district
    });
}
);
router.get("/:DistrictId",checkAuth , (req, res, next) => {
    const id = req.params.DistrictId;
    District.findById(id)
      .select('id name state')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              product: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:5000/district'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

module.exports = router;