import axios from "axios";
import { Express, Request, Response } from "express";
import { sortTrainsWithConditions } from "./sortTrains";

export default function (app: Express) {
  let creds: any;

  app.get("/healthCheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/register", async (req: Request, res: Response) => {
    const companyName = req.body.companyName;
    const response = await axios.post("http://localhost:3000/register", {
      companyName: companyName,
    });

    if (response.status === 200) {
      creds = response.data;
    }

    res.send({
      status: "200",
      response: response.data,
    });
  });

  app.post("/auth", async (req: Request, res: Response) => {
    const params = creds;
    console.log(params);
    const response = await axios.post("http://localhost:3000/auth", {
      companyName: params.companyName,
      clientID: params.clientID,
      clientSecret: params.clientSecret,
    });

    if (response.status === 200) {
      res.locals.token = response.data.access_token;
    }

    res.send({
      status: "200",
      response: response.data,
    });
  });

  app.get("/trains", async (req: Request, res: Response) => {
    const token = res.locals.token;

    const header = `Authorization: Bearer ${token}`;

    const response = await axios.post("http://localhost:3000/trains", {
      header: header,
    });

    const trains = response.data;
    const response_data_sorted = sortTrainsWithConditions(trains);

    res.send({
      status: "200",
      response: response_data_sorted,
    });
  });
}
