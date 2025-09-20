/* eslint-disable @typescript-eslint/no-explicit-any */
type EventCallback = (...args: any[]) => void;

export enum EventNames {
  GATE_EVENT = "gate_event",
}

class EventBus {
  private events: Map<EventNames, EventCallback[]> = new Map();

  /**
   * Emit an event to all registered listeners
   * @param eventName - The name of the event to emit
   * @param args - Arguments to pass to the event listeners
   */
  emit(eventName: EventNames, ...args: any[]): void {
    const listeners = this.events.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for "${eventName}":`, error);
        }
      });
    }
  }

  /**
   * Add an event listener
   * @param eventName - The name of the event to listen for
   * @param callback - The callback function to execute when the event is emitted
   * @returns A function to remove this specific listener
   */
  addListener(eventName: EventNames, callback: EventCallback): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners = this.events.get(eventName)!;
    listeners.push(callback);

    // Return a function to remove this specific listener
    return () => {
      this.removeListener(eventName, callback);
    };
  }

  /**
   * Remove a specific event listener
   * @param eventName - The name of the event
   * @param callback - The callback function to remove
   */
  removeListener(eventName: EventNames, callback: EventCallback): void {
    const listeners = this.events.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);

        // Clean up empty event arrays
        if (listeners.length === 0) {
          this.events.delete(eventName);
        }
      }
    }
  }

  /**
   * Remove all listeners for a specific event
   * @param eventName - The name of the event
   */
  removeAllListeners(eventName?: EventNames): void {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }

  /**
   * Get the number of listeners for a specific event
   * @param eventName - The name of the event
   * @returns The number of listeners
   */
  listenerCount(eventName: EventNames): number {
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  /**
   * Get all event names that have listeners
   * @returns Array of event names
   */
  eventNames(): EventNames[] {
    return Array.from(this.events.keys()) as EventNames[];
  }

  /**
   * Check if an event has any listeners
   * @param eventName - The name of the event
   * @returns True if the event has listeners
   */
  hasListeners(eventName: EventNames): boolean {
    return this.listenerCount(eventName) > 0;
  }
}

// Create and export a singleton instance
export const eventBus = new EventBus();

// Also export the class for creating custom instances if needed
export { EventBus };
export type { EventCallback };
