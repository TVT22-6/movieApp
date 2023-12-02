// test/simpleTestExample.js

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app'); // Make sure this path correctly points to your app.js
let should = chai.should();

chai.use(chaiHttp);

let jwtToken;

// Test endpoint for retrieving all users (customers)
describe('/GET user', () => {
    it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/user') // Adjusted to the user route
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // Include additional assertions here based on your actual customer data structure
                done();
            });
    });
});

// Test endpoint for adding a new user (customer)
describe('/POST register', () => {
    it('it should register a new user', (done) => {
        let user = {
            uname: "newuser", // Field should match the route handler's expectation
            pw: "pass"
        };
        chai.request(server)
            .post('/user/register') // Adjusted to the correct endpoint for registration
            .send(user)
            .end((err, res) => {
                res.should.have.status(201); // Expect a 201 status for successful registration
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User registered successfully');
                done();
            });
    });
});


describe('/POST login', () => {
    it('it should log in a user with correct credentials', (done) => {
        let credentials = {
            uname: "newuser",
            pw: "pass"
        };
        chai.request(server)
            .post('/user/login')
            .send(credentials)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('jwtToken');
                jwtToken = res.body.jwtToken; // Assert the presence of jwtToken
                done();
            });
    });
});

// Test endpoint for deleting a user
describe('/DELETE delete', () => {
    it('it should delete a user', (done) => {
        chai.request(server)
            .delete('/user/delete') // Just the delete endpoint, no username in the URL
            .set('Authorization', `Bearer ${jwtToken}`) // Use the token here
            .end((err, res) => {
                res.should.have.status(200); // Expect a 200 status for successful deletion
                done();
            });
    });
});
// More test cases should be written to cover the full range of CRUD operations


