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

describe('Access key test - Tests with Mocha', function(){
    describe('Test access key permissions', function(){
        describe('AccessKey', async function(){  
            // Access key Tests     
            it('Fail test - Wrong access key', async function(){
                let accesskey = 'AAAA';
                let res = await instance.get('/'+accesskey+'/courses/winter/2022-2023/all');
                strictEqual(res.data, 'Permission denied.');                     
            });    

            it('Success test - Correct access key', async function(){
                let accesskey = 'X3hmwtVdvf8GEqa';
                let res = await instance.get('/'+accesskey+'/courses/winter/2022-2023/all');
                strictEqual(res.data.length, 1200);                      
            }); 
        });        
    });
    
});
