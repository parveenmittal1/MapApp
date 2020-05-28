const express = require('express');

const router = express.Router();
const Joi=require('joi');
const monk=require('monk');
const db=require('../db');
const messages=db.get('messages');


const schema = Joi.object().keys({
  name: Joi.string().alphanum().min(1).max(100).required(),
  message: Joi.string().min(1).max(100).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-90).max(90).required(),
})
router.get('/', (req, res) => {
  messages
      .find()
      .then(allMessages => {
        res.json(allMessages);
      });
});


router.post('/', (req, res,next) => {
  const result = Joi.validate(req.body, schema);
  if(result.error==null){
    const {name ,message,longitude,latitude}=req.body;
    const  userMessage={
      name,
      message,
      longitude,
      latitude,
      date:Date.now()
    }
    messages.insert(userMessage)
        .then(insertedMessage=>{
          res.json(insertedMessage);
        })
  }else {
    next(result.error);
  }
});
module.exports = router;
