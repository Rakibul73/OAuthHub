const cluster = require("cluster");
const os = require("os");
const app = require("./app");

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;

    console.log(`Master process ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} exited. Spawning a new one.`);
        cluster.fork();
    });
} else {
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });
}
