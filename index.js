const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
require('dotenv').config();
const app = express()
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json())
app.use(cors())
const port = 5001;
app.use(express.static('org'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello I am form DB')
})





const uri =
  'mongodb://restaurant:JqHwhgxlPK9Pwlc1@cluster0-shard-00-00.ujwe0.mongodb.net:27017,cluster0-shard-00-01.ujwe0.mongodb.net:27017,cluster0-shard-00-02.ujwe0.mongodb.net:27017/redOnion?ssl=true&replicaSet=atlas-xdan06-shard-0&authSource=admin&retryWrites=true&w=majority';





MongoClient.connect(uri, function (err, client,)   {  
  const userDataCollection = client.db('redOnion').collection('userData')
  const userPhoneCollection = client.db('redOnion').collection('phone')
  const chefCollection = client.db('redOnion').collection('chefs')
 

  app.post('/userData', (req, res) => {
    const orders = req.body;
    console.log(orders)
    userDataCollection.insertOne(orders).then((userResult) => {
      res.send(userResult.insertedCount > 0)
    })
  })

  app.get('/getUserData', (req, res) => {
    userDataCollection.find({}).toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/phones', (req, res) => {
    const phone = req.body
    console.log(phone)
    userPhoneCollection.insertOne(phone)
    .then((phoneData) => {
      res.send(phoneData.insertedCount > 0)
    })
  })

  app.get('/getPhone', (req, res) => {
    userPhoneCollection.find({}).toArray((err, document) => {
      res.send(document)
    })
  })



  // File uploading segment

  app.post('/addChef', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const realName = req.body.realName;
    const email = req.body.email;
    const newImg = file.data;
    const food = req.body.foodName;
    const encImg = newImg.toString('base64');
    console.log(name, email, encImg)

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    chefCollection.insertOne({ food,name, email, image,realName,})
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

app.get('/newChef', (req, res) => {
  chefCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});
})

app.listen(process.env.PORT || port)
