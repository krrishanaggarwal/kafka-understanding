import { kafka, TOPIC_RIDER_LOCATION } from "./config"
async function init() {
    const admin= kafka.admin()
    admin.connect();
    console.log('admin connected');

    await admin.createTopics({
        topics:[
            {
                topic: TOPIC_RIDER_LOCATION,
                numPartitions:4
            }
        ]
    });

    console.log("topic creates succesfully");
    await admin.disconnect(); 
    
}

init();
