import React, { Component } from 'react';
import {
  Scene, Router, Actions, Reducer, ActionConst,
} from 'react-native-router-flux';

// import Home from './MainPage/Index';
// import Tracking from './Tracking';
// import CourseInfo from './Course/CourseInfo';

import CourseInfo from './pages/CourseInfo.page';

const MyNavigator = () => (
  <Router>
      <Scene key="root" headerMode="none">
          <Scene key="home" component={CourseInfo} />
      </Scene>
  </Router>
);

export default MyNavigator;
