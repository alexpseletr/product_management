import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios');
jest.mock('./Login', () => () => <div data-testid="mocked-login">Mocked Login</div>);
jest.mock('./Products', () => () => <div data-testid="mocked-products">Mocked Products</div>);

describe('App Component', () => {
  test('render the login component', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('mocked-login')).toBeInTheDocument();
    });
  });
});
