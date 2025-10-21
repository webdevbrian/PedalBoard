/**
 * Board class - hosts pedals and manages routing between them
 * Modern TypeScript implementation
 */
import { Connectable } from './Connectable';
import { Box } from '../pedals/Box';
export declare class Board extends Connectable {
    private pedals;
    private mediaStreamDestination?;
    constructor(context: AudioContext);
    /**
     * Adds pedals to the board
     */
    addPedals(pedals: Box[]): void;
    /**
     * Adds a single pedal to the board
     */
    addPedal(pedal: Box): void;
    /**
     * Adds a pedal at a specific position
     */
    addPedalAt(pedal: Box, index: number): void;
    /**
     * Removes a pedal from the board
     */
    removePedal(pedal: Box): void;
    /**
     * Removes a pedal at a specific index
     */
    removePedalAt(index: number): Box | undefined;
    /**
     * Gets all pedals on the board
     */
    getPedals(): Box[];
    /**
     * Gets a pedal at a specific index
     */
    getPedalAt(index: number): Box | undefined;
    /**
     * Moves a pedal to a new position
     */
    movePedal(fromIndex: number, toIndex: number): void;
    /**
     * Routes the internal signal chain through all pedals
     */
    private routeInternal;
    /**
     * Sets media stream destination for WebRTC
     */
    setMediaStreamDestination(destination: MediaStreamAudioDestinationNode): void;
    /**
     * Clears all pedals from the board
     */
    clear(): void;
    /**
     * Disposes of the board and all its pedals
     */
    dispose(): void;
    /**
     * Serializes the board configuration
     */
    toJSON(): any;
}
//# sourceMappingURL=Board.d.ts.map