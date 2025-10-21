/**
 * LED indicator component
 */
import React from 'react';
interface LEDProps {
    active: boolean;
    color?: 'red' | 'green' | 'blue' | 'yellow' | 'white';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}
export declare const LED: React.FC<LEDProps>;
export {};
//# sourceMappingURL=LED.d.ts.map