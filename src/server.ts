import { config } from "./config";
import app from "./app";
import { initDb } from "./db";

const port = config.port || 8000;
const main = () => {
  initDb()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
