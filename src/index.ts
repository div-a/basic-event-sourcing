import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { PersistedEvent } from "./entity/Event";
import { Inventory, ProductReceived, ProductShipped } from "./entity/Inventory";
var express = require("express");

(async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  app.get("/", (_req, res) => {
    res.send("Hello World");
  });

  app.post("/shipProduct", (req, res) => {
    let { productId, quantity } = req.body;

    let persistedEvent = PersistedEvent.createEvent(
      productId,
      new ProductShipped(quantity)
    );
    persistedEvent.save();

    // could raise domain event here to aggregate state after save
    // using set product state functionality below!

    res.send(persistedEvent);
  });

  app.post("/receiveProduct", (req, res) => {
    let { productId, quantity } = req.body;

    let persistedEvent = PersistedEvent.createEvent(
      productId,
      new ProductReceived(quantity)
    );
    persistedEvent.save();

    res.send(persistedEvent);
  });

  app.get("/events", async (_req, res) => {
    let events = await PersistedEvent.find();
    res.send(events);
  });

  app.post("/setProductState", async (req, res) => {
    let { productId } = req.body;
    let events = await PersistedEvent.find({
      where: {
        aggregateId: productId,
      },
    });


    let state = new Inventory();
    state.load(events);
    state.save();

    res.send({ quantity: state.quantityOnHand });
  });

  app.listen(3000, () => console.log("Server listening at port 3000"));
})();
