import { getDb } from '../utils/db.mjs';
import { Course } from '../model/course.mjs';

async function _get_student_collection(){
    let db = await getDb();
    return await db.collection('student_accounts');
};

export class Student{ // student class
    // constructor
    constructor(name,username,stdId,level,major){
        this.name = name;
        this.username = username;
        this.stdId = stdId;
        this.level = level;
        this.major = major;
        this.schedule = [];
        this.pinned = [];
    }

    /**
     * This method saves the current object Student in the Database
     * @returns {String} - A message if a Student was saved in the db or not
     */
    async save(){
        try{
            let collection = await _get_student_collection();
            if((await Student.get(this.stdId)).length == 0){
                let mongoObj = await collection.insertOne(this);
                this._id = mongoObj.insertedId;
                console.log('Student was inserted in the database with id -> '+this._id);
                return 'Student data correctly inserted in the Database.';    
            }else{
                console.log('Student Data insert failed!duplicate');
                return 'Error. Student Data insert failed!';
            }        
        } catch(err){
            throw err
        }        
    }
    /**
     * This static method for the class Student will retrieve
     * the total credit hours in the schedule of the student
     * @returns {Integer} - The number of credit hours
     */
    static async get_CreditHours(username){
        try{
            let collection = await _get_student_collection();
            let obj = await collection.find({'username': username}).toArray();
            let schedule = obj[0].schedule;
            let credits = 0;
            for(const course of schedule){
                credits += parseInt(course.credits);
            }
            return credits; 
        } catch(err){
            throw err
        }               
    }


    /**
     * This static method for the class Student will retrieve
     * all the Student data inside the database
     * @returns {Array[Student]} - An array with all the Student retrieved
     */
    static async getAll(){
        try{
            let collection = await _get_student_collection();
            let objs = await collection.find({}).toArray();
            return objs; 
        } catch(err){
            throw err
        }               
    }

    /**
     * This method will retrieve a Student data
     * @param {String} username - the username of the student to be retrieved
     * @returns {Student} - An object Student with all its data
     */
    static async get(username){
        try{
            let collection = await _get_student_collection();
            let obj = await collection.find({'username': username}).toArray();
            return obj;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will retrieve the student schedule
     * @param {String} username - the username of the student to be retrieved
     * @returns {Student} - An object Student with all its data
     */
    static async getSchedule(username){
        try{
            let collection = await _get_student_collection();
            let obj = await collection.find({'username': username}).toArray();
            return obj[0].schedule;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will retrieve a Student pinned courses
     * @param {String} username - the username of the student to be retrieved
     * @returns {Student} - An object Student with all its data
     */
    static async getPinned(username){
        try{
            let collection = await _get_student_collection();
            let obj = await collection.find({'username': username}).toArray();
            return obj[0].pinned;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will update the student date.
     * @param {String} username - the username of the student to be retrieved
     * @param {Student} new_data - An object of class Student
     * @returns {String} A message if the student data was updated or not
     */
    static async update(username, new_data){
        try{
            let collection = await _get_student_collection();
            let new_vals = {$set: {'name':new_data.name,'username':new_data.username,'stdId':new_data.stdId,
                            'level':new_data.level,'major':new_data.major}};
            let obj = await collection.updateOne({"username": username}, new_vals)
            let updated_data = await Student.get(username);
            if (obj.modifiedCount > 0){
                console.log('Student object->'+updated_data[0]._id.toString()+' was updated.');
                return 'Student data correctly updated.';
            }else{
                return 'Student data was not updated.'
            }  
        } catch(err){
            throw err
        }      
    }

    /**
     * This method will detele the student data.
     * @param {String} username - the username of the student to be retrieved
     * @returns {String} A message if the student data was deleted or not
     */
    static async delete(username){
        try{
            let collection = await _get_student_collection();
            let updated_data = await Student.get(username);
            let obj = await collection.deleteOne({"username": username})
            if (obj.deletedCount > 0){
                console.log('Student object->'+updated_data[0]._id.toString()+' was deleted.');
                return 'Student data was deleted.'
            }else{
                return 'Student data was not found';
            }
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will check if the course conflicts with the student's schedule
     * @param {String} username - the username of the student to be retrieved
     * @param {String} crn - the crn of the course to be checked
     * @returns {String} A message stating the time conflicts
     */
    static async checkConflict(username,crn){
        try{
            let student = (await Student.get(username))[0];
            let conflicts = 'conflict: '+crn+' <-> ';
            let isConflict = false;
            for(const stdCourse of student.schedule){
                if(await Course.time_conflict(stdCourse.crn,crn)){ // if there is conflict 
                    conflicts+=(stdCourse.crn+' , ');
                    isConflict = true;
                }
            }
            if(isConflict){
                return conflicts;
            }else{
                return 'No time conflicts';
            }
        } catch(err){
            throw err
        } 
    }
    
    static async check_course_in_schedule(schedule,crn){
        try{
            let found = false;
            for(const course of schedule){
                if(course.crn == crn){
                    found = true;
                }
            }
            return found;
        } catch(err){
            throw err
        } 
    }
    
    /**
     * This method will add course to student's schedule
     * @param {String} username - the username of the student
     * @param {String} crn - the crn of the course to be added
     * @returns {String} A message if the course was added
     */
    static async add_course(username,crn){
        try{
            let course1 = (await Course.get(crn))[0];
            if(course1.rem != '0'){
                if((await Student.get_CreditHours(username))+parseInt(course1.credits) <=15){
                    let student = (await Student.get(username))[0];
                    let course = (await Course.get(crn))[0];
                    if(course!=undefined){
                        if(await Student.check_course_in_schedule(student.schedule,crn)){
                            return 'Course already added.';
                        }
                        else{ // finding if there is conflict 
                            let conflict = false;
                            if(student.schedule.length!=0){ // no conflicts possible for first course.
                                let confStr = await Student.checkConflict(username,crn);
                                if(confStr != 'No time conflicts'){
                                    conflict = true;
                                    return confStr;
                                }
                            }
                            if(!conflict){
                                student.schedule.push(course); // if no conflicts found, add to schedule
                                // update changes to database
                                let collection = await _get_student_collection();
                                let new_vals = {$set: {'name':student.name,'username':student.username,'stdId':student.stdId,
                                                'level':student.level,'major':student.major,'schedule':student.schedule}};
                                let obj = await collection.updateOne({"username": username}, new_vals)
                                
                                if (obj.modifiedCount > 0){
                                    await Course.updateAct(crn, parseInt(course.act)+1);
                                    await Course.updateRem(crn, parseInt(course.rem)-1);
                                    return 'Course added successfully';
                                }else{
                                    return 'add course failed'
                                } 
                            }
                        }
                    }else{
                        return "CRN does not exist"
                    }
                }
                else{
                    return "Course limit reached"
                }
            }else{
                return "Course full"
            }
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will add course to student's schedule with conflict override
     * @param {String} username - the username of the student
     * @param {String} crn - the crn of the course to be added
     * @returns {String} A message if the course was added
     */
    static async add_override_course(username,crn){
        try{
            if((await Student.get_CreditHours(username))+3 <=15){
                let student = (await Student.get(username))[0];
                let course = (await Course.get(crn))[0];
                if(course!=undefined){
                    if(await Student.check_course_in_schedule(student.schedule,crn)){
                        return 'Course already added.';
                    }
                    else{ // finding if there is conflict 
                        student.schedule.push(course);
                        // update changes to database
                        let collection = await _get_student_collection();
                        let new_vals = {$set: {'name':student.name,'username':student.username,'stdId':student.stdId,
                                        'level':student.level,'major':student.major,'schedule':student.schedule}};
                        let obj = await collection.updateOne({"username": username}, new_vals)
                        
                        if (obj.modifiedCount > 0){
                            await Course.updateAct(crn, parseInt(course.act)+1);
                            await Course.updateRem(crn, parseInt(course.rem)-1);
                            return 'Course added successfully with override';
                        }else{
                            return 'add course failed'
                        } 
                    }
                }else{
                    return "CRN does not exist"
                }
            }
            else{
                return "Course limit reached"
            }
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will remove course from student's schedule
     * @param {String} username - the username of the student
     * @param {String} crn - the crn of the course to be removed
     * @returns {String} A message if the course was removed
     */
    static async remove_course(username,crn){
        try{
            let student = (await Student.get(username))[0];
            let course = (await Course.get(crn))[0];

            if(await Student.check_course_in_schedule(student.schedule,crn)){ // remove it.
                let indexToRemove = student.schedule.indexOf(course);
                student.schedule.splice(indexToRemove,1);
                // update changes to database
                let collection = await _get_student_collection();
                let new_vals = {$set: {'name':student.name,'username':student.username,'stdId':student.stdId,
                                'level':student.level,'major':student.major,'schedule':student.schedule}};
                let obj = await collection.updateOne({"username": username}, new_vals)
                
                if (obj.modifiedCount > 0){
                    await Course.updateAct(crn, parseInt(course.act)-1);
                    await Course.updateRem(crn, parseInt(course.rem)+1);
                    return 'Course removed successfully';
                }else{
                    return 'Course remove failed'
                }
            }
            else{ // if course not found
                return 'Course not in schedule';
            }
        } catch(err){
            throw err
        }  
    }


    /**
     * This method will remove mutiple courses from student's schedule
     * @param {String} username - the username of the student
     * @param {String} crns - the crns of the courses to be removed
     * @returns {String} A message if the course was removed
     */
    static async remove_mult_course(username,crns){
        try{
            for(const crn of crns){
                let student = (await Student.get(username))[0];
                let course = (await Course.get(crn))[0];
                if(await Student.check_course_in_schedule(student.schedule,crn)){ // remove it.
                    let newSchedule = [];
                    for(const cr of student.schedule){
                        if(cr.crn != crn){
                            newSchedule.push(cr);
                        }
                    }
                    // update changes to database
                    let collection = await _get_student_collection();
                    let new_vals = {$set: {'name':student.name,'username':student.username,'stdId':student.stdId,
                                    'level':student.level,'major':student.major,'schedule':newSchedule}};
                    let obj = await collection.updateOne({"username": username}, new_vals)
                }
                await Course.updateAct(crn, parseInt(course.act)-1);
                await Course.updateRem(crn, parseInt(course.rem)+1);
            }
            return crns.length+' Courses removed'
        } catch(err){
            throw err
        }  
    }


    /**
     * This method will pins course to student
     * @param {String} username - the username of the student
     * @param {String} crn - the crn of the course to be added
     * @returns {String} A message if the course was added
     */
    static async pin_course(username,crn){
        try{
            let student = (await Student.get(username))[0];
            let course = (await Course.get(crn))[0];
            if(student.pinned.length+1<=3){
                if(course!=undefined){
                    if(await Student.check_course_in_schedule(student.pinned,crn)){
                        return 'Course already added.';
                    }
                    else{
                        student.pinned.push(course);
                        // update changes to database
                        let collection = await _get_student_collection();
                        let new_vals = {$set: {'name':student.name,'username':student.username,'stdId':student.stdId,
                                        'level':student.level,'major':student.major,'schedule':student.schedule,'pinned':student.pinned}};
                        let obj = await collection.updateOne({"username": username}, new_vals)
                        
                        if (obj.modifiedCount > 0){
                            return 'Course pinned successfully';
                        }else{
                            return 'pin course failed'
                        } 

                    }
                }else{
                    return "CRN does not exist"
                }
            }else{
                return "Pin limit reached"
            }
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will unpin course from student
     * @param {String} username - the username of the student
     * @param {String} crn - the crn of the course to be removed
     * @returns {String} A message if the course was removed
     */
    static async unpin_course(username,crn){
        try{
            let student = (await Student.get(username))[0];
            let course = (await Course.get(crn))[0];

            if(await Student.check_course_in_schedule(student.pinned,crn)){
                let indexToRemove = student.pinned.indexOf(course);
                student.pinned.splice(indexToRemove,1);
                // update changes to database
                let collection = await _get_student_collection();
                let new_vals = {$set: {'name':student.name,'username':student.username,'stdId':student.stdId,
                                'level':student.level,'major':student.major,'schedule':student.schedule,'pinned':student.pinned}};
                let obj = await collection.updateOne({"username": username}, new_vals)
                
                if (obj.modifiedCount > 0){
                    return 'Course unpinned successfully';
                }else{
                    return 'course unpin failed'
                }
            }
            else{ // if course not found
                return 'Course not found';
            }
        } catch(err){
            throw err
        }  
    }
}
