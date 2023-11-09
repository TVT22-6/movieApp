require('dotenv').config();
const express = require('express');
const userRoute = require('./routes/user');
const cors = require('cors');

const app = express();

//Setting middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

//Setting routes
app.use('/user', userRoute );

//Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function(){
    console.log('Server running on port ' + PORT);
} );

/**
 * Root mapping.
 */
app.get('/', (req, res) => {

    const persons = [
        { fname: 'Reima', lname: 'Riihimäki', age: 23},
        { fname: 'Liisa', lname: 'Ihmemaa'},
        { fname: 'John', lname: 'Doe'},
    ];

    res.json(persons);
});

/**
 * Post mapping test.
 */
app.post('/info' ,(req,res) => {

    req.body.forEach(element => {
        console.log(element);
        console.log('-----');
    });
    // console.log(req.body.username);
    // console.log(req.body.pw);

    res.send('Post working');
});