'use strict';

import {
    toggleTransparentText
} from './audio-info.js';

export function aboutAddObserver() {
    var options = {
        rootMargin: '-50%',
        threshold: 0
    }
    var callback = function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                toggleTransparentText();
            }
        });
    };

    var observer = new IntersectionObserver(callback, options);
    var target = getTarget();

    observer.observe(target);
};

function getTarget() {
    var lang = document.querySelector('html').getAttribute('lang');
    var texts = document.querySelectorAll('.lang--' + lang);
    return texts[texts.length - 1];
}