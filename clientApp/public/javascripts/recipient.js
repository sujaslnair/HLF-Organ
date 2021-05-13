function toDonorDash() {
    window.location.href='/donor';
}

function clearBox()
{
    document.getElementById('pId').value = "";
    document.getElementById('pName').value = "";
    document.getElementById('hospital').value = "";
    document.getElementById('pgrp').value = "";
    document.getElementById('porgan').value = "";
    document.getElementById('ppriority').value = "";
}
function pWriteData(event){

    event.preventDefault();
    const id = document.getElementById('pId').value;
    const name = document.getElementById('pName').value;
    const hospital = document.getElementById('hospital').value;
    const blood = document.getElementById('pgrp').value;
    const organ = document.getElementById('porgan').value;
    const priority = document.getElementById('ppriority').value;
    
    rdate = new Date(Date.now()).toLocaleString();
    console.log(id+name+hospital+blood+organ+priority+rdate);
    if (id.length==0||name.length==0||hospital.length==0||blood.length==0||organ.length==0||priority.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/recipient/patientwrite',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({pId: id, pName: name, hospital: hospital, pGrp: blood, pOrgan: organ, pPriority: priority,reqstDate:rdate})
        })
        .then(function(response){
            console.log("writepatient (response)");
            return response.json()
        })
        .then(function(msg){
            console.log("writepatient (msg)"+msg);
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
function pQueryData(event){

    event.preventDefault();
    const Qid = document.getElementById('QuerypId').value;
    
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/recipient/patientread',{
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
        .then(function (PatientData){
            // if(DonorData){
               
                console.log("+++++"+typeof PatientData)
            dataBuf = PatientData["PatientData"]
            console.log(PatientData)
            
            if(!alert(dataBuf)){
                document.getElementById('QuerypId').value ="";
                
            }          
            
        })
        .catch(function(error){            
            console.log(error);
            if(!alert('Error in Processing request'+error))
            {window.location.reload();}            
        })    
    }
}
//Delete Patient
function pDeleteData(event){

    event.preventDefault();
    const Qid = document.getElementById('QuerypId').value;
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/recipient/patientdelete',{
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
        .then(function (PatientData){
            // alert("your account deleted")
            if(!alert('Account Deleted')){
                document.getElementById('QuerypId').value ="";
            }         
        })
        .catch(function(err){
            console.log(err);
            alert("Error in processing request");
        })    
    }
}

function pUpdateData(event){

    event.preventDefault();
    const Qid = document.getElementById('Qpid').value;
    
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        let innervalue=document.getElementById("updatebtn").innerHTML
        console.log("btn value"+innervalue);
        if (innervalue=="Fetch")
        {
            fetch('/recipient/patientread',{
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
            .then(function (PatientData){
                console.log("+++++"+typeof PatientData)
                dataBuf = PatientData["PatientData"]
                console.log(dataBuf)
                console.log(JSON.parse(dataBuf))
                // alert(dataBuf);
                // alert(dataBuf);
                document.getElementById("Qpid").disabled = true;
                document.getElementById('Qpname').value =(JSON.parse(dataBuf).pName);
                document.getElementById('Qhospital').value =(JSON.parse(dataBuf).hospital);
                document.getElementById('Qgrp').value =(JSON.parse(dataBuf).pGrp);
                document.getElementById('Qorgan').value =(JSON.parse(dataBuf).pOrgan);
                document.getElementById('Qpriority').value =(JSON.parse(dataBuf).pPriority);
                // alert(dataBuf.donorId)
                document.getElementById("updatebtn").innerHTML="update";
            })
            .catch(function(error){            
                console.log(error);
                if(!alert('Error in Processing request,Patient not exist'))
                {window.location.reload();}            
            })  
        }
        else{
           
             const id = document.getElementById('Qpid').value;
            const Name = document.getElementById('Qpname').value;
            const hospital = document.getElementById('Qhospital').value;
            const blood = document.getElementById('Qgrp').value;
            const organ = document.getElementById('Qorgan').value;
            const priority = document.getElementById('Qpriority').value;
            console.log(id+Name+hospital+blood+organ+priority);

    if (id.length==0||Name.length==0||hospital.length==0||blood.length==0||organ.length==0||priority.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/recipient/updatewrite',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({
                pId: id, 
                pName: Name, 
                hospital: hospital, 
                pGrp: blood, 
                pOrgan: organ, 
                pPriority: priority})
        })
        .then(function(response){
            console.log("writeupdate recipient");
           if(!alert('Successfully updated recipient'))
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

// Hospital Query

function hospitalQuery(event){

    event.preventDefault();
    const Qid = document.getElementById('QuerypId').value;
    
    console.log(Qid);

    if (Qid.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/recipient/hospitalread',{
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
        .then(function(HospitalData){
            // if(DonorData){
                var output="";
                console.log("+++++"+typeof HospitalData)
            dataBuf =  HospitalData["HospitalData"]
            console.log(dataBuf)
            var response=JSON.parse(dataBuf);
            console.log(response[0].Record.pId)

            output +="<tr>";
            output +="<th> Patient Id</th>";
                output +="<th> Patient Name </th>";
               
                output +="<th> Hospital </th>";
                output +="<th> B.Group</th>";
                output +="<th> Organ </th>";
                output +="<th> Priority</th>";
                output +="<th> donor Id </th>";
                output +="<th> donor Name</th>";
                output +="<th> Date</th>";

                output +="</tr>";

                for(var i=0;i<response.length;i++){
                output +="<tr>";
                output +="<td> "+ response[i].Record.pId +"</td>";
                output +="<td> "+ response[i].Record.pName +"</td>";
                output +="<td> "+ response[i].Record.hospital +"</td>";
                output +="<td> "+ response[i].Record.pGrp +"</td>";
                output +="<td> "+ response[i].Record.pOrgan +"</td>";
                output +="<td> "+ response[i].Record.pPriority +"</td>";
                output +="<td> "+ response[i].Record.donarId +"</td>";
                output +="<td> "+ response[i].Record.donarName +"</td>";
                output +="<td> "+ response[i].Record.reqstDate +"</td>";

                output +="</tr>";

            }
            document.getElementById("vehicleDetails").innerHTML=output;
            
        })
        .catch(function(error){            
            console.log(error);
            if(!alert('Error in Processing request,No record found'))
            {window.location.reload();}            
        })    
    }
}