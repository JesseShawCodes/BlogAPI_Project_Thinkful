const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./blogpostrouter');

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/blogposts', (req, res) => {
	res.json(blogRouter.get());
});

app.use('/blogposts', blogRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});


module.exports = {app};

