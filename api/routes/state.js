const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const State = require('../models/state');
const checkAuth = require('../middleware/checkAuth');


router.get('/',checkAuth ,(req, res, next) => {
    State.find()
    .select("id name")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            States: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    request: {
                        type:"GET",
                        url: "https://localhost:5000/state/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
     
}
);
router.post('/',checkAuth ,(req, res, next) => {
   
    const state = new State({
        _id:  new mongoose.Types.ObjectId(),
        name: req.body.name,
    });
    state.save();
    res.status(201).json({
        message: 'Add State',
        addedState: state
    });
}
);
router.get("/:StateId",checkAuth , (req, res, next) => {
    const id = req.params.StateId;
    State.findById(id)
      .select('id name')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              product: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:5000/state'
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