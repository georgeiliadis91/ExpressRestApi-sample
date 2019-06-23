const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

app.use(express.json());

const data = [
  { id: 1, name: 'data1' },
  { id: 2, name: 'data2' },
  { id: 3, name: 'data3' }
];

//Get data
app.get('/', (req, res) => {
  res.send('Hello World');
});

//get Array of data
app.get('/api/data', (req, res) => {
  res.send(data);
});

//Get data filtered by param
app.get('/api/data/:id', (req, res) => {
  const inputData = data.find(d => d.id === parseInt(req.params.id));
  if (!inputData) return res.status(404).send('No such data');

  res.send(inputData);
});

//Post data to data object
app.post('/api/data', (req, res) => {
  const { error } = validateData(req.body);
  if (error) return res.status(400).send('Name should be 3 chars and string.');

  const inputData = {
    id: data.length + 1,
    name: req.body.name
  };

  data.push(inputData);
  res.send(inputData);
});

//Update Data

app.put('/api/data/:id', (req, res) => {
  //Search if not found -> 404
  const inputData = data.find(d => d.id === parseInt(req.params.id));
  if (!inputData) return res.status(404).send('No such data');

  //Validate
  const { error } = validateData(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Return Result
  inputData.name = req.body.name;
  res.send(inputData);
});

//Delete

app.delete('api/data/:id', (req, res) => {
  //Search if not found -> 404
  const inputData = data.find(d => d.id === parseInt(req.params.id));
  if (!inputData) return res.status(404).send('No such data');

  //Delete
  const index = data.indexOf(inputData);
  data.splice(index, 1);

  //Return name
  res.send(inputData);
});

function validateData(input) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(input, schema);
}

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`listening to port ${port}`));
