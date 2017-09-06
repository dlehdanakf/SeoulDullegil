import React, { Component } from 'react';

export function GetJsonData(link){
  console.log('hello~');
  return fetch(link)
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson.list;
    })
    .catch((error) => {
      console.error(error);
    });
}
