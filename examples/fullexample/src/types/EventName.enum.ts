/**
 * Enum for all event names across all services to prevent typos or duplicates.
 * Event names should be globally unique.
 * Service A should not emit events with same name as Service B does.
 * A service with different versions should emit events with same name and subscriptions of this event should set a service version for subscriptions
 */
export enum EventName {
  NewUserSignedUp = 'NewUserSignedUp',
}
