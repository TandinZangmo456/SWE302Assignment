import articleListReducer from './articleList';
import { ARTICLE_PAGE_LOADED, SET_PAGE, APPLY_TAG_FILTER, ASYNC_START } from '../constants/actionTypes';

describe('articleList reducer', () => {
  const initialState = {
    articles: [],
    articlesCount: 0,
    currentPage: 0,
    tab: 'all',
    tag: null,
  };

  it('should return initial state', () => {
    expect(articleListReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle ARTICLE_PAGE_LOADED', () => {
    const articles = [
      { slug: 'article-1', title: 'Article 1' },
      { slug: 'article-2', title: 'Article 2' },
    ];
    
    const action = {
      type: ARTICLE_PAGE_LOADED,
      payload: { articles, articlesCount: 10 },
      tab: 'all',
    };
    
    const newState = articleListReducer(initialState, action);
    
    expect(newState.articles).toEqual(articles);
    expect(newState.articlesCount).toBe(10);
    expect(newState.tab).toBe('all');
  });

  it('should handle ARTICLE_PAGE_LOADED with tag', () => {
    const action = {
      type: ARTICLE_PAGE_LOADED,
      payload: { articles: [], articlesCount: 0 },
      tab: 'tag',
      tag: 'react',
    };
    
    const newState = articleListReducer(initialState, action);
    
    expect(newState.tab).toBe('tag');
    expect(newState.tag).toBe('react');
  });

  it('should handle SET_PAGE', () => {
    const action = {
      type: SET_PAGE,
      payload: { articles: [{ slug: 'article-1' }], articlesCount: 1 },
      page: 2,
    };
    
    const newState = articleListReducer(initialState, action);
    
    expect(newState.currentPage).toBe(2);
    expect(newState.articles).toEqual([{ slug: 'article-1' }]);
    expect(newState.articlesCount).toBe(1);
  });

  it('should handle APPLY_TAG_FILTER', () => {
    const action = {
      type: APPLY_TAG_FILTER,
      tag: 'javascript',
    };
    
    const newState = articleListReducer(initialState, action);
    
    expect(newState.tag).toBe('javascript');
    expect(newState.tab).toBe('tag');
    expect(newState.currentPage).toBe(0);
  });

  it('should handle ASYNC_START with list subtype', () => {
    const action = {
      type: ASYNC_START,
      subtype: ARTICLE_PAGE_LOADED,
    };
    
    const newState = articleListReducer(initialState, action);
    
    expect(newState).toEqual(initialState); // Should not change state
  });
});
