import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { selectIsFetchingCollections } from '../../redux/shop/ShopSelectors';

import WithSpinner from '../WithSpinner/WithSpinner';
import CollectionsOverview from './CollectionsOverview';

const mapStateToProps = createStructuredSelector({
  // We must make sure that the name matches the property of WithSpinner HOC
  isLoading: selectIsFetchingCollections,
});

// compose will do it from bottom to top:
// CollectionsOverview will get passed into WithSpinner and then
// that component will be passed into connect
const CollectionsOverviewContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(CollectionsOverview);

export default CollectionsOverviewContainer;
