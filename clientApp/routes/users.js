var express = require('express');
var router2 = express.Router();

const {client} = require('./client')

// ************* Recipient Page **********//
router2.get('/', function(req, res, next) {
  res.render('recipient', { title: 'Recipient Dashboard' });
});

/* GET users listing. */
router2.get('/recipient/recipientupdate', function(req, res, next) {
  res.render('recipientupdate', { title: 'Recipient'});
});
// ***************display all***//
 router2.get('/rtable', function(req, res, next) {

// console.log("converted in index message:---"+Cardata);
res.render('rtable', { title: 'table'});
//   res.render('rtable', { title: 'table' ,Cardata});
//   })
});

router2.get('/event', function(req, res, next) {
  res.render('event', { title: 'Event' });
});

// creation //

router2.post('/patientwrite',function(req,res){
console.log("inside user.js patientwrite");
  const id = req.body.pId;
  const pName = req.body.pName;
  const hospital = req.body.hospital;
  const blood = req.body.pGrp;
  const organ = req.body.pOrgan;
  const priority = req.body.pPriority;
  const rdate = req.body.reqstDate;
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("hospital","HospitalAdmin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndSubmitTxn(
      "addPatient",
      id,pName,hospital,blood,organ,priority,rdate
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
router2.post('/patientread',async function(req,res){
  const Qid = req.body.QidNumb;
  console.log("inside index.js"+Qid);
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("hospital","HospitalAdmin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndEvalTxn("readPatient", Qid)
  .then(message => {
    console.log("message returned from chaincode"+message.toString());
    res.send({ PatientData : message.toString() });
  })
   .catch (error=> {

            console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
            // return error.endorsements[0].message;
    res.send({PatientData :error.endorsements[0].message})
        })
 })
//  Deletion

 router2.post('/patientdelete',async function(req,res){
  const Qid = req.body.QidNumb;
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("hospital","HospitalAdmin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndSubmitTxn("deletePatient", Qid)
  .then(message => {
    console.log(message.toString());
    res.send({ Cardata : message.toString() });
  });
 })
 

 router2.post('/updatewrite',function(req,res){
  console.log("inside index.js updatewrite");
    const id = req.body.pId;
    const name = req.body.pName;
    const hospital = req.body.hospital;
    const blood = req.body.pGrp;
    const organ = req.body.pOrgan;
    const priority = req.body.pPriority;
    
    let ManufacturerClient = new client();
    ManufacturerClient.setRoleAndIdentity("hospital","HospitalAdmin")
    ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
    ManufacturerClient.generateAndSubmitTxn(
        "updatePatient",
        id,name,hospital,blood,organ,priority
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
  
  router2.post('/hospitalread',async function(req,res){
    const Qid = req.body.QidNumb;
    console.log("inside index.js"+Qid);
    let ManufacturerClient = new client();
    ManufacturerClient.setRoleAndIdentity("hospital","HospitalAdmin")
    ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
    ManufacturerClient.generateAndEvalTxn("queryHospitalInfo", Qid)
    .then(message => {
      console.log("message returned from chaincode"+message.toString());
      res.send({ HospitalData : message.toString() });
    })
     .catch (error=> {
  
              console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
              // return error.endorsements[0].message;
      res.send({HospitalData :error.endorsements[0].message})
          })
   })
  
module.exports = router2;
