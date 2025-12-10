import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Editor from './Editor';

const mockStore = configureStore([]);

describe('Editor Component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      editor: {
        articleSlug: '',
        title: '',
        description: '',
        body: '',
        tagInput: '',
        tagList: [],
        inProgress: false,
        errors: null,
      },
    });
  });

  test('renders form fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Editor />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's this article about?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your article (in markdown)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publish Article' })).toBeInTheDocument();
  });

  test('updates form fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Editor />
        </BrowserRouter>
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText('Article Title');
    const descriptionInput = screen.getByPlaceholderText("What's this article about?");
    const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(bodyInput, { target: { value: 'Test body content' } });

    expect(titleInput.value).toBe('Test Title');
    expect(descriptionInput.value).toBe('Test Description');
    expect(bodyInput.value).toBe('Test body content');
  });

  test('handles tag input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Editor />
        </BrowserRouter>
      </Provider>
    );

    const tagInput = screen.getByPlaceholderText('Enter tags');
    fireEvent.change(tagInput, { target: { value: 'react' } });
    
    expect(tagInput.value).toBe('react');
  });
});
