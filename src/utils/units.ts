export const metersToFeet = (meters: number) => meters / 0.3048;
export const feetToMeters = (feet: number) => feet * 0.3048;
export const displayDimension = (meters: number, unit: 'metric' | 'imperial') => Number((unit === 'metric' ? meters : metersToFeet(meters)).toFixed(unit === 'metric' ? 2 : 1));
