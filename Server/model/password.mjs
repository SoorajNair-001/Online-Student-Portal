import { getDb } from '../utils/db.mjs';

async function _get_passwords_collection(){
    let db = await getDb();
    return await db.collection('account_passwords');
};

export class Password{ // student class
    // constructor
    constructor(passID,password,username){
        this.passID = passID;
        this.password = password;
        this.username = username;
    }

    /**
     * This method saves the current object Password in the Database
     * @returns {String} - A message if a Password was created or not
     */
    async save(){
        try{
            let collection = await _get_passwords_collection();
            if((await Password.get(this.username)).length == 0){
                let mongoObj = await collection.insertOne(this);
                this._id = mongoObj.insertedId;
                console.log('Password was inserted in the database with id -> '+this._id);
                return 'Password created';   
            }else{
                console.log('Create password failed! duplicate');
                return 'Error. Create password failed!';
            }         
        } catch(err){
            throw err
        }        
    }

    /**
     * This static method for the class Password will retrieve
     * all the passwords inside the database
     * @returns {Array[Password]} - An array with all the password retrieved
     */
    static async getAll(){
        try{
            let collection = await _get_passwords_collection();
            let objs = await collection.find({}).toArray();
            return objs;
        } catch(err){
            throw err
        }            
    }


    /**
     * This method will retrieve a password for the username
     * @param {String} username - the username of the password
     * @returns {Password} - An object Password with all its data
     */
    static async get(username){
        try{
            let collection = await _get_passwords_collection();
            let obj = await collection.find({"username": username}).toArray();
            return obj;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will update the password.
     * @param {String} username - the username of the password
     * @param {Password} new_data - An object of password
     * @returns {String} A message if the password was updated or not
     */
    static async update(username, new_data){
        try{
            let collection = await _get_passwords_collection();
            let original_obj = (await Password.get(username))[0];
            let new_vals = {$set: {'passID':original_obj.passID,'username':original_obj.username,'password':new_data.password}};
            let obj = await collection.updateOne({"username": username}, new_vals)
            let updated_data = await Password.get(username);
            if (obj.modifiedCount > 0){
                console.log('Password object->'+ updated_data[0]._id.toString() +' was updated.');
                return 'Password correctly updated.';
            }else{
                return 'Password data was not updated.'
            } 
        } catch(err){
            throw err
        }        
    }

    /**
     * This method will detele the password.
     * @param {String} username - the username of the password
     * @returns {String} A message if the password was deleted or not
     */
    static async delete(username){
        try{
            let collection = await _get_passwords_collection();
            let updated_data = await Password.get(username);
            let obj = await collection.deleteOne({"username": username})
            if (obj.deletedCount > 0){
                console.log('Password object->'+updated_data[0]._id.toString()+' was deleted.');
                return 'Password was deleted.'
            }else{
                return 'Password was not found';
            }
        } catch(err){
            throw err
        } 
    }

    /**
     * This method create unique random passId
     * @returns {String} A unique passId
     */
    static async createPassId(){
        let collection = await _get_passwords_collection();
        let found = false;
        let min = 10000;
        let max = 99999;
        let randPassID = Math.floor(Math.random() * (max - min + 1)) + min;
        while(!found){
            if((await collection.find({'passID': randPassID.toString()}).toArray()).length > 0){
                randPassID = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            else{
                found = true;
            }
        }
        return randPassID.toString();
    }    

    /**
     * This method validates the username and password
     * @returns {Boolean} A boolean if the account and password match
     */
    static async validatePassword(username,password){
        let obj = (await Password.get(username));
        if(obj.length>0){
            if(obj[0].password == password){
                return true;
            }
        }
        else{
            console.log("Username not found");
        }
        return false;
    }    

    
}