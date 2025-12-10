import {
  UPDATE_FIELD_EDITOR,
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  ADD_TAG,
  REMOVE_TAG,
  ASYNC_START,
  ASYNC_END,
} from '../constants/actionTypes';

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

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FIELD_EDITOR:
      return { ...state, [action.key]: action.value };
    case EDITOR_PAGE_LOADED:
      if (!action.payload) {
        return initialState;
      }
      return {
        ...state,
        articleSlug: action.payload.slug || '',
        title: action.payload.title || '',
        description: action.payload.description || '',
        body: action.payload.body || '',
        tagList: action.payload.tagList || [],
      };
    case EDITOR_PAGE_UNLOADED:
      return initialState;
    case ADD_TAG:
      return {
        ...state,
        tagList: state.tagList.concat([action.tag]),
        tagInput: '',
      };
    case REMOVE_TAG:
      return {
        ...state,
        tagList: state.tagList.filter(tag => tag !== action.tag),
      };
    case ASYNC_START:
      if (action.subtype === 'EDITOR_SUBMIT') {
        return { ...state, inProgress: true };
      }
      return state;
    case ASYNC_END:
      return { ...state, inProgress: false };
    default:
      return state;
  }
};
