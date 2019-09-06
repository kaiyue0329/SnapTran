/* eslint-disable no-alert */
import React from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
} from 'react-native-power-translator';
import { clarifaiKey, googleApiKey } from './secret';

import styles from './styles';

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: clarifaiKey,
});
process.nextTick = setImmediate;

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    predictions: [],
    chosenImage: null,
    languageCode: 'fr',
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  // After getting permission to use the camera, code for capturing the photo
  capturePhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      return photo.uri;
    }
  };

  // Photo resized for optimization
  resize = async photo => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }], // Scale the photo
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  // Get the predictions from Clarifai
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
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  // Getting photos for the camera roll
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

  changeLanguage(languageCode) {
    this.setState({ languageCode: languageCode });
  }

  render() {
    // renders the camera and translation results

    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      googleApiKey,
      this.state.languageCode
    );
    const { hasCameraPermission, predictions } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View style={styles.noCamera}>
          <StatusBar hidden={true} />
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden={true} />
          {!this.state.chosenImage && (
            <Camera
              ref={ref => {
                this.camera = ref;
              }}
              style={{ flex: 1 }}
              type={this.state.type}
            >
              <View style={styles.container}>
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
                        <Ionicons name="md-pizza" color="white" size={55} />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Grid>
              </View>
            </Camera>
          )}

          {this.state.chosenImage && (
            <View style={styles.resultContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.languageBar}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.changeLanguage('fr');
                  }}
                >
                  <Text style={styles.p}>French</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.changeLanguage('es');
                  }}
                >
                  <Text style={styles.p}>Spanish</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.changeLanguage('de');
                  }}
                >
                  <Text style={styles.p}>German</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.changeLanguage('zh-CN');
                  }}
                >
                  <Text style={styles.p}>Chinese</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.changeLanguage('ko');
                  }}
                >
                  <Text style={styles.p}>Korean</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.changeLanguage('ja');
                  }}
                >
                  <Text style={styles.p}>Japanese</Text>
                </TouchableOpacity>
              </ScrollView>

              <FlatList
                style={{ width: '100%' }}
                data={
                  predictions.map(prediction => ({
                    key: `${prediction.name.charAt(0).toUpperCase() +
                      prediction.name.slice(1)}`,
                  }))
                  // ${(prediction.value * 100).toFixed(1)}%`}
                }
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <Text style={styles.english}>{item.key}</Text>
                    <PowerTranslator
                      style={styles.translation}
                      text={`${item.key}`}
                    />
                  </View>
                )}
              />

              <TouchableOpacity>
                <Ionicons
                  onPress={this.closeWindow}
                  name="md-close"
                  color="white"
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
