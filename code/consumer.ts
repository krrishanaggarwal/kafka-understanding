import { kafka, TOPIC_RIDER_LOCATION } from "./config";
const group = process.argv[2];

async function init() {
    const consumer = kafka.consumer({groupId: group});
    await consumer.connect();
    console.log(`Consumer ${group} connected successfully`);

    await consumer.subscribe({
        topics: [TOPIC_RIDER_LOCATION], 
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async({topic, partition, message, heartbeat, pause}) => {
            const locationData = JSON.parse(message.value?.toString() || '{}');
            console.log({
                group,
                topic,
                partition,
                location: locationData.location,
                rider: locationData.name,
                timestamp: new Date().toISOString()
            });
        }
    });
}

init().catch(console.error);
