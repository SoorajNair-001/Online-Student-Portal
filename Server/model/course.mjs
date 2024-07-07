import { writeFileSync, appendFileSync, readFileSync} from 'fs';
import { getDb } from '../utils/db.mjs';
import { createRequire } from "module";

var courses_term = 'courses_winter_2022_2023';

async function _get_course_collection (){
    let db = await getDb();
    return await db.collection(courses_term);
};

export class Course { // course class
    static arrayCourses = []; // array that store all the Course  objects.
    // constructor
    constructor(subject,number,name,section,crn,slot,room,type,times,credits,instructors) {
        this.subject = subject;
        this.number = number;
        this.name = name;
        this.section = section;
        this.crn = crn;
        this.slot = slot;
        this.room = room;
        this.type = type;
        this.times = times;
        this.credits = credits;
        this.instructors = instructors;
    } 

    /**
     * This method saves the current object Course in the Database
     * @returns {String} - A message if a Course was saved in the db or not
     */
    async save(){
        try{
            let collection = await _get_course_collection();
            if((await Course.get(this.crn)).length == 0){
                let mongoObj = await collection.insertOne(this);
                this._id = mongoObj.insertedId;
                console.log('Course was inserted in the database with id -> '+this._id);
                return 'Course data correctly inserted in the Database.';   
            }else{
                console.log('Course Data insert failed! duplicate');
                return 'Error. Course Data insert failed!';
            }   
        } catch(err){
            throw err
        }        
    }

    /**
     * This static method for the class Course will retrieve
     * all the Course data inside the database
     * @returns {Array[Course]} - An array with all the Courses retrieved
     */
    static async getAll(){
        try{
            let collection = await _get_course_collection();
            let objs = await collection.find({}).toArray();
            return objs;   
        } catch(err){
            throw err
        }              
    }

    /**
     * This static method for the class Course will retrieve
     * all the Subjects inside the database
     * @returns {Array[String]} - An array with all the Subject names
     */
    static async getAllSubjects(){
        try{
            let collection = await _get_course_collection();
            let objs = await collection.find({}).toArray();
            let subjects = [];
            for (const course of objs){
                subjects.push(course.subjectName);
            }
            subjects = [...new Set(subjects)].sort();
            return JSON.stringify(subjects);
        } catch(err){
            throw err
        }              
    }

    /**
     * This static method for the class Course will retrieve
     * all the courses for a subject
     * @returns {Array[Course]} - An array with all the Courses retrieved
     */
    static async get_subject(subject){
        try{
            let collection = await _get_course_collection();
            let objs = await collection.find({'subjectName':subject}).toArray();
            if (objs.length < 1 ) {
                console.log('Database is empty!');
                return 'No courses found.';
            }
            let numbers = [];
            let newList = [];
            for(const ele of objs){
                if(!numbers.includes(ele.number)){
                    newList.push(ele);
                    numbers.push(ele.number)
                }
            }
            return newList;   
        } catch(err){
            throw err
        }              
    }

    /**
     * This static method for the class Course will retrieve
     * all the sections for a subject
     * @returns {Array[Section]} - An array with all the setions retrieved
     */
    static async get_sections(subject,number){
        try{
            let collection = await _get_course_collection();
            let objs = await collection.find({'subjectName':subject,'number':number}).toArray();
            if (objs.length < 1 ) {
                console.log('Database is empty!');
                return 'No sections found.';
            }
            return objs;   
        } catch(err){
            throw err
        }              
    }
    /**
     * This static method for the class Course will search
     * for a course based on key words
     * @returns {Array[Course]} - An array with all the setions retrieved
     */
    static async search(input){
        try{
            let words = input.split(" ");
            let collection = await _get_course_collection();
            let course_sub = false;
            let found_items = [];
            for(let i=0;i<words.length;i++){
                let objs = await collection.find({'subject':words[i]}).toArray();
                for(const course of objs){
                    found_items.push(course);
                }
                if(objs.length>0){
                    if((i+1)<words.length){
                        found_items = [];
                        let objs3 = await collection.find({'subject':words[i],'number':words[i+1]}).toArray();
                        for(const course of objs3){
                            found_items.push(course);
                        }
                        break;
                    }
                    else{
                        course_sub = true;
                    }
                }

                let objs3 = await collection.find({'number':words[i]}).toArray();
                for(const course of objs3){
                    found_items.push(course);
                }

                let objs5 = await collection.find({'crn':words[i]}).toArray();
                if(objs5.length>0){
                    found_items = [];
                    found_items.push(objs5[0]);
                    break;
                }
            }
            let newList = [];
            if(!course_sub){
                let sub = [];
                for(const ele of found_items){
                    if(!sub.includes(ele.subject)){
                        newList.push(ele);
                        sub.push(ele.subject)
                    }
                }
            }
            else{
                let numbers = [];
                for(const ele of found_items){
                    if(!numbers.includes(ele.number)){
                        newList.push(ele);
                        numbers.push(ele.number)
                    }
                }
            }

            return newList;   
        } catch(err){
            throw err
        }              
    }

    /**
     * This method will retrieve a Course data with the subject, number and section passed
     * as a parameter
     * @param {String} crn - the crn of the course to be retrieved
     * @returns {Course} - An object Course with all course's data
     */
    static async get(crn){
        try{
            let collection = await _get_course_collection();
            let obj = await collection.find({"crn": crn}).toArray();
            return obj;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will update the course date.
     * @param {String} crn - the crn of the course to be retrieved
     * @param {Course} new_data - An object of class Course
     * @returns {String} A message if the course data was updated or not
     */
    static async update(crn, new_data){
        try{
            let collection = await _get_course_collection();
            let new_vals = {$set: {'subject':new_data.subject,'number':new_data.number,'name':new_data.name,'section':new_data.section,
                                    'crn':new_data.crn,'slot':new_data.slot,'room':new_data.room,'type':new_data.type,'times':new_data.times,
                                    'credits':new_data.credits,'instructors':new_data.instructors}};
            let obj = await collection.updateOne({"crn": crn}, new_vals)
            let updated_data = await Course.get(crn);
            if (obj.modifiedCount > 0){
                console.log('Course object->'+updated_data[0]._id.toString()+' was updated.');
                return 'Course data correctly updated.';
            }else{
                return 'Course data was not updated.'
            }       
        } catch(err){
            throw err
        } 
    }


    /**
     * This method will detele the course data.
     * @param {String} crn - the crn of the course to be retrieved
     * @returns {String} A message if the course data was deleted or not
     */
    static async delete(crn){
        try{
            let collection = await _get_course_collection();
            let updated_data = await Course.get(crn);
            let obj = await collection.deleteOne({"crn": crn})
            if (obj.deletedCount > 0){
                console.log('Course object->'+updated_data[0]._id.toString()+' was deleted.');
                return 'Course data was deleted.'
            }else{
                return 'Course data was not found'
            }
        } catch(err){
            throw err
        } 
    }

        
    /**
     * This method will check if the given course has any time conflict with this course object. 
     * @param {Course} checkCourse - the course to be checked.
     * @returns {boolean} If there is a conflict found or not.
     */
    static async time_conflict(crn1, crn2){
        try{
            var conflit = false; // boolean to store the conflict.
            let course1 = (await Course.get(crn1))[0];
            let course2 = (await Course.get(crn2))[0];

            // going through all the schedule times of course2.
            for(const checkTime of course2.times){ 
                // going through all the schedule times of course1.
                for(const time of course1.times){
                    if(checkTime[0] == time[0]){ // in the same day
                        // time conflicts if the time overlaps with each other.
                        if(time[1]<=checkTime[1] && time[2]>=checkTime[1]){
                            conflit = true;
                        }
                        else if(checkTime[1]<=time[1] && checkTime[2]>=time[1]){
                            conflit = true;
                        }
                    }
                }
            }
            return conflit; // return the conflict
        } catch(err){
            throw err
        } 
    }

    /**
     * static method to create all the objects and store in an array.
     * @param {String} fileName - the file name of the data
     */
    static async load(fileName){
        // reading fromthe given file.
        try{
            var coursesFile = readFileSync(fileName, {encoding:'utf8', flag:'r'});
        }catch{
            return 'file not found.';
        }
        var lines = coursesFile.split('\n'); // spliting the file into lines.
        var prevCourse; // temporary object to store the previously used object.
        // going through all the lines in the file.
        for(let i = 0; i < lines.length; i++){
            // if its a new offering of the course,i.e.., if it has a section number.
            if(!isNaN(parseInt(lines[i].substring(38,41)))){
                // read all the data necessary from the line.
                let sub = lines[i].substring(0,4).trim();
                let num = lines[i].substring(5,9).trim();
                let name = lines[i].substring(10,37).trim();
                let sec = lines[i].substring(38,41).trim();
                let crn = lines[i].substring(42,47).trim();
                let slot = lines[i].substring(48,51).trim();
                let room = lines[i].substring(77,84).trim();
                let type = lines[i].substring(86,89).trim();
                let credit = lines[i].substring(138,140).trim();
                let instructors1 = lines[i].substring(146,170).trim();
                let instructors2 = lines[i].substring(170,176).trim();
                let instructors = [instructors1,instructors2];
                // if the subject name is empty, then it is a new section of the previous course.
                // So, get missing data from the previous new course offering
                if(sub==""){
                    sub = prevCourse.subject;
                    num = prevCourse.number;
                    name = prevCourse.name;
                }
                let times = []; // array to store all the scheduled hours and days.
                let days = lines[i].substring(53,67).trim().split(" "); // getting the days from the line (MTWRFSU).
                for (const day of days) { // adding each day and its time to the array
                        if(day != ''){
                        let newDay = [];
                        newDay.push(day); // day name (MTWRFSU)
                        newDay.push(lines[i].substring(67,71)); // beg
                        newDay.push(lines[i].substring(72,76)); // end
                        times.push(newDay)
                    }
                }
                // creating a new course object with all the data parsed from the file line.
                let courseInfo = new Course(sub,num,name,sec,crn,slot,room,type,times,credit,instructors);
                prevCourse = courseInfo; // making the current object the new previous. 
                this.arrayCourses.push(courseInfo); // pusing the object to the array.
            }
            // if there is no section number, it can be the extended time schedule for some courses.
            else if(lines[i].substring(0,48).trim()=="" && lines[i].substring(84).trim()==""
                        && !isNaN(parseInt(lines[i].substring(79,85).trim()))){
                
                let days = lines[i].substring(53,67).trim().split(" "); // getting the days from the line (MTWRFSU).
                for (const day of days) { // adding each day and its time to the array
                        if(day != ''){
                        let newDay = [];
                        newDay.push(day); // day name (MTWRFSU)
                        newDay.push(lines[i].substring(67,71)); // beg
                        newDay.push(lines[i].substring(72,76)); // end
                        prevCourse.times.push(newDay)
                    }
                }
            }
        }
        return '0';
    }
    /**
     * static method to upload all the course data to the database
     * @param {String} fileName - the file name of the data
     */
    static async uploadAllCourses(fileName,dataName){
        let msg = await Course.load(fileName); // load all the courses from the file.
        if(msg == 'file not found.'){
            return 'Course data upload failed!';
        }
        else{
            try{
                let db = await getDb();
                await db.createCollection(dataName);
            }catch(err){
                console.log("Data already exists. Update");
            }
        
            for (const course of Course.arrayCourses){
                try{
                    let db = await getDb();
                    let collection = await db.collection(dataName);
                    let mongoObj = await collection.insertOne(course);
                }catch(err){
                    throw err
                }
            }

            let db = await getDb();
            let collection = await db.collection(dataName);
            let objs = await collection.find({}).toArray();
            if(objs.length>0){
                return 'Course data added successfully.';
            }
            else{
                return 'Course data upload failed!';
            }
        }
    }

    /**
     * static method to remove all the course data from the database
     * @param {String} dataName - the name of the data coolectio
     */
    static async deleteAllCourses(dataName){
        try{
            let db = await getDb();
            var collection = await db.collection(dataName);
            if((await collection.stats()).size > 0){
                collection.drop();
                console.log(dataName+' collection was deleted.');
                return 'Data deleted successfully.';
            }
            else{
                console.log('Data was not found');
                return 'Data was not found.';
            }
        }catch(err){
            throw err
        }
    }

    /**
     * This method will update the course act.
     * @param {String} crn - the crn of the course to be retrieved
     * @param {Course} new_data - An object of class Course
     * @returns {String} A message if the course data was updated or not
     */
    static async updateAct(crn, newAct){
        try{
            let new_data = (await Course.get(crn))[0];
            let collection = await _get_course_collection();
            let new_vals = {$set: {'subject':new_data.subject,'number':new_data.number,'name':new_data.name,'section':new_data.section,
                                    'crn':new_data.crn,'slot':new_data.slot,'room':new_data.room,'type':new_data.type,'times':new_data.times,
                                    'credits':new_data.credits,'instructors':new_data.instructors,'act':newAct.toString()}};
            let obj = await collection.updateOne({"crn": crn}, new_vals)
            let updated_data = await Course.get(crn);
            if (obj.modifiedCount > 0){
                console.log('Course object->'+updated_data[0]._id.toString()+' was updated.');
                return 'Course data correctly updated.';
            }else{
                return 'Course data was not updated.'
            }       
        } catch(err){
            throw err
        } 
    }
    /**
     * This method will update the course rem.
     * @param {String} crn - the crn of the course to be retrieved
     * @param {Course} new_data - An object of class Course
     * @returns {String} A message if the course data was updated or not
     */
    static async updateRem(crn, newRem){
        try{
            let new_data = (await Course.get(crn))[0];
            let collection = await _get_course_collection();
            let new_vals = {$set: {'subject':new_data.subject,'number':new_data.number,'name':new_data.name,'section':new_data.section,
                                    'crn':new_data.crn,'slot':new_data.slot,'room':new_data.room,'type':new_data.type,'times':new_data.times,
                                    'credits':new_data.credits,'instructors':new_data.instructors,'rem':newRem.toString()}};
            let obj = await collection.updateOne({"crn": crn}, new_vals)
            let updated_data = await Course.get(crn);
            if (obj.modifiedCount > 0){
                console.log('Course object->'+updated_data[0]._id.toString()+' was updated.');
                return 'Course data correctly updated.';
            }else{
                return 'Course data was not updated.'
            }       
        } catch(err){
            throw err
        } 
    }

  }
