import { strictEqual, fail } from 'assert';
import axios from 'axios';
const create = axios.create;

var myurl = 'http://localhost:3000';           
// configure the base url
const instance = create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    headers: {'content-type': 'application/json'}
});

describe('Student test - Tests with Mocha', function(){
    describe('Test Add and drop course', function(){
        describe('Student', async function(){  
            var accessKey = '';
            // Add course test
            it('Fail test - Add course', async function(){
                let student = {
                    username:'test_1',
                    password:'123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;

                let crn = '81797';
                let res2 = await instance.post('/'+accessKey+'/student/add/'+crn)

                strictEqual(res2.data,'Permission denied.');             
            });
            it('Fail test - Add course', async function(){
                let student = {
                    username:'test_1',
                    password:'test123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;

                let crn = '81797';
                let res2 = await instance.post('/'+accessKey+'/student/add/'+crn)
                strictEqual(res2.data,'Course full');             
            });
            it('Success test - Add course', async function(){
                let student = {
                    username:'test_1',
                    password:'test123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;
                console.log('Logged in with Access Key: ',res.data); 

                let crn = '92013';
                let res2 = await instance.post('/'+accessKey+'/student/add/'+crn)
                strictEqual(res2.data,'Course added successfully');             
            });

            // Credit hours test
            it('Fail test - Credit hours', async function(){
                let student = {
                    username:'test_1',
                    password:'123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;
                let res2 = await instance.get('/'+accessKey+'/student/credits')

                strictEqual(res2.data,'Permission denied.');             
            });
            
            it('Success test - Credit hours', async function(){
                let student = {
                    username:'test_1',
                    password:'test123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;
                console.log('Logged in with Access Key: ',res.data); 
                let res2 = await instance.get('/'+accessKey+'/student/credits')
                strictEqual(res2.data,6);             
            });

            // Drop course test
            it('Fail test - Drop course', async function(){
                let student = {
                    username:'test_1',
                    password:'123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;

                let crn = '92013';
                let res2 = await instance.post('/'+accessKey+'/student/drop/'+crn)
                strictEqual(res2.data,'Permission denied.');             
            });
            it('Success test - Drop course', async function(){
                let student = {
                    username:'test_1',
                    password:'test123'
                };
                let res = await instance.post('/account/login', student)
                accessKey = res.data;
                console.log('Logged in with Access Key: ',res.data); 

                let crn = '92013';
                let res2 = await instance.post('/'+accessKey+'/student/drop/'+crn)
                strictEqual(res2.data,'Course removed successfully');    
                let res3 = await instance.post('/'+accessKey+'/account/logout')         
            });
        });        
    });
    
});
