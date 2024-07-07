# Server Feature Descriptions

### Login/Logout Account (Server)
* Login a client with the username and password provided. Then logout with client request.
* Login will require a Username and password from a pre-existing account. When a login request is received, the username and password is validated from the database(account_passwords collection). Then a unique Access Key is provided to the client. When a logout request is received the Access Key is removed from the database.
* This feature depends on Mongo database(access_keys collection),access_control module and password_control module.
* This feature is compete. It correctly logins in and out a client and provide access to the account.
* Mocha Fail and Success Tests for this feature is provided in the '2-accounts_test' module. It logs in a Client and receives a accesskey. Then logs out the client successfully. The tests are working properly with all the tests passing.


### Create/Delete Account (Server)
* Create a Student account providing all the student details. Create a Username and password to access the account. This can also delete a Student account provided the username and password for security.
* This feature uses two mongo databases, one to store the account details(like name,student id,etc.) and another one to store the login details(username and password). This is done to keep the password safe,so password details will not be accessible at the client side.
* This depends on the Mongo database(student_accounts and account_passwords collections), password_control module and student_accounts module.
* This feature is complete. Create account will write all the data to the database and Delete account will remove all the account data from  the database.
* Mocha Fail and Success Tests for this feature is provided in the '2-accounts_test' module, where it creates and deletes a test account. The tests are working properly with all the tests passing. 

### Access Key (Server)
* A secure unique random access key, which is generated everytime a client logs into a account.
* The client can use this key to access the account data and other features. When logged out, the key is removed from the database and it is no longer possible to access the account with any old access keys. A new login and new access key is required. 
* This feature depends on Mongo database(access_keys collection) and access_control module.
* This feature is compete. A random key is generated everytime and add to the database. Key is removed when logout occurs.
* Mocha Fail and Success Tests for this feature is provided in the '1-access_test' module. Its logins in a test user and gets a access key. Then uses the key to access course details. The tests are working properly with all the tests passing.

### Load All Courses (Server)
* Reads from the file and stores course data into the database. (Admin only)
* A detailed course offerings .txt file is provided and the feature will read the data ans will write the data to the database. The filename and collection name is provided by the Admin client.
* This feature depends on Mongo database and uses access key to verify(Admin client can only access this feature).
* This feature is compete. Courses are read from the file and loaded into the database correctly.
* Mocha Fail and Success Tests for this feature is provided in the '3-fileupload_test' module. It uses the admin key and a test_courses.txt file to create a collection and then delete it successfully. The tests are working properly with all the tests passing.

### Conflict Check (Server)
* Check for time conflicts between two courses.
* This feature will tell if there is a time conflict between two provided course CRNS. This can be used to check conflics when adding a course to a student schedule.
* This feature depends on  access keys and mongo database course collection.
* This is complete. This returns a boolean which tells if there a conflict exits between two courses.
* Mocha Fail and Success Tests for this feature is provided in the '4-courses_test' module. The test logins in a test user and provides two test CRNs to check conflicts. One test will check two courses with no conflicts and one will check conflict between courses with actually has a conflit. The tests are working properly with all the tests passing.

### Course Search (Server)
* Search for with the given CRN
* This feature will search for a course in the database for a with the CRN of the course. It will then send the course data to the client.
* This feature depends in the mongo database course collection and uses the access key.
* This is complete. It returns the correct course for the provided CRN.
* Mocha Fail and Success Tests for this feature is provided in the '4-courses_test' module. This test will use a test CRN to retrieve a course data and will check again the known course name. The tests are working properly with all the tests passing.

### Subject Search (Server)
* Search for a given subject and gets all the courses in that subject.
* Given the subject, the feature will search the course database and provides a the client with a list of courses in that subject.
* This feature depends in the mongo database course collection and uses the access key.
* This is complete. It returns the correct number of courses in that subject.
* Mocha Fail and Success Tests for this feature is provided in the '4-courses_test' module. This tests if the server will give the correct number of courses in that subject. The tests are working properly with all the tests passing.

### Current Credit Hours (Server)
* The number of credit hours the student is currently registered for.
* This feature will go throught the client student's schedule and calculates the total number of credits the student is currenty registered into.
* This feature depends in the mongo database student collection and uses the access key.
* This is complete. The feature will correcly calculate the total credits of the student.
* Mocha Fail and Success Tests for this feature is provided in the '5-student_test' module. It tests if the feature will give the current number of credit hours for a test student account. The tests are working properly with all the tests passing.

### Add/Drop Courses (Server)
* The student client can add or drop a course from their schedule.
* The student has to first log in to their account to receive a access key. The student can then use this key to add or drop courses from the courses offered for the term with the CRN number provided.
* This feature depends on the mongo database and use access keys. It uses the student_accounts module.
* This feature is compete. While logged in, the student client can add and remove courses from their schedule and its updated in the database successfully.
* Mocha Fail and Success Tests for this feature is provided in the '5-student_test' module. The test will login a pre existing student account and try adding and dropping courses in their schedule. And logs out after. The tests are working properly with all the tests passing.

### Search (Server)
* The client can enter key words and find courses matching those details.
* The client has to use the access key and send a text input with key words like, Subject, Number or CRN. The server then searches for the course database for matching details and send the results back to the client.
* This feature depends on the mongo database and use access keys. It uses the course module.
* This is complete. The feature will find matching subject or number or CRNs and send it to the client.
* Mocha Fail and Success Tests for this feature is provided in the '4-courses_test' module. It tests if the feature will find all the courses which matches the input. The tests are working properly with all the tests passing.
