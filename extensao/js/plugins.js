// Moudule: build and access plugins
var OnePlugins = {

    // Function: build plugins and return a list of plugins
    buildAndGetPluginList: function(access) { 
        var self = this;
        /* access argument should have all resources necessary for plugins usage */
        self.access = access;
        self.pluginList = [ 
            self.makeItem({unit: self.access.unit, img:'img/settings.svg', actionMapKey:'settings', descriptionText: 'Settings'}),
            self.makeItem({unit: self.access.unit, img:'img/bookmark.svg', actionMapKey:'bookmark', descriptionText: 'Recent Bookmarks'}),
            self.makeItem({unit: self.access.unit, img:'img/google.svg', actionMapKey:'google', descriptionText: 'Google'}),
            self.makeItem({unit: self.access.unit, img:'img/defaultIcon.png', actionMapKey:'default', descriptionText: 'Slot 4'}),
            self.makeItem({unit: self.access.unit, img:'img/defaultIcon.png', actionMapKey:'default', descriptionText: 'Slot 5'}),
            self.makeItem({unit: self.access.unit, img:'img/defaultIcon.png', actionMapKey:'default', descriptionText: 'Slot 6'}),
        ]
        return self.pluginList;
    },

    // Function: make a button according to their correspondent plugin
    makeItem: function (args) {
        var self = this;
        return {
            'type': 'PLUGIN',
            'buttonCss': {
                'position': 'absolute',
                'top': args.unit*0.5,
                'left': args.unit*0.5,
                'height': args.unit*2,
                'width': args.unit*2,
                'background': 'purple',
                'box-shadow': '0px 0px 0px 5px white inset',
                'border-radius': '10%',
                'transition': 'transform 1.0s',
            },
            'img': args.img,
            'imgCss': {
                'position': 'absolute',
                'height': '70%',
                'width': '70%',
                'margin': 'auto',
                'top': 0,
                'bottom': 0,
                'left': 0,
                'right': 0,
                'opacity': 0.5,
                'pointer-events': 'none',
            },
            'descriptionCss': {
                'position': 'absolute',
                'margin': 'auto',
                'top': 0,
                'bottom': 0,
                'left': 0,
                'right': 0,
                'height': '80%',
                'width': '80%',
                'display': 'table',
                'overflow': 'hidden',
                'display': 'table',
            },
            'descriptionSpanCss': {
                'font-size': args.unit*0.3,
                'height': '80%',
                'width': '80%',
                'color': 'white',
                'display': 'table-cell',
                'vertical-align': 'middle',
                'text-align': 'center',
                'font-weight': 'bold',
                'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
            },
            'descriptionText': args.descriptionText,
            'action': self.actionMap(self.access)[args.actionMapKey],
        }
    },

  // Function: return a map linking a plugin name with its action function
  actionMap: function(access){
      return {
            'default': function() { console.log('DEFAULT'); },
            'google': function() { 
                window.location.href = "http://www.google.com"; },
            'bookmark': function() {
                var list = [];

                chrome.runtime.sendMessage({"message": "requestBookmark"});

                var oneTimer = setInterval(function() {
                    if (oneRecentBookmarks) {

                        clearInterval(oneTimer);

                        access.browserMenu.hide();
                        var id = helper.idGenerator('oneMenuOuter');;
                        var menuWidth = 4.5*access.unit;
                        var menuOuter = NEW(OneMenuOuter);

                        menuOuter
                            .withWidth(menuWidth)
                            .withContainerSrc(access.mainContainer)
                            .withUnit(access.unit)
                            .withCancelAction(OneScriptWriter.write(access)['bookmarkPluginCancel'])
                            .create()

                        menuOuter.createListMenu();
                        menuOuter.show();
                        access.bookmarkMenu = menuOuter;

                        for (var i = 0; i < oneRecentBookmarks.length; i++) {
                            console.log('pushing');
                            var title = oneRecentBookmarks[i].title;
                            if (title.length > 40) { title = title.slice(0, 40)+'...';}
                            list.push(
                                {
                                    'type': 'BOOKMARK',
                                    'realImgUrl': true,
                                    'buttonCss': {
                                        'position': 'absolute',
                                        'top': access.unit*0.5,
                                        'left': access.unit*0.5,
                                        'height': access.unit*2,
                                        'width': access.unit*2,
                                        'background': 'black',
                                        'box-shadow': '0px 0px 0px 5px white inset',
                                        'border-radius': '10%',
                                    },
                                    'removeButtonCss': {
                                        'position': 'absolute',
                                        'top': access.unit*0.25,
                                        'right': access.unit*0.25,
                                        'height': access.unit,
                                        'width': access.unit,
                                        'background': '#F22',
                                        'box-shadow': '0px 0px 0px 5px white inset',
                                        'border-radius': '10%',
                                    },
                                    'confirmButtonCss': {
                                        'position': 'absolute',
                                        'bottom': access.unit*0.25,
                                        'right': access.unit*0.25,
                                        'height': access.unit,
                                        'width': access.unit,
                                        'background': 'gray',
                                        'box-shadow': '0px 0px 0px 5px white inset',
                                        'border-radius': '10%',
                                    },
                                    'img': helper.getUrlIcon(oneRecentBookmarks[i].url),
                                    'imgCss': {
                                        'position': 'absolute',
                                        'height': '20%',
                                        'width': '20%',
                                        'margin': 'auto',
                                        'left': 0,
                                        'right': 0,
                                        'top': '15%',
                                        'pointer-events': 'none',
                                        'border-radius': '10%',
                                    },

                                    'imgRemoveCss': {
                                        'position': 'absolute',
                                        'height': '20%',
                                        'width': '20%',
                                        'margin': 'auto',
                                        'right': 0,
                                        'left': 0,
                                        'top': 0,
                                        'bottom': 0,
                                        'height': '60%',
                                        'width': '60%',
                                        'pointer-events': 'none',
                                        'border-radius': '10%',
                                    },
                                    'confirmImg': 'img/check.svg',
                                    'imgConfirmCss': {
                                        'position': 'absolute',
                                        'height': '20%',
                                        'width': '20%',
                                        'margin': 'auto',
                                        'right': 0,
                                        'left': 0,
                                        'top': 0,
                                        'bottom': 0,
                                        'height': '60%',
                                        'width': '60%',
                                        'pointer-events': 'none',
                                        'border-radius': '10%',
                                    },
                                    'removeImg': 'img/bin.svg',
                                    'descriptionCss': {
                                        'position': 'absolute',
                                        'margin': 'auto',
                                        'left': 0,
                                        'right': 0,
                                        'bottom': 0,
                                        'height': '50%',
                                        'width': '80%',
                                        'display': 'table',
                                        'overflow': 'hidden',
                                        'display': 'table',
                                    },
                                    'descriptionSpanCss': {
                                        'margin': 'auto',
                                        'top': 0,
                                        'bottom': 0,
                                        'left': 0,
                                        'right': 0,
                                        'font-size': access.unit*0.2,
                                        'height': '80%',
                                        'width': '80%',
                                        'color': 'white',
                                        'display': 'table-cell',
                                        'text-align': 'center',
                                        'word-break': 'break-all',
                                        'font-weight': 'bold',
                                    },
                                    'descriptionText': title,
                                    'action': (function(i){
                                        return function(){window.location.href = oneRecentBookmarks[i].url};
                                    })(i),
                                    'removeAction': (function(i){
                                        return function(){
                                            console.log('BOOKMARK ' + oneRecentBookmarks[i].id + ' excluded')
                                            chrome.runtime.sendMessage({"message": "removeBookmark", "bookmarkId": oneRecentBookmarks[i].id});
                                        };
                                    })(i),
                                }
                            ) // end push bookmark
                        }
                        menuOuter.loadListMenu(list);
                    }
                }, 100);
            }, // end of bookmark action
            settings: function(){
                
                var titleColor= 'white';
                var titleContainerColor = '#555';
                var controlDisplayColor = '#333';
                var testPanelColor = 'gray';
                var targetContainerColor = '#333';

                var maxUnit = $(window).height()/(7.5);

                if($(window).height()/$(window).width() > 7.5/15) {
                    maxUnit = $(window).width()/15;
                }

                var interSpace = 0.25*maxUnit
                var firstDiv = 4*maxUnit + 4*interSpace;
                var thirdDiv = maxUnit + 2*interSpace;
                var secondDiv = $(window).width()-firstDiv-thirdDiv;

                OneScriptWriter.getScript('openSettingsScript')();
                var idContainer = helper.buildDiv('settingsContainer', access.mainContainer.attr('id'), {
                    'position': 'fixed',
                    'top': 0,
                    'left': 0,
                    'height': $(window).height(),
                    'width': $(window).width(),
                    'background': 'black',
                });

                var idTuningPanel = helper.buildDiv('tuningPanel', idContainer, {
                    'position': 'fixed',
                    'top': 0,
                    'left': 0,
                    'height': $(window).height(),
                    'width': firstDiv,
                    'background': 'red',
                });

// /////////////////////////////////////////////////////////////////////////////
                var idTuningSize = helper.buildDiv('tuningSize', idTuningPanel, {
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'height': $(window).height()/2,
                    'width': firstDiv,
                    'background': 'orange',
                });

// /////////////////////////////////////////////////////////////////////////////
                var idTuningSizeLabel = helper.buildDiv('tuningSizeLabel', idTuningSize, {
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'height': (1/3)*($(window).height()/2),
                    'width': firstDiv,
                    'background': 'teal',
                    'display': 'table',
                });
                var idTuningSizeSpan = helper.buildDiv('tuningSizeSpan', idTuningSizeLabel, {
                    'background': titleContainerColor,
                    'display': 'table',
                    'font-size': maxUnit*0.4,
                    'height': '80%',
                    'width': '80%',
                    'color': titleColor,
                    'text-align': 'center',
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                    'font-weight': 'bold',
                });
                $('#'+idTuningSizeSpan).text('MINIMUM BUTTON SIZE');
// /////////////////////////////////////////////////////////////////////////////

                var idTuningSizeControl = helper.buildDiv('tuningSizeControl', idTuningSize, {
                    'position': 'absolute',
                    'top': (1/3)*($(window).height()/2),
                    'left': 0,
                    'height': (2/3)*($(window).height()/2),
                    'width': firstDiv,
                    'background': controlDisplayColor,
                });

                var idSizeDisplay = helper.buildDiv('sizeDisplay', idTuningSizeControl, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': interSpace + maxUnit + interSpace,
                    'height': maxUnit,
                    'width': 2*maxUnit,
                    'background': 'gray',
                    'display': 'table',
                });
                var idSizeDisplaySpan = helper.buildSpan('sizeDisplaySpan', access.unit + 'px', idSizeDisplay, {
                    'background': 'white',
                    'display': 'table',
                    'font-size': maxUnit*0.6,
                    'height': '80%',
                    'width': '80%',
                    'color': 'black',
                    'text-align': 'center',
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                });

                var idIncreaseSize = helper.buildDiv('increaseSize', idTuningSizeControl, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'right': interSpace,
                    'height': maxUnit,
                    'width': maxUnit,
                    'background': 'white',
                    'border-radius': '10%',
                    'box-shadow': '0px 0px 0px 5px black inset',
                });
                helper.insertAOE(idIncreaseSize);
                helper.buildImg('increase', 'img/add.svg', idIncreaseSize, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '80%',
                    'width': '80%',
                });
                var sizeTimer = null;
                $('#'+idIncreaseSize).hover(function() {
                    $(this).css('background', 'yellow');
                    function increase(){
                        access.unit += 1;
                        if (access.unit > maxUnit) {
                            access.unit = Math.floor(maxUnit);
                        }
                        $('#'+idSizeDisplaySpan).text((access.unit) + 'px');
                        for(var i = 0; i < postOrder.length; i++) {
                            var pos = getPosition(postOrder[i][0], postOrder[i][1], access.unit, buttonContainerSize);
                            $('#'+buttonsId[i]).css({
                                    'top': pos.y,
                                    'left': pos.x,
                                    'height': access.unit,
                                    'width': access.unit,
                            });
                        }
                        sizeTimer = setTimeout(increase, 50);
                    }
                    increase();
                }, function() {
                    $(this).css('background', 'white');
                    clearTimeout(sizeTimer);
                });

                var idDecreaseSize = helper.buildDiv('decreaseSize', idTuningSizeControl, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': interSpace,
                    'height': maxUnit,
                    'width': maxUnit,
                    'background': 'white',
                    'border-radius': '10%',
                    'box-shadow': '0px 0px 0px 5px black inset',
                });
                helper.insertAOE(idDecreaseSize);
                helper.buildImg('increase', 'img/minus.svg', idDecreaseSize, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '80%',
                    'width': '80%',
                });
                $('#'+idDecreaseSize).hover(function() {
                    $(this).css('background', 'yellow');
                    function decrease(){
                        access.unit -= 1;
                        if (access.unit < maxUnit*0.5) {
                            access.unit = Math.floor(maxUnit*0.5);
                        }
                        $('#'+idSizeDisplaySpan).text((access.unit) + 'px');
                        for(var i = 0; i < postOrder.length; i++) {
                            var pos = getPosition(postOrder[i][0], postOrder[i][1], access.unit, buttonContainerSize);
                            $('#'+buttonsId[i]).css({
                                    'top': pos.y,
                                    'left': pos.x,
                                    'height': access.unit,
                                    'width': access.unit,
                            });
                        }
                        sizeTimer = setTimeout(decrease, 50);
                    }
                    decrease();
                }, function() {
                    $(this).css('background', 'white');
                    clearTimeout(sizeTimer);
                });

                var idTestPanel = helper.buildDiv('testPanel', idContainer, {
                    'position': 'fixed',
                    'top': 0,
                    'left': firstDiv,
                    'height': $(window).height(),
                    'width': secondDiv,
                    'background': testPanelColor,
                });


                var buttonContainerSize = 4.5*maxUnit;
                var idButtonContainer = helper.buildDiv('buttonContainer', idTestPanel, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': buttonContainerSize,
                    'width': buttonContainerSize,
                    'background': targetContainerColor,
                    'border-radius': '50%/50%'
                });

                function getPosition(i, j, unit, containerSize) {
                   var self = this; 
                   var xC = containerSize/2; 
                   var yC = containerSize/2; 
                   var x11 = 2*unit;
                   var y11 = 2*unit;
                   var xt = xC-x11;
                   var yt = yC-y11; 
                   return {
                       'x':  xt + (j)*(unit/2)+(j*unit),
                       'y':  yt + (i)*(unit/2)+(i*unit),
                   }
                };

                var postOrder = [[0,1], [1,0], [1,1], [1,2], [2,1]];
                var buttonsId = [];
                for(var i = 0; i < postOrder.length; i++) {
                    var pos = getPosition(postOrder[i][0], postOrder[i][1], access.unit, buttonContainerSize);
                    var id = helper.buildDiv('testButton', idButtonContainer, {
                        'position': 'absolute',
                        'margin': 'auto',
                        'top': pos.y,
                        'left': pos.x,
                        'height': access.unit,
                        'width': access.unit,
                        'background': 'white',
                        'border-radius': '10%',
                        // 'opacity': 1,
                    });
                    helper.buildImg('targetImg', 'img/target.svg', id, {
                        'position': 'absolute',
                        'margin': 'auto',
                        'top': 0,
                        'bottom': 0,
                        'left': 0,
                        'right': 0,
                        'height': '80%',
                        'width': '80%',
                    });
                    helper.insertAOE(id);
                    buttonsId.push(id);

                    $('#'+buttonsId[i]).toggleClass('sizeableButton');
                    $('#'+buttonsId[i]).hover(function() {
                        var tgt = this;
                        OneDwellTimeBar.dwell(function(){
                            $(tgt).css("transition", "transform "+0.250+"s ease-out"); 
                            $(tgt).css('-webkit-transform', 'scale(0.0)');
                            setTimeout(function() {
                                $(tgt).css("transition", "transform "+0.250+"s ease-in"); 
                                $(tgt).css('-webkit-transform', 'scale(1.0)');
                            }, 250);
                        }, $(this), access.unit);
                    }, function() {
                        OneDwellTimeBar.clear();
                        var tgt = this;
                    });
                }

                var idSaveQuit = helper.buildDiv('saveQuit', idContainer, {
                    'position': 'fixed',
                    'top': 0,
                    'right': 0,
                    'height': $(window).height(),
                    'width': thirdDiv,
                    'background': '#333',
                    'opacity': '1.0',
                });

                var idSaveContainer = helper.buildDiv('saveContainer', idSaveQuit, {
                    'position': 'absolute',
                    'top': 0,
                    'height': $(window).height()/2,
                    'width': thirdDiv,
                });

                var idQuitContainer = helper.buildDiv('quitContainer', idSaveQuit, {
                    'position': 'absolute',
                    'top': $(window).height()/2,
                    'height': $(window).height()/2,
                    'width': thirdDiv,
                });

                var idSaveButton = helper.buildDiv('saveButton', idSaveContainer, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': maxUnit,
                    'width': maxUnit,
                    'background': '#4F4',
                    'border-radius': '10%',
                    'box-shadow': '0px 0px 0px 5px black inset',
                });
                helper.insertAOE(idSaveButton);
                helper.buildImg('saveImg', 'img/save.svg', idSaveButton, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '80%',
                    'width': '80%',
                });

                $('#'+idSaveButton).hover(function() {
                    OneDwellTimeBar.dwell(function(){
                        access.userSettings.unit = access.unit; 
                        access.userSettings.dwellTime = access.dwellTime; 
                        chrome.storage.sync.set( { 'userSettings': access.userSettings}, function() {
                                console.log('armazenando do storage')
                            });
                    }, $(this), maxUnit);
                }, function() {
                    OneDwellTimeBar.clear();
                });

                var idQuitButton = helper.buildDiv('quitButton', idQuitContainer, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': maxUnit,
                    'width': maxUnit,
                    'background': '#F44',
                    'border-radius': '10%',
                    'box-shadow': '0px 0px 0px 5px black inset',
                });
                helper.insertAOE(idQuitButton);
                helper.buildImg('saveImg', 'img/closeBlack.svg', idQuitButton, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '80%',
                    'width': '80%',
                });

                $('#'+idQuitButton).hover(function() {
                    OneDwellTimeBar.dwell(function(){
                        access.mainContainer.remove();
                        access.prepare(access);
                    }, $(this), maxUnit);
                }, function() {
                    OneDwellTimeBar.clear();
                });

////////////////////////////////////////////////////////////////////////
                var idTuningDwell = helper.buildDiv('tuningDwell', idTuningPanel, {
                    'position': 'absolute',
                    'bottom': 0,
                    'left': 0,
                    'height': $(window).height()/2,
                    'width': firstDiv,
                    'background': 'gray',
                });

/////////////////////////////////////////////////////////////////////////////
                var idTuningDwellLabel = helper.buildDiv('tuningDwellLabel', idTuningDwell, {
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'height': (1/3)*($(window).height()/2),
                    'width': firstDiv,
                    'background': 'teal',
                    'display': 'table',
                });
                var idTuningDwellSpan = helper.buildDiv('tuningDwellSpan', idTuningDwellLabel, {
                    'background': titleContainerColor,
                    'display': 'table',
                    'font-size': maxUnit*0.4,
                    'height': '80%',
                    'width': '80%',
                    'color': titleColor,
                    'text-align': 'center',
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                    'font-weight': 'bold',
                });
                $('#'+idTuningDwellSpan).text('DWELL TIME');

                var idTuningDwellControl = helper.buildDiv('tuningDwellControl', idTuningDwell, {
                    'position': 'absolute',
                    'top': (1/3)*($(window).height()/2),
                    'left': 0,
                    'height': (2/3)*($(window).height()/2),
                    'width': firstDiv,
                    'background': controlDisplayColor,
                });

                var idDwellDisplay = helper.buildDiv('dwellDisplay', idTuningDwellControl, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': interSpace + maxUnit + interSpace,
                    'height': maxUnit,
                    'width': 2*maxUnit,
                    'background': 'gray',
                    'display': 'table',
                });
                var idDwellDisplaySpan = helper.buildSpan('dwellDisplaySpan', access.dwellTime + 'ms', idDwellDisplay, {
                    'background': 'white',
                    'display': 'table',
                    'font-size': maxUnit*0.6,
                    'height': '80%',
                    'width': '80%',
                    'color': 'black',
                    'text-align': 'center',
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                });
                $('#'+idDwellDisplaySpan).text(access.dwellTime + 'ms');

                var idIncreaseDwell = helper.buildDiv('increaseSize', idTuningDwellControl, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'right': interSpace,
                    'height': maxUnit,
                    'width': maxUnit,
                    'background': 'white',
                    'border-radius': '10%',
                    'box-shadow': '0px 0px 0px 5px black inset',
                });
                helper.insertAOE(idIncreaseDwell);
                helper.buildImg('increase', 'img/add.svg', idIncreaseDwell, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '80%',
                    'width': '80%',
                });
                var dwellTimer = null;
                $('#'+idIncreaseDwell).hover(function() {
                    $(this).css('background', 'yellow');
                    function increase(){
                        access.dwellTime += 50;
                        if (access.dwellTime > 2000) {
                            access.dwellTime = 2000;
                        }
                        OneDwellTimeBar.setTime(access.dwellTime);
                        $('#'+idDwellDisplaySpan).text((access.dwellTime) + 'ms');
                        dwellTimer = setTimeout(increase, 300);
                    }
                    increase();
                }, function() {
                    $(this).css('background', 'white');
                    clearTimeout(dwellTimer);
                });

                var idDecreaseDwell = helper.buildDiv('decreaseDwell', idTuningDwellControl, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': interSpace,
                    'height': maxUnit,
                    'width': maxUnit,
                    'background': 'white',
                    'border-radius': '10%',
                    'box-shadow': '0px 0px 0px 5px black inset',
                });
                helper.insertAOE(idDecreaseDwell);
                helper.buildImg('increase', 'img/minus.svg', idDecreaseDwell, {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '80%',
                    'width': '80%',
                });
                $('#'+idDecreaseDwell).hover(function() {
                    $(this).css('background', 'yellow');
                    function decrease(){
                        access.dwellTime -= 50;
                        if (access.dwellTime < 100) {
                            access.dwellTime = 100;
                        }
                        OneDwellTimeBar.setTime(access.dwellTime);
                        $('#'+idDwellDisplaySpan).text((access.dwellTime) + 'ms');
                        dwellTimer = setTimeout(decrease, 300);
                    }
                    decrease();
                }, function() {
                    $(this).css('background', 'white');
                    clearTimeout(dwellTimer);
                });
            } // end of settings
        }
    }

}
