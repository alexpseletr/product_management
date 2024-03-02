import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Products from './Products';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ products: [], group: 'admin' }),
  })
);

describe('Products Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('handles product search successfully but empty', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ products: [], group: 'user' })
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);
    const { getByText } = render(<Products authToken="dummy-token" />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(getByText('No products available')).toBeInTheDocument();
  });

  it('does not handle editing product for non-admin user', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: [{ id: 1, name: 'Product 1', price: 10 }], group: 'user' }),
      })
    );

    const { queryByText } = render(<Products authToken="dummy-token" />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const editButton = queryByText('Save');
    expect(editButton).not.toBeInTheDocument();
  });
});
