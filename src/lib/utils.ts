/** Utility: merge class names (simple version) */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Get first name from a full name */
export function firstName(name: string): string {
  return name.split(' ')[0] || name;
}

/** Format a slug-safe string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** URL-safe base64 encode for birthday data payload */
export function encodeBirthdayData(data: unknown): string {
  try {
    const json = JSON.stringify(data);
    if (typeof window === 'undefined') {
      return Buffer.from(json).toString('base64url');
    }
    // Browser UTF-8 safe base64 encoding
    const encoded = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(encoded).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/** URL-safe base64 decode for birthday data payload */
export function decodeBirthdayData<T = unknown>(str: string): T | null {
  try {
    if (!str) return null;
    // Restore base64 standard padding and chars
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    if (typeof window === 'undefined') {
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(decoded) as T;
    }
    const decodedStr = atob(base64);
    const json = decodeURIComponent(
      Array.prototype.map.call(decodedStr, (c: string) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

