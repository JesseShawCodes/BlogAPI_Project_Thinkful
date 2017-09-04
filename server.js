const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./model');
 
const jsonParser = bodyParser.json();
const app = express();

//log the http layer
app.use(morgan('common'));

//Create blog posts
BlogPosts.create('Test title', 'Hi! Welcome to Jesse\'s Blog API', 'Jesse Shaw');

app.get('/blogposts', (req, res) => {
	res.json(BlogPosts.get());
});

app.post('/blogposts', jsonParser, (req, res) => {
	console.log("Creating a Blog Post");
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = 'Missing \`${field}\` in request body';
			console.error(message);
			return res.status(400).send(message);
		}
	}

	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

app.put('/blogposts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'id'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	if (req.params.id !== req.body.id) {
		console.log('here');
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating shopping list item \`${req.params.id}\``);
	BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	});
	res.status(204).end();
});

app.delete('/blogposts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Delete blop post item \`${req.params.ID}\``);
	res.status(204).end();
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
