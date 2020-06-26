import ShopActions from './ShopActions';

const INITIAL_STATE = {
  collections: null,
  isFetching: false,
  errorMessage: null,
};

const ShopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ShopActions.FETCH_COLLECTIONS_START:
      return {
        ...state,
        isFetching: true,
      };

    case ShopActions.FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        collections: action.payload,
        errorMessage: null,
      };

    case ShopActions.FETCH_COLLECTIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload,
      };

    default:
      return state;
  }
};

export default ShopReducer;
