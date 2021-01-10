# House Of Chat

A Chat-app made with Expo and React Native for House Of Code.

## How to run

### The easy way

- Download Expo Cli from App Store or Google Play store.
- Scan the QR-code from [this website.](https://expo.io/@oordell/projects/HouseOfChat)

### From the code

- Make sure Expo cli is installed: `npm install --global expo-cli`
- Then download or clone this repository.
- Run: `npm i` in root of directory.
- Run `expo start`. This will lauch Metro Bundler in a Browser.
- Run in **simulators or emulators**:
  - To run the App on simulators or emulators they neew to be opened manually first, eg. form Android Studio or XCode. Then, in the terminal press `i` to launch the app in a iOS simulator and `a` to launch it in an Android emulator. These can also be launched from Metro Bundler in the browser.
- **Physical devices**. First download the Expo Cli from App Store or Google Play Store.
  - **Android**. Open the Expo and tap "Scan QR Code", to scan the QR code from the terminal or from Metro Bundler in the browser. This will automatically install and open the App.
  - **iOS**. Open the native camera app, and point the camera at the QR code from the terminal or from Metro Bundler in the browser. This will automatically install and open the App.

## Features

This is a chatting-app, where users can sign in with social media accounts, and chat in premade chat-rooms. The back-end is hosted by Firebase Authentication, -Storage and -Firestore.

- **Login**: Sign in with Facebook or Google. _Note that signing in with Facebook doesn't work on physical Android devices_.
- **List of chat rooms**: After signing in, a list of available chatrooms is presented, with a name, description and a timestamp of the last message in that room. On the top is the signed in users avatar and name. On the bottom is a button for signing out. Pressing on a chat room takes the user to the chat room.
- **Chat room**: Inside the chat room, the last 50 messages is loaded at first. 50 more can be loaded be scrolling to the top, at pressing a button.

  The user can send text messages, images or both at the same time. Images can be selected from the local storage, or from the devices camera (_physical devices only_). When an image is selected, a small version of the image is shown next to the text-input field. If the user regrets the image, it can be pressed to be deleted.

  The first time a user sends a message in the chat room, he or she is presented with a option to get notifications every time someone else posts a message in the chat room.

## Known issues

- Firebase Authentication with Facebook doesn't work with Expo in managed workflow. So users signing in with Facebook ared authenticated by Firebase.
- Sing in with Facebook doesn't work on physical Android devices for some reason.
