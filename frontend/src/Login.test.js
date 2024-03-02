import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './Login';

jest.mock('node-fetch');

describe('Login Component', () => {
  test('renders Login component', () => {
    const handleLoginMock = jest.fn();
    const handleRegisterMock = jest.fn();
    render(<Login onLogin={handleLoginMock} onRegister={handleRegisterMock}/>);
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  test('renders Register component when clicked on Register link', async () => {
    const handleLoginMock = jest.fn();
    const handleRegisterMock = jest.fn();
    render(<Login  onLogin={handleLoginMock} onRegister={handleRegisterMock}/>);
    fireEvent.click(screen.getByTestId('loginRegisterLink'));
    expect(screen.getByTestId('loginRegisterLink')).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  test('submits login form', async () => {
    const userData = { username: 'testuser', token: 'testtoken' };
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userData)
      })
    );
    global.fetch = fetchMock;
    const handleLoginMock = jest.fn();
    const handleRegisterMock = jest.fn();

    render(<Login onLogin={handleLoginMock} onRegister={handleRegisterMock}/>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: 'testuser', password: 'testpassword' })
      });
      expect(screen.queryByText('Invalid username or password.')).toBeNull();
    });
  });

  test('displays error message for invalid credentials', async () => {
    const errorResponse = { error: 'Invalid credentials' };
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(errorResponse)
      })
    );
    global.fetch = fetchMock;

    const handleLoginMock = jest.fn();
    const handleRegisterMock = jest.fn();

    render(<Login onLogin={handleLoginMock} onRegister={handleRegisterMock}/>);

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('displays error message for failed login', async () => {
    const errorResponse = { error: 'Failed to login' };
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(errorResponse)
      })
    );
    global.fetch = fetchMock;

    const handleLoginMock = jest.fn();
    const handleRegisterMock = jest.fn();

    render(<Login onLogin={handleLoginMock} onRegister={handleRegisterMock}/>);

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(screen.getByText('Failed to login')).toBeInTheDocument();
    });
  });
});
