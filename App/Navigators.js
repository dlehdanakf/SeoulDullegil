import React, { Component } from 'react';
import {
  Scene, Router, Actions, Reducer, ActionConst,
} from 'react-native-router-flux';

import Home from './MainPage/Index';
import Tracking from './Tracking';
import CourseInfo from './Course/CourseInfo';

const MyNavigator = () => (
  <Router>
    <Scene key="root" headerMode="none">
      <Scene key="home" component={Home} />
        <Scene key="courseInfo" component={CourseInfo} />
        <Scene key="tracking" component={Tracking} />
    </Scene>
  </Router>
)

//export default SimpleStack;
export default MyNavigator;
