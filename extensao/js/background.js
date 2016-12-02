(function(runtime) {
    'use strict';

    var books = [];

    /**
     * Launch application when a tab is updated
     */ 
    function fireApp(tabid, changeinfo, tab) {
        var url = tab.url;
        if (url !== undefined && changeinfo.status == "complete") {
            console.log('FireApp');
            books = [];
            // chrome.bookmarks.getTree( process_bookmark );
            chrome.bookmarks.getRecent(10, process_bookmark );
            chrome.tabs.query( { active: true, currentWindow: true}, function(tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.setZoom(activeTab.id, 1.0, function() {
                        if (chrome.runtime.lastError)
                            console.log('[ONE] ' + chrome.runtime.lastError.message);
                    });
                    chrome.tabs.sendMessage(activeTab.id, {"message": "fire_app", "bookmarks": books});
                }
            );
        }
    }

    function process_bookmark(bookmarks) {
        for (var i =0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i];
            if (bookmark.url) {
                // console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
                // console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
                // console.log(bookmark);
                books.push({
                    'title': bookmark.title,
                    'url': bookmark.url,
                    'id': bookmark.id,
                });
            }
            if (bookmark.children) {
                // console.log('in '+i);
                process_bookmark(bookmark.children);
                // console.log('endin' + i);
            }
        }
    }
    /* ------------------------ MAIN --------------------------- */
    // function zoomChangeListener(zoomChangeInfo) {
    //     var settings_str = "mode:" + zoomChangeInfo.zoomSettings.mode +
    //         ", scope:" + zoomChangeInfo.zoomSettings.scope;
    //     console.log('[ZoomDemoExtension] zoomChangeListener(tab=' +
    //                 zoomChangeInfo.tabId + ', new=' +
    //                 zoomChangeInfo.newZoomFactor + ', old=' +
    //                 zoomChangeInfo.oldZoomFactor + ', ' +
    //                 settings_str + ')');
    // }
    // chrome.tabs.onZoomChange.addListener(zoomChangeListener);

    chrome.tabs.onUpdated.addListener(fireApp);
    chrome.runtime.onMessage.addListener(messageHandler);
    
    function messageHandler(request, sender, sendResponse) {
        if(request.message === 'removeBookmark') {
            // console.log(request.bookmarkId);
            chrome.bookmarks.remove(request.bookmarkId);
        } 
        else if(request.message === 'bookmarkIt') {
            console.log(request.bookmark);
            chrome.bookmarks.create(request.bookmark);
        } 
        else if(request.message === 'requestBookmark') {
            console.log('REQUESTING...');
            books = [];
            chrome.bookmarks.getRecent(10, process_bookmark );
            console.log(books);
            console.log('END...');
            chrome.tabs.query( { active: true, currentWindow: true}, function(tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, {"message": "bookmarkResponse", "bookmarks": books});
                }
            );
        } 
        else if(request.message === 'requestAllBookmark') {
            console.log('REQUESTING...');
            books = [];
            chrome.bookmarks.getTree( process_bookmark );
            console.log(books);
            console.log('END...');
            chrome.tabs.query( { active: true, currentWindow: true}, function(tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, {"message": "allBookmarkResponse", "allBookmarks": books});
                }
            );
        } 
    }
}(chrome.runtime));

