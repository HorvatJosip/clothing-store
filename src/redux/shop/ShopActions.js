export const updateCollections = collectionsMap => ({
  type: NAMES.UPDATE_COLLECTIONS,
  payload: collectionsMap,
});

const NAMES = {
  UPDATE_COLLECTIONS: 'UPDATE_COLLECTIONS',
};

export default NAMES;
