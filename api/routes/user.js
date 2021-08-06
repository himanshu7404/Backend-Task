const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const multer = require('multer');
const jwbt = require('jsonwebtoken');
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


router.post('/login',(req, res, next) => {
    User.find({ "username" : req.body.username})
    .exec()
    .then(user => {
        if (user.length < 1){
            res.status(401).json({
                message: user
        })
    
     }
     if (req.body.password == user[0].password){
         const token = jwbt.sign({
             user: user[0].username,
             userId: user[0]._id

         },"secret",
         {
             expiresIn: "1h"
         },
         )
        res.status(200).json({
            message: 'Auth Successfull',
            token: token
     })}
     
        res.status(401).json({
            message: 'Auth Failed'
           
     });

     
}
)});
router.get('/logout', checkAuth, (req, res) => {
         res.clearCookie("jwbt");
}
)
router.post('/signup',upload.single('userImage'),(req, res, next) => {
   
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        organisation: req.body.organisation,
        designation: req.body.designation,
        username: req.body.username,
        password: req.body.password,
        userImage: req.file.path
    });
    user.save();
    res.status(201).json({
        message: 'Add User',
        addedUser: user
    });
}
);

/*

router.get('/',(req, res, next) => {
    User.find()
    .select("id name organisation designation username password userImage")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            Users: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    organisation: doc.organisation,
                    designation: doc.designation,
                    username: doc.username,
                    password: doc.password,
                    userImage: doc.userImage,
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
*/
module.exports = router;