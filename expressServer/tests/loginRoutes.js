var serverObject = require('../src/server');
var request = require('supertest');
var should = require('should');
var jwt = require('jsonwebtoken');

describe('Login Route', function(){
  var server;
  var serverConfig = serverObject.getServerConfig();
  var url = 'http://' + serverConfig.host + ':' + serverConfig.port;
  request = request(url);

  beforeEach(function(done){
    server = serverObject.makeServer(done);
  });

  afterEach(function(done){
    server.close(done);
  });

  it('should login successfully with right credentials', function(done){
    var user = {
      username: 'andrebot_almeida@hotmail.com',
      password: 'theasdf123'
    };

    request.post('/login')
      .send(user)
      .expect(200)
      .end(function(error, response){
        if(error) return done(error);

        response.body.should.not.be.empty;

        var verify = jwt.verify(response.body, serverConfig.secret, {issuer: serverConfig.issuer, ignoreExpiration: false});
        verify.should.have.properties('_id', 'role', 'iat', 'exp', 'iss');

        done();
      });
  });

  it('should return status 403 for wrong credentials', function(done){
    var user = {
      username: 'blablalba@hotmail.com',
      password: 'theasdf123'
    };

    request.post('/login')
      .send(user)
      .expect(403)
      .end(function(error, response){
        if(error) return done(error);

        done();
      });
  });

});