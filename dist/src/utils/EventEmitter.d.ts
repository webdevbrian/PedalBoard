/**
 * Simple EventEmitter implementation for TypeScript
 */
type EventListener = (...args: any[]) => void;
export declare class EventEmitter {
    private events;
    on(event: string, listener: EventListener): this;
    off(event: string, listener: EventListener): this;
    emit(event: string, ...args: any[]): this;
    once(event: string, listener: EventListener): this;
    removeAllListeners(event?: string): this;
    listenerCount(event: string): number;
    addEventListener: (event: string, listener: EventListener) => this;
    removeEventListener: (event: string, listener: EventListener) => this;
    dispatchEvent: (event: string, ...args: any[]) => this;
}
export {};
//# sourceMappingURL=EventEmitter.d.ts.map