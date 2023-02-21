import eventHandler, { EventType } from './event-handler';

export default (event: EventType) => {
  eventHandler(event);
};
