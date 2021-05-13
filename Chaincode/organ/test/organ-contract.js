/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { OrganContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('OrganContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new OrganContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"donorName":"AAAA","organType":"Kidney","donorGrp":"O+","donorPh":"111111","donorAdd":"Address 1","rName":" not assigned","rId":"not assigined"}'));
        ctx.stub.getState.withArgs('p001').resolves(Buffer.from
            ('{ "pName":"Patient1","hospital":"Hospital 1","pGrp":"AB-","pOrgan":"Kidney","pPriority":"1","reqstDate":"1-3-2021"}'));
    });

    describe('#donorExists', () => {

        it('should return true for a organ', async () => {
            await contract.donorExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a organ that does not exist', async () => {
            await contract.donorExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#addPatient', () => {

        it('should create a patient', async () => {
            // pId, pName,hospital,pGrp,pOrgan,pPriority, reqstDate
            await contract.addPatient(ctx, 'p001', 'Patient1','Hospital 1','AB-','Kidney','1','1-3-2021');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('p001', Buffer.from
            ('{ "pName":"Patient1","hospital":"Hospital 1","pGrp":"AB-","pOrgan":"Kidney","pPriority":"1","reqstDate":"1-3-2021"}'));
        });

        it('should throw an error for a organ that already exists', async () => {
            await contract.addPatient(ctx, 'p001', 'Patient1','Hospital 1','AB-','Kidney','1','1-3-2021').should.be.rejectedWith(/The organ 1001 already exists/);
        });

    });

    
    describe('#readDonor', () => {

        it('should return a Donor', async () => {
            await contract.readDonor(ctx, '1001').should.eventually.deep.equal({donorName:"AAAA",organType:"Kidney",donorGrp:"O+",donorPh:"111111",donorAdd:"Address 1",rName:" not assigned",rId:"not assigined"});
        });

        it('should throw an error for a Donor that does not exist', async () => {
            await contract.readDonor(ctx, '1003').should.be.rejectedWith(/The Donor 1003 does not exist/);
        });

    });

    describe('#changeOrgan', () => {

        it('should update a patient organ', async () => {
            await contract.changeOrgan(ctx, 'p001', 'Kidney');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('p001', Buffer.from('{"value":"kidney"}'));
        });

        it('should throw an error for a Donor that does not exist', async () => {
            await contract.updateDonor(ctx, '1003', 'Donor 1003 new value').should.be.rejectedWith(/The organ 1003 does not exist/);
        });

    });

    describe('#deleteOrgan', () => {

        it('should delete a organ', async () => {
            await contract.deleteOrgan(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a organ that does not exist', async () => {
            await contract.deleteOrgan(ctx, '1003').should.be.rejectedWith(/The organ 1003 does not exist/);
        });

    });

});