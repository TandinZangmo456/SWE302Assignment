import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from './Header';

const mockStore = configureStore([]);

describe('Header Component', () => {
  test('shows navigation links for logged-in user', () => {
    const store = mockStore({
      auth: {
        token: 'mock-token',
        currentUser: {
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('conduit')).toBeInTheDocument();
  });

  test('shows navigation links for guest user', () => {
    const store = mockStore({
      auth: {
        token: null,
        currentUser: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});
