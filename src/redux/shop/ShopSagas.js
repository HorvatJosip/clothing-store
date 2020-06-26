// takeEvery - listens for every action of a specific type we pass to it
// call:
//    Instead of calling the method directly, we defer control back to the saga middleware
//    In case it needs to cancel, saga can cancel it for us
// put - dispatching
import { takeEvery, call, put } from 'redux-saga/effects';

import {
  firestore,
  convertCollectionsSnapshotToMap,
} from '../../firebase/firebaseUtils';

import {
  fetchCollectionsSuccess,
  fetchCollectionsFailure,
} from './ShopActions';

import ShopActions from './ShopActions';

export function* fetchCollectionsAsync() {
  try {
    const collectionRef = firestore.collection('collections');

    // When this value comes back, it comes back in a promise form (similar to await)
    const snapshot = yield collectionRef.get();

    const collectionsMap = yield call(
      convertCollectionsSnapshotToMap,
      snapshot
    );

    yield put(fetchCollectionsSuccess(collectionsMap));
  } catch (error) {
    yield put(fetchCollectionsFailure(error));
  }
}

export function* fetchCollectionsStart() {
  yield takeEvery(ShopActions.FETCH_COLLECTIONS_START, fetchCollectionsAsync);
}
