import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticlePreview from './ArticlePreview';

describe('ArticlePreview Component', () => {
  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'This is a test article description',
    author: {
      username: 'testauthor',
      image: 'https://example.com/image.jpg',
    },
    createdAt: '2023-01-01T00:00:00.000Z',
    favorited: false,
    favoritesCount: 5,
    tagList: ['react', 'testing', 'javascript'],
  };

  test('renders article data correctly', () => {
    render(
      <BrowserRouter>
        <ArticlePreview article={mockArticle} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test article description')).toBeInTheDocument();
    expect(screen.getByText('testauthor')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders favorite button', () => {
    render(
      <BrowserRouter>
        <ArticlePreview article={mockArticle} />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByText('5');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('author link navigates to profile', () => {
    render(
      <BrowserRouter>
        <ArticlePreview article={mockArticle} />
      </BrowserRouter>
    );

    const authorLink = screen.getByText('testauthor');
    expect(authorLink.closest('a')).toHaveAttribute('href', '/@testauthor');
  });

  test('article title link navigates to article', () => {
    render(
      <BrowserRouter>
        <ArticlePreview article={mockArticle} />
      </BrowserRouter>
    );

    const titleElement = screen.getByText('Test Article Title');
    expect(titleElement.closest('a')).toBeInTheDocument();
  });
});
