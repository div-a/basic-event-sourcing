import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { PersistedEvent } from "./Event";

// use class -  as can't use instanceof / typeof with interface
export class ProductShipped {
  quantity: number;

  constructor(quantity: number) {
    this.quantity = quantity;
  }
}

export class ProductReceived {
  quantity: number;

  constructor(quantity: number) {
    this.quantity = quantity;
  }
}

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity()
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantityOnHand: number;

  load(events: PersistedEvent[]) {
    events.forEach((e: any) => {
      this.apply(e);
    });
  }

  apply(event: PersistedEvent) {
    if (this.quantityOnHand === null || this.quantityOnHand === undefined) {
      this.quantityOnHand = 0;
    }

    let parsedData = JSON.parse(event.data);
    if (event.eventType == "ProductShipped") {
      this.quantityOnHand -= parsedData.quantity;
    } else if (event.eventType == "ProductReceived") {
      this.quantityOnHand += parsedData.quantity;
    }
  }
}
