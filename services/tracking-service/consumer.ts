import { kafka, TOPIC_RIDER_LOCATION } from "../../code/config";

interface RiderLocation {
    name: string;
    location: string;
    lastUpdated: string;
}

const riderLocations = new Map<string, RiderLocation>();
const batchSize = 100;
const locationBatch: RiderLocation[] = [];

async function initTrackingService() {
    const consumer = kafka.consumer({ groupId: 'tracking-service-group' });
    await consumer.connect();
    console.log('Tracking Service Connected');

    await consumer.subscribe({
        topics: [TOPIC_RIDER_LOCATION],
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value?.toString() || '{}');
            
            // Update rider's location
            riderLocations.set(data.name, {
                name: data.name,
                location: data.location,
                lastUpdated: new Date().toISOString()
            });

            locationBatch.push({
                name: data.name,
                location: data.location,
                lastUpdated: new Date().toISOString()
            });

            if (locationBatch.length >= batchSize) {
                // save to your Database here , bulk write thus reducing load on DB
           
                locationBatch.length = 0;
            }

            console.log('🗺️ TRACKING:');
            console.log('Current Rider Locations:');
            console.table(Array.from(riderLocations.values()));
        }
    });
}

initTrackingService().catch(console.error); 