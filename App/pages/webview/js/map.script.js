document.addEventListener("DOMContentLoaded", function(){
    const HOME_PATH = window.HOME_PATH || '.';
    let coursePath = [],
        enterancePath = [],
        enterancePin = [],
        majorPin = [],
        safetyPin = [],
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
            new naver.maps.LatLng(e.y, e.x)
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
    window.RNMessagesChannel.on('removeCoursePath', () => {
        coursePath.map((v, i)=>{
            v.setMap(null);
        });
    });
    window.RNMessagesChannel.on('setCourseEnterancePath', ()=>{});
    window.RNMessagesChannel.on('removeCourseEnterancePath', ()=>{});
    window.RNMessagesChannel.on('setCourseEnterancePin', ()=>{});
    window.RNMessagesChannel.on('removeCourseEnterancePin', ()=>{});
    window.RNMessagesChannel.on('setCourseMajorPin', (e)=>{
        majorPin.map((v, i) => { v.setMap(null) });

        e.map((v, i) => {
            majorPin.push(new naver.maps.Marker({
                position: new naver.maps.LatLng(v.COT_COORD_Y, v.COT_COORD_X),
                icon: {
                    content: "<span class='pin stamp'></span>",
                    size: new naver.maps.Size(24, 37),
                    anchor: new naver.maps.Point(12, 37)
                },
                map: map,
            }))
        });
    });
    window.RNMessagesChannel.on('removeCourseMajorPin', ()=>{});
    window.RNMessagesChannel.on('setCourseSafetyPin', ()=>{});
    window.RNMessagesChannel.on('setCourseSafetyPin', ()=>{});

    window.RNMessagesChannel.on('center', ()=>{
        alert(HOME_PATH);

        // alert(map.getCenter().toString());
    });
});