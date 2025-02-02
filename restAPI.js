const express = require('express');
const AWS = require('aws-sdk');

// Set AWS region and credentials if not using aws configure
AWS.config.update({ region: 'us-east-2' });  // Change to your region
// AWS.config.update({ accessKeyId: 'YOUR_ACCESS_KEY', secretAccessKey: 'YOUR_SECRET_KEY' });

const app = express();
const port = 3000;

// Create DynamoDB client
const docClient = new AWS.DynamoDB.DocumentClient();

// Middleware to parse JSON bodies
app.use(express.json());

// GET request to retrieve an item from DynamoDB
app.get('/item/:id', (req, res) => {
  const params = {
    TableName: 'Products', // Replace with your table name
    Key: {
      'Product_ID': req.params.id, // Replace with your primary key
    },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read item', details: err });
    } else {
      res.status(200).json(data.Item);
    }
  });
});

// POST request to add an item to DynamoDB
// POST request to add an item to DynamoDB
app.post('/item', (req, res) => {
  // Assuming your DynamoDB table has Product_ID as partition key and Price as a second attribute
  const { Product_ID, Price } = req.body; // Use the exact attribute names for your table
  const params = {
    TableName: 'Products', // Ensure this matches your DynamoDB table name
    Item: {
      'Product_ID': Product_ID, // Use the correct primary key name
      'Price': Price,  // Use the correct attribute names
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to add item', details: err });
    } else {
      res.status(200).json({ message: 'Item added successfully', data: req.body });
    }
  });
});

// Listen for requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
