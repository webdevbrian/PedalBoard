/**
 * Base switch class for pedal switches
 */
import { EventEmitter } from '../../utils/EventEmitter';
export class Switch extends EventEmitter {
    constructor(name, defaultState = false) {
        super();
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.state = defaultState;
    }
    /**
     * Sets the switch state
     */
    setState(state) {
        if (this.state !== state) {
            this.state = state;
            this.emit('change', state);
            this.emit(state ? 'on' : 'off');
            this.routeNodes();
        }
    }
    /**
     * Gets the current state
     */
    getState() {
        return this.state;
    }
    /**
     * Sets the audio nodes for bypass routing
     * Format: [[activeNode, inputNode, bypassNode], ...]
     */
    setNodes(nodes) {
        this.nodes = nodes;
        this.routeNodes();
    }
    /**
     * Routes audio nodes based on switch state
     */
    routeNodes() {
        if (!this.nodes)
            return;
        this.nodes.forEach(nodeSet => {
            const [activeNode, inputNode, bypassNode] = nodeSet;
            try {
                // Disconnect input from both paths
                inputNode.disconnect();
                if (this.state) {
                    // Active: route through effect
                    inputNode.connect(activeNode);
                }
                else if (bypassNode) {
                    // Bypassed: route directly to bypass node
                    inputNode.connect(bypassNode);
                }
            }
            catch (e) {
                // Nodes might not be connected yet
            }
        });
    }
    /**
     * Gets the switch configuration
     */
    getConfig() {
        return {
            on: this.state,
            momentary: this.isMomentary()
        };
    }
    /**
     * Gets the switch name
     */
    getName() {
        return this.name;
    }
}
