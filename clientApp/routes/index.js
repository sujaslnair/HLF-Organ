var express = require('express');
var router = express.Router();
const {client} = require('./client')

const{eventGenerator} = require('./Events')



// ************* Donor Page **********//
router.get('/', function(req, res, next) {
  res.render('donor', { title: 'Donor Dashboard' });
});
router.get('/donor/donorupdate', function(req, res, next) {
  res.render('donorupdate', { title: 'Dono'});
});
// ***************display all***//
router.get('/table', function(req, res, next) {
  // location.reload();
  // window.location.reload();
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("donor","admin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndEvalTxn("queryAllDonor").then(message => {
    // console.log(typeof message.toString());
    console.log(message.toString());
   

let Cardata = JSON.parse(message);
console.log("converted in index message:---"+Cardata);

  res.render('table', { title: 'table' ,Cardata});
  })
});

router.get('/event', function(req, res, next) {
  res.render('event', { title: 'Event' });
});

// creation //

router.post('/donorwrite',function(req,res){
console.log("inside index.js donorwrite");
  const id = req.body.donorId;
  const name = req.body.donorName;
  const organ = req.body.organType;
  const blood = req.body.donorGrp;
  const ph = req.body.donorPh;
  const add = req.body.donorAdd;
  
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("donor","admin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndSubmitTxn(
      "addDonor",
      id,name,organ,blood,ph,add
    )
    .then(message => {
      res.send({msg:"Data added"} );
    })
    .catch (error=> {

      console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
      // return error.endorsements[0].message;
res.send({msg:error.endorsements[0].message})
  })
});

// Reading //
router.post('/donorread',async function(req,res){
  const Qid = req.body.QidNumb;
  console.log("inside index.js"+Qid);
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("donor","admin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndEvalTxn("readDonor", Qid)
  .then(message => {
    console.log("message returned from chaincode"+message.toString());
    res.send({ DonorData : message.toString() });
  })
   .catch (error=> {

            console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
            // return error.endorsements[0].message;
    res.send({DonorData :error.endorsements[0].message})
        })
 })
//  Deletion

 router.post('/donordelete',async function(req,res){
  const Qid = req.body.QidNumb;
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("donor","admin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndSubmitTxn("deleteDonor", Qid)
  .then(message => {
    console.log(message.toString());
    res.send({ Cardata : message.toString() });
  });
 })
 

 router.post('/updatewrite',function(req,res){
  console.log("inside index.js updatewrite");
    const id = req.body.donorId;
    const name = req.body.donorName;
    const organ = req.body.organType;
    const blood = req.body.donorGrp;
    const ph = req.body.donorPh;
    const add = req.body.donorAdd;
    
    let ManufacturerClient = new client();
    ManufacturerClient.setRoleAndIdentity("donor","admin")
    ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
    ManufacturerClient.generateAndSubmitTxn(
        "updateDonor",
        id,name,organ,blood,ph,add
      )
      .then(message => {
        res.send("message successful" );
      })
      .catch (error=> {
  
        console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
        // return error.endorsements[0].message;
  res.send(error.endorsements[0].message)
    })
  });
  

module.exports = router;
