import { SET_PROFILE } from '../actions/profile';

const initState = {
  user: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
