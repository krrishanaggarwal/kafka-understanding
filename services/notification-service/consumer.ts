import { kafka, TOPIC_RIDER_LOCATION } from "../../code/config";

async function initNotificationService() {
    const consumer = kafka.consumer({ groupId: 'notification-service-group' });
    await consumer.connect();
    console.log('Notification Service Connected');

    await consumer.subscribe({
        topics: [TOPIC_RIDER_LOCATION],
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value?.toString() || '{}');
            console.log(`🔔 NOTIFICATION: Rider ${data.name} has moved to ${data.location}`);
        }
    });
}

initNotificationService().catch(console.error); 