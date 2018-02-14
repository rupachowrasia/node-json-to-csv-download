const express = require('express');
const Cloudant = require('cloudant');
const app = express();
const json2csv = require('json2csv');

// connect to cloudant database
let cloudant = Cloudant({
  account: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  password: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}); 
let db = cloudant.db.use('employee');

// passing data from database, assume our data is in the format like: 
// let data = {
//     empName: "tester",
//     email: "tester@gmail.com",
//     role: "developer",
//     skill: "nodejs",
//     rating: "4",
//     status: "available"
// };

app.get('/downloadFromDB', (req, res) => {
    db.list({include_docs: true}, (err, result) => {
        let fields = ['empName', 'email', 'role', 'skill', 'rating', 'status' ];
        json2csv({ data: result, fields: fields }, (err, csv) => {
            if (err) console.log(err);
                var filename = 'data.csv';
                res.attachment(filename);
                res.end(csv, 'UTF-8');
        });
    });
});

const jsonData = {
    "total_rows":6,
    "rows":[
       {
          "id":"1",
          "doc":{
             "_id":"101",
             "empId":"1",
             "empName":"tester1",
             "email":"tester1@gmail.com",
             "role":"developer",
             "skills":[
                {
                   "name":"C",
                   "rating":5
                },
                {
                   "name":"C++",
                   "rating":5
                },
                {
                   "name":"Java",
                   "rating":3
                },
                {
                    "name":"NodeJS",
                    "rating":4
                 },
                {
                    "name":".Net",
                    "rating":3
                }
             ],
             "status":"active"
          }
       },
       {
          "id":"2",
          "doc":{
             "_id":"102",
             "empId":"2",
             "empName":"tester2",
             "email":"tester2@gmail.com",
             "role":"developer",
             "skills":[
                {
                   "name":"PHP",
                   "rating":5
                },
                {
                   "name":"Java",
                   "rating":3
                },
                {
                    "name":"NodeJS",
                    "rating":4
                 },
                {
                    "name":".Net",
                    "rating":3
                }
             ],
             "status":"active"
          }
       },
       {
          "id":"3",
          "doc":{
             "_id":"103",
             "empId":"3",
             "empName":"tester3",
             "email":"tester3@gmail.com",
             "role":"designer",
             "skills":[
                {
                   "name":"Photoshop",
                   "rating":4
                },
                {
                   "name":"HTML",
                   "rating":3
                },
                {
                   "name":"CSS",
                   "rating":3
                },
                {
                   "name":"Bootstrap",
                   "rating":4
                }
             ],
             "status":"active"
          }
       },
       {
          "id":"4",
          "doc":{
             "_id":"104",
             "empId":"4",
             "empName":"tester4",
             "email":"tester4@gmail.com",
             "role":"tester",
             "skills":[
                {
                   "name":"Unit",
                   "rating":5
                },
                {
                   "name":"Selenium",
                   "rating":5
                },
                {
                   "name":"Black Box",
                   "rating":5
                }
             ],
             "status":"active"
          }
       }
    ]
 };
 
// pass static json data
app.get('/downloadData', (req, res) => {
    result = jsonData.rows;
    let collection = [];
    let iterationNumber = 0;
    for (var x in result) {
        var skill = result[x].doc.skills;
        var skill_name = [];
        var skill_rating = [];
        for (var y in skill) { 
            skill_name.push(skill[y].name);
            skill_rating.push(skill[y].rating);
        }
        collection[x] = new Object(); 
        collection[x].empName = result[x].doc.empName;
        collection[x].email = result[x].doc.email;
        collection[x].role = result[x].doc.role;
        collection[x].skill = skill_name;
        collection[x].rating = skill_rating;
        collection[x].status = result[x].doc.status;
        iterationNumber++;
        if(iterationNumber == result.length) {
            let fields = ['empName', 'email', 'role', 'skill', 'rating', 'status' ];
            json2csv({ data: collection, fields: fields }, function(err, csv) {
                if (err) console.log(err);
                    var filename = 'data.csv';
                    res.attachment(filename);
                    res.end(csv, 'UTF-8');
            });
        }
    }
});

app.listen(3004, function(){
    console.log(`Server is up and running`);
});
