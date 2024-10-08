import { AddEventsBehaviour, AlloyEvents, Behaviour } from '@hugemce/alloy';
import { Id } from '@hugemce/katamari';

// Consider moving to alloy once it takes shape.

const namedEvents = (name: string, handlers: Array<AlloyEvents.AlloyEventKeyAndHandler<any>>): Behaviour.AlloyBehaviourRecord =>
  Behaviour.derive([
    AddEventsBehaviour.config(name, handlers)
  ]);

const unnamedEvents = (handlers: Array<AlloyEvents.AlloyEventKeyAndHandler<any>>): Behaviour.AlloyBehaviourRecord =>
  namedEvents(Id.generate('unnamed-events'), handlers);

export const SimpleBehaviours = {
  namedEvents,
  unnamedEvents
};
