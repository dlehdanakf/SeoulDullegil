import React, { Component } from 'react';
import {
  Scene, Router, Actions, Reducer, ActionConst,
} from 'react-native-router-flux';

import CourseInfo from './pages/CourseInfo.page';
import CourseMap from './pages/CourseMap.page';
import Tracking from './pages/Tracking';
import Notice from './pages/Notice.page';
import CourseList from './pages/CourseList.page';
import Guide from './pages/Guide.page';
import Home from './pages/Home.page';

const MyNavigator = () => (
    <Router>
        <Scene key="root" headerMode="none">
            <Scene key="notice" component={Notice} />
            <Scene key="home" component={Home} />
            <Scene key="guide" component={Guide} />
            <Scene key="notice" component={Notice} />
            <Scene key="tracking" component={Tracking} />
            <Scene key="course_map" component={CourseMap} />
            <Scene key="course_info" component={CourseInfo} />
            <Scene key="course_list" component={CourseList} />
        </Scene>
    </Router>
);

export default MyNavigator;
