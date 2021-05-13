const {profile} = require('./profile')
const { FileSystemWallet, Gateway } = require('fabric-network');

class client{


    setRoleAndIdentity(role,identityLabel){
        console.log("set role and identity"+role);
        console.log(identityLabel);
        this.Profile = profile[role.toLowerCase()]
        let  wallet = new FileSystemWallet(this.Profile["Wallet"])
        this.connectionOptions = {
            identity: identityLabel,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        }   
        // console.log(wallet);      
    }

    initChannelAndChaincode(channelName,contractName){
        //set channel name
        this.channel = channelName
        // console.log(channelName);
        // console.log(contractName);
        //set contract name
        this.contractName = contractName
    }

    async generateAndSubmitTxn(txnName,...args){
        let gateway = new Gateway()
        try{
        //connects to the fabric network using the connectionOptions and connection profile
        await gateway.connect(this.Profile["CCP"],this.connectionOptions);
        //  console.log(gateway);
        //connects to the network
        let channel = await gateway.getNetwork(this.channel);
        // console.log(channel);
        //gets the contract based on the name 
        let contract = await channel.getContract(this.contractName)
        // console.log(contract);
        //submits the transactions and returns the result
        let result = await contract.submitTransaction(txnName,...args);
        
        return result
        } 
        // catch (error) {

        //     console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
        //     return error;
    
        // } 
        finally {
    
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
    }

    async generateAndEvalTxn(txnName,...args){
        let gateway = new Gateway()
        try{
        //connects to the fabric network using the connectionOptions and connection profile
        await gateway.connect(this.Profile["CCP"],this.connectionOptions);
        //  console.log(gateway);
        //connects to the network
        let channel = await gateway.getNetwork(this.channel);
        // console.log(channel);
        //gets the contract based on the name 
        let contract = await channel.getContract(this.contractName)
        // console.log(contract);
        //submits the transactions and returns the result
        let result = await contract.evaluateTransaction(txnName,...args);
        return result
        } 
        // catch (error) {

        //     console.log(`Error processing transaction inside client.js. ${error.endorsements[0].message}`);
        //     return error;
    
        // } 
        finally {
    
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
    }
}

module.exports={
    client
}