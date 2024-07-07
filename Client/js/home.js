const accessKey = JSON.parse( localStorage.getItem('accessKey')).key;
const account = JSON.parse( localStorage.getItem('account'));

$(document).ready(function(){
    /**
    * Writing the account info to home page.
    */
    let accName = document.getElementById("nameLbl");
    accName.innerHTML = account.name;
    let accUser = document.getElementById("usernameLbl");
    accUser.innerHTML = account.username;
    let accNo = document.getElementById("stdNumLbl");
    accNo.innerHTML = account.stdId;
    let accDegree = document.getElementById("levelLbl");
    accDegree.innerHTML = account.level;
    let accMajor = document.getElementById("majorLbl");
    accMajor.innerHTML = account.major;

    /**
     * This function binds an event to the logout button.
     */
    $("#home-logoutbtn").click(function(event){
        event.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/account/logout',
            type: 'POST',
            contentType: 'application/json',                        
            success: function(response){
                window.alert("Logout successfull.");
                window.location = "./index.html";
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });

    /**
     * Bind an event to the add course 
     * button in courses.html iframe.
     */
    let addBtn;
    const iframe_course = document.getElementById('course-iframe');
    iframe_course.contentWindow.addEventListener('load', () => {
        addBtn = iframe_course.contentDocument.getElementById('det-add-btn');
        addBtn.addEventListener('click', addCourseEvent);

        let pinBtn = iframe_course.contentDocument.getElementById('det-pinCourse-btn');
        pinBtn.addEventListener('click', pinButtonEvent);
    })
    function addCourseEvent () {
        let addTextBox;
        const iframe_action = document.getElementById('actions-iframe');
        iframe_action.contentDocument.getElementById('add-course-textCrn').value = addBtn.value;
        iframe_action.contentDocument.getElementById('add-courseBtn').click();
    }

    /**
     * Reload page
     */
    function reloadActionEvent () {
        window.location.reload(true);
    }

    /**
     * This function will reload the page when actions.html iframe requests
     */
    const iframe_action = document.getElementById('actions-iframe');
    iframe_action.contentWindow.addEventListener('load', () => {
        let reload = iframe_action.contentDocument.getElementById('reload');
        reload.addEventListener('click',reloadActionEvent);
    })


    /**
     * This function binds an event to the print button.
     */
    $("#print-schedule-btn").click(function(event){
        const iframe_schedule = document.getElementById('schedule-iframe');
        iframe_schedule.contentWindow.print();
    });

    /**
     * This function reads the pinned course data from the server and displays it.
     */
    $.ajax({
        url: 'http://localhost:3000/'+accessKey+'/student/get/pinned/',
        type: 'GET',
        contentType: 'application/json',                        
        success: function(response){
            if(response != 'No courses was found'){
                let x = document.getElementById("pinCourses"); 
                let n=0;
                for(const ele of response){
                    $.ajax({
                        url: 'http://localhost:3000/'+accessKey+'/courses/winter/2022-2023/'+ele.crn,
                        type: 'GET',
                        contentType: 'application/json',                        
                        success: function(response){
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
                            let removeBtn = document.createElement("button");
                            removeBtn.innerText = "X";
                            removeBtn.id = "removeBtn";
                            removeBtn.className = "removeBtn";
                            removeBtn.addEventListener("click",function(){unpinButtonEvent(removeBtn.value);});
                            removeBtn.value = ele.crn;
                            let text = document.createTextNode(" "+ele.subject+" "+ele.number+" - "+
                                                    ele.section+" ("+ele.crn+") -> Act:"+response.act
                                                    +"/"+response.cap+" | WL:"+response.wl_act+"/"+response.wl_cap);
                            

                            item.style.paddingBottom = "5px";
                            item.appendChild(removeBtn);
                            item.appendChild(statusLbl);
                            item.appendChild(text);
                            x.appendChild(item);
                            n++;   
                        },                   
                        error: function(xhr, status, error){
                            var errorMessage = xhr.status + ': ' + xhr.statusText
                            alert('Error - ' + errorMessage);
                        }
                    });  
                }
            }  
        },                   
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });

    /**
     * This function binds an event to the pin course button.
     */
    function pinButtonEvent(){
        const iframe_course = document.getElementById('course-iframe');
        let pinBtn = iframe_course.contentDocument.getElementById('det-pinCourse-btn');
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/student/pin/'+pinBtn.value,
            type: 'POST',
            contentType: 'application/json',                        
            success: function(response){
                if(response == "Pin limit reached"){
                    iframe_course.contentDocument.getElementById('course-details-container40').style.visibility='visible';
                }else{
                    window.location.reload(true);
                }
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }

    /**
     * This function binds an event to the unpin button.
     */
    function unpinButtonEvent(crn){
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/student/unpin/'+crn,
            type: 'POST',
            contentType: 'application/json',                        
            success: function(response){

            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
        window.location.reload(true);
    }
});