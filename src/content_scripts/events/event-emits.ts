import eventHandler, { EventType } from './event-handler';

export default async (event: EventType) => {
  await eventHandler(event);
};
