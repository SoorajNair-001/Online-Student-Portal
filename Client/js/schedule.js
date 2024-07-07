const accessKey = JSON.parse( localStorage.getItem('accessKey')).key;
$(document).ready(function(){

    /**
     * This function will read student schedule data from server 
     * and display it in a table.
     */
    $.ajax({
        url: 'http://localhost:3000/'+accessKey+'/student/schedule',
        type: 'GET',
        contentType: 'application/json',                        
        success: function(response){
            if(response != 'No courses was found'){
                let sch = [[],[],[],[],[],[],[]];
                for(const course of response){
                    for(const time of course.times){
                        time.push(course.subject,course.number,course.section,course.room,course.type);
                        if(time[0] =="M"){sch[0].push(time)}
                        if(time[0] =="T"){ sch[1].push(time)}
                        if(time[0] =="W"){ sch[2].push(time)}
                        if(time[0] =="R"){ sch[3].push(time)}
                        if(time[0] =="F"){ sch[4].push(time)}
                        if(time[0] =="S"){ sch[5].push(time)}
                        if(time[0] =="U"){ sch[6].push(time)}
                    }
                }
                sch[0].sort(sortFunction);
                sch[1].sort(sortFunction);
                sch[2].sort(sortFunction);
                sch[3].sort(sortFunction);
                sch[4].sort(sortFunction);
                sch[5].sort(sortFunction);
                sch[6].sort(sortFunction);

                function sortFunction(a, b) {
                    if (a[1] === b[1]) {
                        return 0;
                    }
                    else {
                        return (a[1] < b[1]) ? -1 : 1;
                    }
                }

                for(const day of sch){
                    for(const time of day){
                        let i = 1;
                        let found = false;
                        while (!found){
                            if(document.getElementById(time[0]+i.toString()).innerHTML != ""){
                                i++;
                            }
                            else{
                                found = true;
                            }
                        }
                        document.getElementById(time[0]+i.toString()).style.display = "flex";
                        document.getElementById(time[0]+i.toString()).innerHTML = time[3]+" "+time[4]+
                                                                "<br>"+time[5]+" "+time[7]+"<br>"+time[6]+"<br>"+time[1]+"-"+time[2];
                    }
                }
            }   
        },                   
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });
});