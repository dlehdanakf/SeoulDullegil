'use strict';

import React from 'react';
import { StyleSheet } from 'react-native';

export default function(bgColor){
    return StyleSheet.create({
        statusBar: {
            backgroundColor: bgColor ? bgColor : '#368783',
        },
    });
}
