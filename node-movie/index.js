require('dotenv').config();
const express = require('express');

//Tää pitää ehkä poistaa kun pilvi palveluun siirretään, tiedon vastaanottoa
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();


// const userRoute = require('./routes/user');
// const cors = require('cors');

//Setting middleware
app.use(express.urlencoded({extended: true}));
//app.use(express.json());
//app.use(cors());
//app.use(express.static('public'));

//Setting routes
//app.use('/user', userRoute );



//start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function(){
        console.log('Server is running on Port:' + PORT);
});

//app.get('/', function(req, res){
//        res.send('Home page');
//});

//Same thing, but using arrow functions
//app.get('/', (req, res) => {
//   res.send('Hello World');
//});

/**
 * Root mapping.
 */

app.get('/', (req, res) => {
   
    const persons = [
        { fname: 'tupu', lname: 'ankka', age: 23},
        { fname: 'hupu', lname: 'ankka'},
        { fname: 'lupu', lname: 'ankka'},
    ];

    res.json(persons);
});

app.get('/user', function(req, res){

    const id = req.query.id;
    const userName = req.query.userName;

    console.log(id)
    console.log(userName)

    res.send('Toni');
});


app.post('/home', function(req, res){
    res.send('POST request to the homepage');
});


app.post('/user', upload.none() ,(req, res) => {
    console.log(req.body.username);
    console.log(req.body.pw)

    res.send('POST working password');
});