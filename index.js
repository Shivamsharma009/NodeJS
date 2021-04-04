const express = require('express');
const app = express();

app.use(express.json());

const morgan = require('morgan');

app.use(morgan('dev'));

//Creating our own middleware

app.use((req, res, next) => {
  console.log('Hello From the middleware 😍😛');
  next();
});

const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//read
app.get('/api/v1/tours', (req, res) => {
  res.send(tours);
});

//read based on the id
app.get('/api/v1/tours/:id', (req, res) => {
  //convert string to number
  const id = req.params.id * 1;

  //iterate over the id while the apropriate id not found

  const tour = tours.find((el) => el.id === id);

  //handling if the tour.length is bigger && tour length is not found

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Sucess',
    data: {
      tour,
    },
  });
});

//create
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

//update based on the id
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<Updated Tour here::>',
    },
  });
});

//delete tour based on the id
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<Deleted Tour here::>',
    },
  });
});

const port = 8000;

app.listen(port, () => {
  console.log(`App Running on ${port}`);
});
