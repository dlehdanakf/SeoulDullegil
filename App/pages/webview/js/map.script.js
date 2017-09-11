document.addEventListener("DOMContentLoaded", function(){
    let polyline = null;


    let coursePath = [];
    let myLocationMarker = null;

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
    window.RNMessagesChannel.on('setMapCenter', e => {
        map.setCenter(
            new naver.maps.LatLng(e.y, e.x)
        );
    });
    window.RNMessagesChannel.on('setMapPath', e => {
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
    window.RNMessagesChannel.on('removeMapPath', () => {
        polyline.setMap(null);
    });


    window.RNMessagesChannel.on('center', ()=>{
        alert(map.getCenter().toString());
    });
});