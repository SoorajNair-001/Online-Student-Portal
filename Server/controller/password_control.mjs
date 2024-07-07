import { Password } from '../model/password.mjs';

/**
 * A function that adds a Password to the database.
 * @param {String} username - the username
 * @param {String} password - the password
 */
export async function add_pass(username,password) {
    let isValid  = checkValid(password,username);

    if (isValid){
        let new_pass = new Password(await Password.createPassId(),password,username);
        let msg = await new_pass.save();
        return msg;                
    } else {
        console.log('The Password was not inserted in the database since it is not valid.');
        return 'Error. Create password failed!';
    }
}

/** 
 * A fuction to check if the main attributes are provided.
 */
function checkValid(password,username){
    if(password == undefined || username == undefined){
        return false;
    }
    return true;
}

/**
 * A function that lists all Password data
 * @return {Array} List of passwords
 */
export async function list_all_pass(req, res) {    
    let objs = await Password.getAll();
    console.log(objs.length+' item(s) sent.');
    return objs;        
}

/**
 * A function that gets a Password with username 
 * @param {String} username - the username
 */
export async function get_PasswordData(username) {
    let obj = await Password.get(username);
    if (obj.length > 0){
        console.log(obj.length+' item(s) sent.');
        return obj[0];        
    }else{
        return 'No password was found';
    }  
}

/**
 * A function to update the Password.
 * @param {String} username - the username
 * @param {Password} upd_obj - the new object data
 */
export async function update_PasswordData(param_username,upd_obj) {
    let password = upd_obj.password;
    let username = upd_obj.username;
    let isValid  = checkValid(password,username);
    if (isValid){
        let msg = await Password.update(param_username, 
                            new Password('',password,username))
        return msg;
    } else {
        console.log("The password was not updated");
        let msg = 'Update failed! Username is not valid.';
        return msg;
    }
}

/**
 * A function that deletes a Password
 * @param {String} username - the username
 */
export async function delete_PasswordData(username) {
    let msg = await Password.delete(username);
    return msg;
}

/**
 * A function that validates a Password
 * @param {String} username - the username
 * @param {String} password - the password
 * @return {Boolean} Boolean if password is corrent or not
 */
export async function validate_PasswordData(username,password) {
    let msg = await Password.validatePassword(username,password);
    return msg;
}
