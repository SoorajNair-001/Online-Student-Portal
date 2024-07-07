import { Student } from '../model/student.mjs';
import {validate_accessKey} from '../controller/access_control.mjs';

/**
 * A function that adds a Student data to the database.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 * @returns {String} A message if the student insert successful or not
 */
export async function add_std(req, res) {
    let name = req.body.name;
    let username = req.body.username;
    let stdId = req.body.stdId;
    let level = req.body.level;
    let major = req.body.major;

    let isValid  = checkValid(name,username,stdId,level,major);

    if (isValid){
        let new_student = new Student(name,username,stdId,level,major);
        let msg = await new_student.save();
        return msg;               
    } else {
        console.log('The Student Data was not inserted.');
        return 'Error. Student Data insert failed!';
    }
}

/** 
 * A fuction to check if the main attributes are provided.
 */
function checkValid(name,username,stdId,level,major){
    if(name == undefined || username == undefined || stdId == undefined || level == undefined ||
        major == undefined){
        return false;
    }
    return true;
}

/**
 * A function that lists all Student data with all information that is
 * in the file. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function list_all_std(req, res) {    
    let objs = await Student.getAll();
    console.log(objs.length+' item(s) sent.');
    res.send(objs);        
}

/**
 * A function that gets a Student data with username
 * It returns all data of the Student. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function get_StudentData(req, res) { 
    let key = req.params.key;
    let obj = await validate_accessKey(key);
    if(obj == 'No access.'){
        console.log('Access key not found.');
        res.send('Already logged out.');
    }
    else{
        let std = await Student.get(obj.username);
        if (std.length > 0){
            console.log(std.length+' item(s) sent.');
            res.send(std[0]);        
        }else{
            res.send('No student was found');
        }  
    }
}

/**
 * A function that gets the schedule of the current account
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function getSchedule(req, res) { 
    let key = req.params.key;
    let obj = await validate_accessKey(key);
    if(obj == 'No access.'){
        console.log('Access key not found.');
        res.send('Already logged out.');
    }
    else{
        let std = await Student.getSchedule(obj.username);
        if (std.length > 0){
            console.log(std.length+' item(s) sent.');
            res.send(std);        
        }else{
            res.send('No courses was found');
        }  
    }
}

/**
 * A function to update the Student information.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function update_StudentData(req, res) {
    let param_username = req.params.username;     // access key
    let name = req.body.name;
    let username = req.body.username;
    let stdId = req.body.stdId;
    let level = req.body.level;
    let major = req.body.major;
    let isValid  = checkValid(name,username,stdId,level,major);
    if (isValid){
        let msg = await Student.update(param_username, 
                            new Student(name,username,stdId,level,major))
        console.log("The student data updated");
        res.send(msg);
    } else {
        console.log("The student data was not updated");
        let msg = 'Update failed! The student data is not valid.';
        res.send(msg);
    }
}

/**
 * A function that deletes a student data.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function delete_StudentData(req, res) {
    let username = req.body.username;             // access key
    let msg = await Student.delete(username);
    console.log("The student data was deleted");
    return msg;
}

/**
 * A function that adds course to a student
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function addCourse(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let param_crn = req.params.crn;
        let msg = await Student.add_course(username,param_crn);
        console.log(msg);
        res.send(msg);
    }
}

/**
 * A function that adds course with conflict override
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function addOverrideCourse(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let param_crn = req.params.crn;
        let msg = await Student.add_override_course(username,param_crn);
        console.log(msg);
        res.send(msg);
    }
}

/**
 * A function that removes course from a student
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function removeCourse(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let param_crn = req.params.crn;
        let msg = await Student.remove_course(username,param_crn);
        console.log(msg);
        res.send(msg);
    }
}

/**
 * A function that removes mulktiple courses from a student
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function removeMultCourse(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let crns = req.body.crns;
        let msg = await Student.remove_mult_course(username,crns);
        console.log(msg);
        res.send(msg);
    }
}

/**
 * A function that finds the number of credit hours of the student
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function getCredits(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let msg = await Student.get_CreditHours(username);
        res.send(msg.toString());
    }
}


/**
 * A function that pins course to a student
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function pinCourse(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let param_crn = req.params.crn;
        let msg = await Student.pin_course(username,param_crn);
        console.log(msg);
        res.send(msg);
    }
}

/**
 * A function that unpinnes course from a student
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function unpinCourse(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let param_crn = req.params.crn;
        let msg = await Student.unpin_course(username,param_crn);
        console.log(msg);
        res.send(msg);
    }
}

/**
 * A function that gets the pinned courses of the current account
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function getPinnedCourse(req, res) { 
    let key = req.params.key;
    let obj = await validate_accessKey(key);
    if(obj == 'No access.'){
        console.log('Access key not found.');
        res.send('Already logged out.');
    }
    else{
        let std = await Student.getPinned(obj.username);
        if (std.length > 0){
            console.log(std.length+' item(s) sent.');
            res.send(std);        
        }else{
            res.send('No courses was found');
        }  
    }
}

/**
 * A function that check for a time conflict with schedule
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function checkConflict(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let username = (await validate_accessKey(key)).username; 
        let param_crn = req.params.crn;
        let msg = await Student.checkConflict(username,param_crn);
        console.log(msg);
        res.send(msg);
    }
}