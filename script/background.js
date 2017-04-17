soundManager.setup({
    // trade-off: higher UI responsiveness (play/progress bar), but may use more CPU.
    html5PollingInterval: 50,
    flashVersion: 9
});

var backgroundPlayer = (function (window, document, $, _control) {

    _control.currentSound = null;

    _control.playLink = function (url) {
        console.log("play --->" + url);
        soundManager.stopAll();
        _control.currentSound = soundManager.createSound({
            //id: 'aSound', // optional: provide your own unique id
            url: url,
            stream: true,
            // onload: function() { console.log('sound loaded!', this); }
            // other options here..
            whileplaying: function() {
                //var progressMaxLeft = 100,
                //    left,
                //    width;
                //
                //left = Math.min(progressMaxLeft, Math.max(0, (progressMaxLeft * (this.position / this.durationEstimate)))) + '%';
                //width = Math.min(100, Math.max(0, (100 * this.position / this.durationEstimate))) + '%';
                //
                //if (this.duration) {
                //
                //    dom.progress.style.left = left;
                //    dom.progressBar.style.width = width;
                //
                //    // TODO: only write changes
                //    dom.time.innerHTML = getTime(this.position, true);
                //
                //}
                var msgObj = {
                    id : "bgPlayerPlaying",
                    position : this.position,
                    duration : this.duration,
                    durationEstimate : this.durationEstimate

                };

                //chrome.runtime.sendMessage(extensionId, message, options, callback)
                chrome.runtime.sendMessage( msgObj/*, function(response){
                    console.log(response);
                }*/);
            },
            onbufferchange: function(isBuffering) {

                var msgObj = {
                    id : "bgPlayerOnbufferchange",
                    isBuffering : isBuffering

                };

                //if (isBuffering) {
                //    utils.css.add(dom.o, 'buffering');
                //} else {
                //    utils.css.remove(dom.o, 'buffering');
                //}

                chrome.runtime.sendMessage( msgObj);

            },

            onplay: function() {

                var msgObj = {
                    id : "bgPlayerOnplay"
                };
                //utils.css.swap(dom.o, 'paused', 'playing');
                chrome.runtime.sendMessage( msgObj);
                //callback('play');
            },

            onpause: function() {
                var msgObj = {
                    id : "bgPlayerOnpause"
                };
                chrome.runtime.sendMessage( msgObj);
                //utils.css.swap(dom.o, 'playing', 'paused');
            },

            onresume: function() {
                //utils.css.swap(dom.o, 'paused', 'playing');
                var msgObj = {
                    id : "bgPlayerOnresume"
                };
                console.log("bgPlayerOnresume");
                chrome.runtime.sendMessage(msgObj);

            },

           /* whileloading: function() {

                if (!this.isHTML5) {
                    dom.duration.innerHTML = getTime(this.durationEstimate, true);
                }

            },*/

            onload: function(ok) {

                var msgObj = {
                    id: "bgPlayerOnload",
                    ok: ok,
                    duration: this.duration
                };
                chrome.runtime.sendMessage(msgObj);

            },
            onerror: function() {
                var msgObj = {
                    id: "bgPlayerOnerror"
                };
                chrome.runtime.sendMessage(msgObj);
            },
            /*
            onerror: function() {

                // sound failed to load.
                var item, element, html;

                item = playlistController.getItem();

                if (item) {

                    // note error, delay 2 seconds and advance?
                    // playlistTarget.innerHTML = '<ul class="sm2-playlist-bd"><li>' + item.innerHTML + '</li></ul>';

                    if (extras.loadFailedCharacter) {
                        dom.playlistTarget.innerHTML = dom.playlistTarget.innerHTML.replace('<li>' ,'<li>' + extras.loadFailedCharacter + ' ');
                        if (playlistController.data.playlist && playlistController.data.playlist[playlistController.data.selectedIndex]) {
                            element = playlistController.data.playlist[playlistController.data.selectedIndex].getElementsByTagName('a')[0];
                            html = element.innerHTML;
                            if (html.indexOf(extras.loadFailedCharacter) === -1) {
                                element.innerHTML = extras.loadFailedCharacter + ' ' + html;
                            }
                        }
                    }

                }

                callback('error');

                // load next, possibly with delay.

                if (navigator.userAgent.match(/mobile/i)) {
                    // mobile will likely block the next play() call if there is a setTimeout() - so don't use one here.
                    actions.next();
                } else {
                    if (playlistController.data.timer) {
                        window.clearTimeout(playlistController.data.timer);
                    }
                    playlistController.data.timer = window.setTimeout(actions.next, 2000);
                }

            },
            */
            onstop: function() {

                //utils.css.remove(dom.o, 'playing');

                var msgObj = {
                    id: "bgPlayerOnstop"
                };
                chrome.runtime.sendMessage(msgObj);
            },

            onfinish: function() {

               /* var lastIndex, item;

                utils.css.remove(dom.o, 'playing');

                dom.progress.style.left = '0%';

                lastIndex = playlistController.data.selectedIndex;

                callback('finish');

                // next track?
                item = playlistController.getNext();

                // don't play the same item over and over again, if at end of playlist etc.
                if (item && playlistController.data.selectedIndex !== lastIndex) {

                    playlistController.select(item);

                    setTitle(item);

                    stopOtherSounds();

                    // play next
                    this.play({
                        url: playlistController.getURL()
                    });

                } else {

                    // end of playlist case

                    // explicitly stop?
                    // this.stop();

                    callback('end');

                }*/

                var msgObj = {
                    id: "bgPlayerOnfinish"
                };
                chrome.runtime.sendMessage(msgObj);
                this.destruct();

            }
        });

        _control.currentSound.play(/*{
            onfinish: function() {
                this.destruct();
            }
        }*/);

    };

    _control.sendDemo = function () {
        $.ajax({
            url: "http://music.163.com/weapi/search/suggest/web?csrf_token=",
            type: 'POST',
            data: {
                'params': "+v1R2FHaMHJbYvneTWaIofGm9F3Krk1uG8NhdiHR6XRI4tVrX3C+51xuFoQWq9Km1sg56b/nYiRmRqIm5b6Qzb5iwGUc2/XJj0fMh8FzrRw=",
                'encSecKey': "82e18d1525a88aed2b0b8c04c3dd865777449eafdbaba902fb31ab592d01bc5076250f6c8ca8657bcf0f1e7b01c467aba2e82d0fef1ecdb5686211a2fda7c3debe5b40931547fed5213a87bd028c44f07ed630968b8b02097a362d07687f6a250e52b7337935961f1eee64c4a06fee7f06a9c2d7ebfc5844cdcf10485a84d69b"
            },
            //beforeSend: function(request) {
            //    request.setRequestHeader("Referer", "http://music.163.com/");
            //},
            success: function (result) {
                alert(result);
                console.log(result);
            },
            error: function (result) {
                alert("server busy,please try it later!");
            }
        });
    };

    return _control;
})(window, document, $, window.backgroundPlayer || {});
//TODO
//function playSong(url) {
//    alert(url);
//}


chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.type === 'xmlhttprequest') {
            var existsRr = false, existsCT = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    existsRr = true;
                    details.requestHeaders[i].value = 'http://music.163.com';

                }
                /*else  if (details.requestHeaders[i].name === 'Content-Type') {
                 existsCT = true;
                 details.requestHeaders[i].value = 'application/x-www-form-urlencoded';
                 }*/
            }

            if (!existsRr) {
                details.requestHeaders.push({name: 'Referer', value: 'http://music.163.com'});
            }
            /*if (!existsCT) {
             details.requestHeaders.push({ name: 'Content-Type', value: 'application/x-www-form-urlencoded'});
             }*/

            return {requestHeaders: details.requestHeaders};
        }
    },
    {urls: ['http://music.163.com/*']},
    ["blocking", "requestHeaders"]
);


var consoleLog = console;











