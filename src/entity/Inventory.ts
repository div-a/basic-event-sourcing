import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

// use class -  as can't use instanceof / typeof with interface
export class ProductShipped {
  quantity: number;
}

export class ProductReceived {
  quantity: number;
}

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity()
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantityOnHand: number;

  load(events: any) {
    events.forEach((e: any) => {
      this.apply(e);
    });
  }

  apply(event: ProductShipped | ProductReceived) {
    if (event instanceof ProductShipped) {
      this.quantityOnHand -= event.quantity;
    } else if (event instanceof ProductShipped) {
      this.quantityOnHand += event.quantity;
    }
  }
}
