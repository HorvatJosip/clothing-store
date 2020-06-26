// call:
//    Instead of calling the method directly, we defer control back to the saga middleware
//    In case it needs to cancel, saga can cancel it for us
// put - dispatching
import { takeLatest, all, call, put } from 'redux-saga/effects';

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
  yield takeLatest(ShopActions.FETCH_COLLECTIONS_START, fetchCollectionsAsync);
}

export default function* shopSagas() {
  yield all([call(fetchCollectionsStart)]);
}
