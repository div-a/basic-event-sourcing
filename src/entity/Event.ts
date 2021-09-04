import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregateId: number;

  @Column()
  eventType: string;

  @Column()
  data: string;

  static createEvent(aggregateId: number, e: any) {
    let event = new Event();
    event.aggregateId = aggregateId;
    event.eventType = typeof e;
    event.data = JSON.stringify(e);
    return event;
  }
}
