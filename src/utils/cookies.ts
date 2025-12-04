// utils/cookies.ts

interface CookieOptions {
  expires?: number | Date; // Số ngày hoặc Date object
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean; // Chỉ server-side mới set được
}

class CookieStorage {
  /**
   * Lưu cookie
   * @param name - Tên cookie
   * @param value - Giá trị (sẽ tự động stringify nếu là object)
   * @param options - Các tùy chọn cookie
   */
  set<T>(name: string, value: T, options: CookieOptions = {}): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(stringValue)}`;

      // Xử lý expires
      if (options.expires) {
        let expiresDate: Date;

        if (typeof options.expires === 'number') {
          // Số ngày
          expiresDate = new Date();
          expiresDate.setTime(expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000);
        } else {
          // Date object
          expiresDate = options.expires;
        }

        cookieString += `; expires=${expiresDate.toUTCString()}`;
      }

      // Path (mặc định là '/')
      cookieString += `; path=${options.path || '/'}`;

      // Domain
      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }

      // Secure (chỉ gửi qua HTTPS)
      if (options.secure) {
        cookieString += '; secure';
      }

      // SameSite
      if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookieString;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  /**
   * Lấy cookie
   * @param name - Tên cookie
   * @returns Giá trị hoặc null nếu không tồn tại
   */
  get<T>(name: string): T | null {
    try {
      const nameEQ = encodeURIComponent(name) + '=';
      const cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(cookie.substring(nameEQ.length));

          // Try parse JSON
          try {
            return JSON.parse(value) as T;
          } catch {
            return value as T;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  /**
   * Xóa cookie
   * @param name - Tên cookie
   * @param options - Path và domain phải khớp với lúc set
   */
  remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0), // Set về quá khứ để xóa
    });
  }

  /**
   * Kiểm tra cookie có tồn tại không
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Lấy tất cả cookies
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};

    if (!document.cookie) {
      return cookies;
    }

    document.cookie.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
      }
    });

    return cookies;
  }

  /**
   * Xóa tất cả cookies
   */
  clear(options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach((name) => {
      this.remove(name, options);
    });
  }
}

// Export singleton instance
export const cookies = new CookieStorage();

// Time constants
export const COOKIE_TIME = {
  HOUR: 1 / 24,
  DAY: 1,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365,
};
