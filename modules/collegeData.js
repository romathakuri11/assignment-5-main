const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length == 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    })
}


module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length == 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        const foundStudent = dataCollection.students.find(student => student.studentNum == num);

        if (!foundStudent) {
            reject("No student found with the given number");
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.updateStudent = function (studentData) {
    console.log("here is the studentData: ", studentData)
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(student => student.studentNum == Number(studentData.studentNum));
        if(studentData.TA == undefined || studentData.TA == null)
        {
            studentData.TA = false;
        }
        else
        {
            studentData.TA = true
        }
        studentData.course = Number(studentData.course)
        studentData.studentNum = Number(studentData.studentNum) 
        if (index !== -1) {
            
            console.log("here is the last updated studentData: ", studentData)
            dataCollection.students[index] = studentData;
        }
        else{
            reject("No student found with the given number");
            return;
        }

        resolve();
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        console.log("here is the courses list", dataCollection.courses)
        const course = dataCollection.courses.find(course => course.courseId == id);
        console.log("here is the desired course", course)
        if (!course) {
            reject("query returned 0 results");
            return;
        }

        resolve(course);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.course == course);

        if (filteredStudents.length == 0) {
            reject("No students found for the given course");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        if(studentData.TA == undefined || studentData.TA == null)
        {
            studentData.TA = false;
        }
        else
        {
            studentData.TA = true
        }
        studentData.studentNum = dataCollection.students.length + 1
        studentData.course = Number(studentData.course)
        dataCollection.students.push(studentData)
        resolve(dataCollection.students)
    });
}