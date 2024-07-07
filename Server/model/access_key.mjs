import { getDb } from '../utils/db.mjs';

async function _get_keys_collection(){
    let db = await getDb();
    return await db.collection('access_keys');
};

export class AccessKey{ // student class
    // constructor
    constructor(key,username){
        this.key = key;
        this.username = username;
    }

    /**
     * This method saves the current object Accesskey in the Database
     * @returns {String} - A message if a AccessKey was created or not
     */
    async save(){
        try{
            let collection = await _get_keys_collection();
            if((await AccessKey.get_key(this.username)).length == 0){
                let mongoObj = await collection.insertOne(this);
                this._id = mongoObj.insertedId;
                console.log('AccessKey was inserted in the database with id -> '+this._id);
                return this.key;            
            }else{
                this.key = await AccessKey.createAccessKey()
                let newData = {
                    key: this.key,
                    username: this.username
                };
                await AccessKey.update(this.username,newData);
                console.log('New AccessKey created');
                return this.key;
            }
        } catch(err){
            throw err
        }        
    }

    /**
     * This static method for the class AccessKey will retrieve
     * all the data inside the database
     * @returns {Array[AccessKey]} - An array with all the AccessKeys retrieved
     */
    static async getAll(){
        try{
            let collection = await _get_keys_collection();
            let objs = await collection.find({}).toArray();
            return objs;
        } catch(err){
            throw err
        }            
    }


    /**
     * This method will retrieve an access key object for the username
     * @param {String} username - the username of the access key
     * @returns {AccessKey} - An object AccessKey with all its data
     */
    static async get_key(username){
        try{
            let collection = await _get_keys_collection();
            let obj = await collection.find({"username": username}).toArray();
            return obj;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will retrieve the access data
     * @param {String} key - the access key
     * @returns {AccessKey} - An object AccessKey with all its data
     */
    static async get_user(key){
        try{
            let collection = await _get_keys_collection();
            let obj = await collection.find({"key": key}).toArray();
            return obj;
        } catch(err){
            throw err
        } 
    }

    /**
     * This method will update the AccessKey.
     * @param {String} username - the username of the Access key
     * @param {AccessKey} new_data - An object of AccessKey
     * @returns {String} A message if the Access key was updated or not
     */
    static async update(username, new_data){
        try{
            let collection = await _get_keys_collection();
            let original_obj = (await AccessKey.get_key(username))[0];
            let new_vals = {$set: {'key':new_data.key,'username':original_obj.username}};
            let obj = await collection.updateOne({"username": username}, new_vals)
            let updated_data = await AccessKey.get_key(username);
            if (obj.modifiedCount > 0){
                console.log('AccessKey object->'+ updated_data[0]._id.toString() +' was updated.');
                return 'AccessKey correctly updated.';
            }else{
                return 'AccessKey data was not updated.'
            } 
        } catch(err){
            throw err
        }        
    }

    /**
     * This method will detele the access key.
     * @param {String} username - the username of the accesskey
     * @returns {String} A message if the access key was deleted or not
     */
    static async delete(username){
        try{
            let collection = await _get_keys_collection();
            let updated_data = await AccessKey.get_key(username);
            let obj = await collection.deleteOne({"username": username})
            if (obj.deletedCount > 0){
                console.log('AccessKey object->'+updated_data[0]._id.toString()+' was deleted.');
                return 'AccessKey was deleted.'
            }else{
                return 'AccessKey was not found';
            }
        } catch(err){
            throw err
        } 
    }

    /**
     * This method create unique random passId
     * @returns {String} A unique passId
     */
    static async createAccessKey(){
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        let collection = await _get_keys_collection();
        let found = false;
        let randKey = '';
        let length = 15;
        for ( let i = 0; i < length; i++ ) {
            randKey += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        while(!found){
            if((await collection.find({'key': randKey}).toArray()).length > 0){
                randKey = '';
                for ( let i = 0; i < length; i++ ) {
                    randKey += characters.charAt(Math.floor(Math.random() * characters.length));
                }
            }
            else{
                found = true;
            }
        }
        return randKey;
        
    }    
    
}