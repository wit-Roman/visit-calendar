const express = require('express')
//const waitRequest = require('./../model/send-request.js')
const methods = require('../model/static-methods.js')
const data = require('../model/data.js')
const sendRouter = express.Router()

sendRouter.use('/', (req, res, next) => {
  req.accepts('application/json')
  if ( req.query.hasOwnProperty("api_result") &&
    methods.validateSession(req.query) ) {

    const response = JSON.parse(req.query.api_result).response[0]
    const randomNumber = Math.random().toString(36).substring(2, 12)
    const session_key = randomNumber + "_" + req.query.group_id + "_" + req.query.viewer_id

    res.cookie('session_key', session_key,
      { signed:true, expire: 24*60*60*1000, path:'/', secure:true, httpOnly:true })

    const param = {
      api_id: parseInt(req.query.api_id),
      group_id: parseInt(req.query.group_id),
      viewer_id: parseInt(req.query.viewer_id),
      viewer_type: parseInt(req.query.viewer_type),
      user_id: parseInt(req.query.user_id),
      can_access_closed: (+!!response.can_access_closed),
      first_name: response.first_name.toString(),
      last_name: response.last_name.toString(),
      photo_50: response.photo_50.toString(),
      session_key
    }

    data.create_session(param)
  } else {
    if ( (typeof req.signedCookies.session_key === "undefined" ||
    req.signedCookies.session_key == false) &&
    !req.originalUrl.includes('welcome') &&
    !req.originalUrl.includes('tester') &&
    !req.originalUrl.includes('static') )
      return res.redirect(307, '/welcome/');
  }

  next()
})

sendRouter.get('/change', (req, res) => {
  req.accepts('application/json')
  if ( !methods.validateDate(req.query.d) )
    return res.status(400).send("Bad Request");
  const selectedUserDateISO = req.query.d
  const selectedUserDateInt = Date.parse(selectedUserDateISO)
  const session_key = req.signedCookies.session_key
  const group_id = (req.query.hasOwnProperty("g") && !isNaN(req.query.g)) ? parseInt(req.query.g) : parseInt(session_key.split("_")[1])
  const viewer_id = (req.query.hasOwnProperty("v") && !isNaN(req.query.v)) ? parseInt(req.query.v) : parseInt(session_key.split("_")[1])

  data.write_selected_date(group_id,viewer_id,session_key,selectedUserDateInt).then(result => {
    return res.status(200).send(result)
  }).catch(error => { 
    console.log(error)
    return res.status(404).send("Not Found")
  })
})
  
sendRouter.get('/val', (req, res) => {
  req.accepts('application/json')
  if ( isNaN(req.query.l) )
    return res.status(400).send("Wrong changed");
  if ( (typeof req.signedCookies.session_key === "undefined" ||
    req.signedCookies.session_key == false) &&
    !req.originalUrl.includes('/welcome') &&
    !req.originalUrl.includes('/tester') )
     return res.redirect(307, '/welcome/');
  const session_key = req.signedCookies.session_key
  const group_id = (req.query.hasOwnProperty("g") && !isNaN(req.query.g)) ? parseInt(req.query.g) : parseInt(session_key.split("_")[1])
  const viewer_id = (req.query.hasOwnProperty("v") && !isNaN(req.query.v)) ? parseInt(req.query.v) : parseInt(session_key.split("_")[1])
  const last = parseInt(req.query.l)

  data.get_current(group_id,viewer_id,session_key,last).then(result => {
    return res.status(200).send(result)
  }).catch(error => {
    console.log(error)
    return res.status(404).send("Not Found")
  })
})

sendRouter.get('/setting', (req, res) => {
  req.accepts('application/json')
  const session_key = req.signedCookies.session_key
  const group_id = (req.query.hasOwnProperty("g") && !isNaN(req.query.g) && req.query.g !== '0') ? parseInt(req.query.g) : parseInt(session_key.split("_")[1])

  data.get_setting(group_id).then(result => {
    return res.status(200).send(result)
  }).catch(error => {
    console.log(error)
    return res.status(404).send("Not Found")
  })
})

sendRouter.post('/setting', (req, res) => {
  req.accepts('application/json')
  let bodyData = ''
  req.on('data', (data) => {
    bodyData += data;
  })
  req.on('end', () => {
    const body = JSON.parse(bodyData)
    //console.log(body)
    const {accessMember,widgetEnable,widgetWeeks,widgetToken,autoUpd,allowedDays1,allowedDays2,allowedDays3,allowedDays4,allowedDays5,allowedDays6,allowedDays7,allowedDaysMin,allowedDaysMax,blockedDays,group_id} = body
    const session_key = req.signedCookies.session_key
    const group_id_confirm = (typeof group_id !=="undefined" && !isNaN(group_id) && group_id != 0 ) ? parseInt(group_id) : parseInt(session_key.split("_")[1])
    
    /*if ( body.hasOwnProperty('parentUrl') &&
     body.parentUrl.includes('_-') &&
     !isNaN(body.parentUrl.split("_-")[1]) )
      group_id = body.parentUrl.split("_-")[1];
    console.log(body,group_id)*/
    if ( !methods.validateSettings(body,group_id_confirm) )
      return res.status(400).send("Bad Request");

    data.save_setting(group_id_confirm,session_key,accessMember,widgetEnable,widgetWeeks,widgetToken,autoUpd,allowedDays1,allowedDays2,allowedDays3,allowedDays4,allowedDays5,allowedDays6,allowedDays7,allowedDaysMin,allowedDaysMax,blockedDays).then(result => {
      return res.status(200).send(result)
    }).catch(error => {
      console.log(error)
      return res.status(422).send("Unprocessable Entity")
    })
  })
})

sendRouter.get('/tester/:group/:viewer', (req, res) => {
  const group_id = parseInt(req.params.group)
  const viewer_id = parseInt(req.params.viewer)
  const randomNumber = Math.random().toString(36).substring(2, 12)
  const session_key = randomNumber + "_" + group_id + "_" + viewer_id

  res.cookie('session_key', session_key,
    { signed:true, expire: 24*60*60*1000, path:'/', secure:true, httpOnly:true })
  const photo_50 = ['http://pngimg.com/uploads/number1/number1_PNG14878.png','https://banner2.kisspng.com/20171209/8c6/golden-stereo-2-5a2c7bd1bc8717.7156664115128647217722.jpg','http://www.sclance.com/pngs/3-png/3_png_5033.png','https://icon2.kisspng.com/20171220/fke/number-4-png-5a3a5135182d63.115348981513771317099.jpg','http://pngimg.com/uploads/number5/number5_PNG15053.png']
  const param = {
    api_id: 6841218,
    group_id,
    viewer_id,
    viewer_type: 4,
    can_access_closed: 1,
    first_name: "tester_" + viewer_id,
    last_name: "test_" + group_id,
    photo_50: photo_50[viewer_id-1],
    session_key
  }
  data.create_session(param)
  return res.redirect(307, '/')
})

sendRouter.get('/checkstore', (req, res) => {
  data.check_store().then(result => {
    return res.status(200).send( JSON.stringify(result) )
  }).catch(error => {
    console.log(error)
    return res.status(422).send("Unprocessable Entity")
  })
})

module.exports = sendRouter