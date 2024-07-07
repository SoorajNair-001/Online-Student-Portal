import { validate_accessKey,get_AccessData, add_access, update_AccessData, delete_AccessData} from '../controller/access_control.mjs';
import { add_std, update_StudentData, delete_StudentData} from '../controller/student_accounts.mjs';
import { get_PasswordData, add_pass, update_PasswordData, delete_PasswordData, validate_PasswordData} from '../controller/password_control.mjs';


/**
 * A function that logins a user.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let isValid  = checkValid(username,password);
    if (isValid){
        if(await validate_PasswordData(username,password)){
            let key = await add_access(username);
            res.send(key);
        }       
        else{
            console.log('Wrong password.');
            res.send('Invalid Username or password');
        } 
    } else {
        console.log('Invalid Username or password');
        res.send('Invalid Username or password');
    }
}

/**
 * A function that logs out a user.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function logout(req, res) {
    let key = req.params.key;
    let obj = await validate_accessKey(key);
    if(obj == 'No access.'){
        console.log('Access key not found.');
        res.send('Already logged out.');
    }
    else{
        await delete_AccessData(obj.username);
        res.send('Account logged out successfully.');
    }
}

/** 
 * A fuction to check if the main attributes are provided.
 */
function checkValid(username,password){
    if(username == undefined || password == undefined){
        return false;
    }
    return true;
}

/**
 * A function that creates a new user account.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function new_account(req, res) {
    let msg = await add_std(req, res);
    if(msg == 'Error. Student Data insert failed!'){
        res.send('Account creation failed! Retry.');
    }else{
        let username = req.body.username;
        let password = req.body.password;
        let isValid  = checkValid(username,password);
        if (isValid){
            let passMsg = add_pass(username,password);
            if(passMsg == 'Error. Create password failed!'){
                await delete_StudentData(req, res);
                res.send('Account creation failed! Retry.');
            }
            res.send('Account creation successfully.');

        } else {
            await delete_StudentData(req, res);
            console.log('Invalid Username or password');
            res.send('Account creation failed! Retry.');
        }
    }
}

/**
 * A function that deletes a user account.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function delete_account(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let isValid  = checkValid(username,password);
    if (isValid){
        if(await validate_PasswordData(username,password)){
            let msg = await delete_StudentData(req, res);
            if(msg == 'Student data was not found'){
                res.send('Account deletion failed! Retry.');
            }else{
                await delete_PasswordData(username);
                await delete_AccessData(username);
                res.send('Account deleted successfully.');
            }
        }       
        else{
            console.log('Wrong password.');
            res.send('Invalid Username or password');
        } 
    } else {
        console.log('Invalid Username or password');
        res.send('Invalid Username or password');
    }
}