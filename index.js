const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.avq6v53.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run(){

    try{
        const serviceCollection = client.db('serviceFood').collection('allService');
        const orderCollection = client.db('serviceFood').collection('order');

        app.get('/service', async (req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/services', async (req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get("/services/:id", async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query)
            res.send(service);
        });

        app.post('/orders', async (req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        
    }
    finally{

    }

}
run().catch(err => console.error(err));
 

app.get('/', (req, res) =>{
    res.send('server is running');
})
app.listen(port, () =>{
    console.log(`server is running on port ${port}`);
})