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
    backgroundColor: '#232323',
  },
  p: {
    color: '#828280',
    lineHeight: 24,
    fontSize: 15,
    marginRight: '3%'
  },
  languageBar: {
    marginTop: '3%',
    paddingVertical: '5%',
    width: '100%'
  },
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  translation: {
    fontSize: 20,
    lineHeight: 40,
    fontFamily: 'Avenir',
    color: 'white',
  },
  english: {
    fontSize: 25,
    lineHeight: 40,
    marginRight: 15,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    color: 'white',
  },
  noCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 70,
  },
});
