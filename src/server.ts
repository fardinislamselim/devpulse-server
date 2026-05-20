import { config } from "./config";
import app from "./app";

const port = config.port || 8000;
const main = () => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
