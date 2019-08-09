import React from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: 'ec193b71319e40fa9568a580e4358a6b',
});
process.nextTick = setImmediate;

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    predictions: [],
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
    console.log(photo);
    let resized = await this.resize(photo);
    let predictions = await this.predict(resized);
    this.setState({ predictions: predictions.outputs[0].data.concepts });
  };

  render() {
    const { hasCameraPermission, predictions } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {/* Added ref */}
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            {/* Switched to flexDirection 'column', added justifyContent:  */}
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {/* Added to component */}
              <View
                style={{
                  flex: 1,
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <FlatList
                  data={predictions.map(prediction => ({
                    key: `${prediction.name} ${prediction.value}`,
                  }))}
                  renderItem={({ item }) => (
                    <Text
                      style={{ paddingLeft: 15, color: 'white', fontSize: 20 }}
                    >
                      {item.key}
                    </Text>
                  )}
                />
              </View>

              {/* Removed alignedSelf, Added background Color and height   */}
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  backgroundColor: 'blue',
                  height: '10%',
                }}
                // Removed stuff after onPress
                onPress={this.objectDetection}
              >
                {/* Changed the styles */}
                <Text style={{ fontSize: 30, color: 'white', padding: 15 }}>
                  {/* deleted Flip */} Detect Objects{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
