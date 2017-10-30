import React, { Component } from 'react';
import {
  Scene, Router, Actions, Reducer, ActionConst,
} from 'react-native-router-flux';

import Main from './pages/Main.page';
import CourseInfo from './pages/CourseInfo.page';
import CourseMap from './pages/CourseMap.page';
import Tracking from './pages/Tracking';
import Notice from './pages/Notice.page';
import Guide from './pages/Guide.page';
import Event from './pages/Event.page';

const MyNavigator = () => (
    <Router>
        <Scene key="root" headerMode="none">
            <Scene key="main" component={Main} />
            <Scene key="event" component={Event} />
            <Scene key="guide" component={Guide} />
            <Scene key="course_info" component={CourseInfo} />
            <Scene key="course_map" component={CourseMap} />
            <Scene key="tracking" component={Tracking} />
            <Scene key="notice" component={Notice} />
        </Scene>
    </Router>
);

export default MyNavigator;
