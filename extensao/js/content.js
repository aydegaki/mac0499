var oneRecentBookmarks = []; // global: stores recent bookmarks
var oneAllBookmarks = []; // global: stores all bookmarks

(function (document, runtime, storage) {
    'use strict';

    // Function: handle messages from background.js
    function messageHandler(request, sender){
        if(request.message === 'bookmarkResponse') {
            oneRecentBookmarks = request.bookmarks;
        }
        else if(request.message === 'allBookmarkResponse') {
            oneAllBookmarks = request.allBookmarks;
        }
        else if(request.message === "fire_app") { 

            var access = {};
            access.prepare = prepare;
            access.prepare(access);

            // Function: configure initial settings (button size, dwell-time)
            function prepare(access) {
                storage.sync.get('userSettings', function(value) {
                    var defined = false;
                    var userSettings = {};
                    for (var prop in value) {
                        if (value.hasOwnProperty(prop)) {
                            defined = true;
                            break;
                        }
                    }
                    if (defined === true) {
                        userSettings = value.userSettings;
                    } else {
                        var newUserSettings = {'unit': 150, 'dwellTime': 750};
                        storage.sync.set({'userSettings': newUserSettings}, function() {console.log('USER SETTINGS CREATED')});
                        userSettings = newUserSettings;
                    }
                    access.start = start;;
                    access.userSettings = userSettings;
                    console.log(access.userSettings);
                    start(access);
                });
            }

            // Function: start application
            function start(access) {

                $('*').css('cursor', 'none');
                hideOriginalScrollbar();

                var winW = $(window).width();
                var winH = $(window).height();

                var unit = access.userSettings.unit; // pixels
                var dwellTime = access.userSettings.dwellTime; // ms

                console.log('before scalePage: ' + dwellTime);
                OneDwellTimeBar.setTime(dwellTime);

                var sideBarWidth = unit*1.5;
                var initialScale = (winW-sideBarWidth)/winW;
                var scrollWidth = winW-sideBarWidth;

                var oneContainer =  createExtensionContainer();

                scalePage(initialScale);

                var gazer = NEW(OneGazer),
                    scroller = NEW(OneScroller),
                    sideBar = NEW(OneSideBar),
                    accessButtonClick = NEW(OneAccessButton),
                    accessButtonMenu = NEW(OneAccessButton),
                    objectSelector = NEW(OneObjectSelector),
                    browserMenu = NEW(OneMenuBrowser),
                    keyboard = NEW(OneKeyboard);

                /* interface access for plugins */
                access.unit = unit;
                access.dwellTime = dwellTime;
                access.initialScale = initialScale;
                access.scrollWidth = scrollWidth;
                access.mainContainer = oneContainer;
                access.gazer = gazer;
                access.scroller = scroller;
                access.sideBar = sideBar;
                access.accessButtonClick = accessButtonClick;
                access.accessButtonMenu = accessButtonMenu;
                access.objectSelector = objectSelector;
                access.browserMenu = browserMenu;
                access.keyboard = keyboard;


                var scriptMap = OneScriptWriter.write(access); 

                sideBar.withWidth(sideBarWidth)
                    .withHeight(winH)
                    .withContainerSrc(oneContainer)
                    .create();
                scroller.withHeight(unit*1.5)
                    .withWidth(scrollWidth)
                    .withContainerSrc(oneContainer)
                    .create();
                /* gazer induce accessButtonClick color */
                gazer.withUnit(unit)
                    .withContainerSrc(oneContainer)
                    .withAccessButton(accessButtonClick)
                    .withScroller(scroller)
                    .create();
                /* cancelAction is triggered through quitButton */
                keyboard.withUnit(unit)
                    .withContainerSrc(oneContainer)
                    .withCancelAction(scriptMap['keyboardCancelScript'])
                    .create();
                /* keyboardAction is triggerd when input is selected, cancelAction, when 'red bar' is activated */
                objectSelector.withUnit(unit)
                    .withContainerSrc(oneContainer)
                    .withCancelAction(scriptMap['objectSelectorCancelScript'])
                    .withKeyboardAction(scriptMap['keyboardShowScript'])
                    .withInitialScale(initialScale)
                    .create();
                accessButtonClick.withUnit(unit)
                    .withImg('img/cursor.png')
                    .withColor('gray')
                    .withY((winH/3)-unit/2)
                    .withContainerSrc(sideBar.getContainer())
                    .withHoverOn(clickHoverOn)
                    .withHoverOff(accessButtonHoverOff)
                    .create();
                accessButtonMenu.withUnit(unit)
                    .withImg('img/menu.svg')
                    .withColor('#FF4')
                    .withY((winH*(2/3))-unit/2)
                    .withContainerSrc(sideBar.getContainer())
                    .withHoverOn(menuHoverOn)
                    .withHoverOff(accessButtonHoverOff)
                    .create();
                browserMenu.withUnit(unit)
                    .withContainerSrc(oneContainer)
                    .withCancelAction(scriptMap['browserMenuCancelScript'])
                    .withKeyboardAction(scriptMap['keyboardShowScript'])
                    .withKeyboard(keyboard)
                    .create();
                browserMenu.loadMenuOuter(
                    OnePlugins.buildAndGetPluginList(access)
                );


                // Function: callback for click button hoverOn event
                function clickHoverOn(){

                    var list = gazer.getItemList(); // item keys: ['element', 'x0', 'y0', 'w0', 'y0']

                    /* if there are candidate links, activate button */
                    if (list.length > 0) {

                        gazer.pause();

                        OneDwellTimeBar.dwell(function(){
                            scroller.hide();
                            sideBar.hide();
                            gazer.lockResume(); // otherwise hoveroff accessButton would be triggered
                            gazer.removeMiniMarkers();
                            objectSelector.loadItemList(list);
                            /* if there is ambiguity, show objectSelector */
                            if (list.length > 1) {
                                objectSelector.show();
                                objectSelector.optimizeView(list);
                            }
                        } , accessButtonClick.getElement(), access.unit); 
                    }
                } 

                // Function: callback for menu/click button hoverOff event
                function accessButtonHoverOff() {
                    gazer.resume();
                    OneDwellTimeBar.clear(); 
                }

                // Function: callback for menu button hoverOn event
                function menuHoverOn(){
                    gazer.pause();
                    OneDwellTimeBar.dwell(function(){
                        scroller.hide();
                        sideBar.hide();
                        gazer.lockResume(); // otherwise hoveroff accessButton would be triggered
                        gazer.removeMiniMarkers();
                        browserMenu.show(OnePlugins.buildAndGetPluginList(access));
                    }, accessButtonMenu.getElement(), access.unit); 
                } 

                // Function: adjust page size according to sidebar
                function scalePage(initialScale) {
                    $('body').css('-webkit-transform-origin', '0% 0%');
                    $('body').css('-webkit-transform', 'scale('+initialScale+')');
                }

                // Function: Hide scroll bar
                function hideOriginalScrollbar() {
                    $("body").css("overflow", "hidden"); 
                }

                // Function: create main extension container that will contain all objects
                function createExtensionContainer() {
                    var mainContainerId = 'oneContainer',
                        containerSrc = $('html');
                    var oneContainer = $('<div id="'+mainContainerId+'"></div>');

                    $('#'+mainContainerId).remove();
                    containerSrc.append(oneContainer);
                    return oneContainer
                }
            }
        } // end of fire app condition 
    } // end of file handler


    /* ------------------------ MAIN --------------------------- */

    runtime.onMessage.addListener(messageHandler);

}(document, chrome.runtime, chrome.storage));
