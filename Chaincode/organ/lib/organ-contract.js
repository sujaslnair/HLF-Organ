/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const shim = require("fabric-shim");

//PDC Collection name

const​ ​ myCollectionName​ = ​ "CollectionOne"​ ;
class OrganContract extends Contract {

// Private Data collection//
// ***************** */

async​ ​ privateAssetExists​ (ctx​,privateAssetId​ ) {
    const​ ​ buffer​ = ​ await​ ctx.stub​.getPrivateDataHash​(myCollectionName​,privateAssetId)
    return​ (!!​ buffer​ && ​ buffer​.length​>0);
}

async​ ​ createPrivateAsset​(ctx​,privateAssetId​) {
    const​ ​ exists​ = ​ await​​ this.privateAssetExists​(ctx​,privateAssetId​ );
    if (exists) {
        throw new Error(`The Private Asset ${privateAssetId​} already exists`);
    }
    const​ ​ privateAsset​ = {};
    const​ ​ transientData​ = ​ ctx​.stub.getTransient();

    if (transientData.size === 0|| !​transientData​.has('privateValue')){
        throw new Error(`The privateValue key was not specified in transient data `);
    }
    privateAsset.privateValue=transientData.get('privateValue').toString('utf8');
    ​ 
    await ctx.stub.putPrivateData(myCollectionName,privateAssetId,Buffer.from(JSON.stringify(privateAsset)));

}

async​ readPrivateAsset​(ctx​ ,privateAssetId​ ) {
    const​ ​ exists​ = ​ await​​ this.privateAssetExists​(ctx​,privateAssetId​ );
    if (!exists) {
        throw new Error(`The Private Asset ${privateAssetId​} does not exists`);
    }
    const privateData=await ctx.stub.getPrivateData(myCollectionName​,privateAssetId);
    return JSON.parse(privateData.toString());

}
//****Private Data Collection***************//

// For the Donor 
//**************************************** */ 

    async donorExists(ctx, donorId) {
        const buffer = await ctx.stub.getState(donorId);
        return (!!buffer && buffer.length > 0);
    }

//Add -Donor

    async addDonor(ctx, donorId, donorName, organType, donorGrp,donorPh,donorAdd) {
        let logger = shim.newLogger("Chaincode --> ");
        let CID = new shim.ClientIdentity(ctx.stub);
        let mspID = CID.getMSPID();
        logger.info("MSPID : "+ mspID);

        if(mspID == "DonorMSP"){
            const exists = await this.donorExists(ctx,donorId);
            if (exists) {
                throw new Error(`A donor with Aadhar number: ${donorId} already exists`);
            }
            const asset = {
                donorId,
                donorName,
                organType,
                donorGrp,
                donorPh,
                donorAdd,
                rName: "not assigned",
                rId:"not assigned",
                assetType:"Donor"
            };
            const buffer = Buffer.from(JSON.stringify(asset));
            logger.info(asset);
            await ctx.stub.putState(donorId, buffer);

            let addDonorEvent = {Type: 'New Donor Created', donorName:donorName };
            await ctx.stub.setEvent('addDonorEvent', Buffer.from(JSON.stringify(addDonorEvent)));

        }
        else{
            logger.info("Users under the following MSP : "+
                        mspID + "cannot perform this action");
            return("Users under the following MSP : "+
            mspID + "cannot perform this action");
        }
    }

//Read Donor

    async readDonor(ctx, donorId) {
        let logger = shim.newLogger("Chaincode --> ");
        const exists = await this.donorExists(ctx, donorId);
        if (!exists) {
            throw new Error(`A donor with Aadhar number: ${donorId} does not exist`);
        }
        const buffer = await ctx.stub.getState(donorId);
        const asset = JSON.parse(buffer.toString());
        logger.info(asset);
        return asset;
    }
//Deletion -Donor

    async deleteDonor(ctx, donorId) {
        let logger = shim.newLogger("Chaincode --> ");
        let CID = new shim.ClientIdentity(ctx.stub);
        let mspID = CID.getMSPID();
        logger.info("MSPID : "+ mspID);

        if(mspID == "DonorMSP" || mspID == "GAOMSP"){
            const exists = await this.donorExists(ctx, donorId);
            if (!exists) {
                throw new Error(`A donor with Aadhar number: ${donorId} does not exist`);
            }
            await ctx.stub.deleteState(donorId);
        }
        else{
            logger.info("Users under the following MSP : "+
                        mspID + "cannot perform this action");
            return("Users under the following MSP : "+
            mspID + "cannot perform this action");
        }
    }

//update Donor -Ph,address,group,name
async updateDonor(ctx, donorId,newName,newOrg,newGrp,newPh,newAdd) {
    console.info('============= START : changeOrgan ===========');

    let logger = shim.newLogger("Chaincode --> ");
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info("MSPID : "+ mspID);

    if(mspID == "DonorMSP"){
        const exists = await this.donorExists(ctx,donorId);
        if (!exists) {
            throw new Error(`A Patient with id: ${ donorId} doent exists`);
        }
        const dBuffer = await ctx.stub.getState(donorId);
        const dDetail = JSON.parse(dBuffer.toString());
        dDetail.donorName = newName;
        dDetail.organType = newOrg;
        dDetail.donorGrp = newGrp;
        dDetail.donorPh = newPh;
        dDetail.donorAdd = newAdd;
        const buffer = Buffer.from(JSON.stringify(dDetail));
        await ctx.stub.putState(donorId, buffer);

    }
    else{
        logger.info("Users under the following MSP : "+
                    mspID + "cannot perform this action");
        return("Users under the following MSP : "+
        mspID + "cannot perform this action");
    }

}

// Hospital functions
//************************************** *///

async pExists(ctx, pId) {
    const buffer = await ctx.stub.getState(pId);
    return (!!buffer && buffer.length > 0);
}

// Add Patient details 

async addPatient(ctx, pId, pName,hospital,pGrp,pOrgan,pPriority, reqstDate) {
    let logger = shim.newLogger("Chaincode --> ");
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info("MSPID : "+ mspID);

    if(mspID == "HospitalMSP"){
        const exists = await this.pExists(ctx,pId);
        if (exists) {
            throw new Error(`A Patient with id: ${ pId} already exists`);
        }
        const asset = { 
            pId,
            pName,
            hospital,            
            pGrp,
            pOrgan,
            pPriority,
            reqstDate,
            donarId:"not assigned",
            donarName:"not assigned",
            assetType:"Patient"
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(pId, buffer);

        let addPatientEvent = {Type: 'New Patient Created', patientName:pName };
        await ctx.stub.setEvent('addPatientEvent', Buffer.from(JSON.stringify(addPatientEvent)));

    }
    else{
        logger.info("Users under the following MSP : "+
                    mspID + "cannot perform this action");
        return("Users under the following MSP : "+
        mspID + "cannot perform this action");
    }
}

// Read the details of a registereed patient

async readPatient(ctx,pId) {
    const exists = await this.pExists(ctx,pId);
    if (!exists) {
        throw new Error(`A Patient with id: ${ pId} doesnt exists`);
    }
    const buffer = await ctx.stub.getState(pId);
    const asset = JSON.parse(buffer.toString());
    return asset;
}
// delete a registered patient

async deletePatient(ctx,pId) {
    let logger = shim.newLogger("Chaincode --> ");
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info("MSPID : "+ mspID);

    if(mspID == "HospitalMSP"){
        const exists = await this.pExists(ctx,pId);
        if (!exists) {
            throw new Error(`A Patient with id: ${ pId} doent exists`);
        }
        await ctx.stub.deleteState(pId);
    }
    else{
        logger.info("Users under the following MSP : "+
                    mspID + "cannot perform this action");
        return("Users under the following MSP : "+
        mspID + "cannot perform this action");
    }
}

//update patient -priority,name,hospital,group,organ
async updatePatient(ctx, pId, nName,nHospital,nGrp,nOrgan,nPriority) {
    console.info('============= START : changeOrgan ===========');

    let logger = shim.newLogger("Chaincode --> ");
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info("MSPID : "+ mspID);

    if(mspID == "HospitalMSP"){
        const exists = await this.pExists(ctx,pId);
        if (!exists) {
            throw new Error(`A Patient with id: ${ pId} doent exists`);
        }
        const pBuffer = await ctx.stub.getState(pId);
        const pDetail = JSON.parse(pBuffer.toString());
        pDetail.pName = nName;
        pDetail.hospital = nHospital;
        pDetail.pGrp = nGrp;
        pDetail.pOrgan = nOrgan;
        pDetail.pPriority = nPriority;
       

        const buffer = Buffer.from(JSON.stringify(pDetail));
        await ctx.stub.putState(pId, buffer);

    }
    else{
        logger.info("Users under the following MSP : "+
                    mspID + "cannot perform this action");
        return("Users under the following MSP : "+
        mspID + "cannot perform this action");
    }

}

//  NGO functions-pass the donorId and PatientId.if the organ and bloodgroup matches,
// // if the patient is not assigned previously the assignment is done and the donor will get deleted.
// //******************************************************** */
async matchOrgan(ctx, pId, donorId) {
    let logger = shim.newLogger("Chaincode --> ");
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info("MSPID : "+ mspID);
    if(mspID == "GAOMSP"){
    
    const exists = await this.pExists(ctx, pId);
    if(!exists) {
        throw new Error(`A patient with : ${pId} does not exists`);
    }

    const donorExists = await this.donorExists(ctx, donorId);
    if(!donorExists) {
        throw new Error(`No such donor : ${donorId}  exists`);
    }

    const pBuffer = await ctx.stub.getState(pId);
    const pDetail = JSON.parse(pBuffer.toString());
    if(pDetail.donarId !="not assigned"){
        throw new Error(`Patient is already assigned,check and proceed`);
    }
    const dBuffer = await ctx.stub.getState(donorId);
    const dDetail = JSON.parse(dBuffer.toString());
    logger.info("match : "+ pDetail.pOrgan +pDetail.pGrp +pDetail.pPriority +dDetail.donorId);

    logger.info("match 2: "+ dDetail.organType +dDetail.donorGrp +dDetail.donorId);

    if(pDetail.pOrgan === dDetail.organType && pDetail.pGrp === dDetail.donorGrp &&
        pDetail.pPriority <= 2){
        pDetail.donarId = dDetail.donorId;
        pDetail.donarName = dDetail.donorName;

        let patientp=pDetail.pPriority;
            logger.info("details  "+pDetail.pPriority);
        dDetail.rId = pDetail.pId;
        dDetail.rName = pDetail.pName;

        const newBuffer = Buffer.from(JSON.stringify(pDetail));
        await ctx.stub.putState(pId, newBuffer);
        // Event for Match of Priority 1
        if(patientp == 1){
            let addMatchEvent = {Type: 'A match Done for priority 1 ', donorId:donorId,patientId:pId,priority:patientp };
            await ctx.stub.setEvent('addMatchEvent', Buffer.from(JSON.stringify(addMatchEvent)));
    
        }       
        

        // const newBuffer1 = Buffer.from(JSON.stringify(dDetail));
        // await ctx.stub.putState(donorId, newBuffer1);
        
        return await this.deleteDonor(ctx, donorId);
    }
    else{
        throw new Error(`Patient and Donor doesnt match`);
    }
}
else{
    logger.info("Users under the following MSP : "+
                mspID + "cannot perform this action");
    return("Users under the following MSP : "+
    mspID + "cannot perform this action");
}
}


// query functions  
//******************************************************** */
// Query All Donors

async queryAllDonor(ctx) {

    const queryString = {
        selector: {
            "assetType":"Donor"
        }
    };
   
    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
}

// Query All Patients with date and priority

async queryAllPatient(ctx) {

    const queryString = {
        selector: {
            "assetType":"Patient"
            // "donarId":"not assigned"
        },
        "sort": ["reqstDate","pPriority"]
        
    };   

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
}
// based on given hospital it returns the all the patients within that hospital

async queryHospitalInfo(ctx,hospitalId) {
    let logger = shim.newLogger("Chaincode --> ");
    logger.info("Hospital passed :"+hospitalId);
    const queryString = {
        "selector": {
            "hospital": hospitalId
       
            },
    //    "sort": [{"reqstDate": "desc"}]
    // "sort": ["reqstDate","pPriority"]
    };

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
}

 // getDonorHistory -history of a particular donor
 async getDonorHistory(ctx, donorId) {

    console.info('- start getDonorHistory: %s\n', donorId);
    let resultsIterator = await ctx.stub.getHistoryForKey(donorId);
    let results = await this.getAllResults(resultsIterator, true);
    return JSON.stringify(results);
}

async getPatientHistory(ctx, patientId) {

    console.info('- start getPatientHistory: %s\n', patientId);
    let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
    let results = await this.getAllResults(resultsIterator, true);
    return JSON.stringify(results);
}
async getAllResults(iterator, isHistory) {
    let allResults = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));

            if (isHistory && isHistory === true) {
                jsonRes.TxId = res.value.tx_id;
                jsonRes.Timestamp = res.value.timestamp;
                jsonRes.IsDelete = res.value.is_delete.toString();
                try {
                    jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Value = res.value.value.toString('utf8');
                }
            } else {
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
            }
            allResults.push(jsonRes);
        }
        if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;
        }
    }
}

}

module.exports = OrganContract;
