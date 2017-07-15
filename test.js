const request = require("supertest");
const assert = require("assert");
const application = require('./application.js');
var Cookies;

describe("POST registration information", function () {
    it("Should fail without all data", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ name: "Rob", password: "qwer1234", passwordConfirm: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without all data", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ email: "Rob@email.com", password: "qwer1234", passwordConfirm: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without all data", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ name: "Rob", email: "Rob@email.com", passwordConfirm: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without all data", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ name: "Rob", email: "Rob@email.com", password: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail with email already in system", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ name: "Rob", email: "Rob@email.com", password: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without matching passwords", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ name: "Rob", email: "Rob@email.com", password: "qwer1234", passwordConfirm: "different" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should return a successful status", function (done) {
        request(application)
            .post("/api/register")
            .type('form')
            .send({ name: "Rob", email: "Rob@email.com", password: "qwer1234", passwordConfirm: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
})

describe("POST login information", function () {
    it("Should fail without all required fields", function (done) {
        request(application)
            .post("/api/login")
            .type('form')
            .send({ password: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without all required fields", function (done) {
        request(application)
            .post("/api/login")
            .type('form')
            .send({ email: "Rob@email.com" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail if incorrect credentials entered", function (done) {
        request(application)
            .post("/api/login")
            .type('form')
            .send({ email: "Jeffe@email.com", password: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should return a successful status", function (done) {
        request(application)
            .post("/api/login")
            .type('form')
            .send({ email: "Rob@email.com", password: "qwer1234" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(function (err, res) {
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    })
})

describe("POST a new snippet", function () {
    it("Should fail without all required data", function (done) {
        request(application)
            .post("/api/add-snippet")
            .type('form')
            .send({ name: "Sample javascript", language: "javascript" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without all required data", function (done) {
        request(application)
            .post("/api/add-snippet")
            .type('form')
            .send({ name: "Sample javascript", content: "var blah " })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail without all required data", function (done) {
        request(application)
            .post("/api/add-snippet")
            .type('form')
            .send({ content: "var blah ", language: "javascript" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should pass with all required fields", function (done) {
        var req = request(application).post("/api/add-snippet");
        req.cookies = Cookies;
        req.type('form')
            .send({ name: "Sample javascript 1", content: "var blah ", language: "javascript" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })

    it("Should pass with all required fields and additional fields", function (done) {
        var req = request(application).post("/api/add-snippet");
        req.cookies = Cookies;
        req.type('form')
            .send({ name: "Sample ruby", content: "var blah ", notes: "for a test file", language: "ruby" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })

    it("Should pass with all required fields and additional fields", function (done) {
        var req = request(application).post("/api/add-snippet");
        req.cookies = Cookies;
        req.type('form')
            .send({ name: "Sample java", content: "var blah ", notes: "for a test file", language: "java", tags: "One, Two, Three" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
})

describe("GET all snippets", function () {
    it("Should pass for user with snippets", function (done) {
        var req = request(application).get("/api/all-snippets");
        req.cookies = Cookies;
        req.type('form')
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
});

describe("POST a language filter request", function () {
    it("Should pass with language that exists in database", function (done) {
        var req = request(application).post("/api/all-snippets/language");
        req.cookies = Cookies;
        req.type('form')
            .send({ language: "Java" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
});

describe("POST a tag filter request", function () {
    it("Should pass with tag that exists in database", function (done) {
        var req = request(application).post("/api/all-snippets/tag");
        req.cookies = Cookies;
        req.type('form')
            .send({ tag: "One" })
            .expect(200)
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
});