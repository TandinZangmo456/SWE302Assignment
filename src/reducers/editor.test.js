import editorReducer from './editor';
import { UPDATE_FIELD_EDITOR, EDITOR_PAGE_LOADED, ADD_TAG, REMOVE_TAG, ASYNC_START } from '../constants/actionTypes';

describe('editor reducer', () => {
  const initialState = {
    articleSlug: '',
    title: '',
    description: '',
    body: '',
    tagInput: '',
    tagList: [],
    inProgress: false,
    errors: null,
  };

  it('should return initial state', () => {
    expect(editorReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle UPDATE_FIELD_EDITOR', () => {
    const action = {
      type: UPDATE_FIELD_EDITOR,
      key: 'title',
      value: 'New Article Title',
    };
    
    const newState = editorReducer(initialState, action);
    
    expect(newState.title).toBe('New Article Title');
  });

  it('should handle UPDATE_FIELD_EDITOR for body', () => {
    const action = {
      type: UPDATE_FIELD_EDITOR,
      key: 'body',
      value: 'Article body content',
    };
    
    const newState = editorReducer(initialState, action);
    
    expect(newState.body).toBe('Article body content');
  });

  it('should handle EDITOR_PAGE_LOADED for new article', () => {
    const action = {
      type: EDITOR_PAGE_LOADED,
    };
    
    const newState = editorReducer(initialState, action);
    
    expect(newState).toEqual(initialState);
  });

  it('should handle EDITOR_PAGE_LOADED for editing article', () => {
    const article = {
      slug: 'existing-article',
      title: 'Existing Title',
      description: 'Existing Description',
      body: 'Existing Body',
      tagList: ['react', 'redux'],
    };
    
    const action = {
      type: EDITOR_PAGE_LOADED,
      payload: article,
    };
    
    const newState = editorReducer(initialState, action);
    
    expect(newState.articleSlug).toBe('existing-article');
    expect(newState.title).toBe('Existing Title');
    expect(newState.description).toBe('Existing Description');
    expect(newState.body).toBe('Existing Body');
    expect(newState.tagList).toEqual(['react', 'redux']);
  });

  it('should handle ADD_TAG', () => {
    const stateWithTags = { ...initialState, tagInput: 'react', tagList: ['javascript'] };
    const action = {
      type: ADD_TAG,
      tag: 'react',
    };
    
    const newState = editorReducer(stateWithTags, action);
    
    expect(newState.tagList).toEqual(['javascript', 'react']);
    expect(newState.tagInput).toBe('');
  });

  it('should handle REMOVE_TAG', () => {
    const stateWithTags = { ...initialState, tagList: ['javascript', 'react', 'redux'] };
    const action = {
      type: REMOVE_TAG,
      tag: 'react',
    };
    
    const newState = editorReducer(stateWithTags, action);
    
    expect(newState.tagList).toEqual(['javascript', 'redux']);
  });

  it('should handle ASYNC_START', () => {
    const action = {
      type: ASYNC_START,
      subtype: 'EDITOR_SUBMIT',
    };
    
    const newState = editorReducer(initialState, action);
    
    expect(newState.inProgress).toBe(true);
  });
});
