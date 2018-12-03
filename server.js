import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Issue from './models/Issue';
import { runInNewContext } from 'vm';

const app = express();
const port = 4000;
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established succesfully!');
});

// Configure and implement endpoints

// Get all issues
router.route('/issues').get((req, res) => {
  Issue.find((err, issues) => {
    if (err)
      console.log(err);
    else
      res.json(issues);
  })
});

// Get an issue by ID
router.route('/issues/:id').get((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (err)
      console.log(err);
    else
      res.json(issue);
  })
});

// Post new issue
router.route('/issues/add').post((req, res) => {
  let issue = new Issue(req.body);
  issue.save().then(issue => {
    res.status(200).json({ 'issue': 'Added succesfully'});
  })
  .catch(err => {
    res.status(400).send('Failed to create new record');
  });
});

// Post an issue update
router.route('/issues/update/:id').post((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (!issue)
      return next(new Error('Could not load Document'));
    else {
      issue.title = req.body.title;
      issue.responsible = req.body.responsible;
      issue.description = req.body.description;
      issue.severity = req.body.severity;
      issue.status = req.body.status;

      issue.save().then(issue => {
        res.json('Update done');
      }).catch(err => {
        res.status(400).send('Update failed');
      });
    }
  });
});

// Delete an issue
router.route('/issues/delete/:id').get((req, res) => {
  Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
    if (err)
      res.json(err);
    else
      res.json('Removed succesfully');
  })
});

// Setup listen for connections
app.use('/', router);
app.listen(port, () => console.log(`Express server running on port ${port}`));



// Basic hello world routing
// app.use('/', router);
// app.listen(4000, () => console.log(`Express server running on port 4000`));