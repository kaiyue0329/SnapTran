# SnapTran

A visual translation mobile application that uses deep learning and image classification technology to recognize the different objects in a photo and translate them into 4 different languages

**Demo**: https://youtu.be/8xtcNXKKe4M

### Prerequisites

  * Expo app
  * Node.js

## Getting Started

**Fork** and clone this repository. Then
1) Visit https://www.clarifai.com/ and register for a free API key
2) Visit https://developers.google.com/places/web-service/get-api-key for instructions to get a Google API Key
3) Create a file in the top level of your directory, name it secret.js
4) Copy and paste the following line, filling in the info for Clarifai
```
export const clarifaiKey = 'your key here'
export const googleApiKey = 'your key here'
```
5) `npm install`
 
## Start

Running `expo start` will make great things happen!

Open Expo Client on your device. Use it to scan the QR code printed by `expo start`. You may have to wait a minute while your project bundles and loads for the first time.

## Built With

* [React Native] (https://facebook.github.io/react-native/) - Front end framework for developing the mobile app
* [Clarifai] (https://www.clarifai.com/) - Image recognition API used for recognizing objects and moods using camera
* [Google Translate API] (https://cloud.google.com/translate/) - API used for translating between languages

## Authors

* **Kaiyue Pan**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
