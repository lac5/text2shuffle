(async (window) => {
    'use strict';

    let {
        Array,
        document,
        location,
        speechSynthesis,
        SpeechSynthesisUtterance,
    } = window;

    var browser = browser || chrome;

    function getVoice(lang) {
        let voices = speechSynthesis.getVoices();
        let voice = null;

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].lang.startsWith(lang)) {
                voice = voices[i];
                break;
            }
        }

        if (!voice) {
            voice = voices[0] || null;
        }

        return voice;
    }

    function getText(selector) {
        return Array.from(document.querySelectorAll(selector)).map(e => e.textContent).join('\n\n');
    }

    async function isPlaying() {
        return (await browser.storage.sync.get('isPlaying')).isPlaying;
    }

    async function getSelector(url) {
        for (let line of String((await browser.storage.sync.get('urlList')).urlList).split(/\r?\n/g)) {
            line = line.split('$');
            if (line[0].trim() === url) {
                return (line[1] || '').trim() || 'body';
            }
        }
        return null;
    }

    async function nextUrl(url) {
        let urls = String((await browser.storage.sync.get('urlList')).urlList).split(/\r?\n/g).map(line => line.split('$')[0]);

        return urls[(urls.indexOf(url) + 1) % urls.length];
    }

    function speak(selector, lang) {
        let utter = new SpeechSynthesisUtterance();
        utter.rate = 1;
        utter.pitch = 0.5;
        utter.text = getText(selector);
        utter.voice = getVoice(lang);

        utter.onend = async function() {
            try {
                location.href = await nextUrl(location.href);
            } catch (e) {
                alert(e);
            }
        };

        speechSynthesis.speak(utter);
    }

    if (await isPlaying()) {
        let selector = await getSelector(location.href);
        if (selector) {
            speak(selector, 'en');
        }
    }
})(window).catch(e => alert(e));
