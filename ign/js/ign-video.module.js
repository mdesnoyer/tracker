!
function () {}();
!
function ($) {
    $(document).ready(function () {
        var playlistLeftStart = parseInt($(".video_playlist").children("ul").css("left").replace(/[^-\d\.]/g, ""), 10);
        $(".nextbutton").click(function () {
            var $playlistContainer = $(this).parents(".video_playlist");
            var $playlist = $playlistContainer.children("ul");
            var $playlistContainerWidth = parseInt($playlistContainer.css("width").replace(/[^-\d\.]/g, ""), 10);
            var $playlistWidth = parseInt($playlist.css("width").replace(/[^-\d\.]/g, ""), 10);
            var playlistLeftCurrent = parseInt($playlist.css("left").replace(/[^-\d\.]/g, ""), 10);
            var $scrollNextMax = playlistLeftStart - $playlistWidth + $playlistContainerWidth;
            var $scrollNextDistance = Math.max(playlistLeftCurrent - $playlistContainerWidth, $scrollNextMax);
            if (playlistLeftCurrent >= $scrollNextMax) {
                $(this).parent().parent().children(".previous.page").removeClass("disabled");
                $playlist.animate({
                    left: $scrollNextDistance
                }, 500)
            }
            if ($scrollNextDistance == $scrollNextMax) {
                $(this).parent().addClass("disabled")
            }
        });
        $(".prevbutton").click(function () {
            var $playlistContainer = $(this).parents(".video_playlist");
            var $playlist = $playlistContainer.children("ul");
            var $playlistContainerWidth = parseInt($playlistContainer.css("width").replace(/[^-\d\.]/g, ""), 10);
            var playlistLeftCurrent = parseInt($playlist.css("left").replace(/[^-\d\.]/g, ""), 10);
            var $scrollPrevMin = playlistLeftStart;
            var $scrollPrevDistance = Math.min(playlistLeftCurrent + $playlistContainerWidth, $scrollPrevMin);
            if (playlistLeftCurrent < $scrollPrevMin) {
                $(this).parent().parent().children(".next.page").removeClass("disabled");
                $playlist.animate({
                    left: $scrollPrevDistance
                }, 500)
            }
            if ($scrollPrevDistance == $scrollPrevMin) {
                $(this).parent().addClass("disabled")
            }
        })
    })
}(jQuery);
!
function ($) {
    $(document).ready(function () {
        var playlistTimeDelay = 3e3;
        var initLoad = false;
        var ajaxCall;
        var isScrolling = false;
        var recircData = {
            totalSeconds: 5,
            seconds: 0,
            href: "",
            countDownInterval: null,
            scrollLimit: 500
        };
        var $videosList = $("#video_playlist.videos");
        var $videoPlaylist = $("#video_playlist");
        var $videoPlaylistButtons = $(".video_playlist_button");
        var $nextPage = $(".next.page");
        var $previousPage = $(".previous.page");
        var $autoPlayText;
        var playlistData = {
            initCount: 20,
            loadCount: 20,
            startIndex: 0,
            $selectors: $(".video_playlist_button span span"),
            curType: "",
            curTotal: 0
        };
        _.templateSettings.variable = "data";
        var playlistTemplate = _.template($("script.template").html());
        var config = {
            fadeSpeed: 300,
            scrollSpeed: 600,
            itemWidth: 0,
            startPosition: 10
        };
        var rules = {
            shows: {},
            taboola: {},
            trailers: {
                condition: "is",
                field: "metadata.classification",
                value: "Trailer"
            },
            reviews: {
                condition: "is",
                field: "metadata.classification",
                value: "Review"
            },
            related: {
                videoId: $(".video_current").data("id")
            },
            playlist: {
                playlistId: "4c3fab9d2db5b93b1600061d"
            },
            ignevent: {
                condition: "contains",
                field: "tags",
                value: $(".event-button").data("event")
            }
        };
        var videoContentHelper = {
            parseDuration: function (duration) {
                return Math.floor(duration / 60) + ":" + (duration % 60 > 9 ? duration % 60 : "0" + duration % 60)
            },
            parseTitle: function (video) {
                if (video.metadata.longTitle) {
                    return video.metadata.longTitle
                }
                if (video.objectRelations) {
                    var objectName = video.objectRelations[0] ? video.objectRelations[0].objectName : video.objectRelations.objectName;
                    return (objectName !== undefined ? objectName + " - " : "") + video.metadata.title
                }
                return video.metadata.title
            },
            convertHtml: function (videos, type) {
                var dataObject, videoCount;
                var html = "";
                if (type == "taboola") {
                    videos.count = videos.list.length;
                    videos.total = videos.list.length
                }
                videoCount = videos.count;
                var timerExists = false;
                for (var i = 0; i < videoCount; i++) {
                    if (type == "taboola") {
                        var index = 2;
                        var ad = true;
                        if (videos.list[i].url.indexOf("ign.com") != -1) {
                            ad = false
                        }
                        if (videos.list[i].thumbnail.length == 1) {
                            index = 0
                        }
                        dataObject = {
                            title: videos.list[i].name,
                            url: videos.list[i].url,
                            target: ad ? "_blank" : "_self",
                            img: videos.list[i].thumbnail[index].url,
                            duration: ad ? "Sponsored" : this.parseDuration(videos.list[i].duration),
                            classes: "video" + (ad ? " selected" : ""),
                            responseId: videos.id,
                            itemId: videos.list[i].id
                        }
                    } else if (videos.data[i].thumbnails.length > 0) {
                        dataObject = {
                            title: this.parseTitle(videos.data[i]),
                            url: videos.data[i].metadata.url.replace("www.ign.com", location.host),
                            target: "_self",
                            img: videos.data[i].thumbnails[0].styleUrl.replace("{size}", "medium"),
                            duration: this.parseDuration(videos.data[i].metadata.duration) + " MIN",
                            classes: "video"
                        }
                    }
                    if (!timerExists && document.URL != dataObject.url && document.referrer != dataObject.url) {
                        dataObject.recircClass = "image-timer";
                        timerExists = true
                    }
                    html += playlistTemplate(dataObject)
                }
                return html
            }
        };
        var sendTaboolaEvent = function (type, responseId, itemId) {
                var url = "http://api.taboola.com/1.0/json/ign-ign/recommendations.notify-" + type,
                    data = {
                        "app.type": "desktop",
                        "item.type": "video",
                        "app.apikey": "5fea3480dbe28817c8aca0d29d4dad4e88a62d3",
                        "response.id": responseId,
                        "item.id": itemId
                    };
                if (ajaxCall) {
                    ajaxCall.abort()
                }
                ajaxCall = $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "jsonp",
                    jsonp: "output.callback",
                    data: data
                })
            };
        var loadPlaylist = function (type, count, callback, resetTotal) {
                var url = "/ajax/videos/carousel";
                var data = {
                    count: count,
                    type: type,
                    startIndex: playlistData.startIndex,
                    rules: JSON.stringify(rules[type])
                };
                if (type == "taboola") {
                    url = "http://api.taboola.com/1.0/json/ign-ign/recommendations.get";
                    data = {
                        "app.type": "desktop",
                        "rec.type": "video",
                        "rec.count": 22,
                        "app.apikey": "5fea3480dbe28817c8aca0d29d4dad4e88a62d3",
                        "source.url": location.pathname,
                        "source.type": "video",
                        "source.id": rules.related.videoId
                    }
                }
                if (ajaxCall) {
                    ajaxCall.abort()
                }
                ajaxCall = $.ajax({
                    type: "GET",
                    url: url,
                    dataType: type == "taboola" ? "jsonp" : "json",
                    jsonp: "output.callback",
                    data: data,
                    success: function (response) {
                        var html = videoContentHelper.convertHtml(response, type);
                        if (resetTotal) {
                            playlistData.curTotal = response.total - response.count
                        }
                        callback.call(null, html)
                    },
                    error: function () {
                        playlistData.curTotal = 0
                    }
                })
            };
        var addPlaylistItemsToPage = function (videos) {
                var $videos = $(".videos"),
                    $promoLi = $videos.find(".promoted_video");
                $videos.stop().fadeOut(config.faseSpeed, function () {
                    var $this = $(this);
                    $videos.css("left", config.startPosition).empty();
                    $this.append(videos);
                    if ($promoLi.length > 0) {
                        $videos.find(".image-timer").removeClass("image-timer");
                        $this.prepend($promoLi)
                    }
                    $this.fadeIn(config.faseSpeed);
                    config.itemWidth = $videosList.find("li").outerWidth(true);
                    $videosList.find("a").click(function () {
                        $this = $(this);
                        if ($this.data("response-id")) {
                            sendTaboolaEvent("click", $this.data("response-id"), $this.data("item-id"))
                        }
                    })
                })
            };
        var loadMore = function () {
                if (playlistData.curTotal <= 0) {
                    return
                }
                var count = playlistData.loadCount;
                playlistData.startIndex += playlistData.loadCount;
                if (playlistData.curTotal < count) {
                    count = playlistData.curTotal
                }
                playlistData.curTotal -= count;
                loadPlaylist(playlistData.curType, count, appendPlaylist)
            };
        var appendPlaylist = function (videos) {
                $(".videos").append(videos)
            };
        playlistData.$selectors.click(function (e) {
            var $this = $(this);
            e.preventDefault();
            playlistData.startIndex = 0;
            playlistData.$selectors.removeClass("selected").addClass("selectable");
            playlistData.$selectors.parent().removeClass("container-selected");
            $this.removeClass("selectable").addClass("selected");
            $this.parent().addClass("container-selected");
            var type = $this.data("type");
            playlistData.curType = type;
            $(".previous.page").addClass("disabled");
            $(".next.page").removeClass("disabled");
            loadPlaylist(type, playlistData.initCount, addPlaylistItemsToPage, true)
        });
        var scrollTonextPage = function (e) {
                e.preventDefault();
                if (isScrolling) {
                    return
                }
                var loadNextPage = false;
                var scrollAmount = parseInt($videoPlaylist.css("width"), 10);
                var itemStripRemaining = parseInt($videosList.css("width"), 10) + parseInt($videosList.css("left"), 10);
                var videoPlaylistProperties = {
                    left: "-=0"
                };
                isScrolling = true;
                $previousPage.removeClass("disabled");
                if (itemStripRemaining <= scrollAmount * 3) {
                    if (playlistData.curTotal > 0) {
                        scrollAmount -= scrollAmount % config.itemWidth;
                        loadNextPage = true
                    } else if (itemStripRemaining <= scrollAmount * 2) {
                        scrollAmount = itemStripRemaining - scrollAmount;
                        $nextPage.addClass("disabled");
                        if (scrollAmount < config.startPosition) {
                            isScrolling = false;
                            return
                        }
                    } else {
                        scrollAmount -= scrollAmount % config.itemWidth
                    }
                } else {
                    scrollAmount -= scrollAmount % config.itemWidth
                }
                videoPlaylistProperties.left = "-=" + scrollAmount;
                $($videosList).stop().animate(videoPlaylistProperties, config.scrollSpeed, function () {
                    if (loadNextPage) {
                        loadMore()
                    }
                    isScrolling = false
                })
            };
        var scrollToPreviousPage = function (e) {
                e.preventDefault();
                if (isScrolling) {
                    return
                }
                isScrolling = true;
                $nextPage.removeClass("disabled");
                var scrollAmount = parseInt($videoPlaylist.css("width"), 10);
                var itemStripLeft = parseInt($videosList.css("left"), 10);
                var videoPlaylistProperties = {
                    left: "-=0"
                };
                if (itemStripLeft + scrollAmount > config.startPosition) {
                    videoPlaylistProperties.left = config.startPosition;
                    $previousPage.addClass("disabled")
                } else {
                    scrollAmount -= scrollAmount % config.itemWidth;
                    videoPlaylistProperties.left = "+=" + scrollAmount
                }
                $($videosList).stop().animate(videoPlaylistProperties, config.scrollSpeed, function () {
                    isScrolling = false
                })
            };
        $nextPage.click(scrollTonextPage);
        $previousPage.click(scrollToPreviousPage);

        function onInitLoadPlaylist() {
            if (initLoad) {
                return
            }
            initLoad = true;
            var $firstButton = $videoPlaylistButtons.first();
            var $firstButtonObject = $firstButton.find(".item.selectable");
            var type = $firstButtonObject.data("type");
            $firstButton.children(".item-container").addClass("container-selected");
            $firstButtonObject.removeClass("selectable").addClass("selected");
            clearTimeout(playlistTimeout);
            playlistData.curType = type
        }
        var onRecirc = function () {
                var thumbSel = $("#video_playlist .videos .image-timer");
                if (!thumbSel.length) {
                    return
                }
                var autoPLayLabel = "ON";
                var isOn = true;
                var html = "";
                recircData.seconds = recircData.totalSeconds;
                thumbSel.siblings(".video_duration").css("opacity", 1).text("UP NEXT");
                thumbSel.siblings(".video_name").css("opacity", 1);
                thumbSel.siblings(".video_duration").css("opacity", 1);
                recircData.href = $(".videos li div.image-timer").parent("a").attr("href");
                if (typeof recircData.href === "undefined" || recircData.href === "undefined" || recircData.href === "") {
                    recircData.href = $(".videos li:eq(0)").children("a").attr("href")
                }
                if (parseInt($(".videos").css("left"), 10) < 0 || $(window).scrollTop() > recircData.scrollLimit) {
                    isOn = false;
                    autoPLayLabel = "OFF"
                }
                html = '<div class="timer-cell"><span class="timer-autoplay">AUTOPLAY <a href="#" data-isOn="';
                html += isOn;
                html += '">';
                html += autoPLayLabel;
                html += '</a></span><span class="timer-text">';
                html += recircData.seconds;
                html += "</span></div>";
                thumbSel.append(html);
                var autoPlayLink = thumbSel.find(".timer-cell .timer-autoplay a");
                $autoPlayText = thumbSel.find(".timer-cell .timer-text");
                if (isOn) {
                    recircData.countDownInterval = setInterval(countDown, 1e3)
                }
                autoPlayLink.click(autoPlayToggle);
                assignStopTimerEvents()
            };
        var autoPlayToggle = function (e) {
                var $this = $(this);
                e.preventDefault();
                e.stopImmediatePropagation();
                var autoPlaySwitch = $this.data("isOn");
                if (autoPlaySwitch) {
                    $this.data("isOn", !autoPlaySwitch);
                    $this.text("ON");
                    recircData.countDownInterval = setInterval(countDown, 1e3)
                } else {
                    $this.data("isOn", !autoPlaySwitch);
                    $this.text("OFF");
                    clearInterval(recircData.countDownInterval)
                }
            };
        var countDown = function () {
                recircData.seconds--;
                $autoPlayText.text(recircData.seconds);
                if (recircData.seconds <= 0) {
                    clearInterval(recircData.countDownInterval);
                    window.igndrones.async.push(function () {
                        window.igndrones.fireEvent("Video Countdown", "Video:" + rules.related.videoId, $(".video_current").data("title"), recircData.totalSeconds, true)
                    });
                    setTimeout(function () {
                        window.location = recircData.href
                    }, 1e3)
                }
            };
        var assignStopTimerEvents = function () {
                $nextPage.click(stopTimer);
                $(window).scroll(function () {
                    if ($(window).scrollTop() > recircData.scrollLimit) {
                        stopTimer()
                    }
                })
            };
        var stopTimer = function () {
                $(".timer-autoplay a").text("OFF").data("isOn", false);
                clearInterval(recircData.countDownInterval)
            };
        window.IGNVideoPlayer.on("PlayerState_Recirculation", onRecirc);
        window.IGNVideoPlayer.on("PlayerState_PreRoll", onInitLoadPlaylist);
        window.IGNVideoPlayer.on("PlayerState_PreRoll", stopTimer);
        var playlistTimeout = setTimeout(onInitLoadPlaylist, playlistTimeDelay)
    })
}(jQuery);
!
function ($) {
    $(document).ready(function () {
        var $videoDownloadButton = $("#video-download-button");
        $videoDownloadButton.find(".video-button").click(function (e) {
            e.preventDefault();
            $(this).parent().find(".dropdown").toggle(0, function () {
                var $this = $(this);
                if (!$this.data("primeChecked") && $this.is(":visible")) {
                    $this.data("primeChecked", true);
                    $.ajax({
                        type: "GET",
                        url: "/private/videos/download-button",
                        dataType: "json",
                        success: function (response) {
                            if (response.isPrime) {
                                makeDownloadable()
                            }
                        }
                    })
                }
            })
        });
        var makeDownloadable = function () {
                $videoDownloadButton.find(".video-file").each(function (i, fileItem) {
                    var $fileItem = $(fileItem);
                    var $resolution = $fileItem.find(".resolution");
                    $videoDownloadButton.find(".message").text('Right Click a video size and select "Save..." to Download.');
                    var data = {
                        type: $fileItem.data("type"),
                        id: $fileItem.data("id"),
                        width: $fileItem.data("width")
                    };
                    var url = "http://assets.ign.com/videos/zencoder/" + data.width + "/" + data.id + "." + data.type;
                    var val = $resolution.text();
                    $resolution.empty().append('<a href="' + url + '">' + val + "</a>")
                })
            }
    })
}(jQuery);