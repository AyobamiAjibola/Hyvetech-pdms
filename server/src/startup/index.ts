import { Server } from "http";
import AppLogger from "../utils/AppLogger";
import database from "../config/database";
import dataStore from "../config/dataStore";
import CommandLineRunner from "../helpers/CommandLineRunner";

const logger = AppLogger.init(startup.name).logger;

export default async function startup(server: Server) {
  const port = process.env.PORT || 5050;

  await dataStore.init({ flush: true });
  await database.init();
  await database.sequelize.sync();
  await CommandLineRunner.run();

  server.listen(port, () => logger.info(`Server running on port: ${port}`));
}
