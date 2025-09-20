/**
 * General utility functions for the task manager application
 */

// Date and time helpers
export class DateHelper {
  // Format date to ISO string without time
  static toDateOnly(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // Check if date is today
  static isToday(date: Date | string): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    return (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    );
  }

  // Check if date is in the past
  static isPast(date: Date | string): boolean {
    const now = new Date();
    const targetDate = new Date(date);
    return targetDate < now;
  }

  // Check if date is within specified days from now
  static isWithinDays(date: Date | string, days: number): boolean {
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= days;
  }

  // Get days until date
  static daysUntil(date: Date | string): number {
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Format date for display
  static formatForDisplay(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format datetime for display
  static formatDateTimeForDisplay(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// String helpers
export class StringHelper {
  // Capitalize first letter
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Convert to title case
  static toTitleCase(str: string): string {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  // Truncate string with ellipsis
  static truncate(str: string, length: number): string {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + '...';
  }

  // Generate slug from string
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Extract initials from name
  static getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Sanitize HTML
  static sanitizeHtml(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return str.replace(/[&<>"'/]/g, (s) => htmlEntities[s]);
  }

  // Generate random string
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// Array helpers
export class ArrayHelper {
  // Remove duplicates from array
  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  // Group array by key
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  // Sort array by multiple criteria
  static sortBy<T>(array: T[], ...criteria: Array<keyof T | ((item: T) => any)>): T[] {
    return [...array].sort((a, b) => {
      for (const criterion of criteria) {
        let valueA: any;
        let valueB: any;

        if (typeof criterion === 'function') {
          valueA = criterion(a);
          valueB = criterion(b);
        } else {
          valueA = a[criterion];
          valueB = b[criterion];
        }

        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
      }
      return 0;
    });
  }

  // Chunk array into smaller arrays
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Get random item from array
  static randomItem<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Object helpers
export class ObjectHelper {
  // Deep clone object
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as any;
    if (typeof obj === 'object') {
      const clonedObj = {} as any;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  }

  // Pick specific keys from object
  static pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  // Omit specific keys from object
  static omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  }

  // Check if object is empty
  static isEmpty(obj: any): boolean {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
  }

  // Flatten nested object
  static flatten(obj: any, prefix: string = ''): Record<string, any> {
    const flattened: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flatten(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }

    return flattened;
  }
}

// Number helpers
export class NumberHelper {
  // Format number as currency
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }

  // Format number with thousand separators
  static formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Calculate percentage
  static percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // Clamp number between min and max
  static clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  // Generate random number between min and max
  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// File helpers
export class FileHelper {
  // Get file extension
  static getExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  // Get filename without extension
  static getNameWithoutExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '');
  }

  // Format file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file type is image
  static isImage(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const extension = this.getExtension(filename).toLowerCase();
    return imageExtensions.includes(extension);
  }

  // Check if file type is document
  static isDocument(filename: string): boolean {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const extension = this.getExtension(filename).toLowerCase();
    return docExtensions.includes(extension);
  }
}

// URL helpers
export class UrlHelper {
  // Build query string from object
  static buildQuery(params: Record<string, any>): string {
    const query = new URLSearchParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        query.append(key, String(value));
      }
    });

    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Parse query string to object
  static parseQuery(queryString: string): Record<string, string> {
    const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  // Validate URL
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Export all helpers as a single object for convenience
export const helpers = {
  date: DateHelper,
  string: StringHelper,
  array: ArrayHelper,
  object: ObjectHelper,
  number: NumberHelper,
  file: FileHelper,
  url: UrlHelper
};