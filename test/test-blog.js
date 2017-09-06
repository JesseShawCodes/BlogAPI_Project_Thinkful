const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('blogposts', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list blog post on GET', function() {
        return chai.request(app)
            .get('/blogposts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');

                res.body.length.should.be.at.least(1);

                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    it('should add a blog post on POST', function() {
        const newItem = {title: 'blog post 1000', content: 'i cant believe ive wrote 1000 blogs', author: 'Jesse Shaw', publishDate: publishDate || Date.now()};
        return chai.request(app)
            .post('/blogposts')
            .send(newItem)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
            })
    });

    it('should update blog post on PUT', function(){
        const updateData = {
            title: 'Blog post 1000',
            content: 'Another 1000',
            author: 'Jesse Shaw',
            publishDate: publishDate || Date.now()
        }
        return chai.request(app)
            .get('/blogposts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blogposts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.equal(updateData);
            });
    });

    it('should delete blogpost on DELETE', function() {
        return chai.request(app)
          // first have to get so we have an `id` of item
          // to delete
          .get('/blogposts')
          .then(function(res) {
            return chai.request(app)
              .delete(`/blogposts/${res.body[0].id}`);
          })
          .then(function(res) {
            res.should.have.status(204);
          });
      });
});
