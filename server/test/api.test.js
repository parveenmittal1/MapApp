const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('POST /api/v1/messages', () => {
  it('responds with a inserted  message', (done) => {
    const messageresult ={
      name:'Parveen',
      message:'This is so cool',
      latitude:-90,
      longitude:180
    }
    request(app)
      .post('/api/v1/messages')
        .send(messageresult)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // .then(response => {
        //   console.log(response);
        // })
         .expect(200, messageresult, done);
  });
});
