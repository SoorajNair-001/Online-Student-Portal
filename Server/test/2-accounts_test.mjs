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

describe('Login test - Tests with Mocha', function(){
    describe('Test login and logout', function(){
        describe('Account', async function(){  
            var accessKey = '';
            // New account Tests     
            it('Fail test - New account', async function(){
                let student = {
                    name:'Akhil',
                    stdId:'201963808',
                    level:'Undergraduate',
                    major:'Computer Science',
                    username:'ashajinair',
                    //password:'123123'
                };
                let res = await instance.post('/account/create', student)
                strictEqual(res.data, 'Account creation failed! Retry.');                
            });    
    
            it('Success test - New account', async function(){
                let student = {
                    name:'Akhil',
                    stdId:'201963808',
                    level:'Undergraduate',
                    major:'Computer Science',
                    username:'ashajinair',
                    password:'123123'
                };
                let res = await instance.post('/account/create', student)
                strictEqual(res.data, 'Account creation successfully.');               
            });
            
            // Login test
            it('Fail test - Login', async function(){
                let student = {
                    username:'ashajinair',
                    //password:'123123'
                };
                let res = await instance.post('/account/login', student)
                strictEqual(res.data, 'Invalid Username or password');                
            });  
            
            it('Fail test - Login', async function(){
                let student = {
                    username:'ashajinair',
                    password:'123'
                };
                let res = await instance.post('/account/login', student)
                strictEqual(res.data, 'Invalid Username or password');                
            }); 

            it('Success test - Login', async function(){
                let student = {
                    username:'ashajinair',
                    password:'123123'
                };
                let res = await instance.post('/account/login', student)
                console.log('Returned Access Key: ',res.data); 
                accessKey = res.data;
                strictEqual(false, res.data=='Invalid Username or password');              
            });

            // logout test
            it('Fail test - Logout', async function(){
                let fakeaccesskey = 'AAAA';
                let res = await instance.post('/'+fakeaccesskey+'/account/logout')
                strictEqual(res.data, 'Already logged out.');                
            }); 

            it('Success test - Logout', async function(){
                let res = await instance.post('/'+accessKey+'/account/logout')
                strictEqual(res.data, 'Account logged out successfully.');                
            });

            // Delete account
            it('Fail test - Delete account', async function(){
                let student = {
                    username:'ashajinair',
                    password:'123'
                };
                let res = await instance.post('/account/delete', student)
                strictEqual(res.data, 'Invalid Username or password');              
            });
            it('Success test - Delete account', async function(){
                let student = {
                    username:'ashajinair',
                    password:'123123'
                };
                let res = await instance.post('/account/delete', student)
                strictEqual(res.data, 'Account deleted successfully.');              
            });
              
        });        
    });
    
});
