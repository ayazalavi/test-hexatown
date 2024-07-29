module.exports = {
  apps: [
    {
      name: "backend",
      script: "backend/index.ts",
      interpreter: "ts-node",
      watch: true,
      env: {
        NODE_ENV: "development",
        MONGO_URL: "mongodb://mongo:27017/mydatabase",
        LOG_PATH: "/usr/src/app/logs/backend.log",
      },
    },
    {
      name: "frontend",
      script: "npm",
      args: "run dev",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
