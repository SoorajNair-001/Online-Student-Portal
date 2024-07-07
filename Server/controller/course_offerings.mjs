import { Course } from '../model/course.mjs';
import {validate_accessKey} from '../controller/access_control.mjs';

/**
 * A function that adds a Course data to the database.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function add(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        if((await validate_accessKey(key)).username == 'admin'){
            let subject = req.body.subject;
            let number = req.body.number;
            let name = req.body.name;
            let section = req.body.section;
            let crn = req.body.crn;
            let slot = req.body.slot;
            let room = req.body.room;
            let type = req.body.type;
            let times = req.body.times;
            let credits = req.body.credits;
            let instructors = req.body.instructors;

            let isValid  = checkValid(subject,number,name,section,crn,slot,room,type,times,credits,instructors);

            if (isValid){
                let new_course = new Course(subject,number,name,section,crn,slot,room,type,times,credits,instructors);
                let msg = await new_course.save();
                res.send(msg);                
            } else {
                console.log('The Course Data was not inserted in the database since it is not valid.');
                res.send('Error. Course Data insert failed!');
            }
        }
        else{
            console.log('Access key failed. Not admin.');
            res.send('Permission denied.');
        }
    }
}

/** 
 * A fuction to check if the main attributes are provided.
 */
function checkValid(subject,number,name,section,crn,slot,room,type,times,credits,instructors){
    if(subject == undefined || number == undefined || name == undefined ||
        section == undefined || crn == undefined || slot == undefined
        || room == undefined|| type == undefined|| times == undefined|| credits == undefined|| instructors == undefined){
        return false;
    }
    return true;
}

/**
 * A function that lists all Course data with all information that is
 * in the file. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function list_all(req, res) {    
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let objs = await Course.getAll();
        console.log(objs.length+' item(s) sent.');
        res.send(objs);   
    }     
}

/**
 * A function that lists all subjects offered in the term
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function get_Subjects(req, res) {    
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let objs = await Course.getAllSubjects();
        console.log(objs.length+' item(s) sent.');
        res.send(objs);   
    }     
}

/**
 * A function that lists all Course data for a given subject
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function list_subject_courses(req, res) {  
    let subject = req.params.subject;
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let objs = await Course.get_subject(subject);
        if(objs != "No courses found."){
            console.log(objs.length+' item(s) sent.');
        }
        res.send(objs);   
    }     
}

/**
 * A function that lists all sections for a given subject
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function list_sections_courses(req, res) {  
    let subject = req.params.subject;
    let number = req.params.number;
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let objs = await Course.get_sections(subject,number);
        if(objs != "No sections found."){
            console.log(objs.length+' item(s) sent.');
        }
        res.send(objs);   
    }
}

/**
 * A function that search for courses
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function search_courses(req, res) {  
    let input = req.params.input;
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }
    else{
        let objs = await Course.search(input);
        if(objs != "No sections found."){
            console.log(objs.length+' item(s) sent.');
        }
        res.send(objs);   
    }
}


/**
 * A function that gets a Course data with subject, number and section.
 * It returns all data of the requested Course. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function get_CourseData(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        let param_crn = req.params.crn;
        let obj = await Course.get(param_crn);
        if (obj.length > 0){
            console.log(obj.length+' item(s) sent.');
            res.send(obj[0]);        
        }else{
            res.send('No course was found');
        }
    }
    
}

/**
 * A function to update the course information.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function update_CourseData(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        if((await validate_accessKey(key)).username == 'admin'){
            let param_crn = req.params.crn;
            let subject = req.body.subject;
            let number = req.body.number;
            let name = req.body.name;
            let section = req.body.section;
            let crn = req.body.crn;
            let slot = req.body.slot;
            let room = req.body.room;
            let type = req.body.type;
            let times = req.body.times;
            let credits = req.body.credits;
            let instructors = req.body.instructors;
            let isValid  = checkValid(subject,number,name,section,crn,slot,room,type,times,credits,instructors);
            if (isValid){
                let msg = await Course.update(param_crn, 
                                    new Course(subject,number,name,section,crn,slot,room,type,times,credits,instructors))
                res.send(msg);
            } else {
                console.log("The course data was not updated");
                let msg = 'Update failed! The data is not valid.';
                res.send(msg);
            }
        }
        else{
            console.log('Access key failed. Not admin.');
            res.send('Permission denied.');
        }
    }

}

/**
 * A function that deletes a course data.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function delete_CourseData(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        if((await validate_accessKey(key)).username == 'admin'){
            let param_crn = req.params.crn;
            let msg = await Course.delete(param_crn);
            res.send(msg);
        }
        else{
            console.log('Access key failed. Not admin.');
            res.send('Permission denied.');
        }
    }
}

/**
 * A function that checks if there is a time conflit between the given courses.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function conflict(req, res) {
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        let param_crn1 = req.params.crn1;
        let param_crn2 = req.params.crn2;
        let msg = await Course.time_conflict(param_crn1,param_crn2);
        res.send(msg.toString());
    }
}

/**
 * A function that uploads course data in a file to the database
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function uploadCoursesToDB(req,res) {
    let fileName = req.params.filename;
    let dataName = req.params.dataname;
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        if((await validate_accessKey(key)).username == 'admin'){
            let msg = await Course.uploadAllCourses('./resources/'+fileName, dataName);
            res.send(msg);
        }
        else{
            console.log('Access key failed. Not admin.');
            res.send('Permission denied.');
        }
    }
}

/**
 * A function that drops a course collection
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
export async function removeCoursesfromDB(req,res) {
    let dataName = req.params.dataname;
    let key = req.params.key;
    if(await validate_accessKey(key) == 'No access.'){
        console.log('Access key failed.');
        res.send('Permission denied.');
    }else{
        if((await validate_accessKey(key)).username == 'admin'){
            let msg = await Course.deleteAllCourses(dataName);
            res.send(msg);
        }
        else{
            console.log('Access key failed. Not admin.');
            res.send('Permission denied.');
        }
    }
}



