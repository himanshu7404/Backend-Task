const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkAuth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toString() + file.originalname);
    }
});
const upload = multer({storage: storage});

const Child = require('../models/child');

router.get('/', checkAuth ,(req, res, next) => {
    Child.find()
    .select("id name sex dateOfBirth fatherName motherName state district childImage")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            children: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    sex: doc.sex,
                    dateOfBirth: doc.dateOfBirth,
                    fatherName: doc.fatherName,
                    motherName: doc.motherName,
                    state: doc.state,
                    district: doc.district,
                    childImage: doc.childImage,
                    request: {
                        type:"GET",
                        url: "https://localhost:5000/child/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
     
}
);
router.post('/', checkAuth ,upload.single('childImage'),(req, res, next) => {
   
    const child = new Child({
        _id:  new mongoose.Types.ObjectId(),
        name: req.body.name,
        sex: req.body.sex,
        dateOfBirth: req.body.dob,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        state: req.body.state,
        district: req.body.district,
        childImage: req.file.path
    });
    child.save();
    res.status(201).json({
        message: 'Add Child',
        addedchild: child
    });
}
);
router.get("/:childId", checkAuth , (req, res, next) => {
    const id = req.params.childId;
    Child.findById(id)
      .select('id name sex dateOfBirth fatherName motherName state district childImage')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              product: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/District'
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