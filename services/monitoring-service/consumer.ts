import { kafka, TOPIC_RIDER_LOCATION } from "../../code/config";

async function initMonitoringService() {
    const consumer = kafka.consumer({ groupId: 'monitoring-service-group' });
    await consumer.connect();
    console.log('Monitoring Service Connected');

    const messageCount = {
        total: 0,
        byPartition: {
            0: 0, // north
            1: 0, // south
            2: 0, // east
            3: 0  // west
        }
    };

    await consumer.subscribe({
        topics: [TOPIC_RIDER_LOCATION],
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            messageCount.total++;
            messageCount.byPartition[partition]++;

            console.log('📡 MONITORING:');
            console.log(`Total Messages Processed: ${messageCount.total}`);
            console.log('Messages by Partition:');
            console.table(messageCount.byPartition);
        }
    });
}

initMonitoringService().catch(console.error); 