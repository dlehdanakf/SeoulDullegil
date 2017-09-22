import React, { Component } from 'react';
import {
  Scene, Router, Actions, Reducer, ActionConst,
} from 'react-native-router-flux';

// import Home from './MainPage/Index';
// import Tracking from './Tracking';
// import CourseInfo from './Course/CourseInfo';

import CourseInfo from './pages/CourseInfo.page';
import CourseMap from './pages/CourseMap.page';
import Tracking from './pages/Tracking';

const MyNavigator = () => (
  <Router>
      <Scene key="root" headerMode="none">
          <Scene key="tracking" component={Tracking} />
          <Scene key="course_map" component={CourseMap} />
          <Scene key="course_info" component={CourseInfo} />
      </Scene>
  </Router>
);

export default MyNavigator;
