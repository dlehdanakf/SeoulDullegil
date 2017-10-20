document.addEventListener("DOMContentLoaded", function(){
    window.RNMessagesChannel.on('drawRoadInfo', e => {
        var imgWrap = document.getElementById("img_wrap");
        while(imgWrap.firstChild){ imgWrap.removeChild(imgWrap.firstChild); }

        if(e.img){
            var img = document.createElement("img");
            img.src = e.img;
            img.alt = 'IMAGE';

            imgWrap.appendChild(img);
        } else {
            var span = document.createElement("span");
            var text = document.createTextNode("이미지 없음");

            span.appendChild(text);
            imgWrap.appendChild(span);
        }

        var desc = document.getElementById("desc");
        desc.innerHTML = '';

        if(e.desc){
            var text = document.createTextNode(e.desc);
            desc.appendChild(text);
        }
    });
});