import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'food-delivery-app',
  brokers: ['localhost:9092'], // Update this with your Kafka broker addresses
});

export const TOPIC_RIDER_LOCATION = 'rider_location';

