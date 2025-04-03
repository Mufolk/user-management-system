import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../page';
import { toast } from 'sonner';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the RegisterForm component
jest.mock('@/components/auth/RegisterForm', () => {
  return function MockRegisterForm({ onSubmit, isLoading }: any) {
    return (
      <form
        data-testid="register-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User',
          });
        }}
      >
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    );
  };
});

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders the registration page with title and description', () => {
    render(<RegisterPage />);
    
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your details below to create your account/i)).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/auth/signin');
  });

  it('handles successful registration', async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'User registered successfully' }),
    });

    render(<RegisterPage />);
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('register-form'));
    
    // Check if the API was called with the correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        }),
      });
    });
    
    // Check if success toast was shown
    expect(toast.success).toHaveBeenCalledWith('Registration successful! Please sign in.');
  });

  it('handles API error during registration', async () => {
    // Mock API error response
    const errorMessage = 'User with this email already exists';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    render(<RegisterPage />);
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('register-form'));
    
    // Check if error toast was shown with the correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('handles network error during registration', async () => {
    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<RegisterPage />);
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('register-form'));
    
    // Check if error toast was shown with the correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  it('handles unknown error during registration', async () => {
    // Mock unknown error
    mockFetch.mockRejectedValueOnce('Unknown error');

    render(<RegisterPage />);
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('register-form'));
    
    // Check if error toast was shown with the default error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
  });
}); 