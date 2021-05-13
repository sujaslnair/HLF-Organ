# HLF-Organ
Organ Donation and tracking using Hyperledger Fabric
About the Project

Organ donation is the process of extracting an organ from an organ donor and then
surgically replacing that organ in a recipient. The donor can be living or deceased.Here in this
project it is focused on living Donor and can donate a kidney,Liver,Pancreas or intestine.
This is a web based application that tracks an organ donation with blockchain
technology.Here the Donor and the Hospitals have to register themselves to the system
with needed information.The hospitals on need will register the recipient with the organ details.the
government authority will have a dashboard listing all the donors and the recipient/patient info.here
the assignment of organ is done based on some crietria.

Work Flow

● Donors are one who donates organ.They have to register themselves to the network with
details about the organ.Once its registered,an asset is created with the organ.

● The recipients are registered from the hospital.based on the medical conditions the needed
organs are specified,along with the priority.Here the creation date will get added(which can
not be updated) They are also stored in the Ledger.

● All these donors and recipients are shared with the government authority.(GAO).Here the
matching is done based on Organ,blood group and the priority.Once matching is
successful,the recipient is updated with the matched donor details and the donor is deleted.
Here a private data collection is implemented so that the patient if wants can send an incentive
to the Donor as a token of thanks.

● Once patient is assigned,or if the priority is above 2 then the assignment can’t be done.

● Block events are generated for every submit transactions.

● When ever a new patient or donor is registered an event is generated and also if a match is
done with high priority(1) its notified throug events.

Running the Application

Prerequisites
-Visual Studio code,Hyperledger Fabric Binaries ,Docker Docker compose,ansible,npm
Installation
•
Install the required ansible role using the command
$ ansible-galaxy install -r requirements.yml –force

clone the repo https://github.com/sujaslnair/HLF-Organ.git

1 Package ,install and instantiate chaincode

2 for running ClientApp::~/project/clientApp$ npm start,and in browser use localhost:3000

3 For events:~/project/clientApp/routes$ node eventListner
