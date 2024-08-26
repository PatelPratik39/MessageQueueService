const { MongoClient } = require("mongodb");
const amqp = require("amqplib/callback_api");
require("dotenv").config();

const url = 'mongodb://localhost:27017'; // MongoDB URL
const dbName = 'MessageQueueService'; // Database name
const collectionName = 'MessageQueueService'; // Collection name
const RABBITMQ_URL = process.env.RABBITMQ_URL;

let collection;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);
    collection = db.collection(collectionName);

    // Now start the RabbitMQ consumer after establishing MongoDB connection
    startRabbitMQConsumer();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

function startRabbitMQConsumer() {
  amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const queue = "task_queue";

      channel.assertQueue(queue, {
        durable: true
      });

      channel.consume(
        queue,
        (msg) => {
          if (msg !== null) {
            console.log("Received:", msg.content.toString());

            // Insert message into MongoDB
            collection.insertOne(
              { message: msg.content.toString() },
              (err, result) => {
                if (err) {
                  console.error("Failed to insert message into MongoDB", err);
                } else {
                  console.log("Message inserted into MongoDB:", result.ops);
                }
              }
            );

            channel.ack(msg);
          }
        },
        {
          noAck: false
        }
      );
    });
  });
}