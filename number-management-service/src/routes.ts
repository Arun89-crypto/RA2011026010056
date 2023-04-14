import axios from "axios";
import { Express, Request, Response } from "express";

export default function (app: Express) {
  app.get("/healthCheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.get("/numbers", (req: Request, res: Response) => {
    const url_array = req.query.url;

    const cancel_token = axios.CancelToken;
    const source = cancel_token.source();

    const timeout = 100; // 100 millisecond timeout

    const num_array = new Set();

    // tslint:disable-next-line
    url_array?.forEach((url) => {
      axios
        .get(url, {
          cancelToken: source.token,
        })
        .then((response) => {
          for (let index = 0; index < response.data.length; index++) {
            // Getting the nums
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("Request cancelled", error.message);
          } else {
            console.log("Error", error.message);
          }
        });
      setTimeout(() => {
        source.cancel("Request took too long"); // Cancel the request with a custom message
      }, timeout);
    });
  });
}
