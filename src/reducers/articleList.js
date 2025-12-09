import {
  ARTICLE_PAGE_LOADED,
  ARTICLE_PAGE_UNLOADED,
  SET_PAGE,
  APPLY_TAG_FILTER,
} from '../constants/actionTypes';

const initialState = {
  articles: [],
  articlesCount: 0,
  currentPage: 0,
  tab: 'all',
  tag: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ARTICLE_PAGE_LOADED:
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        tab: action.tab,
        tag: action.tag,
      };
    case ARTICLE_PAGE_UNLOADED:
      return initialState;
    case SET_PAGE:
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        currentPage: action.page,
      };
    case APPLY_TAG_FILTER:
      return {
        ...state,
        tag: action.tag,
        tab: 'tag',
        currentPage: 0,
      };
    default:
      return state;
  }
};
