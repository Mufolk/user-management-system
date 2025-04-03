import { POST } from '../route';
import { prisma } from '../../../../../lib/prisma';
import { hash } from 'bcryptjs';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: { status?: number } = {}) => ({
      status: options.status || 200,
      json: () => Promise.resolve(data)
    })
  }
}));

// Mock the prisma client
jest.mock('../../../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
  },
}));

describe('Registration API', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    // Mock the request
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    });

    // Mock prisma responses
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('User registered successfully');
    expect(data.user).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(prisma.activityLog.create).toHaveBeenCalled();
  });

  it('should return 400 if email already exists', async () => {
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
      }),
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('User with this email already exists');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid email format', async () => {
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email address');
  });

  it('should return 400 for password too short', async () => {
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123',
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Password must be at least 8 characters');
  });

  it('should hash the password before storing', async () => {
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockImplementation(async (data) => {
      // Verify that the password is hashed
      const hashedPassword = data.data.password;
      expect(hashedPassword).not.toBe('password123');
      expect(await hash('password123', 12)).not.toBe(hashedPassword);
      return mockUser;
    });

    await POST(req);
    expect(prisma.user.create).toHaveBeenCalled();
  });
}); 