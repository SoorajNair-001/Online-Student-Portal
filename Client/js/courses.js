const accessKey = JSON.parse( localStorage.getItem('accessKey')).key;

$(document).ready(function(){
    /**
     * This function reads all the subject names from the database and 
     * adds it to a dropdown menu
     */
    $.ajax({
        url: 'http://localhost:3000/'+accessKey+'/courses/winter/2022-2023/subjects/all',
        type: 'GET',
        contentType: 'application/json',                        
        success: function(response){
            let subjects = JSON.parse(response); 
            let x = document.getElementById("subject-dropdown");

            for(let i=0;i<subjects.length;i++){
                let option = document.createElement("option");
                option.text = subjects[i];
                x.add(option); 
            }         
        },                   
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });


    var selected_subject = "subject"; // default dropdown option
    /**
     * This function binds an event to subject dropdown.
     * Shows all the subject data in a list
     */
    $("#subject-dropdown").change(function(){selected_subject = this.value;dropDownEvent();});
    function dropDownEvent() {
        if(selected_subject!="subject"){
            $.ajax({
                url: 'http://localhost:3000/'+accessKey+'/courses/winter/2022-2023/subject/'+selected_subject,
                type: 'GET',
                contentType: 'application/json',                        
                success: function(response){
                    document.getElementById("coursesList").innerHTML = "";
                    let x = document.getElementById("coursesList");  
                    document.getElementById("course-search-input").value = "";
                    for(const ele of response){
                        let item = document.createElement("li");
                        let button = document.createElement("button");
                        button.addEventListener("click",function(){sectionButtonClick(ele);});
                        button.id = "course-sections-btn";
                        button.className = "course-sections-btn" ;
                        let text = document.createTextNode("       "+ele.subject+"    "+ele.number+"   -   "+ele.name);
                        button.innerHTML = "view sections";
                        item.appendChild(button);
                        item.appendChild(text);
                        x.appendChild(item);       
                    }
                },                   
                error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            });
        }
        else{
            document.getElementById("coursesList").innerHTML = "";
        }
    }

    /**
     * This function binds an event to the sections button.
     * And displayes courses in a list
     */
    function sectionButtonClick(ele){
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/courses/winter/2022-2023/subject/sections/'+ele.subjectName+"/"+ele.number,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                document.getElementById("coursesList").innerHTML = "";
                let list = document.getElementById("coursesList");
                let item = document.createElement("li");
                let backbutton = document.createElement("button");
                if(selected_subject !="subject"){
                    backbutton.addEventListener("click",function(){dropDownEvent();});
                }
                else{
                    backbutton.addEventListener("click",function(){searchBtnEvent()});
                }
                backbutton.id = "course-back-btn";
                backbutton.className = "course-back-btn" ;
                backbutton.innerHTML = "<-back";

                let conflictLblbutton = document.createElement("button");
                conflictLblbutton.innerHTML="!";
                conflictLblbutton.className="course-conflict-lbl";
                let lblText = document.createTextNode("-Time conflict\t");
                let tickLblbutton = document.createElement("button");
                tickLblbutton.innerHTML="&#10004;";
                tickLblbutton.className="course-conflict-lbl";
                tickLblbutton.style.color="rgb(0, 188, 19)";
                let lblText2 = document.createTextNode("-Already added");
                item.appendChild(backbutton);
                item.appendChild(conflictLblbutton);
                item.appendChild(lblText);
                item.appendChild(tickLblbutton);
                item.appendChild(lblText2);
                list.appendChild(item);

                let item2 = document.createElement("li");
                let pnl = document.createElement('strong');
                let text = document.createTextNode("\t\t\t\t\tCRN\t  SUB\t  NUM\t  SEC\t  NAME");
                pnl.appendChild(text);
                item2.appendChild(pnl);
                list.appendChild(item2);
                let n=0;
                for(const ele of response){
                    let item = document.createElement("li");
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

                    let conflictLbl = document.createElement("button");
                    conflictLbl.id = n.toString()+"-course-conflict-lbl";
                    conflictLbl.className = "course-conflict-lbl" ;
                    checkConflict(ele.crn,n);


                    let button = document.createElement("button");
                    button.id = "course-detains-btn";
                    button.className = "course-details-btn" ;
                    button.innerHTML = "details";
                    button.addEventListener("click",function(){detailsBtnEvent(ele);});
                    let text = document.createTextNode("\t"+ele.crn+"    "+ele.subject+"    "+ele.number+"      "+ele.section+"      "+ele.name);
                    
                    let times = document.createTextNode("");
                    for(const time of ele.times){
                        if(isNaN(time)){
                            times.nodeValue += "\n\t\t\t\t\t"+time[0]+" : "+time[1]+" - "+time[2];
                        }
                    }
                    item.appendChild(button);
                    item.appendChild(conflictLbl);
                    item.appendChild(statusLbl);
                    item.appendChild(text);
                    item.appendChild(times)
                    list.appendChild(item);  
                    n++;     
                }

            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }

    /**
     * This function binds an event to the search box.
     * Displays the found courses in a list
     */
    var searchBox ;
    $("#course-search-input").change(function(){searchBox = this.value;searchBtnEvent();});
    function searchBtnEvent(){
        let input = searchBox;
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/courses/winter/2022-2023/search/'+input,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                if(response != "No course was found"){
                    document.getElementById("coursesList").innerHTML = "";
                    let list = document.getElementById("coursesList");
                    document.getElementById("subject-dropdown").value = "subject";
                    let item = document.createElement("li");
                    let text = document.createTextNode("Search Results ("+response.length+" Items):");
                    item.appendChild(text);
                    list.appendChild(item);
      
                    for(const ele of response){
                        let item = document.createElement("li");
                        let button = document.createElement("button");
                        button.addEventListener("click",function(){sectionButtonClick(ele);});
                        button.id = "course-sections-btn";
                        button.className = "course-sections-btn" ;
                        let text = document.createTextNode("       "+ele.subject+"    "+ele.number+"   -   "+ele.name);
                        button.innerHTML = "view sections";
                        item.appendChild(button);
                        item.appendChild(text);
                        list.appendChild(item);  
                    }     
                }
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }

    /**
     * This function binds an event to the course details button.
     * Displays all the details for the course.
     */
    function detailsBtnEvent(ele){
        displayChart(ele);
        document.getElementById("det-add-btn").value = ele.crn;
        document.getElementById("det-pinCourse-btn").value = ele.crn;
        document.getElementById("course-details-container").style.display="contents";
        document.getElementById("courses-main-container").style.display="none";
        document.getElementById("det-subject").innerHTML=ele.subject;
        document.getElementById("det-number").innerHTML=ele.number;
        document.getElementById("det-name").innerHTML="- "+ele.name;
        document.getElementById("det-section").innerHTML="Section: "+ele.section;
        
        document.getElementById("det-crn").innerHTML=ele.crn;
        document.getElementById("det-slot").innerHTML=ele.slot;
        document.getElementById("det-room").innerHTML=ele.room;
        document.getElementById("det-type").innerHTML=ele.type;

        document.getElementById("det-credits").innerHTML=ele.credits;
        document.getElementById("det-instructors").innerHTML=ele.instructors;
        document.getElementById("det-times").innerHTML = "";
        for(const time of ele.times){
            if(isNaN(time)){
                document.getElementById("det-times").innerHTML += "<br>"+time[0]+" : "+time[1]+" - "+time[2];
            }
        }

        document.getElementById("det-act").innerHTML=ele.act;
        document.getElementById("det-cap").innerHTML=ele.cap;
        document.getElementById("det-rem").innerHTML=ele.rem;
        document.getElementById("det-wlact").innerHTML=ele.wl_act;
        document.getElementById("det-wlcap").innerHTML=ele.wl_cap;
        document.getElementById("det-wlrem").innerHTML=ele.wl_rem;

    }

    /**
     * This function binds an event to the back button.
     */
    $("#det-back-btn").click(function(event){
        document.getElementById("card-container").innerHTML = '<canvas id="doughnut-chart"></canvas>';
        document.getElementById("course-details-container").style.display="none";
        document.getElementById("courses-main-container").style.display="block";
        document.getElementById('course-details-container40').style.visibility='hidden';
    });

    /**
     * This function will show a population graph for the selected course.
     */
    function displayChart(curr_course){
        var StateLabels = ["Act", "Rem"];
        var Colors = ["#e41a1c", "#377eb8"];
        var data = [parseInt(curr_course.act),parseInt(curr_course.rem)];
        
        var doughnutContext= $("#doughnut-chart");
        var doughnutChart = new Chart(doughnutContext, {
            type: 'doughnut',
            data: {
            labels: StateLabels,
            datasets: [
                {
                label: "",
                backgroundColor: Colors,
                data: data
                }
            ]
            },
            options: {
            title: {
                display: true,
                text: 'Population Graph'
            },
            maintainAspectRatio: false,
            responsive: true,

            }
        });
    }

    /**
     * This function will check for time conflicts in a course and the student's schedule
     */
    function checkConflict(crn,n){
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/student/schedule/conflict/'+crn,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                if(response == 'No time conflicts'){
                    document.getElementById(n.toString()+"-course-conflict-lbl").style.visibility='hidden';
                }
                else if(response.startsWith("conflict:")){
                    let res = response.split(" ");
                    if(res[1]==res[3] || res[1]==res[5] || res[1]==res[7] || res[1]==res[9]){
                        document.getElementById(n.toString()+"-course-conflict-lbl").style.visibility='visible';
                        document.getElementById(n.toString()+"-course-conflict-lbl").innerHTML = "&#10004;";
                        document.getElementById(n.toString()+"-course-conflict-lbl").style.color="rgb(0, 188, 19)";
                    }
                    else{
                        document.getElementById(n.toString()+"-course-conflict-lbl").style.visibility='visible';
                        document.getElementById(n.toString()+"-course-conflict-lbl").innerHTML = "!";
                        document.getElementById(n.toString()+"-course-conflict-lbl").style.color="orange";
                    }
                }
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }
});