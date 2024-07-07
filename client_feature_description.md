# Client Feature Descriptions

### Lookup all courses (Client)
* Requests course data from the server and display them in a list.
* The user needs to select the subject from the dropdown. Then the subject course list is presented. The user then can choose a course to display all the sections offered for the course. 
* This feature depends on the server(jQuery request) to send the subject names for the dropdown, courses in subjects and sections offered in courses.
* This feature is compete. It successfully connects to the server and receives the course and subject details as requested by the user and displays it. It is implemeted in courses.html and is displayed inside home.html.
* Test N/A
* The user should see a dropdown menu of subjects. When selecting a subject, all the courses in that subject is displayed. The user can choose to see sections in those courses with the section button. All the UI elements are working. See "Lookup courses demo.mp4" for UI demo.

### Live Schedule (Client)
* Student's schedule is displayed in a timetable form and is updated live.
* Schedule is requested to the server and uses the data to fill out the timetable. 
* This feature depends on the server(jQuery request) to send the schedule of the student. 
* This feature is compete. It successfully connects to the server and receives the schedule and displays the schedule table. It is implemeted in schedule.html and is displayed inside home.html.
* Test N/A
* In the homepage, the schedule is displayed in the bottom right corner. All the UI elements are working. See "Live schedule demo.mp4" for UI demo.

### Population Graph (Client)
* Display a donut chart of the class population/class size.
* In the course details menu, the chart displays the class size with the current course act and cap.
* This feature depends on the server(jQuery request) to send the course detials. It also uses "jsdelivr.net-chart.js" module for the chart.
* This feature is compete. It successfully connects to the server and receives the course details and uses it to draw the donut chart. It is implemeted in courses.html(with the course details menu) and is displayed inside home.html.
* Test N/A
* When the user selects to see the details for a course, a menu appears with all the detials. The population graph is located inside this menu. All the UI elements are working. See "Population graph demo.mp4" for UI demo.

### Course status label (Client)
* Display a status label with the course sections. green-available,yellow-almost full(less than 10% remaining),red-closed. 
* It will request course data from the server(jQuery request) and uses the act and cap to determine the status of the course and displays label along with the course.
* This feature depends on the server(jQuery request) to send the course detials.
* This feature is compete. It successfully connects to the server and receives the course details and uses it to calculate and display the status label. It is implemeted in courses.html(with the course sections) and is displayed inside home.html.
* Test N/A
* The user can see labels with colors, red,yellow and green in the course search. All the UI elements are working. See "Status label demo.mp4" for UI demo.

### Conflict override (Client)
* Displays a warning when trying to add a course which had time conflict with the current schedule. The user has option to remove/cancel the action or can override the action. 
* When a user adds a course using the course search (in courses.html)or using the add course with CRN (in actions.html), the client will check if there is any time conflict. It will then provide two buttons, remove or override. The remove button clears the warning and the override button will send the server a course add request.
* This feature depends on the server(jQuery request) to send the course detials and the schedule. It also uses the server to add course to the schedule with override.
* This feature is compete. It successfully connects to the server and receives the course details. It checks for conflict and provide options to the user to overrife. It is implemeted in actions.html and is displayed inside home.html.
* Test N/A
* When the user tries a add a course with time conflict, a warning appears nn the actions required panel. All the UI elements are working. See "Conflict override demo.mp4" for UI demo.

### Course info (Client)
* Display a menu to display all the details of the selected course.
* When the user searchs throught the course offereings and selects the details button for a course, th course info menu is displayed. It shows all the details in that course including the act, cap and remaining space. It also holds the population graph feature.
* This feature depends on the server(jQuery request) to send the course detials. It also uses the Population graph feature.
* This feature is compete. It successfully connects to the server and receives the course details. It displays the complete course info with the correct population graph. It is implemeted in courses.html and is displayed inside home.html.
* Test N/A
* When the user clicks the details button, a menu appears with all the course info. All the UI elements are working. See "Course info demo.mp4" for UI demo.

### Print Schedule (Client)
* Print the current schedule of the student or download a pdf version.
* The student can click the print schedule button and the feature will print a full page of the schedule in table form.
* This feature depends on the schedule.html file to output a printable version of the schedule.
* This feature is compete. It will print the full schedule. It is implemeted in home.html.
* Test N/A
* In the homepage, there is a print schedule button. When clicked it will the print menu to the user. All the UI elements are working. See "Print schedule demo.mp4" for UI demo.

### Pin Courses (Client)
* The student can pin courses to the homepage which can help to know the status of a course without needing to search for it al the time.
* In the course info menu, there is a pin course button which will add the course to the pinned list. The pinned list is shown in the homepage with a button to remove it.
* This feature depends on the courses.html file to search for course and press the pin course button.
* This feature is compete. It will pin and unpin the courses to the homepage. It is implemeted in home.html.
* Test N/A
* In the homepage below the course search, the pinned courses can be found. The pinned courses are displayed here. All the UI elements are working. See "Pin courses demo.mp4" for UI demo.

### Simultaneous confilt check (Client)
* Time conflict is checked along with displaying course sections when searching for a course.
* When the user goes throught the course search, a warning label is displayed along with course sections which lets the user know of the course will make a time conflict when added.
* This feature depends on the server to check for time conlficts. 
* This feature is compete. It will display a waring label along with courses. It is implemeted in courses.html and is displayed in home.html
* Test N/A
* Along with course sections, a orange warning label is displayed for courses which makes time conflict with current schedule. All the UI elements are working. See "Simultaneous confilt check demo.mp4" for UI demo.
