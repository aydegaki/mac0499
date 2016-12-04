// Class: menu with basic browser features and plugin
var OneMenuBrowser = {

    idOuter: null,
    idNav: null,
    unit: null,
    cancelAction: null,

    menuOuter: null,
    bookMarks: null,

    getUnit: function() {
        var self = this;
        return self.unit;
    },

    // Function: set unit that determines button size
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    // Function: set source container
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },
    // Function: set callback function when this menu is closed
    withCancelAction: function(cancelAction) {
        this.cancelAction = cancelAction;
        return this;
    },
    // Function: set callback function when URL entrance is selected
    withKeyboardAction: function(keyboardAction) {
        this.keyboardAction = keyboardAction;
        return this;
    },
    // Function: set keyboard used when URL entrance is selected
    withKeyboard: function(keyboard) {
        this.keyboard = keyboard;
        return this;
    },

    // Function: create navigation menu and plugin menu
    create: function() {
        var self = this;

        self.menuPluginWidth = 3.0*self.unit;

        /* plugin space */
        self.menuOuter = NEW(OneMenuOuter);
        self.menuOuter
            .withWidth(self.menuPluginWidth)
            .withContainerSrc(self.containerSrc)
            .withUnit(self.unit)
            .withCancelAction(self.cancelAction)
            .create()
        self.menuOuter.createListMenu();

        self.navMenu = NEW(OneNavigationMenu);
        self.navMenu.withContainerSrc(self.containerSrc)
            .withUnit(self.unit)
            .withMenuPluginWidth(self.menuPluginWidth)
            .withCancelAction(self.cancelAction)
            .withKeyboardAction(self.keyboardAction)
            .withKeyboard(self.keyboard)
            .create();
    },

    getMenuOuter: function() {
        var self = this;
        return self.menuOuter;
    },

    // Function: load menu with plugins
    loadMenuOuter: function(pluginList) {
        var self = this;
        self.menuOuter.loadListMenu(
                pluginList
        );
    },

    // Function: hide menus
    hide: function() {
        var self = this;
        $('#'+self.menuOuter.getId()).css('visibility', 'hidden');
        $('#'+self.navMenu.getId()).css('visibility', 'hidden');
    },

    // Function: menus and reload plugins
    show: function(pluginList) {
        var self = this;

        chrome.runtime.sendMessage({"message": "requestAllBookmark"});
        var oneTimer = setInterval(function() {
            if (oneAllBookmarks) {
                clearInterval(oneTimer);
                for (var i = 0; i < oneAllBookmarks.length; i++) {
                    if (oneAllBookmarks[i].url === window.location.href) {
                        var imgUrl = chrome.extension.getURL('img/starFull.svg');
                        $('div[label=bookmark] img').attr('src', imgUrl);
                        break;
                    }
                }
            }
        }, 100);
        oneAllBookmarks = [];

        $('#'+self.menuOuter.getId()).css('visibility', 'visible');
        $('#'+self.navMenu.getId()).css('visibility', 'visible');

        console.log('called');
        // reloading menu with plugins
        self.menuOuter.loadListMenu(
            pluginList
        );
    },

    // Function: hide url input
    hideUrlInput: function() {
        var self = this;
        self.navMenu.hideUrlInput();
    }
};

// Class: menu with basic browser functions
var OneNavigationMenu = {

    id: null,
    unit: null,
    side: null,
    x0: null,
    y0: null,
    buttonCounter: 0,

    // Functions: set source container
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },

    // Function: set unit that determines button size
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },

    // Function: set an id for this menu
    withId: function(id) {
        this.id = id;
        return this;
    },

    // Function: parameter necessary to place this menu
    withMenuPluginWidth: function(menuPluginWidth) {
        this.menuPluginWidth = menuPluginWidth;
        return this;
    },

    // Function: set callback function when this menu is closed
    withCancelAction: function(cancelAction) {
        this.cancelAction = cancelAction;
        return this;
    },

    // Function: set callback function when URL entrance is selected
    withKeyboardAction: function(keyboardAction) {
        this.keyboardAction = keyboardAction;
        return this;
    },

    // Function: set keyboard used when URL entrance is selected
    withKeyboard: function(keyboard) {
        this.keyboard = keyboard;
        return this;
    },

    getId: function() {
        var self = this;
        return self.id;
    },

    // Functions: create basic browser functions menu
    create: function(){
        var self = this;

        self.side = 3*(self.unit*1.5);

        self.y0 = ($(window).height()/2)-self.side/2;
        self.x0 = (($(window).width()-self.menuPluginWidth)/2)-self.side/2

        self.containerSrc.append('<div id="'+self.id+'"></div>');
        self.id = helper.buildDiv('navMenu', self.containerSrc.attr('id'), {
            'position': 'fixed',
            'top': self.y0,
            'left': self.x0,
            'height': self.side,
            'width': self.side,
            'background': '#333',
            'box-shadow': '0px 0px 0px 2px gray inset',
            'z-index': 2147483645,
            'border-radius': '50%/50%',
            'visibility': 'hidden',
        });

        self.buildButton(0,1, 'img/url.svg', self.actionMap().url, 'url');
        self.buildButton(1,0, 'img/back.svg', self.actionMap().back, 'back');
        self.buildButton(1,1, 'img/reload.svg', self.actionMap().reload, 'reload');
        self.buildButton(1,2, 'img/forward.svg', self.actionMap().forward, 'forward');
        self.buildButton(2,1, 'img/star.svg', self.actionMap().bookmarkIt, 'bookmark');
            
    },
    
    // Function: return postion for the buttons
    getPosition: function(i, j) {
       var self = this; 
       return {
           'x': self.unit*0.25 + self.x0+j*self.unit + j*self.unit*0.5,
           'y': self.unit*0.25 + self.y0+i*self.unit + i*self.unit*0.5,
       }
    },

    // Function: build a button with (i,j) position in pixels, with an image 'img' that
    // triggers 'action' when selected. The action assigned is determined according to the 'label'
    buildButton: function(i, j, img, action, label) {
        var self = this;
        var imgUrl = chrome.extension.getURL(img);

        var pos = self.getPosition(i,j);
        var idNavButton = helper.buildDiv('navButton', self.id, {
            'position': 'fixed',
            'top': pos.y,
            'left': pos.x,
            'height': self.unit,
            'width': self.unit,
            'background': 'black',
            'box-shadow': '0px 0px 0px 5px white inset',
            'border-radius': '10%',
        });
        $('#'+idNavButton).attr('label', label);

        var idNavImg = helper.buildImg('navImg', imgUrl, idNavButton, {
            'position': 'absolute',
            'height': '70%',
            'width': '70%',
            'margin': 'auto',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'pointer-events': 'none',
        }, true);
        helper.insertAOE(idNavButton);

        $('#'+idNavButton).hover(function() {
            OneDwellTimeBar.dwell(function(){
                action();
            }, $(this));  
        }, function() {
            OneDwellTimeBar.clear(); 
        });

        self.buttonCounter++;
    },

    // Function: return a map of actions to be assigned to the buttons
    actionMap: function() {
        var self = this;
        return {
            'bookmarkIt': function() {
                chrome.runtime.sendMessage(
                    {
                        'message': 'bookmarkIt', 
                        'bookmark': {
                            'title': document.title,
                            'url': window.location.href,
                        }
                    }
                );
                var imgUrl = chrome.extension.getURL('img/starFull.svg');
                $('div[label=bookmark] img').attr('src', imgUrl);

            },
            'back': function() {
                window.history.back();
            },
            'forward': function() {
                window.history.forward();
            },
            'reload': function() {
                location.reload();
            },
            'url': function() {
                self.containerSrc.append('<input type="text" id="'+self.id+'Input"></div>');
                var inputH = self.unit/3;
                var inputW = $(window).width()*0.5;
                $('#'+self.id+'Input').css({
                    'position': 'fixed',
                    'top': ($(window).height()-self.keyboard.getHeight())/2 - 30/2,
                    'left': ($(window).width()/2)-inputW/2,
                    'z-index': 2147483644,
                    'height': inputH,
                    'width': inputW,
                    'font-size': self.unit/3,
                    'visibiliy': 'visible',
                    'box-shadow': '0px 0px 80px 30px gray',
                });

                self.idKeyboardEnter = helper.buildDiv('keyboardEnter', self.containerSrc.attr('id'), {
                    'position': 'fixed',
                    'top': ($(window).height()-self.keyboard.getHeight())/2 -self.unit/2,
                    'left': ($(window).width()/2)+inputW/2 + self.unit/2,
                    'height': self.unit,
                    'width': self.unit,
                    'background': '#44F',
                    'box-shadow': '0px 2px 4px darkblue',
                    'opacity': '0.9',
                    'z-index': 2147483645,
                    'border-radius': '10%',
                    'visibility': 'visible',
                });
                helper.insertAOE(self.idKeyboardEnter);

                helper.buildImg('keyboardEnterImg', 'img/find.svg', self.idKeyboardEnter, {
                    'position': 'absolute',
                    'height': '70%',
                    'width': '70%',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'pointer-events': 'none',
                });

                $('#'+self.idKeyboardEnter).hover(function() {
                    OneDwellTimeBar.dwell(function() {
                        $('#'+self.idKeyboardEnter).remove();
                        var url = 'http://'+$('#'+self.id+'Input').val();
                        self.cancelAction();
                        self.keyboard.hide();
                        window.location.href = url;
                    }, $(this), self.unit);
                }, function() {
                    OneDwellTimeBar.clear();
                });

                $('#'+self.id+'Input').focus();
                self.keyboardAction($('#'+self.id+'Input'));
            },
            'default': function() {
            }
        }
    }, 

    // Function: hide url input
    hideUrlInput: function() {
        var self = this;
        $('#'+self.id+'Input').remove();
        $('#'+self.idKeyboardEnter).remove();
    }
};
