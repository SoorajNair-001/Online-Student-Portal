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

describe('Course data - Tests with Mocha', function(){
    describe('Test CRUD operations', function(){
        describe('CourseData', async function(){   
            // Create Tests         
            it('Fail test - Create a new record.', async function(){
                var data1 = {
                    subject: 'subject',
                    number: '001',
                    name: 'name',
                    //section: '001',
                    crn: '00000',
                    slot: '001',
                    room: 'A room',
                    type: 'LEC',
                    times: [],
                    credits: '3',
                    instructors: []
                };
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.post('/'+key+'/courses/winter/2022-2023/', data1)
                strictEqual(res.data, 'Error. Course Data insert failed!');                
            }); 
            
            it('Success test - Create a new record.', async function(){
                var data1 = {
                    subject: 'subject',
                    number: '001',
                    name: 'name',
                    section: '001',
                    crn: '00000',
                    slot: '001',
                    room: 'A room',
                    type: 'LEC',
                    times: [],
                    credits: '3',
                    instructors: []
                };
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.post('/'+key+'/courses/winter/2022-2023/', data1)
                strictEqual(res.data, 'Course data correctly inserted in the Database.');                
            }); 

            // Read Tests 
            it('Fail test - Read a record/Course search', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/00001')
                strictEqual(res.data, 'No course was found');                
            });       
            it('Success test - Read a record/Course search', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/00000')
                strictEqual(res.data.name, 'name');                
            }); 
            

            // Update Tests
            it('Fail test - Update a record.', async function(){
                var data1 = {
                    subject: 'subject',
                    number: '001',
                    //name: 'name',
                    section: '001',
                    crn: '00000',
                    slot: '001',
                    room: 'A room',
                    type: 'LEC',
                    times: [],
                    credits: '3',
                    instructors: []
                };
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.put('/'+key+'/courses/winter/2022-2023/00000', data1);
                strictEqual(res.data, 'Update failed! The data is not valid.');                
            });  
            it('Success test - Update a record.', async function(){
                var data1 = {
                    subject: 'subject',
                    number: '001',
                    name: 'new_name',
                    section: '001',
                    crn: '00000',
                    slot: '001',
                    room: 'A room',
                    type: 'LEC',
                    times: [],
                    credits: '3',
                    instructors: []
                };
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.put('/'+key+'/courses/winter/2022-2023/00000', data1);
                strictEqual(res.data, 'Course data correctly updated.');                
            }); 

            // Delete Tests
            it('Fail test - Delete a record.', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.delete('/'+key+'/courses/winter/2022-2023/00001');
                strictEqual(res.data, 'Course data was not found');                
            }); 
            it('Success test - Delete a record.', async function(){
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.delete('/'+key+'/courses/winter/2022-2023/00000');
                strictEqual(res.data, 'Course data was deleted.');                
            }); 

            
            // test time conflict
            it('Fail test - time conflict', async function(){
                let test_course1 = '81797';
                let test_course2 = '91100';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/conflict/'+test_course1+'/'+test_course2);
                strictEqual(res.data,false);                
            });
            // test time conflict
            it('Success test - time conflict', async function(){
                let test_course1 = '96646';
                let test_course2 = '86838';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/conflict/'+test_course1+'/'+test_course2);
                strictEqual(res.data,true);                
            });

            // subject search
            it('Fail test - subject search', async function(){
                let subject = '';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/subject/'+subject);
                strictEqual(res.data,'No course was found');                
            });
            it('Fail test - subject search without labs', async function(){
                let subject = 'Computer Science';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/subject/'+subject);
                strictEqual(true,res.data.length!=36);                
            });
            it('Success test - subject search without labs', async function(){
                let subject = 'Computer Science';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/subject/'+subject);
                strictEqual(res.data.length,22);              
            });

            // search
            it('Fail test - search', async function(){
                let input = '';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/search/'+input);
                strictEqual(res.data,'No course was found');               
            });
            it('Success test - search subject', async function(){
                let input = 'COMP';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/search/'+input);
                strictEqual(res.data.length,22);               
            });
            it('Success test - search course number', async function(){
                let input = '1001';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/search/'+input);
                strictEqual(res.data.length,8);               
            });
            it('Success test - search course CRN', async function(){
                let input = '81797';
                let key = 'X3hmwtVdvf8GEqa'; // admin key
                let res = await instance.get('/'+key+'/courses/winter/2022-2023/search/'+input);
                strictEqual(res.data[0].subject,'ANTH');               
            });

            
        });        
    });
    
});
