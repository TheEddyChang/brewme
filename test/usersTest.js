var request = require('request'),
    expect = require('chai').expect,
    baseUrl = "http://localhost:3000";

    describe('Users', function() {
       it('should show signup page on GET /signup', function(done) {
       	  request(baseUrl + '/signup', function (error, response, body) {
       	 	expect(response.statusCode).to.equal(200);
       	 	done();
       	 });
       });
    });