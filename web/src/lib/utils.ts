import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getDataTypeDistribution(data: any): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  if (Array.isArray(data)) {
    data.forEach(item => {
      const type = typeof item;
      distribution[type] = (distribution[type] || 0) + 1;
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.values(data).forEach(value => {
      const type = typeof value;
      distribution[type] = (distribution[type] || 0) + 1;
    });
  }
  
  return distribution;
}

export function getNestedDepth(data: any): number {
  if (typeof data !== 'object' || data === null) {
    return 0;
  }
  
  let maxDepth = 0;
  
  if (Array.isArray(data)) {
    data.forEach(item => {
      const depth = getNestedDepth(item);
      maxDepth = Math.max(maxDepth, depth);
    });
  } else {
    Object.values(data).forEach(value => {
      const depth = getNestedDepth(value);
      maxDepth = Math.max(maxDepth, depth);
    });
  }
  
  return maxDepth + 1;
}