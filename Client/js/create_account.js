const accessKey = JSON.parse( localStorage.getItem('accessKey')).key;

$(document).ready(function(){
    /**
     * This function binds an event to the create account button.
     */
    $("#create-account-btn").click(function(event){
        event.preventDefault();
        let name = $("#create-fullname").val();
        let stdId = $("#create-stdNum").val();
        let level = document.getElementById("create-level-select").value.toString();
        let major = $("#create-major").val();
        let username = $("#create-username").val();
        let password = $("#create-password").val();
        let confirmPassword = $("#create-confirm-password").val();


        if(name == "" || stdId == "" || major == "" || 
            username == "" || password == "" || confirmPassword == "" || level == "- select level -"){
            $("#create-error-message").text("Please fill all account info.");
            document.getElementById("create-error-message").style.visibility="visible";
            document.getElementById("error-message").style.color="#ff0000"; 
        }
        else if(password != confirmPassword){
            $("#create-error-message").text("Passwords don't match.");
            document.getElementById("create-error-message").style.visibility="visible";
            document.getElementById("error-message").style.color="#ff0000"; 
        }
        else{
            let accountData = assembleAccountData();
            $.ajax({
                url: 'http://localhost:3000/account/create',
                type: 'POST',
                data: JSON.stringify(accountData),
                contentType: 'application/json',                        
                success: function(response){
                    if(response.toString()!='Account creation successfully.'){
                        $("#create-error-message").text(response.toString());
                        document.getElementById("create-error-message").style.visibility="visible";  
                        document.getElementById("error-message").style.color="#ff0000"; 
                    }
                    else{
                        $("#create-error-message").text("Account created successfully!");
                        document.getElementById("create-error-message").style.visibility="visible";
                        document.getElementById("create-error-message").style.color="#03c03c";  
                        window.location = "./index.html";
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
     * Accesble new account data
     */
    function assembleAccountData(){
        let account = {};
        account.name = $("#create-fullname").val();
        account.stdId = $("#create-stdNum").val();
        account.level = document.getElementById("create-level-select").value.toString();
        account.major = $("#create-major").val();
        account.username = $("#create-username").val();
        account.password = $("#create-password").val();
        return account;     
    }
});