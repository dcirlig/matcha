var app = require("./server"),
  chai = require("chai"),
  request = require("supertest");

var expect = chai.expect;

describe("List API Integration Tests", function() {
  describe("# Register", function() {
    it("should register with true parameters", function(done) {
      var data = {
        firstname: "Cirlig",
        lastname: "Doina",
        username: "doina",
        passwd: "to1A@abc",
        email: "k.doina@mail.ru",
        gender: "female"
      };
      request(app.app)
        .post("/users/register")
        .send(data)
        .end(function(err, res) {
          console.log("res", res.body);
          //   console.log(res.body);
          // expect(res.statusCode).to.equal(200);
          // expect(res.body).to.be.an("array");
          // expect(res.body).to.be.empty;
          done();
        });
    });
  });
});
