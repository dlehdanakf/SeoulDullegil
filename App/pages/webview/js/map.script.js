function onClickMarker(marker){

}


document.addEventListener("DOMContentLoaded", function(){
    const HOME_PATH = window.HOME_PATH || '.';
    let coursePath = [],
        enterancePath = [],
        enterancePin = [],
        majorPin = [],
        safetyPin = [],
        stampPin = [],
        myLocationMarker = null;

    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.566621, 126.978399),
        zoom: 8
    });

    window.RNMessagesChannel.on('setMyLocationPin', e => {
        if(myLocationMarker !== null) myLocationMarker.setMap(null);

        myLocationMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(e.y, e.x),
            map: map,
            icon: {
                content: "<span class='myLocPin'></span>",
                size: new naver.maps.Size(14, 14)
            },
        });
    });
    window.RNMessagesChannel.on('moveMapCenter', e => {
        map.setCenter(
            new naver.maps.LatLng(e[1], e[0])
        );
    });
    window.RNMessagesChannel.on('setCoursePath', e => {
        coursePath.map((v, i)=>{
            v.setMap(null);
        });

        e.map((v, i)=>{
            let path = [];
            v.map((val, idx)=>{
                path.push(new naver.maps.LatLng(val[1], val[0]));
            });

            coursePath.push(new naver.maps.Polyline({
                map: map,
                path: path,
                strokeColor: '#037fff',
                strokeOpacity: 0.9,
                strokeWeight: 6
            }));
        });
    });
    // window.RNMessagesChannel.on('removeCoursePath', () => {});
    window.RNMessagesChannel.on('setCourseEnterancePath', (e)=>{
        enterancePath.map((v, i)=>{v.setMap(null);});

        e.map((v, i) => {
            let path = [];
            v.COORD_DATA.map((val, idx)=>{
                path.push(new naver.maps.LatLng(val[1], val[0]));
            });

            enterancePath.push(new naver.maps.Polyline({
                map: map,
                path: path,
                strokeColor: '#037fff',
                strokeOpacity: 0.9,
                strokeWeight: 4,
                strokeStyle: 'shortdash',
            }));
        });
    });
    // window.RNMessagesChannel.on('removeCourseEnterancePath', ()=>{});
    window.RNMessagesChannel.on('setCourseEnterancePin', (e)=>{
        enterancePin.map((v, i) => { v.setMap(null) });

        e.map((v, i) => {
            enterancePin.push(new naver.maps.Marker({
                position: new naver.maps.LatLng(v.COORD[1], v.COORD[0]),
                icon: {
                    content: "<span class='pin enterance e" + (i+1) + "'><span></span></span>",
                    size: new naver.maps.Size(24, 37),
                    anchor: new naver.maps.Point(12, 37)
                },
                map: map,
            }));
        });
    });
    // window.RNMessagesChannel.on('removeCourseEnterancePin', ()=>{});
    window.RNMessagesChannel.on('setCourseMajorPin', (e)=>{
        majorPin.map((v, i) => { v.setMap(null) });

        e.map((v, i) => {
            majorPin.push(new naver.maps.Marker({
                position: new naver.maps.LatLng(v.COT_COORD_Y, v.COT_COORD_X),
                icon: {
                    content: "<span class='pin major'><span></span></span>",
                    size: new naver.maps.Size(24, 37),
                    anchor: new naver.maps.Point(12, 37)
                },
                map: map,
            }));
        });
    });
    // window.RNMessagesChannel.on('removeCourseMajorPin', ()=>{});
    window.RNMessagesChannel.on('setCourseSafetyPin', (e)=>{
        safetyPin.map((v, i) => { v.setMap(null) });

        e.map((v, i) => {
            safetyPin.push(new naver.maps.Marker({
                position: new naver.maps.LatLng(v.COT_COORD_Y, v.COT_COORD_X),
                icon: {
                    content: "<span class='pin safety e" + (i+1) + "'><span></span></span>",
                    size: new naver.maps.Size(24, 37),
                    anchor: new naver.maps.Point(12, 37)
                },
                map: map,
            }));
        });
    });
    // window.RNMessagesChannel.on('removeCourseSafetyPin', ()=>{});
    window.RNMessagesChannel.on('setCourseStampPin', (e)=>{
        stampPin.map((v, i) => { v.setMap(null) });

        e.map((v, i) => {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(v.COT_COORD_Y, v.COT_COORD_X),
                icon: {
                    content: "<span class='pin stamp e" + (i+1) + "'><span></span></span>",
                    size: new naver.maps.Size(24, 37),
                    anchor: new naver.maps.Point(12, 37)
                },
                map: map,
            });

            stampPin.push(marker);
            naver.maps.Event.addListener(marker, 'click', ()=>{
                stampPin.map((v, i)=>{
                    v.setOptions({
                        icon: {
                            content: "<span class='pin stamp e" + (i+1) + "'><span></span></span>",
                            size: new naver.maps.Size(24, 37),
                            anchor: new naver.maps.Point(12, 37)
                        }
                    });
                });
                marker.setOptions({
                    icon: {
                        content: "<span class='pin active stamp e" + (i+1) + "'><span></span></span>",
                        size: new naver.maps.Size(24, 37),
                        anchor: new naver.maps.Point(12, 37)
                    }
                });
                map.setCenter(marker.getOptions('position'));
            });
        });
    });
    // window.RNMessagesChannel.on('removeCourseStampPin', ()=>{});
    window.RNMessagesChannel.on('removeAllPinAndPath', ()=>{
        enterancePath.map((v, i) => v.setMap(null));
        enterancePin.map((v, i) => v.setMap(null));
        majorPin.map((v, i) => v.setMap(null));
        safetyPin.map((v, i) => v.setMap(null));
        stampPin.map((v, i) => v.setMap(null));
    });

    window.RNMessagesChannel.on('center', ()=>{
        alert(map.getCenter().toString());
    });
});