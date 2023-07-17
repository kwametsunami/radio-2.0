# tr-1.fm - Discover and Play Radio Stations Around the World

[![Build Status](https://img.shields.io/github/workflow/status/kwametsunami/radio-2.0/CI)](https://github.com/kwametsunami/radio-2.0/actions)
[![License](https://img.shields.io/github/license/kwametsunami/radio-2.0)](https://github.com/kwametsunami/radio-2.0/blob/master/LICENSE)

tr-1.fm is a web application that allows users to discover and play radio stations from various countries around the world. The app utilizes the Radio-Browser API to access a wide range of radio stations. Users can listen to music, news, and more, immersing themselves in the diverse sounds of different cultures.

<img src="./src/assets/demo/tr1fm.gif" alt="screen recording of the tr-1.fm radio app ">

## Features

- Explore and search for radio stations based on country, language, and genre.
- Play radio stations in real-time using the React Player and React H5 Player libraries.
- Save favorite radio stations using Firebase authentication and database.
- Responsive design that works seamlessly across different devices.

## Live Demo

Check out the live demo of tr-1.fm [here](https://tr-1fm.netlify.app/).

## Installation and Usage

To run tr-1.fm locally on your machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/kwametsunami/radio-2.0.git
cd radio-2.0
```

2. Install dependencies:

`npm install`

3. Run the development server:

`npm start`

## Configuration

Before running the application, make sure to create a Firebase project and set up the required configuration. Rename the .env.example file to .env and replace the placeholder values with your Firebase configuration.

## Dependencies

The following dependencies are used in this project:

- [React Player](https://github.com/CookPete/react-player): A React component to play audio and video.
- [React H5 Player](https://github.com/dadioo/react-h5-audio-player): A customizable HTML5 audio player for React.

You can find the complete list of dependencies along with their versions in the `package.json` file.
