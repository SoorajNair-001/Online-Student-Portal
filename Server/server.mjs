import express, { json, urlencoded } from 'express';
const app = express();
const port = 3000;

// CORS 
app.use(json());// support json encoded bodies
app.use(urlencoded({extended: true}));//incoming objects are strings or arrays
// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

import { login, logout,new_account, delete_account} from './controller/login.mjs';
import {list_all,get_CourseData,get_Subjects,add,list_subject_courses,list_sections_courses,search_courses,update_CourseData,delete_CourseData,
        conflict,uploadCoursesToDB,removeCoursesfromDB} from './controller/course_offerings.mjs';

import { addCourse,addOverrideCourse,removeCourse,removeMultCourse,getCredits,get_StudentData,
        getSchedule,pinCourse,unpinCourse,getPinnedCourse,checkConflict} from './controller/student_accounts.mjs';
import { connectToDB, closeDBConnection } from './utils/db.mjs';

var server;

async function createServer(){
  try {
    // mongo to connect
    await connectToDB();

    // resource paths for login
    app.post('/account/login', login);
    app.post('/account/create', new_account);
    app.post('/account/delete', delete_account);
    app.post('/:key/account/logout', logout);
    app.get('/:key/account/get', get_StudentData);

    // resource paths for courses collection
    app.post('/:key/courses/collection/upload/:dataname/:filename', uploadCoursesToDB); // admin only
    app.delete('/:key/courses/collection/:dataname', removeCoursesfromDB); // admin only


    // resource paths for courses
    app.get('/:key/courses/winter/2022-2023/all',list_all); // anyone
    app.get('/:key/courses/winter/2022-2023/:crn', get_CourseData); // anyone
    app.get('/:key/courses/winter/2022-2023/subjects/all', get_Subjects); // anyone
    app.get('/:key/courses/winter/2022-2023/subject/:subject', list_subject_courses); // anyone
    app.get('/:key/courses/winter/2022-2023/subject/sections/:subject/:number', list_sections_courses); // anyone
    app.get('/:key/courses/winter/2022-2023/search/:input', search_courses); // anyone


    app.post('/:key/courses/winter/2022-2023/', add); // admin only
    app.put('/:key/courses/winter/2022-2023/:crn', update_CourseData); // admin only
    app.delete('/:key/courses/winter/2022-2023/:crn', delete_CourseData); // admin only
    app.get('/:key/courses/winter/2022-2023/conflict/:crn1/:crn2', conflict); // anyone


    // resource paths for student access
    app.post('/:key/student/add/:crn', addCourse); // student access
    app.post('/:key/student/add/override/:crn', addOverrideCourse); // student access
    app.post('/:key/student/drop/:crn', removeCourse); // student access
    app.post('/:key/student/drop/multiple/crns', removeMultCourse); // student access
    app.get('/:key/student/credits', getCredits); // student access
    app.get('/:key/student/schedule', getSchedule); // student access
    app.post('/:key/student/pin/:crn', pinCourse); // student access
    app.post('/:key/student/unpin/:crn', unpinCourse); // student access
    app.get('/:key/student/get/pinned/', getPinnedCourse); // student access
    app.get('/:key/student/schedule/conflict/:crn', checkConflict); // student access

    // start the server
    server = app.listen(port, () => {
      console.log('Listening at http://localhost:%d', port);
    });
  }catch(err){
    console.err(err)
  }
}
createServer();

// Callback function to capture
// when for when we kill the server. 
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  server.close(async function(){
    let msg = await closeDBConnection()   ;
    console.log(msg);
  });
});
