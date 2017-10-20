'use strict';

import React from 'react';
import { StyleSheet } from 'react-native';

export default function(bgColor){
    return StyleSheet.create({
        statusBar: {
            backgroundColor: bgColor ? bgColor : '#368783',
        },
        navBar: {
            height: 46,
            backgroundColor: bgColor ? bgColor : '#368783',
            marginHorizontal: 0,
            borderBottomWidth: 0,
        },
        title: {
            fontSize: 17,
            letterSpacing: 0.5,
            fontWeight: "500",
            textAlign: "center",
            color: '#FFF',
            marginTop: 1,
        },
        backIcon: {
            color: '#FFF',
        },
        navBarButtons: {
            height: 46,
            width: 40,
            paddingVertical: 11,
            paddingHorizontal: 8,
        }
    });
}
