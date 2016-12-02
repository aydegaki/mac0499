var oneRecentBookmarks = [];
var oneAllBookmarks = [];
(function (document, runtime, storage) {
    'use strict';

    function timeFired() {
        helper.printDebug();
    }
    /* ------------------ MESSAGE HANDLER --------------------- */
    function messageHandler(request, sender){
        if(request.message === 'bookmarkResponse') {
            oneRecentBookmarks = request.bookmarks;
        }
        else if(request.message === 'allBookmarkResponse') {
            oneAllBookmarks = request.allBookmarks;
        }
        else if(request.message === "fire_app") { 

            // timeFired();

            // storage.sync.clear();
            var access = {};
            access.prepare = prepare;
            access.prepare(access);

            function prepare(access) {
                storage.sync.get('userSettings', function(value) {
                    console.log('pegando do storage:')
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

            function start(access) {
                $('*').css('cursor', 'none');
                hideOriginalScrollbar();
                var winW = $(window).width();
                var winH = $(window).height();

                // extension parameters
                var unit = access.userSettings.unit; // pixels
                var dwellTime = access.userSettings.dwellTime; // ms

                console.log('before scalePage: ' + dwellTime);
                OneDwellTimeBar.setTime(dwellTime);
                // var dwellTime = 750; // miliseconds

                var sideBarWidth = unit*1.5;
                var initialScale = (winW-sideBarWidth)/winW;
                var scrollWidth = winW-sideBarWidth;

                // creating main conteiner
                var oneContainer =  createExtensionContainer();

                // adjusting page size according to sidebar
                scalePage(initialScale);

                var gazer = NEW(OneGazer),
                    scroller = NEW(OneScroller),
                    sideBar = NEW(OneSideBar),
                    accessButtonClick = NEW(OneAccessButton),
                    accessButtonMenu = NEW(OneAccessButton),
                    linkSelector = NEW(OneLinkSelector),
                    browserMenu = NEW(OneMenuBrowser),
                    keyboard = NEW(OneKeyboard);

                // interface access for plugins
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
                access.linkSelector = linkSelector;
                access.browserMenu = browserMenu;
                access.keyboard = keyboard;


                var scriptMap = OneScriptWriter.write(access); 

                sideBar.withUnit(unit)
                    .withWidth(sideBarWidth)
                    .withHeight(winH)
                    .withConteinerSrc(oneContainer)
                    .create();
                scroller.withHeight(unit*1.5)
                    .withWidth(scrollWidth)
                    .withConteinerSrc(oneContainer)
                    .create();
                // gazer induce accessButtonClick color
                gazer.withUnit(unit)
                    .withConteinerSrc(oneContainer)
                    .withAccessButton(accessButtonClick)
                    .withScroller(scroller)
                    .create();
                // cancelAction is triggered through quitButton 
                keyboard.withUnit(unit)
                    .withConteinerSrc(oneContainer)
                    .withCancelAction(scriptMap['keyboardCancelScript'])
                    .create();
                // keyboardAction is triggerd when input is selected, cancelAction, when 'red bar' is activated
                linkSelector.withUnit(unit)
                    .withConteinerSrc(oneContainer)
                    .withCancelAction(scriptMap['linkSelectorCancelScript'])
                    .withKeyboardAction(scriptMap['keyboardShowScript'])
                    .withInitialScale(initialScale)
                    .create();
                accessButtonClick.withUnit(unit)
                    .withImg('img/cursor.png')
                    .withColor('gray')
                    .withY((winH/3)-unit/2)
                    .withConteinerSrc(sideBar.getConteiner())
                    .withHoverOn(clickHoverOn)
                    .withHoverOff(accessButtonHoverOff)
                    .create();
                accessButtonMenu.withUnit(unit)
                    .withImg('img/menu.svg')
                    .withColor('#FF4')
                    .withY((winH*(2/3))-unit/2)
                    .withConteinerSrc(sideBar.getConteiner())
                    .withHoverOn(menuHoverOn)
                    .withHoverOff(accessButtonHoverOff)
                    .create();
                browserMenu.withUnit(unit)
                    .withConteinerSrc(oneContainer)
                    .withCancelAction(scriptMap['browserMenuCancelScript'])
                    .withKeyboardAction(scriptMap['keyboardShowScript'])
                    .withKeyboard(keyboard)
                    .create();
                browserMenu.loadMenuOuter(
                    OnePlugins.buildAndGetPluginList(access)
                );


                ///////////////////////////////////////////////////////////////q
                function clickHoverOn(){

                    // item keys: ['element', 'x0', 'y0', 'w0', 'y0']
                    var list = gazer.getItemList();

                    // if there are link candidates, activate button
                    if (list.length > 0) {

                        gazer.pause();

                        OneDwellTimeBar.dwell(function(){
                            scroller.hide();
                            sideBar.hide();
                            gazer.lockResume(); // otherwise hoveroff accessButton would be triggered
                            gazer.removeMiniMarkers();
                            linkSelector.loadItemList(list);
                            // if there is ambiguity, show linkSelector
                            if (list.length > 1) {
                                linkSelector.show();
                                linkSelector.optimizeView(list);
                            }
                        } , accessButtonClick.getElement(), access.unit); 
                    }
                } 

                function accessButtonHoverOff() {
                    gazer.resume();
                    OneDwellTimeBar.clear(); 
                }

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

                function scalePage() {
                    console.log('inside scalePage' + initialScale);
                    $('body').css('-webkit-transform-origin', '0% 0%');
                    $('body').css('-webkit-transform', 'scale('+initialScale+')');
                }

                function hideOriginalScrollbar() {
                    // disable scrollbar
                    $("body").css("overflow", "hidden"); // hide scrollbar
                }

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


// storage.sync.set({'oi': 'foo'}, function() {console.log('armazenando do storage')});
// storage.sync.clear();
// storage.sync.get('oi', function(value) {
//     console.log('pegando do storage:')
//     console.log(value)
// });
