# Instructions
### Import mongo database
* run a local Mongo server on localhost/127.0.0.1 at port 27017
* navigate to this directory (Server)
* import mongo database: mongorestore mongodump_files

### Start the server
* run server command: node server.mjs

### Stop the server
* While server running press: control + c

### To run tests:
* run a local Mongo server on localhost/127.0.0.1 at port 27017
* navigate to this directory (Server)
* import mongo database: mongorestore mongodump_files
* run server command: node server.mjs
* run test command: npm test

# Basic Architecture
The server.mjs module is the main module to run the server. There are controller modules which connects directly with the model modules to perform actions and write/read from the database.

### Controller modules
* The access_control.mjs module provides CRUD operations for the access keys. It also has functions to validate a access key.
* The course_offering.mjs module has tools to access the courses and perform CRUD operations. It also function for coflict check and upload file to database.
* The login.mjs module does the login,logout, new account and delete account operations.
* The password_control.mjs has the CRUD operations for managing the passwords. It also validates passwords.
* The student_accounts.mjs module will do CRUD operations for the student accounts. It also does credit hours check and Add/Drop courses from schedule.

### Model modules
* The access_key.mjs holds the class for Access key operations.
* The course.mjs holds the class for courses.
* The password.mjs holds the password class.
* The student.mjs holds the student class.

### Resources file
* Holds the txt files for the course offerings.

### Test modules
* Holds Mocha test modules for feature testing.

### Utils file
* Holds the db.mjs module which provides access to the mongodb database.

# Attributions
No attributions.

