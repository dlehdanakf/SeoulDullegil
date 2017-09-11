document.addEventListener("DOMContentLoaded", function(){
    let polyline = null;
    let myLocationMarker = null;

    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.566621, 126.978399),
        zoom: 8
    });

    window.RNMessagesChannel.on('setMyLocation', e => {
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
        if(polyline !== null) polyline.setMap(null);

        let linePath = [];
        e.map((v, i)=>{
            linePath.push(new naver.maps.LatLng(v[1], v[0]));
        });

        polyline = new naver.maps.Polyline({
            map: map,
            path: linePath,
            strokeColor: '#037fff',
            strokeOpacity: 0.9,
            strokeWeight: 6
        });
    });
    window.RNMessagesChannel.on('removeMapPath', () => {
        polyline.setMap(null);
    });

    window.RNMessagesChannel.on('center', ()=>{
        alert(map.getCenter().toString());
    });
});