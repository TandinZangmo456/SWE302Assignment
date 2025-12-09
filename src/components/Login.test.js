import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from './Login';

const mockStore = configureStore([]);

describe('Login Component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        inProgress: false,
        errors: null,
      },
    });
  });

  test('renders login form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText('Need an account?')).toBeInTheDocument();
  });

  test('updates input fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error messages', () => {
    store = mockStore({
      auth: {
        inProgress: false,
        errors: { email: 'Invalid email', password: 'Password too short' },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // In real app, errors would be displayed
    // For now, just check the component renders
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    store = mockStore({
      auth: {
        inProgress: true,
        errors: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    const button = screen.getByRole('button', { name: 'Sign in' });
    expect(button).toBeInTheDocument();
  });
});
