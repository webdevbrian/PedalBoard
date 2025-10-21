/**
 * Simple EventEmitter implementation for TypeScript
 */
export class EventEmitter {
    constructor() {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Aliases for compatibility
        Object.defineProperty(this, "addEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.on
        });
        Object.defineProperty(this, "removeEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.off
        });
        Object.defineProperty(this, "dispatchEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.emit
        });
    }
    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(listener);
        return this;
    }
    off(event, listener) {
        const listeners = this.events.get(event);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                this.events.delete(event);
            }
        }
        return this;
    }
    emit(event, ...args) {
        const listeners = this.events.get(event);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(...args);
                }
                catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
        return this;
    }
    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, onceListener);
            listener(...args);
        };
        return this.on(event, onceListener);
    }
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        }
        else {
            this.events.clear();
        }
        return this;
    }
    listenerCount(event) {
        const listeners = this.events.get(event);
        return listeners ? listeners.size : 0;
    }
}
