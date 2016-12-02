var OneScriptWriter = {

    scriptMap: {},

    write: function(access) {
        var self = this;

        var linkSelectorCancelScript = function() {
            access.sideBar.show();
            access.scroller.show(access.scrollWidth);
            access.gazer.unlockResume();
            access.gazer.resume();
            access.linkSelector.hide();
            $("body").css("transition", "transform "+1.0+"s"); 
            $('body').css('-webkit-transform-origin', 0+'% '+ 0+'%');
            $('body').css('-webkit-transform', 'scale('+access.initialScale+')');
        };

        var keyboardCancelScript = function() {
            access.sideBar.show();
            access.scroller.show(access.scrollWidth);
            access.gazer.unlockResume();
            access.gazer.resume();
            access.browserMenu.hide(); // hide navMenu and listMenu but not UrlInput
            access.browserMenu.hideUrlInput();
            $("body").css("transition", "transform "+1.0+"s"); 
            $('body').css('-webkit-transform-origin', 0+'% '+ 0+'%');
            $('body').css('-webkit-transform', 'scale('+access.initialScale+')');
        };

        var keyboardCancelScript = function() {
            access.sideBar.show();
            access.scroller.show(access.scrollWidth);
            access.gazer.unlockResume();
            access.gazer.resume();
            access.browserMenu.hideUrlInput();
            access.linkSelector.hide();
            $("body").css("transition", "transform "+1.0+"s"); 
            $('body').css('-webkit-transform-origin', 0+'% '+ 0+'%');
            $('body').css('-webkit-transform', 'scale('+access.initialScale+')');
        };

        var browserMenuCancelScript = function() {
            access.sideBar.show();
            access.scroller.show(access.scrollWidth);
            access.gazer.unlockResume();
            access.gazer.resume();
            access.browserMenu.hide();
            // access.browserMenu.hideUrlInput();
            $("body").css("transition", "transform "+1.0+"s"); 
            $('body').css('-webkit-transform-origin', 0+'% '+ 0+'%');
            $('body').css('-webkit-transform', 'scale('+access.initialScale+')');
        };

        // input parameter is the text input on which the keyboard will act
        var keyboardShowScript = function(input) {
            access.browserMenu.hide();
            access.linkSelector.hide();
            access.keyboard.show(input);
            // keyboard.setInputSelected(input);
            $('body').css('-webkit-transform', 'scale(1.0)');
        };

        var bookmarkPluginCancel = function() {
            access.bookmarkMenu.remove();
            access.sideBar.show();
            access.scroller.show(access.scrollWidth);
            access.gazer.unlockResume();
            access.gazer.resume();
        };

        var openSettingsScript = function() {
            access.browserMenu.hide();
            $('body').css('-webkit-transform', 'scale(1.0)');
        };

        self.scriptMap['linkSelectorCancelScript'] = linkSelectorCancelScript;
        self.scriptMap['keyboardCancelScript'] = keyboardCancelScript;
        self.scriptMap['browserMenuCancelScript'] = browserMenuCancelScript;
        self.scriptMap['keyboardShowScript'] = keyboardShowScript;
        self.scriptMap['bookmarkPluginCancel'] = bookmarkPluginCancel;
        self.scriptMap['openSettingsScript'] = openSettingsScript;

        return self.scriptMap;
    },
    getScript: function(scriptName) {
        var self = this;
        return self.scriptMap[scriptName];
    }
};
