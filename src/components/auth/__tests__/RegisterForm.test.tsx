import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';

// Mock the onSubmit function
const mockOnSubmit = jest.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Check if all form fields are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
    
    // The onSubmit function should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates password requirements', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Fill in the form with a weak password
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'weak');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'weak');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for password validation errors
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
      expect(screen.getByText(/password must contain at least one special character/i)).toBeInTheDocument();
    });
    
    // The onSubmit function should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates that passwords match', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Fill in the form with mismatched passwords
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!!');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for password match validation error
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
    
    // The onSubmit function should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when validation passes', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });
    });
  });

  it('displays error message when onSubmit throws an error', async () => {
    // Mock onSubmit to throw an error
    const errorMessage = 'Registration failed';
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    
    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables the submit button when isLoading is true', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    // Check if the submit button is disabled
    expect(screen.getByRole('button', { name: /registering/i })).toBeDisabled();
  });
}); 