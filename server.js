import express from 'express';
import mustache from 'mustache-express';

const app = express();

app.set('views', './views');
app.set('view engine', 'mustache');
app.engine('html', mustache());

app.get('/', (req, res) => {
  res.render('index.html');
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
