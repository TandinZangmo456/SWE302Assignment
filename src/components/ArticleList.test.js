import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ArticleList from './ArticleList';

const mockStore = configureStore([]);

describe('ArticleList Component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      articleList: {
        articles: [],
        articlesCount: 0,
        currentPage: 0,
      },
    });
  });

  test('renders article list with empty articles array', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArticleList articles={[]} />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/No articles are here/)).toBeInTheDocument();
  });

  test('renders article list with multiple articles', () => {
    const mockArticles = [
      {
        slug: 'test-article-1',
        title: 'Test Article 1',
        description: 'Test description 1',
        author: { username: 'author1' },
        createdAt: '2023-01-01',
      },
      {
        slug: 'test-article-2',
        title: 'Test Article 2',
        description: 'Test description 2',
        author: { username: 'author2' },
        createdAt: '2023-01-02',
      },
    ];

    store = mockStore({
      articleList: {
        articles: mockArticles,
        articlesCount: 2,
        currentPage: 0,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArticleList articles={mockArticles} />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    store = mockStore({
      articleList: {
        articles: [],
        articlesCount: 0,
        currentPage: 0,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArticleList loading={true} />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/Loading articles/)).toBeInTheDocument();
  });
});
