import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { selectAreCollectionsLoaded } from '../../redux/shop/ShopSelectors';
import WithSpinner from '../../components/WithSpinner/WithSpinner';
import CollectionPage from './CollectionPage';

const mapStateToProps = createStructuredSelector({
  isLoading: state => !selectAreCollectionsLoaded(state),
});

const CollectionPageContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(CollectionPage);

export default CollectionPageContainer;
