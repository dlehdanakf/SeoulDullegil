document.addEventListener("DOMContentLoaded", function(){
    let polyline;

    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.566621, 126.978399),
        zoom: 8
    });

    window.RNMessagesChannel.on('text', text => {
        if(text === 'show'){
            polyline = new naver.maps.Polyline({
                map: map,
                path: linePath,
                strokeColor: '#ff0000',
                strokeOpacity: 0.9,
                strokeWeight: 4
            });
        } else {
            polyline.setMap(null);
        }
    });

    window.RNMessagesChannel.on('setMapCenter', e => {
        map.setCenter(
            new naver.maps.LatLng(e.y, e.x)
        );
    });
    window.RNMessagesChannel.on('setMapPath', e => {
        let linePath = [];
        e.map((v, i)=>{
            linePath.push(new naver.maps.LatLng(v[1], v[0]));
        });

        polyline = new naver.maps.Polyline({
            map: map,
            path: linePath,
            strokeColor: '#ff0000',
            strokeOpacity: 0.9,
            strokeWeight: 4
        });
    });
});