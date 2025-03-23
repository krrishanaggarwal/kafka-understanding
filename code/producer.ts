import { kafka, TOPIC_RIDER_LOCATION } from "./config";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log("Connecting Producer");
  await producer.connect();
  console.log("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [riderName, location] = line.split(" ");
    await producer.send({
      topic: TOPIC_RIDER_LOCATION,
      messages: [
        {
          partition: location.toLowerCase() === "north" ? 0 
                    : location.toLowerCase() === "south" ? 1
                    : location.toLowerCase() === "east" ? 2
                    : 3, 
          key: "location-update",
          value: JSON.stringify({ name: riderName, location }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();