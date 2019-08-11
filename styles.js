import { StyleSheet, Dimensions } from 'react-native';

const { width: winWidth } = Dimensions.get('window');

export default StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 100,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  translation: {
    fontSize: 20,
    lineHeight: 40,
    fontFamily: 'Avenir',
  },
  english: {
    fontSize: 25,
    lineHeight: 40,
    // width: 130,
    marginRight: 15,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
  },
  noCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 70,
  },
});
