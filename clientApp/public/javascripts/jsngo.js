function matchorg(event){
    // alert("msg");
    const pid = document.getElementById('QuerypId').value;
    
    console.log(pid);
    const did = document.getElementById('QuerydId').value;
    
    console.log(did);
    if (pid.length==0 || did.length==0) {
        alert("Please enter the data properly");
    }
    else{
        fetch('/ngo/matchpost',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({pidNumb: pid,didNumb:did})
        })
    
    .then(function(response){
        console.log("-------------"+response);
        return response.json();
        // return response;
    })
    .then(function (datadisp){
        // if(DonorData){
           
            console.log("+++++"+typeof datadisp)
        dataBuf = datadisp["datadisp"]
        console.log(dataBuf)
        if(!alert(""+dataBuf)){
            window.location.reload();
        }
        // {window.location.reload();}
   
        
    })
    
    .catch(function(err){
        console.log(err);
        alert("Error "+err);
    })    
    
}
}


  
window.onload = function() { 
    fetch('/ngo/displayDonor',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',              
        },
        // body: JSON.stringify({QidNumb: Qid})
    })
    .then(function(response){
        // console.log("-------------"+response.json());
        return response.json();
        // return response;
    })
    .then(function(donorData){
        // if(DonorData){
            var output="";
            console.log("+++++"+typeof donorData)
        dataBufd =  donorData["donorData"]
        console.log(dataBufd)
        var response=JSON.parse(dataBufd);
        console.log(JSON.parse(dataBufd))
console.log("length "+response.length)
        output +="<tr>";
        output +="<th> Donor Id</th>";
           
            output +="<th> B.Group</th>";
            output +="<th> Organ </th>";
            
            output +="</tr>";

            for(var i=0;i<response.length;i++){
            output +="<tr>";
            output +="<td> "+ response[i].Record.donorId +"</td>";
            
            output +="<td> "+ response[i].Record.donorGrp +"</td>";
            output +="<td> "+ response[i].Record.organType +"</td>";
            

            output +="</tr>";

        }
        document.getElementById("donorlist").innerHTML=output;
        
    })
    .catch(function(error){            
        console.log(error);
        if(!alert('Error in Processing request'+error))
        {window.location.reload();}            
    })    

    // ------------------------------
    fetch('/ngo/displayPatient',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',              
        },
        // body: JSON.stringify({QidNumb: Qid})
    })
    .then(function(response){
        // console.log("-------------"+response.json());
        return response.json();
        // return response;
    })
    .then(function(patientData){
        // if(DonorData){
            var output1="";
            console.log("+++++"+typeof patientData)
        dataBufp =  patientData["patientData"]
        console.log(dataBufp)
        var responsep=JSON.parse(dataBufp);
        console.log(JSON.parse(dataBufp))
console.log("length "+responsep.length)
        output1 +="<tr>";
        output1 +="<th> Patient Id</th>";
        output1 +="<th> Organ </th>";
            output1 +="<th> B.Group</th>";
            output1 +="<th> Priority</th>";
            output1 +="<th> Date</th>";
            output1 +="<th> Donor Id </th>";
            output1 +="</tr>";

            for(var i=0;i<responsep.length;i++){
            output1 +="<tr>";
            output1 +="<td> "+ responsep[i].Record.pId +"</td>";
            output1 +="<td> "+ responsep[i].Record.pOrgan +"</td>";
            output1 +="<td> "+ responsep[i].Record.pGrp +"</td>";
           
            output1 +="<td> "+ responsep[i].Record.pPriority +"</td>";
            output1 +="<td> "+ responsep[i].Record.reqstDate +"</td>";
            output1 +="<td> "+ responsep[i].Record.donarId +"</td>";
            output1 +="</tr>";

        }
        document.getElementById("patientlist").innerHTML=output1;
        
    })
    .catch(function(error){            
        console.log(error);
        alert('Error in Processing request'+error)
                
    })    

}
   
  