var express = require('express');
var router3 = express.Router();

const {client} = require('./client')

// ************* Recipient Page **********//
router3.get('/', function(req, res, next) {
  res.render('ngo', { title: 'NGO Dashboard' });
});

/* GET users listing. */
router3.post('/displayDonor',async function(req,res){
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("gao","GAOadmin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndEvalTxn("queryAllDonor").then(message => {
    console.log("message returned from chaincode"+message.toString());
    res.send({ donorData : message.toString() });
  })
   .catch (error=> {

            console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
            // return error.endorsements[0].message;
    res.send({donorData :error.endorsements[0].message})
        })
 })

 router3.post('/displayPatient',async function(req,res){
  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("gao","GAOadmin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndEvalTxn("queryAllPatient").then(message => {
    console.log("message returned from chaincode"+message.toString());
    res.send({ patientData : message.toString() });
  })
   .catch (error=> {

            console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
            // return error.endorsements[0].message;
    res.send({patientData :error.endorsements[0].message})
        })
 })

 router3.post('/matchpost',async function(req,res){

  const pid = req.body.pidNumb;
    console.log("inside index.js"+pid);
    const did = req.body.didNumb;
    console.log("inside index.js"+did);

  let ManufacturerClient = new client();
  ManufacturerClient.setRoleAndIdentity("gao","GAOadmin")
  ManufacturerClient.initChannelAndChaincode("organchannel", "organ");
  ManufacturerClient.generateAndSubmitTxn("matchOrgan",pid,did).then(message => {
    console.log("message matchpost"+message.toString());
    res.send({datadisp: "Assigned and updated" });
  })
   .catch (error=> {

            console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
            // return error.endorsements[0].message;
    res.send({datadisp :error.endorsements[0].message})
        })
 })
module.exports = router3;
