const accessKey = JSON.parse( localStorage.getItem('accessKey')).key;
$(document).ready(function(){
    /**
     * This function will get current credit hours from the server and displayes it
     */
    let curr_credits = 0;
    $.ajax({
        url: 'http://localhost:3000/'+accessKey+'/student/credits',
        type: 'GET',
        contentType: 'application/json',                        
        success: function(response){
           document.getElementById("actions-credits").innerHTML = response; 
           curr_credits = response;      
        },                   
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });
    
    /**
     * This function will get the student's schedule and displayes it in a list
     */
    let n=0;
    $.ajax({
        url: 'http://localhost:3000/'+accessKey+'/student/schedule',
        type: 'GET',
        contentType: 'application/json',                        
        success: function(response){
            if(response != 'No courses was found'){
                let x = document.getElementById("currentCourses");  
                for(const ele of response){
                    let item = document.createElement("li");
                    let checkbox = document.createElement("input");
                    checkbox.setAttribute("type", "checkbox");
                    checkbox.id = n.toString()+"-course-checkBox";
                    checkbox.value = ele.crn;

                    let statusLbl = document.createElement("button");
                    statusLbl.id = "course-status-lbl";
                    statusLbl.className = "course-status-lbl" ;
                    if(ele.act == ele.cap){
                        statusLbl.innerHTML = "C";
                        statusLbl.style.backgroundColor = "red";
                    }
                    else if(((parseInt(ele.cap) - parseInt(ele.act))/(parseInt(ele.cap)))<0.1){
                        statusLbl.innerHTML = "W";
                        statusLbl.style.backgroundColor = "#FFEF00";
                    }
                    else{
                        statusLbl.innerHTML = "A";
                        statusLbl.style.backgroundColor = "rgb(0, 188, 19)";
                    }
                    let text = document.createTextNode(" "+ele.subject+" "+ele.number+" - "+ele.section+" ("+ele.crn+")");
                    item.style.paddingBottom = "5px";
                    item.appendChild(checkbox);
                    item.appendChild(statusLbl);
                    item.appendChild(text);
                    x.appendChild(item);
                    n++;     
                }  
            }   
        },                   
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });

    /**
     * This function binds an event to the add course button.
     */
    $("#add-courseBtn").click(function(event){
        let crn = document.getElementById("add-course-textCrn").value;
        if(crn !=""){
            $.ajax({
                url: 'http://localhost:3000/'+accessKey+'/student/add/'+crn,
                type: 'POST',
                contentType: 'application/json',                        
                success: function(response){
                    if(response == 'Course already added.'){
                        $("#error-message").text("Already added!");
                        document.getElementById("error-message").style.visibility="visible";
                        document.getElementById("actions-conflict-container").style.display = "none";
                        document.getElementById("no-conflict-text").style.display = "flex";
                    }
                    else if(response == 'Course limit reached'){
                        $("#error-message").text("Credit limit reached!");
                        document.getElementById("error-message").style.visibility="visible";
                        document.getElementById("actions-conflict-container").style.display = "none";
                        document.getElementById("no-conflict-text").style.display = "flex";
                    }
                    else if(response == 'Course full'){
                        $("#error-message").text("Course is full!");
                        document.getElementById("error-message").style.visibility="visible";
                        document.getElementById("actions-conflict-container").style.display = "none";
                        document.getElementById("no-conflict-text").style.display = "flex";
                    }
                    else if(response.startsWith("conflict:")){
                        $("#conflict-text").text(response);
                        document.getElementById("actions-conflict-container").style.display = "flex";
                        document.getElementById("no-conflict-text").style.display = "none";
                    }
                    else{
                        document.getElementById("actions-conflict-container").style.display = "none";
                        document.getElementById("no-conflict-text").style.display = "flex"; 
                        document.getElementById("reload").click();
                    } 
                },                   
                error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            });
        }
    });

    /**
     * This function binds an event to the course drop button.
     */
    $("#course-drop-btn").click(function(event){

        if(window.confirm("Confirm course drop!")){
            let dropCourses = [];
            for(let i=0;i<n;i++){
                if(document.getElementById(i+"-course-checkBox").checked){
                    dropCourses.push(document.getElementById(i+"-course-checkBox").value);
                }
            }
            let dropData = {};
            dropData.crns = dropCourses;

            $.ajax({
                url: 'http://localhost:3000/'+accessKey+'/student/drop/multiple/crns',
                type: 'POST',
                data: JSON.stringify(dropData),
                contentType: 'application/json',                        
                success: function(response){
                    document.getElementById("reload").click(); 
                },                   
                error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            });
        }
    });

    /**
     * This function binds an event to the conflict error remove button
     */
    $("#remove-btn").click(function(event){
        document.getElementById("actions-conflict-container").style.display = "none";
        document.getElementById("no-conflict-text").style.display = "flex";
    });

    /**
     * This function binds an event to the conflict errir override button
     */
    $("#override-btn").click(function(event){
        let crn = document.getElementById("add-course-textCrn").value;
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/student/add/override/'+crn,
            type: 'POST',
            contentType: 'application/json',                        
            success: function(response){
                document.getElementById("actions-conflict-container").style.display = "none";
                document.getElementById("no-conflict-text").style.display = "flex";
                document.getElementById("reload").click();
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });

});