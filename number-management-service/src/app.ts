import express from "express";
import routes from "./routes";

const port = 3010;
const host = "localhost";

const app = express();
app.use(express.json());

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
  routes(app);
});
