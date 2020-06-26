import { all, call } from 'redux-saga/effects';

import { fetchCollectionsStart } from './shop/ShopSagas';
import UserSagas from './user/UserSagas';

export default function* rootSaga() {
  yield all([call(fetchCollectionsStart), call(UserSagas)]);
}
