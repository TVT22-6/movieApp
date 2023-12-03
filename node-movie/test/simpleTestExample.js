let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app'); // Ensure this path is correct
let should = chai.should();

chai.use(chaiHttp);

// Global variables for username and password
let testUsername = `testuser_${Date.now()}`;
let testPassword = "pass";
let jwtToken;

describe('/GET user', () => {
    it('it should GET all the users', function(done) {
        this.timeout(5000); // Adjust timeout if needed
        chai.request(server)
            .get('/user') // Adjust the endpoint if needed
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // You can add more assertions here based on the expected structure
                done();
            });
    });
});


describe('User Management Tests', () => {
    describe('/POST register', () => {
        it('it should register a new user', (done) => {
            chai.request(server)
                .post('/user/register')
                .send({ uname: testUsername, pw: testPassword })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it('it should not allow registering the same username twice', (done) => {
            chai.request(server)
                .post('/user/register')
                .send({ uname: testUsername, pw: testPassword })
                .end((err, res) => {
                    res.should.have.status(409); // Expecting a conflict error
                    done();
                });
        });
    });



    // Test for logging in a user
    describe('/POST login', () => {
        it('it should log in a user with correct credentials', (done) => {
            let credentials = {
                uname: testUsername,
                pw: testPassword
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('jwtToken');
                    jwtToken = res.body.jwtToken; // Store the JWT token
                    done();
                });
        });
    });

    describe('Password Change Tests', () => {
        // Ensure the user is registered and logged in before running these tests
        before((done) => {
            // Register and log in the user, then store the JWT token in jwtToken
            // ...
            done();
        });
    
        it('it should change the user password', (done) => {
            let passwordChangeDetails = {
                currentPassword: testPassword,
                newPassword: "newPassword123"
            };
            chai.request(server)
                .put('/user/change-password')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send(passwordChangeDetails)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Password changed successfully');
                    done();
                });
        });
    
        it('it should log in with the new password', (done) => {
            let credentials = {
                uname: testUsername,
                pw: "newPassword123"
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('jwtToken');
                    done();
                });
        });
    
        it('it should not log in with the old password', (done) => {
            let credentials = {
                uname: testUsername,
                pw: testPassword
            };
            chai.request(server)
                .post('/user/login')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(401); // Unauthorized status expected
                    done();
                });
        });
    
        // After tests, reset any changes made to the test environment
        after((done) => {
            // Reset user password back to the original, if necessary
            // ...
            done();
        });
    });

    // Test for deleting a user
    describe('/DELETE delete', () => {
        it('it should delete a user', (done) => {
            chai.request(server)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${jwtToken}`)
                .end((err, res) => {
                    res.should.have.status(200); // Expect a 200 status for successful deletion
                    done();
                });
        });
    });

   
});