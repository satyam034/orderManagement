import { Kafka } from 'kafkajs';
import * as dotenv from 'dotenv';
dotenv.config();

const brokers = (process.env.KAFKA_BROKERS || '127.0.0.1:9092').split(',');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'mini-order-flow',
  brokers
});

export const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log('Kafka producer connected');
}
