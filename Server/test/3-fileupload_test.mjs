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

describe('Upload Course file test - Tests with Mocha', function(){
    describe('Txt file to database', function(){
        describe('Course file', async function(){  
            // Load courses Tests     
            it('Fail test - wrong filename', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let dataname = 'test_courses';
                let filename = 'test_courses';
                let res = await instance.post('/'+key+'/courses/collection/upload/'+dataname+'/'+filename);
                strictEqual(res.data, 'Course data upload failed!');                     
            });    
            it('Success test - Correct filename', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let dataname = 'test_courses';
                let filename = 'test_courses.txt';
                let res = await instance.post('/'+key+'/courses/collection/upload/'+dataname+'/'+filename);
                strictEqual(res.data, 'Course data added successfully.');                     
            });  
            
            // Delete course collection
            it('Fail test - remove collection', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let dataname = 'test_cour';
                let res = await instance.delete('/'+key+'/courses/collection/'+dataname);
                strictEqual(res.data, 'Data was not found.');                     
            }); 
            
            it('Success test - remove collection', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let dataname = 'test_courses';
                let res = await instance.delete('/'+key+'/courses/collection/'+dataname);
                strictEqual(res.data, 'Data deleted successfully.');                     
            }); 
            

        });        
    });
    
});
