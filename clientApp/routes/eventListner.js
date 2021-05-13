const {EventListner} = require('./Events')

// Block Event Listener 

let blockEvent = new EventListner();
blockEvent.setRoleAndIdentity("hospital","HospitalAdmin")
blockEvent.initChannelAndChaincode("organchannel", "organ");
blockEvent.blockEventListner('blockEvent')



// Chaincode event listener for new addition of Donor and Patient

let donorEvent = new EventListner();
donorEvent.setRoleAndIdentity("donor","admin")
donorEvent.initChannelAndChaincode("organchannel", "organ");
donorEvent.contractEventListner('SampleListner','addDonorEvent')

let patientEvent = new EventListner();
patientEvent.setRoleAndIdentity("hospital","HospitalAdmin")
patientEvent.initChannelAndChaincode("organchannel", "organ");
patientEvent.contractEventListner('SampleListner','addPatientEvent')

let matchEvent = new EventListner();
matchEvent.setRoleAndIdentity("gao","GAOadmin")
matchEvent.initChannelAndChaincode("organchannel", "organ");
matchEvent.contractEventListner('SampleListner','addMatchEvent')



let tnxEvent = new EventListner();
tnxEvent.setRoleAndIdentity("hospital","HospitalAdmin")
tnxEvent.initChannelAndChaincode("organchannel", "organ");

tnxEvent.txnListner('deletePatient')