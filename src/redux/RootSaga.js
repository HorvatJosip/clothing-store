import { all, call } from 'redux-saga/effects';

import ShopSagas from './shop/ShopSagas';
import UserSagas from './user/UserSagas';
import CartSagas from './cart/CartSagas';

export default function* rootSaga() {
  yield all([call(ShopSagas), call(UserSagas), call(CartSagas)]);
}
