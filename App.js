/* eslint-disable no-alert */
import React from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { ListItem } from 'react-native-elements';
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';

// import SwipeCloseImage from 'react-native-swipe-close-image';

import styles from './styles';

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: 'ec193b71319e40fa9568a580e4358a6b',
});
process.nextTick = setImmediate;

const key = {};

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    predictions: [],
    chosenImage: null,
    language: null,
    output: null,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  capturePhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      return photo.uri;
    }
  };
  resize = async photo => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }], // Scale the photo
      { base64: true }
    );
    return manipulatedImage.base64;
  };
  predict = async image => {
    let predictions = await clarifai.models.predict(
      Clarifai.GENERAL_MODEL,
      image
    );
    return predictions;
  };
  objectDetection = async () => {
    let photo = await this.capturePhoto();
    let resized = await this.resize(photo);
    let predictions = await this.predict(resized);

    console.log(photo);
    this.setState({ chosenImage: photo });
    this.setState({ predictions: predictions.outputs[0].data.concepts });

    // const textToTranslate = predictions.outputs[0].data.concepts.join();
    // this.setState({ output: output });
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  // Function for camera roll
  _pickImage = async () => {
    this.getPermissionAsync();
    let selectedImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!selectedImage.cancelled) {
      this.setState({ chosenImage: selectedImage.uri });
      let resized = await this.resize(selectedImage.uri);
      let predictions = await this.predict(resized);

      console.log(selectedImage.uri);

      this.setState({ predictions: predictions.outputs[0].data.concepts });
    }
  };

  closeWindow = () => {
    this.setState({
      chosenImage: null,
    });
  };

  render() {
    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      'AIzaSyB5ip6KC-9KCIjO9Q7Rm47dYJDmOdjLgM0',
      'fr'
    );

    const { hasCameraPermission, predictions } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StatusBar hidden={true} />
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {/* Added ref */}
          <StatusBar hidden={true} />
          {!this.state.chosenImage && (
            <Camera
              ref={ref => {
                this.camera = ref;
              }}
              style={{ flex: 1 }}
              type={this.state.type}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                {/* bottom toolbar */}
                <Grid style={styles.bottomToolbar}>
                  <Row>
                    <Col style={styles.alignCenter}>
                      <TouchableOpacity>
                        <Ionicons
                          onPress={this._pickImage}
                          name="ios-photos"
                          color="white"
                          size={55}
                        />
                      </TouchableOpacity>
                    </Col>
                    <Col size={2} style={styles.alignCenter}>
                      <TouchableOpacity>
                        <Ionicons
                          onPress={this.objectDetection}
                          name="ios-camera"
                          color="white"
                          size={90}
                        />
                      </TouchableOpacity>
                    </Col>
                    <Col style={styles.alignCenter}>
                      <TouchableOpacity>
                        <Ionicons
                          name="md-reverse-camera"
                          color="white"
                          size={55}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Grid>
              </View>
            </Camera>
          )}

          {this.state.chosenImage && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <TouchableWithoutFeedback onPress={this.onPressImage}>
                <Image
                  ref={c => {
                    this.imageRef = c;
                  }}
                  source={{ uri: this.state.chosenImage }}
                  style={{ width: 300, height: 300 }}
                  resizeMode="contain"
                />
              </TouchableWithoutFeedback>

              <SwipeCloseImage
                // eslint-disable-next-line no-return-assign
                ref={c => (this.swipeToCloseRef = c)}
                imageSource={this.state.chosenImage}
              /> */}

              <PowerTranslator
                text={'A Confucian Revival Began'}
              />
              <PowerTranslator
                text={'Author: Confucianism'}
              />

              <FlatList
                style={{
                  flex: 1,
                  textAlign: 'center',
                  marginTop: '2%',
                }}
                data={
                  predictions.map((prediction, i) => ({
                    key: `${prediction.name.charAt(0).toUpperCase() +
                      prediction.name.slice(1)}:

                    `,
                  }))
                  // ${(prediction.value * 100).toFixed(1)}%`}
                }
                renderItem={({ item }) => (
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 20,
                    }}
                  >
                    {item.key}
                  </Text>
                )}
              />

              <TouchableOpacity>
                <Ionicons
                  onPress={this.closeWindow}
                  name="md-close"
                  color="black"
                  size={35}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }
  }
}
