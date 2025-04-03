import '@testing-library/jest-dom'

// Mock the Request object for Next.js API routes
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Headers(options.headers || {});
    this.body = options.body;
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}; 