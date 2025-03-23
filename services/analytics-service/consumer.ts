import { kafka, TOPIC_RIDER_LOCATION } from "../../code/config";

interface LocationCount {
    north: number;
    south: number;
    east: number;
    west: number;
}

const locationStats: LocationCount = {
    north: 0,
    south: 0,
    east: 0,
    west: 0
};

async function initAnalyticsService() {
    const consumer = kafka.consumer({ groupId: 'analytics-service-group' });
    await consumer.connect();
    console.log('Analytics Service Connected');

    await consumer.subscribe({
        topics: [TOPIC_RIDER_LOCATION],
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value?.toString() || '{}');
            const location = data.location.toLowerCase();
            
            // Update stats
            locationStats[location as keyof LocationCount]++;
            
            console.log('📊 ANALYTICS:');
            console.log('Current Distribution:');
            console.table(locationStats);
        }
    });
}

initAnalyticsService().catch(console.error); 