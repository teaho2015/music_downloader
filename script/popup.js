/**
 *
 *
 *
 */

var bg = chrome.extension == undefined ? {} : chrome.extension.getBackgroundPage();
/*
 //bg.myPlayer.playLink("http://freshly-ground.com/data/audio/sm2/SonReal%20-%20Already%20There%20Remix%20ft.%20Rich%20Kidd%2C%20Saukrates.mp3");
 //http://freshly-ground.com/data/audio/sm2/SonReal%20-%20Already%20There%20Remix%20ft.%20Rich%20Kidd%2C%20Saukrates.mp3
 $(function () {
 //alert("");
 $("input#b_play").click(function () {
 var cache = $("input#songName").val();
 //alert(cache);
 bg.myPlayer.playLink(cache);
 });
 });
 */
//console.bgConsole = bg.console || {};
console.bgConsole = bg.console || window.console;

/*function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}*/


$(function(){

    window.searchers = [];
    $(".searcher").each(function(){
        searchers.push(new mdSearcher($(this).get(0)));

    });
    //window.mdSearcherInst = new mdSearcher($(".searcher").get(0));

    var playerInst = new mdPlayer($(".player").get(0));

    window.mdPlayerInst = playerInst;

    //window.mdSearcherInst.setPlayer(playerInst);



});

;(function (window, document, $) {
    "use strict";

    var constant = {
        searchListContent : "searchListContent",
        searchInputContent : "searchInputContent",

        type: {
            limitSearch : "limitSearch",
            cloudSearch : "cloudSearch",
            cloudSearchLoadMore : "cloudSearchLoadMore"

        }
    };


    var searcher = function (selectorStr) {

        var _searcher = {};
        var pager = {};


        //var SearchSelector = "";

        //_searcher.setSearcherSelector = function (selectorStr) {
        //    SearchSelector = selectorStr;
        //}

        var htmlContent = {
            loadMore : "<li class='dropdown load-more'><a class='text-center' href='javascript:;'>load more</a></li>"

        };

        var css = {
            class : {
                loadMore : "load-more"
            }

        };

        var jqDom = {
            songNameInput : null
        };

        _searcher.searcher_boy;


        function renderSearcherList(obj) {
            var pagerVO;
            if(obj && typeof obj.content == "string" && obj.content.length>0) {
                if (obj.type == constant.type.limitSearch) {
                    _searcher.searcher_boy.find(".nav").append(obj.content);
                    _searcher.searcher_boy.find("a.songDownload").click(function () {
                        utils.wangyi.limitSearch.getSongUrl($(this).attr("data-id"), $(this).attr("data-filename"), utils.wangyi.limitSearch.openSongUrl);

                    });
                    _searcher.searcher_boy.find("a.songPlay").click(function () {
                        utils.wangyi.limitSearch.getSongUrl($(this).attr("data-id"), "", utils.wangyi.limitSearch.listenSongUrl);

                    });
                } else if (obj.type == constant.type.cloudSearch || obj.type == constant.type.cloudSearchLoadMore) {
                    pagerVO = obj.pager || {};

                    pager = new Pager(pagerVO.offset, pagerVO.limit, pagerVO.total);
                    pager.setOutOfRangeCallback(pagerOutOfRange);

                    _searcher.searcher_boy.find(".nav").append(obj.content);

                    _searcher.searcher_boy.find("a.songDownload").click(function () {
                        utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), $(this).attr("data-filename"), utils.wangyi.cloudSearch.openSongUrl);

                    });
                    _searcher.searcher_boy.find("a.songPlay").click(function () {
                        utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), "", utils.wangyi.cloudSearch.listenSongUrl);

                    });

                    //load more
                    _searcher.searcher_boy.find("." + css.class.loadMore).click(function () {
                        utils.wangyi.cloudSearch.search(obj.searchWord, pager, function (result) {
                            var content = utils.wangyi.cloudSearch.resolveSearchData(result);

                            _searcher.searcher_boy.find("." + css.class.loadMore).before(content);
                            //console.bgConsole(result, "DEBUG");
                            _searcher.searcher_boy.find("a.songDownload").click(function () {
                                utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), $(this).attr("data-filename"), utils.wangyi.cloudSearch.openSongUrl);

                            });
                            _searcher.searcher_boy.find("a.songPlay").click(function () {
                                utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), "", utils.wangyi.cloudSearch.listenSongUrl);

                            });

                            var obj = {};
                            var s = "";
                            _searcher.searcher_boy.find(".nav li.dropdown").each(function (index, item) {
                                s += item.outerHTML;
                            });
                            obj[constant.searchListContent] = {
                                type:constant.type.cloudSearchLoadMore,
                                content: s,
                                pager: {
                                    limit: pager.getLimit(),
                                    total: pager.getTotal(),
                                    offset: pager.getOffset()
                                },
                                searchWord : obj.searchWord
                            };
                            utils.storage.setItem(obj);

                        });
                    });

                }


            }
        }

        function pagerOutOfRange () {
            var jq =  _searcher.searcher_boy.find("." + css.class.loadMore);
            //console.bgConsole(dom.find("a"), "WARN");
            jq.find("a").text("bottom!");
            jq.find("a").addClass("well");
            jq.find("a").css("margin-bottom", "0");
            jq.unbind("click");
        }

        function init() {
            _searcher.searcher_boy = $(selectorStr);

            jqDom.songNameInput = _searcher.searcher_boy.find("input[name='songName']");

            //var storageContent = localStorage.getItem("content");
            //if(storageContent) {
            //    renderSearcherList(storageContent);
            //}

            utils.storage.getItem(constant.searchListContent, renderSearcherList);

            utils.storage.getItem(constant.searchInputContent, function(content) {
                if(typeof content == "string" && content.length>0) {
                    jqDom.songNameInput.val(content);
                }
            });

            jqDom.songNameInput.bind('input propertychange', function () {

                var obj = {};
                obj[constant.searchInputContent] = $(this).val();
                utils.storage.setItem(obj);
                utils.wangyi.limitSearch.search($(this).val(), function (result) {
                    var content = utils.wangyi.limitSearch.resolveSearchData(result);
                    _searcher.searcher_boy.find(".nav>.dropdown").remove();

                    //localStorage.setItem("content", content);
                    var obj = {};
                    obj[constant.searchListContent] = {
                        type: constant.type.limitSearch,
                        content: content
                    };
                    utils.storage.setItem(obj);
                    renderSearcherList(obj[constant.searchListContent]);
                });


            });

            /* utils.wangyi.playList.search({}, {}, function (result) {
             //alert(chrome.downloads.download);
             for(var i in result.playlist.tracks) {
             var songArtists = "";
             for(var j in result.playlist.tracks[i].ar) {
             songArtists+= result.playlist.tracks[i].ar[j].name + "ft.";
             }
             songArtists = songArtists.substr(0, songArtists.length -3);
             utils.wangyi.playList.getSongUrl(result.playlist.tracks[i].id,  songArtists + " - " + result.playlist.tracks[i].name,  utils.wangyi.playList.downloadUrl);
             //sleep(10000);
             }
             });*/

            _searcher.searcher_boy.find("span.search-btn").bind('click', function () {

                var inValue = jqDom.songNameInput.val();
                pager = new Pager(-1, 30);
                pager.setOutOfRangeCallback(pagerOutOfRange);

                //TODO refactor
                utils.wangyi.cloudSearch.search(inValue, pager, function (result) {
                    var content = utils.wangyi.cloudSearch.resolveSearchData(result, htmlContent.loadMore, pager);
                    _searcher.searcher_boy.find(".nav>.dropdown").remove();
                    //console.bgConsole(result, "DEBUG");

                    _searcher.searcher_boy.find(".nav").append(content);

                    _searcher.searcher_boy.find("a.songDownload").click(function () {
                        utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), $(this).attr("data-filename"), utils.wangyi.cloudSearch.openSongUrl);

                    });
                    _searcher.searcher_boy.find("a.songPlay").click(function () {
                        utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), "", utils.wangyi.cloudSearch.listenSongUrl);

                    });

                    var obj = {};
                    obj[constant.searchListContent] = {
                        type : constant.type.cloudSearch,
                        content : content,
                        pager : {
                            limit: pager.getLimit(),
                            total: pager.getTotal(),
                            offset: pager.getOffset()

                        },
                        searchWord: inValue
                    };
                    utils.storage.setItem(obj);

                    _searcher.searcher_boy.find("." + css.class.loadMore).click(function () {
                        console.bgConsole.debug("loadmore click");
                        utils.wangyi.cloudSearch.search(inValue, pager, function (result) {
                            var content = utils.wangyi.cloudSearch.resolveSearchData(result);
                            //_searcher.searcher_boy.find(".nav>.dropdown").remove();

                            _searcher.searcher_boy.find("." + css.class.loadMore).before(content);
                            //console.bgConsole(result, "DEBUG");
                            //_searcher.searcher_boy.find(".nav").append(content);
                            _searcher.searcher_boy.find("a.songDownload").click(function () {
                                utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), $(this).attr("data-filename"), utils.wangyi.cloudSearch.openSongUrl);

                            });
                            _searcher.searcher_boy.find("a.songPlay").click(function () {
                                utils.wangyi.cloudSearch.getSongUrl($(this).attr("data-id"), "", utils.wangyi.cloudSearch.listenSongUrl);

                            });

                            var obj = {};
                            var s = "";
                            _searcher.searcher_boy.find(".nav li.dropdown").each(function (index, item) {
                                s+= item.outerHTML;
                            });


                            console.log("load more pager", pager);
                            obj[constant.searchListContent] = {
                                type : constant.type.cloudSearchLoadMore,
                                content : s,
                                searchWord: inValue,
                                pager : {
                                    limit: pager.getLimit(),
                                    total: pager.getTotal(),
                                    offset: pager.getOffset()

                                }
                            };
                            utils.storage.setItem(obj);

                        });
                    });
                });



            });
        }

        init();

        return _searcher;
    };


    var utils = (function (window, document, $, _control) {
        _control.wangyi = {
            limitSearch: {

                search: function (word, callback) {
                    var DEFAULT_BR = 128e3;
                    // console.log(Ka.emj);
                    var bbZ = function (bOP) {
                        var bp = [];
                        cv(bOP, function (bOO) {
                            bp.push(Ka.emj[bOO])
                        });
                        return bp.join("")
                    };

                    var url = "/api/search/suggest/web";
                    var searchData = send(url, {
                        type: "json",
                        data: "s=" + encodeURI(word) + "&limit=20", // ids: JSON.stringify([this.dz.id]),

                        onload: function () {
                            alert("onload Yes")
                        },
                        ornerror: function () {
                            alert("on error")
                        }
                    }, bbZ);
                    console.bgConsole.debug(searchData);
                    //console.bgConsole(url, "DEBUG");
                    //console.bgConsole(callback, "DEBUG");
                    ajaxSend(searchData.url, searchData.data, callback);
                },
                resolveSearchData: function (result) {
                    //console.bgConsole("Start resolveSearchData!", "DEBUG");
                    if (result.code != 200) {
                        console.bgConsole.warn("wrong keywords!");
                        return "";
                    }
                    if (result.result.songs == undefined || result.result.songs.length == 0) {
                        console.bgConsole.warn("Song doesn't exist (or could not get more in server)!");
                        return "";
                    }
                    var content = "";
                    console.bgConsole.debug("Start generating html content!");
                    for (var i = 0; i < result.result.songs.length; i++) {
                        var song = result.result.songs[i];
                        var songArtists = "";
                        for(var j in song.artists) {
                            songArtists+= song.artists[j].name + "ft.";
                        }
                        songArtists = songArtists.substr(0, songArtists.length -3);
                        content += "<li class='dropdown'>";
                        content += " <a id='song" + i + "' href='#' class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                        content += "<span class='glyphicon glyphicon-music'></span> " + song.name + " - " + songArtists;
                        content += "<span class='caret'></span>";
                        content += "</a>";
                        content += "<ul id='menu" + i + "' class='dropdown-menu' role='menu' aria-labelledby='song" + i + "'>";
                        content += "<li ><a class='songDownload' role='menuitem' tabindex='-1' data-id='" + song.id + "' data-filename='"+ song.artists[0].name + " - " + song.name + "' href='javascript:void(0);'>" + "<span class='glyphicon glyphicon-download'></span>" + " download</a></li>";
                        /*javascript:utils.wangyi.getSongUrl(" + song.id + ",utils.wangyi.openSongUrl)*/
                        content += "<li ><a class='songPlay' role='menuitem' tabindex='-1' data-id='" + song.id + "' href='javascript:void(0);'>" + "<span class='glyphicon glyphicon-headphones'></span>" + " play</a></li>";
                        //content += "";<li class='divider'></li>
                        content += "</ul>";
                        content += "</li>";
                    }
                    console.bgConsole.debug(content);
                    return content;
                },
                getSongUrl: function (songid, songname, _callback) {
                    console.bgConsole.debug("getSongUrl " + songid);
                    var DEFAULT_BR = 128e3;
                    // console.log(Ka.emj);
                    var bbZ = function (bOP) {
                        var bp = [];
                        cv(bOP, function (bOO) {
                            bp.push(Ka.emj[bOO])
                        });
                        return bp.join("")
                    };

                    var url = "/api/song/enhance/player/url";
                    var searchData = send(url, {
                        type: "json",
                        query: {
                            ids: JSON.stringify([songid]),// ids: JSON.stringify([this.dz.id]),
                            br: DEFAULT_BR
                        },
                        onload: function () {
                            alert("onload Yes")
                        },
                        ornerror: function () {
                            alert("on error")
                        }
                    }, bbZ);
                    //console.bgConsole(searchData, "DEBUG");
                    ajaxSend(searchData.url, searchData.data, function (result) {
                        console.bgConsole.debug("Downloading song:" + songid, _callback(result,songname));
                    });
                },
                openSongUrl: function (result, filename) {
                    if (result.code == 200) {
                        //console.bgConsole("Download song!", "DEBUG");
                        //window.open(result.data[0].url, "_blank");
                        chrome.downloads.download({
                            url : result.data[0].url,
                            filename: filename + "." + result.data[0].type,
                            conflictAction: "prompt",
                            saveAs: true,
                            method: "GET"
                            //headers: 自定义header数组,
                            //    body: POST的数据
                        });

                    }
                },
                listenSongUrl: function (result) {
                    if (result.code == 200) {

                        bg.backgroundPlayer.playLink(result.data[0].url);
                    }
                }
            },
            cloudSearch: {
                search: function (word, pager, callback) {
                    var DEFAULT_BR = 128e3;
                    // console.log(Ka.emj);
                    var bbZ = function (bOP) {
                        var bp = [];
                        cv(bOP, function (bOO) {
                            bp.push(Ka.emj[bOO])
                        });
                        return bp.join("")
                    };
                    console.bgConsole.debug("cloudsearch");
                    var url = "/api/cloudsearch/get/web";
                    try{
                        var searchData = send(url, {
                            type: "json",
                            data: "hlpretag=%3Cspan%20class%3D%22s-fc7%22%3E&hlposttag=%3C%2Fspan%3E&%23%2F=&s=" + encodeURI(word) + "&type=1&offset="+ pager.getNextOffset() +"&total=true&limit=" + pager.getLimit(), // ids: JSON.stringify([this.dz.id]),

                            onload: function () {
                                alert("onload Yes")
                            },
                            ornerror: function () {
                                alert("on error")
                            }
                        }, bbZ);
                    } catch(e) {
                        console.bgConsole.warn(e.toString());
                        return;
                    } finally {


                    }
                    console.bgConsole.debug(searchData);
                    //console.bgConsole(url, "DEBUG");
                    //console.bgConsole(callback, "DEBUG");
                    ajaxSend(searchData.url, searchData.data, callback);
                },
                resolveSearchData: function (result, addmore, pager) { //TODO refactor to regex
                    console.bgConsole.debug("Start resolveSearchData!");
                    if (result.code != 200) {
                        console.bgConsole.warn("wrong keywords!");
                        return "";
                    }
                    if (result.result.songs == undefined || result.result.songs.length == 0) {
                        console.bgConsole.warn("songs don't exist!");
                        return "";
                    }

                    //if(pager !== undefined && pager instanceof Pager ) {
                    if(pager) {
                        console.bgConsole.debug("cloudSearch.resolveSearchData() result get this round total : "+ result.result.songCount);
                        pager.setTotal(result.result.songCount);

                    }
                    var content = "";
                    console.bgConsole.debug("Start generating html content!");
                    for (var i = 0; i < result.result.songs.length; i++) {
                        var song = result.result.songs[i];
                        var songArtists = "";
                        for(var j in song.ar) {
                            songArtists+= song.ar[j].name + "ft.";
                        }
                        songArtists = songArtists.substr(0, songArtists.length -3);
                        content += "<li class='dropdown'>";
                        content += " <a id='song" + i + "' href='javascript:void(0);' class='dropdown-toggle "+ (song.privilege.subp==0?"disabled":"") +"' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                        content += "<span class='glyphicon glyphicon-music'></span> " + song.name + " - " + songArtists;
                        content += "<span class='caret'></span>";
                        content += "</a>";
                        content += "<ul id='menu" + i + "' class='dropdown-menu' role='menu' aria-labelledby='song" + i + "'>";
                        content += "<li ><a class='songDownload' role='menuitem' tabindex='-1' data-id='" + song.id + "' data-filename='" + songArtists + " - " + song.name + "' href='javascript:void(0);'>" + "<span class='glyphicon glyphicon-download'></span>" + " download</a></li>";
                        /*javascript:utils.wangyi.getSongUrl(" + song.id + ",utils.wangyi.openSongUrl)*/
                        content += "<li ><a class='songPlay' role='menuitem' tabindex='-1' data-id='" + song.id + "' href='javascript:void(0);'>" + "<span class='glyphicon glyphicon-headphones'></span>" + " play</a></li>";
                        //content += "";<li class='divider'></li>
                        content += "</ul>";
                        content += "</li>";
                    }
                    content += addmore==undefined? "" : addmore;
                    //console.bgConsole.debug(content);
                    return content;
                },
                getSongUrl: function (songid, filename, _callback) {
                    console.bgConsole.debug("getSongUrl " + songid);
                    var DEFAULT_BR = 128e3;
                    // console.log(Ka.emj);
                    var bbZ = function (bOP) {
                        var bp = [];
                        cv(bOP, function (bOO) {
                            bp.push(Ka.emj[bOO])
                        });
                        return bp.join("")
                    };

                    var url = "/api/song/enhance/player/url";
                    var searchData = send(url, {
                        type: "json",
                        query: {
                            ids: JSON.stringify([songid]),// ids: JSON.stringify([this.dz.id]),
                            br: DEFAULT_BR
                        },
                        onload: function () {
                            alert("onload Yes")
                        },
                        ornerror: function () {
                            alert("on error")
                        }
                    }, bbZ);
                    //console.bgConsole(searchData, "DEBUG");
                    ajaxSend(searchData.url, searchData.data, function (result) {
                        console.bgConsole.log("Downloading song:" + songid, _callback(result, filename));
                    });
                },
                openSongUrl: function (result, filename) {
                    if (result.code == 200) {
                        //console.bgConsole("Download song!", "DEBUG");
                        //window.open(result.data[0].url, "_blank");
                        chrome.downloads.download({
                            url : result.data[0].url,
                            filename: filename + "." + result.data[0].type,
                            conflictAction: "overwrite",
                            saveAs: false,
                            method: "GET"
                            //headers: 自定义header数组,
                            //    body: POST的数据
                        });

                    }
                },

                listenSongUrl: function (result) {
                    if (result.code == 200) {
                        //console.bgConsole("Download song!", "DEBUG");

                        bg.backgroundPlayer.playLink(result.data[0].url);

                    }
                }
            },
            playList: {
                search: function (word, pager, callback) {
                    var DEFAULT_BR = 128e3;
                    // console.log(Ka.emj);
                    var bbZ = function (bOP) {
                        var bp = [];
                        cv(bOP, function (bOO) {
                            bp.push(Ka.emj[bOO])
                        });
                        return bp.join("")
                    };
                    console.bgConsole.debug("playList");
                    var url = "/api/v3/playlist/detail"; // /api/cloudsearch/get/web
                    try{
                        var searchData = send(url, {
                            type: "json",
                            data: "id=569020058&offset=0&total=true&limit=1000&n=1000", // id=569020058&offset=0&total=true&limit=1000&n=1000

                            onload: function () {
                                alert("onload Yes")
                            },
                            ornerror: function () {
                                alert("on error")
                            }
                        }, bbZ);
                    } catch(e) {
                        console.bgConsole.warn(e.toString());
                        return;
                    } finally {


                    }
                    console.bgConsole.debug(searchData);
                    //console.bgConsole(url, "DEBUG");
                    //console.bgConsole(callback, "DEBUG");
                    ajaxSend(searchData.url, searchData.data, callback);
                },
                resolveSearchData: function (result, addmore, pager) { //TODO refactor to regex
                    console.bgConsole.debug("Start resolveSearchData!");
                    if (result.code != 200) {
                        console.bgConsole.warn("wrong keywords!");
                        return "";
                    }
                    if (result.result.songs == undefined || result.result.songs.length == 0) {
                        console.bgConsole.warn("songs don't exist!" );
                        return "";
                    }

                    if(pager !== undefined ) {
                        console.bgConsole.debug("get total : "+ result.result.songCount);
                        pager.setTotal(result.result.songCount);

                    }
                    var content = "";
                    console.bgConsole.debug("Start generating html content!");
                    for (var i = 0; i < result.result.songs.length; i++) {
                        var song = result.result.songs[i];
                        content += "<li class='dropdown'>";
                        content += " <a id='song" + i + "' href='#' class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                        content += "<span class='glyphicon glyphicon-music'></span> " + song.name + " - " + song.ar[0].name;
                        content += "<span class='caret'></span>";
                        content += "</a>";
                        content += "<ul id='menu" + i + "' class='dropdown-menu' role='menu' aria-labelledby='song" + i + "'>";
                        content += "<li ><a class='songDownload' role='menuitem' tabindex='-1' data-id='" + song.id + "' href='javascript:void(0);'>" + "<span class='glyphicon glyphicon-download'></span>" + " download</a></li>";
                        content += "<li ><a class='songPlay' role='menuitem' tabindex='-1' data-id='" + song.id + "' href='javascript:void(0);'>" + "<span class='glyphicon glyphicon-headphones'></span>" + " play</a></li>";
                        //content += "";<li class='divider'></li>
                        content += "</ul>";
                        content += "</li>";
                    }
                    content += addmore==undefined? "" : addmore;
                    console.bgConsole.debug(content);
                    return content;
                },

                getSongUrl: function (songid, filename, _callback) {
                    console.bgConsole.debug("getSongUrl " + songid);
                    var DEFAULT_BR = 128e3;
                    // console.log(Ka.emj);
                    var bbZ = function (bOP) {
                        var bp = [];
                        cv(bOP, function (bOO) {
                            bp.push(Ka.emj[bOO])
                        });
                        return bp.join("")
                    };

                    var url = "/api/song/enhance/player/url";
                    var searchData = send(url, {
                        type: "json",
                        query: {
                            ids: JSON.stringify([songid]),// ids: JSON.stringify([this.dz.id]),
                            br: DEFAULT_BR
                        },
                        onload: function () {
                            alert("onload Yes")
                        },
                        ornerror: function () {
                            alert("on error")
                        }
                    }, bbZ);
                    //console.bgConsole(searchData, "DEBUG");
                    ajaxSend(searchData.url, searchData.data, function (result) {
                        console.bgConsole("Downloading song:" + songid, _callback(filename, result));
                    });
                },
                downloadUrl : function (filename, result) {
                    if (result.code == 200) {
                        //console.bgConsole("Download song!", "DEBUG");
                        //window.open(result.data[0].url, "_blank");
                        chrome.downloads.download({
                            url : result.data[0].url,
                            filename: filename + "." + result.data[0].type,
                            conflictAction: "overwrite",
                            saveAs: false,
                            method: "GET"
                            //headers: 自定义header数组,
                            //    body: POST的数据
                        });

                    }
                }

                /*,
                openSongUrl: function (result) {
                    if (result.code == 200) {
                        //console.bgConsole("Download song!", "DEBUG");
                        window.open(result.data[0].url, "_blank");
                    }
                },

                listenSongUrl: function (result) {
                    if (result.code == 200) {
                        //console.bgConsole("Download song!", "DEBUG");

                        bg.backgroundPlayer.playLink(result.data[0].url);
                    }
                }*/
            }


        };
        var send;
        var bON = send;
        // bA.cG
        send = function (bZ, bf, bbZ) {
            var bl = {}
                , bf = NEJ.X({}, bf)
                , mb = -1;
            // , mb = -1;
            // if (/(^|\.com)\/api/.test(bZ) && !(bf.headers && bf.headers[fm.yY] == fm.Ca) && !bf.noEnc) {
            if (mb != -1) {
                bl = iO(bZ.substring(mb + 1));
                bZ = bZ.substring(0, mb)
            }
            if (bf.query) {
                bl = NEJ.X(bl, gH(bf.query) ? iO(bf.query) : bf.query)
            }
            if (bf.data) {
                bl = NEJ.X(bl, gH(bf.data) ? iO(bf.data) : bf.data)
            }
            // bl["csrf_token"] = bA.hI("__csrf");
            bl["csrf_token"] = "";
            bZ = bZ.replace("api", "weapi");
            bf.method = "post";
            delete bf.query;
            var bua = window.asrsea(JSON.stringify(bl), bbZ(["流泪", "强"]), bbZ(Ka.md), bbZ(["爱心", "女孩", "惊恐", "大笑"]));
            bf.data = eX({
                params: bua.encText,
                encSecKey: bua.encSecKey
            });

            return {url: bZ, data: bua};

        };

        var ajaxSend = function (url, data, _callback) {
            var resultJSON;
            $.ajax({
                url: "http://music.163.com" + url,
                type: 'POST',
                //async:false,
                data: {
                    'params': data.encText,
                    'encSecKey': data.encSecKey
                },
                //beforeSend: function(request) {
                //    request.setRequestHeader("Referer", "http://music.163.com/");
                //},
                success: function (result) {
                    //resultJSON = JSON.parse(result);
                    //alert(result);
                    //console.log();
                    console.bgConsole.debug(JSON.parse(result));
                    if (_callback != undefined) {
                        _callback(JSON.parse(result));
                    }

                },
                error: function (result) {
                    console.bgConsole.warn(result + "======>" + "server busy,please try it later!");
                }
            });
            //return resultJSON;
        };

        //_control.css = {
        //    swapClass : function(o, class1, class2) {
        //        o.addClass(class1);
        //        o.rem
        //    }
        //};

        _control.position = (function() {

            function getOffX(o) {

                // http://www.xs4all.nl/~ppk/js/findpos.html
                var curleft = 0;

                if (o.offsetParent) {

                    while (o.offsetParent) {

                        curleft += o.offsetLeft;

                        o = o.offsetParent;

                    }

                } else if (o.x) {

                    curleft += o.x;

                }

                return curleft;

            }

            function getOffY(o) {

                // http://www.xs4all.nl/~ppk/js/findpos.html
                var curtop = 0;

                if (o.offsetParent) {

                    while (o.offsetParent) {

                        curtop += o.offsetTop;

                        o = o.offsetParent;

                    }

                } else if (o.y) {

                    curtop += o.y;

                }

                return curtop;

            }

            return {
                getOffX: getOffX,
                getOffY: getOffY
            };

        }());

        _control.events = (function () {
            var preventDefault = function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    e.cancelBubble = true;
                }
                return false;
            };

            var isRightClick = function (e) {
                // only pay attention to left clicks. old IE differs where there's no e.which, but e.button is 1 on left click.
                if (e && ((e.which && e.which === 2) || (e.which === undefined && e.button !== 1))) {
                    // http://www.quirksmode.org/js/events_properties.html#button
                    return true;
                }
            };


            return {
                preventDefault : preventDefault,
                isRightClick : isRightClick
            };
        }());

        //unify store data interface
        _control.storage = (function() {

            function setItem(obj, callback) {
                //console.log({ key : value});
                //chrome.storage.local.set(JSON.parse('{"' + key +'":"'+ value +'"}'));
                chrome.storage.local.set(obj, callback);
            }

            function getItem(key, callback) {
                //return localStorage.getItem("content");
                //console.log(key ,  ": " , callback);

                 chrome.storage.local.get(key, function(obj) {
                    callback(obj[key]);
                     console.log("getItem callback", obj);
                });


            }


            return {
                setItem : setItem,
                getItem : getItem
            };
        }());

        return _control;
    })
    (window, document, $, utils || {});


    var Pager = function(originalOffset, originLimit, orginTotal) {
        var _control = {};
        var offset = -1;
        var limit = 30; //default page limit
        var total = Number.MAX_VALUE;
        var outOfRangeCallback;

        _control.getNextOffset = function () {
            if(total <= (offset + limit)) {
                console.bgConsole.warn("next offset crash!");
                if(outOfRangeCallback !== undefined ) {
                    console.bgConsole.warn("call back;");
                    outOfRangeCallback();
                }
                throw new OffsetOutOfRangeException(offset);
            }

            offset =  offset == -1? 0 : (offset + limit);

            return offset;
        };

        _control.getLimit = function () {
            return limit;
        };

        _control.getOffset = function(){
            return offset;
        };

        _control.setOffset = function(o){
            offset = o;
        };

        _control.getTotal = function () {
            return total;
        };

        _control.setTotal = function (t) {
            total = t;
        };

        _control.setOutOfRangeCallback = function (fun) {
            outOfRangeCallback = fun;
        };



        function init() {
            offset = typeof(originalOffset) == "undefined"? offset : originalOffset;
            limit = typeof(originLimit) == "undefined"? limit : originLimit;
            total = orginTotal == undefined? total : orginTotal;


        }

        init();
        return _control;
    };



    //exception
    function BaseException() {}
    BaseException.prototype = new Error();
    BaseException.prototype.constructor = BaseException;
    BaseException.prototype.toString = function () {
        // note that name and message are properties of Error
        return this.name + ": "+this.message;
    };

    function OffsetOutOfRangeException(value) {
        this.name = "OffsetOutOfRangeException";
        this.message = "Offset error!Value: "+value;
    }
    OffsetOutOfRangeException.prototype = new BaseException();
    OffsetOutOfRangeException.prototype.constructor = OffsetOutOfRangeException;

    //function EmptyInputException() {
    //    this.name = "EmptyInputException";
    //    this.message = "Empty input!";
    //}
    //EmptyInputException.prototype = new BaseException();
    //EmptyInputException.prototype.constructor = EmptyInputException;

    function getTime(msec, useString) {

        // convert milliseconds to hh:mm:ss, return as object literal or string

        var nSec = Math.floor(msec/1000),
            hh = Math.floor(nSec/3600),
            min = Math.floor(nSec/60) - Math.floor(hh * 60),
            sec = Math.floor(nSec -(hh*3600) -(min*60));

        // if (min === 0 && sec === 0) return null; // return 0:00 as null

        return (useString ? ((hh ? hh + ':' : '') + (hh && min < 10 ? '0' + min : min) + ':' + ( sec < 10 ? '0' + sec : sec ) ) : { 'min': min, 'sec': sec });

    }

    var Player = function(playerDom) {
        var _instance = {};

        var jqDom, dom;

        jqDom = {
            player : null
        };

        dom = {
            progressTrack : null,
            progress : null,
            progressBar: null,
            time : null,
            duration: null,
            playButton : null
        };


        function initJqDomAndDom() {
            jqDom.player = $(playerDom);
            dom.progressTrack = jqDom.player.find(".progress").get(0);
            dom.progress = jqDom.player.find(".progress-ball").get(0);
            dom.progressBar = jqDom.player.find(".progress-bar").get(0);
            dom.time = jqDom.player.find(".md-inline-time").get(0);
            dom.duration = jqDom.player.find(".md-inline-duration").get(0);

            dom.playButton = jqDom.player.find(".md-play-btn").get(0);



        }

        function initChromeMsg() {
            if(chrome) {
                chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
                    if(message.id == 'bgPlayerPlaying'){
                        //console.log(sender);
                        whilePlaying(message);
                    } else if(message.id == 'bgPlayerOnbufferchange') {
                        //console.log(message);
                        onBufferchange(message);
                    } else if(message.id == "bgPlayerOnplay") {
                        //console.log(message);
                        onPlay(message);
                    } else if(message.id == "bgPlayerOnpause") {
                        //console.log(message);
                        onPause(message);
                    } else if(message.id == "bgPlayerOnresume") {
                        console.log("onresume");
                        onResume(message);
                    } else if(message.id == "bgPlayerOnload") {
                        onLoad(message);
                    } else if(message.id == "bgPlayerOnerror") {
                        //TODO use chrome API to do some error alerting or handling
                        onError(message);
                    } else if(message.id == "bgPlayerOnstop") {
                        onStop(message);
                    }else if(message.id == "bgPlayerOnfinish") {
                        onFinish(message);
                    }

                });
            }
        }

        function handleMouse(e) {

            var target, barX, barWidth, x, newPosition, sound;

            target = dom.progressTrack;

            barX = utils.position.getOffX(target);
            barWidth = target.offsetWidth;

            x = (e.clientX - barX);

            newPosition = (x / barWidth);

            sound = bg.backgroundPlayer.currentSound;

            if (sound && sound.duration) {

                console.debug("set postion :" + (sound.duration * newPosition) + ", s._iO.position=" + sound._iO.position, e);
                sound.setPosition((sound.duration * newPosition));
                //console.log("set postion :" + (sound.duration * newPosition) + ", s._iO.position=" + sound._iO.position, e);

                // a little hackish: ensure UI updates immediately with current position, even if audio is buffering and hasn't moved there yet.
                if (sound._iO && sound._iO.whileplaying) {
                    sound._iO.whileplaying.apply(sound);
                }

            }

            if (e.preventDefault) {
                e.preventDefault();
            }

            return false;

        }

        function releaseMouse(e) {

            //utils.events.remove(document, 'mousemove', handleMouse);
            $(document).unbind("mousemove", handleMouse);
            jqDom.player.removeClass('grabbing');

            //utils.events.remove(document, 'mouseup', releaseMouse);
            $(document).unbind("mouseup", releaseMouse);

            utils.events.preventDefault(e);

            return false;

        }

        function init() {
            initJqDomAndDom();
            initChromeMsg();

            $(dom.playButton).bind("click", function(e) {

                if (!bg.backgroundPlayer.currentSound) {
                    return true;
                }
                // edge case: if the current sound is not playing, stop all others.
                //if (!soundObject.playState) {
                //    bg.backgroundPlayer.currentSound.stopAll();
                //}
                bg.backgroundPlayer.currentSound.togglePause();

            });

            //init playing state
            if(bg.backgroundPlayer.currentSound && bg.backgroundPlayer.currentSound.playState) {
                jqDom.player.addClass("playing").removeClass("paused");


            }
            if(bg.backgroundPlayer.currentSound && bg.backgroundPlayer.currentSound.paused) {
                console.log("paused");
                onPause();
                whilePlaying(bg.backgroundPlayer.currentSound);
            }

            //init duration
            if(bg.backgroundPlayer.currentSound) {
                dom.duration.innerHTML = getTime(bg.backgroundPlayer.currentSound.duration, true);
            }

            //init progress dragging
            jqDom.player.find(".md-progress-control .progress").bind("mousedown", function(e) {
                //console.log(utils);
                if (utils.events.isRightClick(e)) {
                    console.log("right clicking!!!", e);
                    return true;
                }

                jqDom.player.addClass("grabbing");
                $(document).bind('mousemove', handleMouse);
                $(document).bind('mouseup', releaseMouse);

                //utils.events.add(document, 'mousemove', handleMouse);
                //utils.events.add(document, 'mouseup', releaseMouse);
                return handleMouse(e);
            });

        }

        function whilePlaying(message) {
            var progressMaxLeft = 100,
                left,
                width;

            left = Math.min(progressMaxLeft, Math.max(0, (progressMaxLeft * (message.position / message.durationEstimate)))) + '%';
            width = Math.min(100, Math.max(0, (100 * message.position / message.durationEstimate))) + '%';

            if (message.duration) {

                dom.progress.style.left = left;
                dom.progressBar.style.width = width;

                // TODO: only write changes
                dom.time.innerHTML = getTime(message.position, true);

            }
        }

        function onBufferchange(message) {
            if(message.isBuffering) {
                jqDom.player.addClass("buffering");
            } else {
                jqDom.player.removeClass("buffering");

            }
        }

        function onPlay(message) {
            jqDom.player.addClass("playing").removeClass("paused");
        }

        function onPause(message) {
            jqDom.player.addClass("paused").removeClass("playing");
        }

        function onResume(message) {
            jqDom.player.addClass("playing").removeClass("paused");

        }

        function onLoad(message) {
            if (message.ok) {

                dom.duration.innerHTML = getTime(message.duration, true);

            } else if (bg.backgroundPlayer.currentSound._iO && bg.backgroundPlayer.currentSound.onerror) {

                bg.backgroundPlayer.currentSound._iO.onerror();

            }
        }

        function onError(message) {
            //TODO use chrome API to do some error alerting or handling
            console.error("error while load sound resource !!");
        }

        function onStop(message) {
            jqDom.player.removeClass("playing");
        }


        function onFinish(message) {
            jqDom.player.removeClass("playing");

            dom.progress.style.left = '0%';
            dom.progressBar.style.width = '0%';



        }


        _instance.playLink = function(url) {
        };








        init();
    };




    window.mdSearcher = searcher;
    //window.pager = pager;
    //window.utils = utils;
    window.mdPlayer = Player;

})(window, document, $);





