import { all, call, takeLatest, put } from 'redux-saga/effects';

import UserActions from '../user/UserActions';
import { clearCart } from './CartActions';

export function* clearCartOnSignOut() {
  yield put(clearCart());
}

export function* onSignOutSuccess() {
  yield takeLatest(UserActions.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

export default function* cartSagas() {
  yield all([call(onSignOutSuccess)]);
}
