import authReducer from './auth';
import { LOGIN, LOGOUT, REGISTER, ASYNC_START, ASYNC_END } from '../constants/actionTypes';

describe('auth reducer', () => {
  const initialState = {
    token: null,
    currentUser: null,
    inProgress: false,
    errors: null,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle LOGIN', () => {
    const action = {
      type: LOGIN,
      payload: { user: { email: 'test@test.com', token: 'jwt-token' } },
      error: null,
    };
    const newState = authReducer(initialState, action);
    
    expect(newState.token).toBe('jwt-token');
    expect(newState.currentUser.email).toBe('test@test.com');
    expect(newState.errors).toBeNull();
  });

  it('should handle LOGIN with errors', () => {
    const action = {
      type: LOGIN,
      error: true,
      payload: { errors: { email: 'Invalid email' } },
    };
    const newState = authReducer(initialState, action);
    
    expect(newState.errors).toEqual({ email: 'Invalid email' });
    expect(newState.token).toBeNull();
    expect(newState.currentUser).toBeNull();
  });

  it('should handle LOGOUT', () => {
    const stateWithUser = {
      token: 'jwt-token',
      currentUser: { email: 'test@test.com' },
      inProgress: false,
      errors: null,
    };
    
    const action = { type: LOGOUT };
    const newState = authReducer(stateWithUser, action);
    
    expect(newState.token).toBeNull();
    expect(newState.currentUser).toBeNull();
  });

  it('should handle REGISTER', () => {
    const action = {
      type: REGISTER,
      payload: { user: { username: 'newuser', email: 'new@test.com', token: 'new-token' } },
      error: null,
    };
    const newState = authReducer(initialState, action);
    
    expect(newState.token).toBe('new-token');
    expect(newState.currentUser.username).toBe('newuser');
    expect(newState.currentUser.email).toBe('new@test.com');
  });

  it('should handle ASYNC_START with auth action', () => {
    const action = {
      type: ASYNC_START,
      subtype: LOGIN,
    };
    const newState = authReducer(initialState, action);
    
    expect(newState.inProgress).toBe(true);
  });

  it('should handle ASYNC_END', () => {
    const stateInProgress = { ...initialState, inProgress: true };
    const action = { type: ASYNC_END };
    const newState = authReducer(stateInProgress, action);
    
    expect(newState.inProgress).toBe(false);
  });
});
