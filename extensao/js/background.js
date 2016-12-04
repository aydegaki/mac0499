(function(runtime) {
    'use strict';

    var books = [];

    // Launch application when a tab is updated
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

    // Store bookmarks (title, url, id) in 'books'
    function process_bookmark(bookmarks) {
        for (var i =0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i];
            if (bookmark.url) {
                books.push({
                    'title': bookmark.title,
                    'url': bookmark.url,
                    'id': bookmark.id,
                });
            }
            if (bookmark.children) {
                process_bookmark(bookmark.children);
            }
        }
    }

    chrome.tabs.onUpdated.addListener(fireApp);
    chrome.runtime.onMessage.addListener(messageHandler);
    
    // Handle messages from content.js
    function messageHandler(request, sender, sendResponse) {
        if(request.message === 'removeBookmark') {
            chrome.bookmarks.remove(request.bookmarkId);
        } 
        else if(request.message === 'bookmarkIt') {
            console.log(request.bookmark);
            chrome.bookmarks.create(request.bookmark);
        } 
        else if(request.message === 'requestBookmark') {
            books = [];
            chrome.bookmarks.getRecent(10, process_bookmark );
            chrome.tabs.query( { active: true, currentWindow: true}, function(tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, {"message": "bookmarkResponse", "bookmarks": books});
                }
            );
        } 
        else if(request.message === 'requestAllBookmark') {
            books = [];
            chrome.bookmarks.getTree( process_bookmark );
            chrome.tabs.query( { active: true, currentWindow: true}, function(tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, {"message": "allBookmarkResponse", "allBookmarks": books});
                }
            );
        } 
    }
}(chrome.runtime));

