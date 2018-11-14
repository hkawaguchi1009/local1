/* This file illustrates the creation and use of Javascript objects. 
   Details:
    - An JSON array of students objects may be retrieved from:
            http://mcs.drury.edu/ssigman/DUCS_EMS/getAllStudents
    - Each student retrieved has the following attributes (fields):
       * studentID - student's id number (integer)
       * firstName - student's first name (string)
       * lastName  - student's last name (string)
       * email     - student's email address (string)
 */

/****************************************
 *         Class declarations           *
 ****************************************/

// Javascript student class declaration
function Student() {
    var id;
    var lastName;
    var firstName;
    var email;
};

Student.prototype.setId = function(id) {
    this.id = id;
}

Student.prototype.getId = function() {
    return this.id;
}

Student.prototype.setLastName = function(lName) {
    this.lastName = lName;
}

Student.prototype.getLastName = function() {
    return this.lastName;
}

Student.prototype.setFirstName = function(fName) {
    this.firstName = fName;
}

Student.prototype.getFirstName = function() {
    return this.firstName;
}

Student.prototype.setEmail = function(email) {
    this.email = email;
}

Student.prototype.getEmail = function() {
    return this.email;
}

Student.prototype.getFullName = function() {
    return this.lastName + ", " + this.firstName;
}

/* To Do: Create a windows.onload function that 
             - reads the JSON array of students from the server.
             - creates second array of Student objects where
               each student in the JSON array is a converted to 
               a student in the new array.  Call the new array roster.
             - add a roster table (as an html table) from the Javascript
               code.  The table should have columns for Id, Name, & Email.
               The columns should have heading names Id, Name, & Email.  Use
               the full name for the name column.
             - each row in the table should be generated from one of the objects
               in the roster array.
 */
// declaration of the app class
function App () {
    // base URL for the REST API calls
    
    var numStudents;   // number of student in the roster
    var roster;        // roster of students
}

// Parses the array of students returned by the AJAX call.
// The roster property of the App is created.
//
// stuList - an array of simple objects from the JSON 
//           response
// return - nothing
App.prototype.parseRoster = function(stuList) {
    this.roster = [];  // make an empty roster
    this.numStudents = 0;
    
    // add each student in stuList as a Student object
    // in roster
    for(var i=0; i<stuList.length; i++) {
        // create a student object
        var stu = new Student();
        stu.setId(stuList[i].studentID);
        stu.setFirstName(stuList[i].firstName);
        stu.setLastName(stuList[i].lastName);
        stu.setEmail(stuList[i].email);
        
        // add student to roster
        this.roster.push(stu);
        
        // increase the number of students by 1
        this.numStudents += 1;
    }
};

// Initializes the application by requesting
// the students on the roster and creating the
// roster table.
// 
// return - nothing
App.prototype.initialize = function() {
    var _this = this;
    // create an AJAX XMLHTTPRequest object
    var xhr = new XMLHttpRequest();
    
    // create an onload handler
    xhr.onload = function() {
        if(xhr.status !== 200) {
            var rosterDiv = document.querySelector('div#roster');
            rosterDiv.innerHTML = '<p>' + roster.innerHTML +
            + xhr.status +': ' + xhr.statusText + '</p>';
            return;
        }
        // Assert: response is not an error
    
        // load the roster
        _this.parseRoster(xhr.response);
        
        // add the roster to the page
        _this.addRosterTable();
        
    };
    
    xhr.open("GET","http://mcs.drury.edu/ssigman/DUCS_EMS/getAllStudents.php");
    xhr.responseType = "json";
    xhr.onerror = function() {
        console.log("The application has thrown an error trying" +
                    " to retreive student data.");
    }
    xhr.send();
    
};

// app method that adds the rows to the roster.
// One row is added for each student in roster array
// of the app object.
//
// return - nothing
App.prototype.addRosterTable = function() {
    var html = "";   // the html string to add
    
    // add one table row for each student
    for(var i=0; i<this.roster.length; i++) {
        html += "<tr>";
        html += "<td>" + this.roster[i].getFullName() + "</td>";
        html += "<td>" + this.roster[i].getId() + "</td>";
        html += "<td>" + this.roster[i].getEmail() + "</td>";
        html += "</tr>";
    }
    
    // add the row to the table
    document.querySelector("table#rosterTable").innerHTML += html;
    
    // add the number of students
    html = "";
    html = '<span id="numRow">Number of Students: ' + this.numStudents +
           '</span>';
    document.querySelector("#roster").innerHTML += html;
}

/********************************************
 *   Global declarations and Startup code.  *
 ********************************************/

// declare a global app object
var rosterApp;

window.onload = function() {
    rosterApp = new App();
    rosterApp.initialize();
};
