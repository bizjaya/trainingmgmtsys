require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./helper/error.handler');

const url = 'mongodb://localhost/test'

const app = express()

let server = process.env.MONGODB_SERVER;
let user = process.env.MONGODB_USER;
let pswd = process.env.MONGODB_PASSWORD;
let dbname = process.env.MONGODB_NAME;

const mongouri = `mongodb+srv://${user}:${pswd}@${server}/${dbname}?retryWrites=true&w=majority`;
console.log(mongouri);

mongoose
    .connect(mongouri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('successfully connected to the database');
    })
    .catch((err) => {
        console.log(err);
        console.log('error connecting to the database');
        process.exit();
    });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(errorHandler);
app.use(cors());

const subRoute = require('./routes/subject.controller')
app.use('/subject', subRoute)

const CourseRoute = require('./routes/course.controller')
app.use('/course', CourseRoute)

const UserRoute = require('./routes/user.controller')
app.use('/user', UserRoute)

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
}) 
