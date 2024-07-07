import { AccessKey } from '../model/access_key.mjs';

/**
 * A function that adds a AccessKey to the database.
 * @param {String} username - username of the account
 * @return {String} - Access key generated
 */
export async function add_access(username) {
    let new_access = new AccessKey(await AccessKey.createAccessKey(),username);
    let key = await new_access.save();
    return key;                
}

/**
 * A function that lists all Access keys
 * @returns {Array} list of accesskeys
 */
export async function list_all_access() {    
    let objs = await AccessKey.getAll();
    console.log(objs.length+' item(s) sent.');
    return objs;        
}

/**
 * A function that gets a Accesskey for username 
 * @param {String} username - the username for access
 */
export async function get_AccessData(username) {
    let obj = await AccessKey.get_key(username);
    if (obj.length > 0){
        console.log(obj.length+' item(s) sent.');
        return obj[0];        
    }else{
        return 'No access found.';
    }  
}

/**
 * A function to update the Access key.
 * @param {String} username - the username to update
 * @param {AccessKey} upd_obj new update object
 */
export async function update_AccessData(param_username,upd_obj) {
    let key = upd_obj.key;
    let username = upd_obj.username;
    let isValid  = checkValid(username);
    if (isValid){
        let msg = await AccessKey.update(param_username, 
                            new AccessKey(key,username))
        return msg;
    } else {
        console.log("The access key was not updated");
        let msg = 'Update failed! Username is not valid.';
        return msg;
    }
}

/**
 * A function that deletes a AccessKey
 * @param {String} username - the username to delete
 */
export async function delete_AccessData(username) {
    let msg = await AccessKey.delete(username);
    return msg;
}

/**
 * A function that validates a accesskey an return the username
 * @param {String} accesskey - the accesskey
 * @returns {String} Username or message No access
 */
export async function validate_accessKey(key) {
    let obj = await AccessKey.get_user(key);
    if (obj.length > 0){
        return obj[0];        
    }else{
        return 'No access.';
    }  
}

