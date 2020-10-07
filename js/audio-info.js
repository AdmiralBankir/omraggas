'use strict';
var TIMECODE_LENGTH = 11;
var text = document.querySelector('.audio-info__text');
var infoBuffer = undefined;
var audioInfo = undefined;
var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

class AudioInfo {
    constructor(name) {
        this.name = name.substring(0, name.lastIndexOf('.')),
            this.currentTime = '00:00',
            this.duration = '00:00'
    }

    update(timeCode, duration) {
        var currentTime = formatSecondsAsTime(timeCode);
        var duration = formatSecondsAsTime(duration);

        if (currentTime !== this.currentTime) {
            this.currentTime = currentTime;
            this.duration = duration;
            return true;
        }

        return false;
    }

    printInfo() {
        return this.name + ' ' + this.printTime();
    }

    printTime() {
        return this.currentTime + '/' + this.duration;
    }
}

(function wrapText() {
    document.addEventListener('DOMContentLoaded', () => {
        wrap(text);
        infoBuffer = text.innerHTML;
    });
})();

export function updateAudioInfo(timeCode, duration) {
    if (audioInfo.update(timeCode, duration)) {
        updateTextContent();
    }
};

export function wrapAudioInfo(name) {
    audioInfo = new AudioInfo(name);
    text.innerHTML = audioInfo.printInfo();
    wrap(text);
};

export function toggleInfoActive() {
    var tmp = text.innerHTML;
    text.innerHTML = infoBuffer;
    infoBuffer = tmp;
};

function updateTextContent() {
    var time = audioInfo.printTime();
    var chars = text.querySelectorAll('span');
    var cnt = TIMECODE_LENGTH - 1;

    for (var i = chars.length - 1; i > (chars.length - TIMECODE_LENGTH); i--) {
        chars[i].textContent = time[cnt];
        cnt--;
    }
};

function wrap(txt) {
    if(!txt) return;

    var start = -90;
    var angle = 360;

    var characters = txt.innerHTML.split('');
    var step = angle / characters.length - 1;
    var radius = getRadius();

    txt.innerHTML = '';

    characters.forEach((item, index) => {
        buildItem(index);
    });

    function getRadius() {
        var root = document.querySelector(':root');
        var rootStyles = getComputedStyle(root);
        return parseFloat(rootStyles.getPropertyValue('--btn-size'), 10) - 20;
    };

    function buildItem(i) {
        var item = document.createElement('span');
        item.innerHTML = characters[i];
        txt.appendChild(item);
        var w = item.clientWidth;
        var h = item.clientHeight;
        var a = (start + step * i) * Math.PI / 180;
        item.style.left = centerX - w / 2 + radius * Math.sin(a) + 'px';
        item.style.top = centerY - h - radius * Math.cos(a) + 'px';
        item.style.transform = 'rotate(' + a + 'rad)';
    };
};


function formatSecondsAsTime(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    return min + ':' + sec;
}