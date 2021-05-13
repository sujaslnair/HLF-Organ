function toDonorDash() {
    window.location.href='/donor';

}
function clearBox()
{
    document.getElementById('donorId').value = "";
    document.getElementById('donorName').value = "";
    document.getElementById('organType').value = "";
    document.getElementById('donorGrp').value = "";
    document.getElementById('donorPh').value = "";
    document.getElementById('donorAdd').value = "";
}
function DonorWriteData(event){

    event.preventDefault();
    const id = document.getElementById('donorId').value;
    const Name = document.getElementById('donorName').value;
    const organ = document.getElementById('organType').value;
    const blood = document.getElementById('donorGrp').value;
    const ph = document.getElementById('donorPh').value;
    const address = document.getElementById('donorAdd').value;
    console.log(id+Name+organ+blood+ph+address);

    if (id.length==0||Name.length==0||organ.length==0||blood.length==0||ph.length==0||address.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/donor/donorwrite',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({donorId: id, donorName: Name, organType: organ, donorGrp: blood, donorPh: ph, donorAdd: address})
        })
        .then(function(response){
            console.log("writedonor (response)");
            return response.json()
        })
        .then(function(msg){
            console.log("writedonor (msg)"+msg);
            databuf1=msg["msg"]

                    
           if(!alert(databuf1))
            {
                clearBox();
            }                       
        //     return response;
        })       
        .catch(function(err){
            console.log(err);
            if(!alert('Error in Processing Request'))
            {window.location.reload();}
            
        })    
    }
}
function DonorQueryData(event){

    event.preventDefault();
    const Qid = document.getElementById('QueryDonorId').value;
    
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/donor/donorread',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({QidNumb: Qid})
        })
        .then(function(response){
            // console.log("-------------"+response.json());
            return response.json();
            // return response;
        })
        .then(function (DonorData){
            // if(DonorData){
               
                console.log("+++++"+typeof DonorData)
            dataBuf = DonorData["DonorData"]
            console.log(DonorData)
            
            if(!alert(dataBuf)){
                document.getElementById('QueryDonorId').value ="";
                
            }          
            
        })
        .catch(function(error){            
            console.log(error);
            if(!alert('Error in Processing request'+error))
            {window.location.reload();}            
        })    
    }
}
//Delete donor
function DonorDeleteData(event){

    event.preventDefault();
    const Qid = document.getElementById('QueryDonorId').value;
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/donor/donordelete',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({QidNumb: Qid})
        })
        .then(function(response){
            console.log("-------------"+response);
            return response.json();
            // return response;
        })
        .then(function (Cardata){
            // alert("your account deleted")
            if(!alert('Account Deleted')){
                document.getElementById('QueryDonorId').value ="";
            }         
        })
        .catch(function(err){
            console.log(err);
            alert("Error in processing request");
        })    
    }
}

function DonorUpdateData(event){

    event.preventDefault();
    const Qid = document.getElementById('QDonorId').value;
    
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        let innervalue=document.getElementById("updatebtn").innerHTML
        console.log("btn value"+innervalue);
        if (innervalue=="Fetch")
        {
            fetch('/donor/donorread',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',              
                },
                body: JSON.stringify({QidNumb: Qid})
            })
            .then(function(response){
                // console.log("-------------"+response.json());
                return response.json();
                // return response;
            })
            .then(function (DonorData){
                console.log("+++++"+typeof DonorData)
                dataBuf = DonorData["DonorData"]
                console.log(dataBuf)
                console.log(JSON.parse(dataBuf))
                // alert(dataBuf);
                // alert(dataBuf);
                document.getElementById("QDonorId").disabled = true;
                document.getElementById('QdonorName').value =(JSON.parse(dataBuf).donorName);
                document.getElementById('QorganType').value =(JSON.parse(dataBuf).organType);
                document.getElementById('QdonorGrp').value =(JSON.parse(dataBuf).donorGrp);
                document.getElementById('QdonorPh').value =(JSON.parse(dataBuf).donorPh);
                document.getElementById('QdonorAdd').value =(JSON.parse(dataBuf).donorAdd);
                // alert(dataBuf.donorId)
                document.getElementById("updatebtn").innerHTML="update";
            })
            .catch(function(error){            
                console.log(error);
                if(!alert('Error in Processing request,Donor not exist'))
                {window.location.reload();}            
            })  
        }
        else{
           
             const id = document.getElementById('QDonorId').value;
            const Name = document.getElementById('QdonorName').value;
            const organ = document.getElementById('QorganType').value;
            const blood = document.getElementById('QdonorGrp').value;
            const ph = document.getElementById('QdonorPh').value;
            const address = document.getElementById('QdonorAdd').value;
            console.log(id+Name+organ+blood+ph+address);

    if (id.length==0||Name.length==0||organ.length==0||blood.length==0||ph.length==0||address.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/donor/updatewrite',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({donorId: id, donorName: Name, organType: organ, donorGrp: blood, donorPh: ph, donorAdd: address})
        })
        .then(function(response){
            console.log("writeupdatedonor");
           if(!alert('Successfully updated donor'))
            {
                clearBox();
            }                       
            return response;
        })       
        .catch(function(err){
            console.log(err);
            if(!alert('Error in Processing Request'))
            {window.location.reload();}
            
        })    
        document.getElementById("updatebtn").innerHTML="Fetch";
         }

        }
         
    }
}