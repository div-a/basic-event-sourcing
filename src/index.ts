import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { ProductReceived, ProductShipped } from "./entity/Inventory";
var express = require("express");

(async () => {
  const app = express();

  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  app.get("/", (_req, res) => {
    res.send("Hello World");
  });

  app.post("/shipProduct", (_req: , res) => {
    let { quantity } = _req;
    
    let event = new ProductShipped();
    event.quantity = quantity;


    res.send("Hello World");
  });

  app.post("/receiveProduct", (_req, res) => {
    let { quantity } = _req;
    
    let event = new ProductReceived();
    event.quantity = quantity;
    
    res.send("Hello World");
  });

  app.listen(3000, () => console.log("Server listening at port 3000"));
})();
