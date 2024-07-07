window.localStorage
$(document).ready(function(){
    /**
     * This function binds an event to the login button.
     */
    $("#login-btn").click(function(event){
        event.preventDefault();
        let username = $("#login-username").val();
        let password = $("#login-password").val();
        if(username == "" || password == ""){
            $("#error-message").text("Please enter account info.");
            document.getElementById("error-message").style.visibility="visible";
            document.getElementById("error-message").style.color="#ff0000"; 
        }
        else{
            let loginData = assembleLoginData();
            $.ajax({
                url: 'http://localhost:3000/account/login',
                type: 'POST',
                data: JSON.stringify(loginData),
                contentType: 'application/json',                        
                success: function(response){
                    if(response.toString()=="Invalid Username or password"){
                        $("#error-message").text(response.toString());
                        document.getElementById("error-message").style.visibility="visible"; 
                        document.getElementById("error-message").style.color="#ff0000"; 
                    }
                    else{
                        $("#error-message").text("Login Success!");
                        document.getElementById("error-message").style.visibility="visible";
                        document.getElementById("error-message").style.color="#03c03c";    
                        let accessKey = response.toString();
                        saveAccessKey(accessKey);
                        saveAccountInfo(accessKey);
                        window.location = "./home.html";
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
     * Login data accemble
     */
    function assembleLoginData(){
        let login = {};
        login.username = $("#login-username").val();
        login.password = $("#login-password").val();
        return login;     
    }

    /**
     * Save access key to persistant storage
     */
    function saveAccessKey(key){
        localStorage.setItem('accessKey', JSON.stringify({ key:key }));
    }

    /**
     * Save a account data to persistant storage
     */
    function saveAccountInfo(accessKey){
        $.ajax({
            url: 'http://localhost:3000/'+accessKey+'/account/get',
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                localStorage.setItem('account', JSON.stringify(response));
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });

    }

    /**
     * This function binds an event to the create button.
     */
    $("#create-btn").click(function(event){
        window.location = "./create-account.html";
    });

    /**
     * This function binds an event to the forgot button.
     * NOT IMPLEMENTED
     */
    $("#forgot-btn").click(function(event){
        window.alert("Forgot password not implemented yet.");
    });
});