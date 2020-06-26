import {
  firestore,
  convertCollectionsSnapshotToMap,
} from '../../firebase/firebaseUtils';

export const fetchCollectionsStart = () => ({
  type: NAMES.FETCH_COLLECTIONS_START,
});

export const fetchCollectionsSuccess = collectionsMap => ({
  type: NAMES.FETCH_COLLECTIONS_SUCCESS,
  payload: collectionsMap,
});

export const fetchCollectionsFailure = errorMessage => ({
  type: NAMES.FETCH_COLLECTIONS_FAILURE,
  payload: errorMessage,
});

export const fetchCollectionsStartAsync = () => dispatch => {
  dispatch(fetchCollectionsStart());

  const collectionRef = firestore.collection('collections');

  collectionRef
    .get()
    .then(async snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);

      dispatch(fetchCollectionsSuccess(collectionsMap));
    })
    .catch(error => dispatch(fetchCollectionsFailure(error)));
};

const NAMES = {
  FETCH_COLLECTIONS_START: 'FETCH_COLLECTIONS_START',
  FETCH_COLLECTIONS_SUCCESS: 'FETCH_COLLECTIONS_SUCCESS',
  FETCH_COLLECTIONS_FAILURE: 'FETCH_COLLECTIONS_FAILURE',
};

export default NAMES;
