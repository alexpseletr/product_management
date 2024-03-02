import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Register from './Register';

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers user successfully', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({})
    });

    render(<Register onClickLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password' }
    });
    fireEvent.click(screen.getByTestId("button-register"));
    await waitFor(() => {
      expect(screen.getByText('Registered successfully! Please login.')).toBeInTheDocument();
    });
  });

  test('displays error if passwords do not match', async () => {
    render(<Register onClickLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'differentpassword' }
    });
    fireEvent.click(screen.getByTestId("button-register"));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  test('displays error if registration fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({})
    });

    render(<Register onClickLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password' }
    });
    fireEvent.click(screen.getByTestId("button-register"));

    await waitFor(() => {
      expect(screen.getByText('Failed to register')).toBeInTheDocument();
    });
  });
});
