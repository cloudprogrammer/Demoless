import { UPDATE_THEME } from '../actions/theme';

const initState = {
  backgroundPrimary: '#f2f2f2',
  accent: '#ef5350',
  text: '#000',
  rowColor: '#fff',
  header: '#ef5350',
  gradient: '#FF6D6A',
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_THEME:
      return {
        ...state,
        backgroundPrimary: action.backgroundPrimary,
        accent: action.accent,
        text: action.text,
        header: action.header,
        rowColor: action.rowColor,
        gradient: action.gradient,
      };
    default:
      return state;
  }
};

export default reducer;
