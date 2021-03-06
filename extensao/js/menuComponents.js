// Class: menu used to display representations of candidate objets or other items like plugins and bookmarks
var OneMenuOuter = {

    // Function: set the menu width
    withWidth: function(width) {
        this.width = width;
        return this;
    },

    // Function: set the source container
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },

    // Function: set unit used to size the menu 
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },

    // Function: callback funtion triggered when the menu is closed
    withCancelAction: function(cancelAction) {
        this.cancelAction = cancelAction;
        return this;
    },

    getId: function() {
        var self = this;
        return self.id;
    },

    // Function: create menu
    create: function() {
        var self = this;

        self.id = helper.buildDiv('menuOuter', self.containerSrc.attr('id'), {
                'position': 'fixed',
                'right': 0,
                'top': 0,
                'width': self.width,
                'height': '100%',
                'background': 'gray',
                'z-index': 2147483645,
                'visibility': 'hidden',
        });

        var idMenuCancel = helper.buildDiv('menuCancel', self.id, {
            'width': '100%',
            'height': self.unit*1.5,
            'background': '#F55',
            'position': 'absolute',
            'top': 0,
            'border-bottom': '1px solid gray',
        });
        $('#'+idMenuCancel).hover(function() {
            OneDwellTimeBar.dwell(function(){
                $('.onePageStamp').remove();
                self.cancelAction();
            }, $(this));  
        }, function() {
            $(this).css('background', '#F55');
            OneDwellTimeBar.clear();
        });

    },

    // Functions: create inside container that contains a list of items
    createListMenu: function() {
        var self = this;
        self.listMenu = NEW(OneListMenu);

        self.listMenu
            .withContainerSrc($('#'+self.id))
            .withX(0)
            .withY(self.unit*1.5)
            .withWidth(self.width)
            .withHeight($(window).height()-self.unit*1.5)
            .withUnit(self.unit)
            .create();

    },

    // Functions: load the container with items
    loadListMenu: function(list) {
        var self = this;
        self.listMenu.insertFormattedList(list);
    },

    // Funçtions: show the menu
    show: function() {
        var self = this;
        $('#'+self.id).css('visibility', 'visible');
    },

    // Functions: remove the menu
    remove: function() {
        var self = this;
        $('#'+self.id).remove();
    }
}

// Class: container that display a list of items
var OneListMenu = {

    // Function: set the source container
    withContainerSrc: function(containerSrc) {
        var self = this;
        self.containerSrc = containerSrc;
        return this;
    },

    // Function: horizontal position relative to source container
    withX: function(x) {
        var self = this;
        self.x = x;
        return this;
    },

    // Function: vertical position relative to source container
    withY: function(y) {
        var self = this;
        self.y = y;
        return this;
    },

    // Functions: set menu width in pixels
    withWidth: function(width) {
        var self = this;
        self.width = width;
        return this;
    },

    // Functions: set menu width in pixels
    withHeight: function(height) {
        var self = this;
        self.height = height;
        return this;
    },

    // Function: set unit used to size the menu 
    withUnit: function(unit) {
        var self = this;
        self.unit = unit;
        return this;
    },

    // Functions: create list item menu
    create: function() {
        var self = this;

        self.id = helper.buildDiv('oneMenu', self.containerSrc.attr('id'), {
            'position': 'absolute',
            'left': self.x,
            'top': self.y,
            'width': self.width,
            'height': self.height,
            'z-index': 2147483647,
            'overflow': 'hidden',
        });

        self.idItemContainer = helper.buildDiv('itemContainer', self.id, {
            'width': '100%',
            'height': $('#'+self.id).height()-2*self.unit,
            'position': 'absolute',
            'top': 0,
            'z-index': -1,
        });

        self.buildScrollers();
    },

    // Functions: build scrollers to display the item list
    buildScrollers: function() {
        var self = this;
        var idUpScroll = helper.buildDiv('upScroll', self.id, {
            'top': 0,
            'left': self.x,
        });
        var idDownScroll = helper.buildDiv('downScroll', self.id, {
            'bottom': 0,
            'left': self.x,
        });

        var className = helper.idGenerator('linkScroll')
        $('#'+idUpScroll).toggleClass(className);
        $('#'+idDownScroll).toggleClass(className);
        $('.'+className).css({
            'width': self.width,
            'height': self.unit*1.5,
            'background': '#81C99F',
            'position': 'absolute',
            'z-index': 2147483646,
            'opacity': 0.0,
        });

        var downScrollTimer = null;
        $('#'+idDownScroll).hover(function() {
            var diff = 10;
            $('#'+idUpScroll).css( {'pointer-events': 'auto',});
            $('#'+idDownScroll).css( {'opacity': '0.5',});
            downScrollTimer = setInterval(function() {
                var currentY = $('#'+self.idItemContainer).offset().top;
                var bottom = currentY + self.itemCounter*self.unit*3.0;
                if ((bottom-diff) < ($(window).scrollTop() + (self.y+self.height))){
                    $('#'+idDownScroll).css( {'pointer-events': 'none',});
                    $('#'+idDownScroll).css( {'opacity': '0.0',});
                    clearInterval(downScrollTimer);
                } else {
                    $('#'+self.idItemContainer).offset({top : currentY-diff});
                }
            }, 20);
        }, function() {
            $('#'+idDownScroll).css( {'opacity': '0.0',});
            clearInterval(downScrollTimer); 
        });

        $('#'+idUpScroll).hover(function() {
            var diff = 10;
            $('#'+idDownScroll).css( {'pointer-events': 'auto',});
            $('#'+idUpScroll).css( {'opacity': '0.5',});
            downScrollTimer = setInterval(function() {
                var currentY = $('#'+self.idItemContainer).offset().top;
                if (currentY + diff > $(window).scrollTop()+self.y) {
                    $('#'+idUpScroll).css( {'pointer-events': 'none',});
                    $('#'+idUpScroll).css( {'opacity': '0.0',});
                    clearInterval(downScrollTimer);
                } else {
                    $('#'+self.idItemContainer).offset({top : currentY+diff});
                }
            }, 20);
        }, function() {
            $('#'+idUpScroll).css( {'opacity': '0.0',});
            clearInterval(downScrollTimer); 
        });
    },

    // Functions: format the items according to their types
    insertFormattedList: function(formattedList) {

        var self = this;
        
        self.empty();

        for (var i = 0; i < formattedList.length; i++) {
            var idOneItem = helper.buildDiv('oneItem', self.idItemContainer, {
                'position': 'relative',
                'top': 0,
                'left': 0,
                'height': self.unit*(3.0),
                'width': '100%',
                'background': '#333',
                'box-shadow': '0px 0px 0px 1px gray inset',
                'color': 'white',
            });

            switch(formattedList[i].type) {
                case "PAGE_ELEMENT": {

                    var item = formattedList[i];

                    var idOneStamp = helper.buildDiv('oneStamp', idOneItem, item.stampCss);
                    helper.insertAOE(idOneStamp);
                    var idOneStampSpan = helper.buildDiv('oneStampSpan', idOneStamp, item.stampSpanCss);
                    var idOneStampSpanSpan = helper.buildSpan('oneStampSpanSpan', i, idOneStampSpan, item.stampSpanSpanCss);
                    var idOneDescription = helper.buildDiv('oneDescription', idOneStamp, item.descriptionCss);
                    var idOneDescriptionSpan = helper.buildSpan('oneDescriptionSpan', item.descriptionText,
                            idOneDescription, item.descriptionSpanCss);

                    // closure for the variable 'i'
                    (function(i, idOneItem) {

                        $('#'+idOneItem).hover(function() {
                            $('.oneSelected').css('box-shadow', '0px 0px 0px 0px red inset');
                            $('.oneSelected').toggleClass('oneSelected');
                            formattedList[i].element.css('box-shadow', '0px 0px 0px 1px red inset');
                            formattedList[i].element.toggleClass('oneSelected');
                        }, function() {
                        });

                        $('#'+idOneStamp).hover(function() {

                            OneDwellTimeBar.dwell(function(){
                                clearTimeout(self.sizeTimer);
                                formattedList[i].action();
                            }, $(this));  
                        }, function() {
                            OneDwellTimeBar.clear(); 
                        });
                    })(i, idOneItem)
                    break;
                }
                case "PLUGIN": {
                    console.log("INSERTING PLUGINS");
                    var item = formattedList[i];

                    var idOneButton = helper.buildDiv('oneButton', idOneItem, item.buttonCss);
                    helper.insertAOE(idOneButton);

                    helper.buildImg('pluginImg', item.img, idOneButton, item.imgCss);

                    var idOneDescription = helper.buildDiv('oneDescription', idOneButton, item.descriptionCss);
                    var idOneDescriptionSpan = helper.buildSpan('oneDescriptionSpan', item.descriptionText,
                            idOneDescription, item.descriptionSpanCss);

                    // closure for the variable 'i'
                    (function(i) {
                        $('#'+idOneButton).hover(function() {
                            OneDwellTimeBar.dwell(function(){
                                clearTimeout(self.sizeTimer);
                                formattedList[i].action();
                            }, $(this));  
                        }, function() {
                            OneDwellTimeBar.clear(); 
                        });
                    })(i)
                    break;
                }
                case 'BOOKMARK': {
                    console.log("INSERTING BOOKMARKS");
                    var item = formattedList[i];

                    var idOneButton = helper.buildDiv('oneButton', idOneItem, item.buttonCss);
                    helper.insertAOE(idOneButton);

                    if (typeof(item.realImgUrl) === 'undefined') {
                        helper.buildImg('pluginImg', item.img, idOneButton, item.imgCss);
                    } else {
                        helper.buildImg('pluginImg', item.img, idOneButton, item.imgCss, true); // real url 
                    }

                    var idOneConfirmButton = helper.buildDiv('oneConfirmButton', idOneItem, item.confirmButtonCss);
                    helper.insertAOE(idOneConfirmButton);
                    var pluginConfirmImg = helper.buildImg('pluginConfirmImg', item.confirmImg, idOneConfirmButton, item.imgConfirmCss);

                    var idOneRemoveButton = helper.buildDiv('oneRemoveButton', idOneItem, item.removeButtonCss);
                    helper.insertAOE(idOneRemoveButton);
                    var pluginRemoveImg = helper.buildImg('pluginRemoveImg', item.removeImg, idOneRemoveButton, item.imgRemoveCss);
                    (function(i, idOneItem, idOneConfirmButton, idOneRemoveButton) {
                        $('#'+idOneRemoveButton).hover(function(ev) {
                            var that = this;
                            OneDwellTimeBar.dwell(function(){
                                if( $(that).hasClass('oneRemove')) {
                                    $(that).toggleClass('oneRemove');
                                    $('#'+idOneConfirmButton).css({'background': 'gray'});
                                    $('#'+idOneRemoveButton+' img').attr('src', chrome.extension.getURL('img/bin.svg'));
                                    $('#'+idOneConfirmButton).unbind('mouseenter mouseleave');
                                } else {
                                    $(that).toggleClass('oneRemove');
                                    $('#'+idOneConfirmButton).css({'background': '#2F2'});
                                    $('#'+idOneRemoveButton+' img').attr('src', chrome.extension.getURL('img/close.svg'));
                                    $('#'+idOneConfirmButton).hover(function() {
                                        OneDwellTimeBar.dwell(function(){
                                            formattedList[i].removeAction();
                                            $('#'+idOneItem).remove();
                                        }, $(this));  
                                    }, function() {
                                        OneDwellTimeBar.clear(); 
                                    });
                                }
                            }, $(this));  
                        }, function() {
                            OneDwellTimeBar.clear(); 
                        });

                    })(i, idOneItem, idOneConfirmButton, idOneRemoveButton)



                    var idOneDescription = helper.buildDiv('oneDescription', idOneButton, item.descriptionCss);
                    var idOneDescriptionSpan = helper.buildSpan('oneDescriptionSpan', item.descriptionText,
                            idOneDescription, item.descriptionSpanCss);

                    // closure for the variable 'i'
                    (function(i) {
                        $('#'+idOneButton).hover(function() {
                            OneDwellTimeBar.dwell(function(){
                                clearTimeout(self.sizeTimer);
                                formattedList[i].action();
                            }, $(this));  
                        }, function() {
                            OneDwellTimeBar.clear(); 
                        });
                    })(i)
                    break;
                }
            }
            self.itemCounter++;
        } 
    },

    // Function: empty item list
    empty: function() {
        var self = this;
        self.itemCounter = 0;
        $('#'+self.idItemContainer).empty();
        $('#'+self.idItemContainer).css('top', '0');
    },
};
