import React, { Component } from 'react';
import {
  Scene, Router, Actions, Reducer, ActionConst,
} from 'react-native-router-flux';

import CourseInfo from './pages/CourseInfo.page';
import CourseMap from './pages/CourseMap.page';
import Tracking from './pages/Tracking';
import Home from './pages/Home'
import CourseList from './pages/CourseList.page'
import Main from './pages/Main.page';

const MyNavigator = () => (
    <Router>
        <Scene key="root" headerMode="none">
            <Scene key="home" component={Home} />
            <Scene key="tracking" component={Tracking} />
            <Scene key="course_map" component={CourseMap} />
            <Scene key="course_info" component={CourseInfo} />
            <Scene key="course_list" component={CourseList} />
        </Scene>
    </Router>
);

export default MyNavigator;
