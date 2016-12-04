// Class: side menu with buttons representing candidade objects found in the fixation area
var OneObjectSelector = {

    id: null,
    sufix: null,
    menuOuter: null,
    itemList: [],
    pageStampSize: 20,

    getUnit: function() {
        var self = this;
        return self.unit;
    },

    // Funtion: set 'unit' in pixels to determine menu and buttons dimensions
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    // Function: set source container
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },
    // Function: set callback function triggered when side menu is closed
    withCancelAction: function(cancelAction) {
        this.cancelAction = cancelAction;
        return this;
    },
    // Function: set callback function triggered when an input bar is selected
    withKeyboardAction: function(keyboardAction) {
        this.keyboardAction = keyboardAction;
        return this;
    },
    // Function: set initial scale
    withInitialScale: function(initialScale) {
        this.initialScale = initialScale;
        return this;
    },

    // Function: create side menu with buttons representing the candidate objects
    create: function() {

        var self = this;

        self.menuWidth = 3.0*self.unit;

        self.menuOuter = NEW(OneMenuOuter);

        self.menuOuter
            .withWidth(self.menuWidth)
            .withContainerSrc(self.containerSrc)
            .withUnit(self.unit)
            .withCancelAction(self.cancelAction)
            .create()

        self.menuOuter.createListMenu();
    },

    // Function: load the candidate objects in the side menu
    loadItemList: function(itemList) {

        var self = this;

        /* if there is no ambiguity, the selected object item is triggered */
        if (itemList.length === 1) {
            self.getAction(itemList[0])();
        } else { // preparing to insert items in list menu
            var formattedItemList = self.formatItemList(itemList);
            self.menuOuter.loadListMenu(formattedItemList);
            for (var i = 0; i < itemList.length; i++) {
                self.buildPageStamps(i, itemList[i].element);
            }
        }
    },

    // Function: determine how the candidate items will be displayed in the side menu
    formatItemList: function(rawList) {
        var self = this;
        var list = [];
        for (var i = 0; i < rawList.length; i++) {
            var backgroundColor = self.getColorStamp(rawList[i].element).backgroundColor;
            var borderColor = self.getColorStamp(rawList[i].element).borderColor;
            var color = self.getColorStamp(rawList[i].element).color;
            var text = self.getColorStamp(rawList[i].element).text;
            var limit = 40;
            if (text.length > limit) {
                text = text.slice(0, limit)+'...';
            } 
            var item = {
                'type': 'PAGE_ELEMENT',
                'element': rawList[i].element,
                'stampCss': {
                    'position': 'absolute',
                    'top': self.unit*0.5,
                    'left': self.unit*0.5,
                    'height': self.unit*2,
                    'width': self.unit*2,
                    'display': 'table',
                },
                'stampSpanCss': {
                    'position': 'absolute',
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '100%',
                    'width': '100%',
                    'transition': 'transform 1.0s',
                    'font-size': self.unit*0.4,
                    'background': backgroundColor,
                    'display': 'table',
                    'box-shadow': '0px 0px 0px 5px '+borderColor+' inset',
                    'pointer-events': 'none',
                    'border-radius': '10%',
                },
                'stampSpanSpanCss': {
                    'margin': 'auto',
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': '100%',
                    'width': '100%',
                    'font-size': self.unit*1.2,
                    'opacity': 0.25,
                    'font-family': 'helvetica',
                    'color': 'black',
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                    'text-align': 'center',
                    'font-weight': 'bold',
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
                    // 'background': 'orange',
                    'display': 'table',
                },

                'descriptionSpanCss': {
                    'height': '100%',
                    'width': '100%',
                    'font-family': 'helvetica',
                    'font-size': self.unit*0.25,
                    'height': '100%',
                    'width': '100%',
                    'display': 'table-cell',
                    'vertical-align': 'middle',
                    'text-align': 'center',
                    'color': 'black',
                    'font-weight': 'bold',
                    'text-shadow': '-1px 0 '+ backgroundColor +
                                   ', 0 1px ' + backgroundColor + 
                                   ', 1px 0 '+ backgroundColor +
                                   ', 0 -1px ' + backgroundColor,
                },

                'descriptionText': text,
                'action': self.getAction(rawList[i]),
            };
            list.push(item);
        }
        return list;
    },

    // Function: remove border created to highlight the objects
    cleanLinks: function() {
        var self = this;
        for (var i = 0; i < self.itemList.length; i++) {
            self.itemList[i].element.css('box-shadow', '0px 0px 0px 0px');
        }
        self.itemList = [];
    },

    // Function: zoom-in the candidate objects 
    optimizeView: function(itemList) {
        var self = this; 
        self.itemList = itemList;
        var scale = 1.0;
        var xMin = Number.MAX_VALUE;
        var yMin = Number.MAX_VALUE;
        var xMax = -Number.MAX_VALUE;
        var yMax = -Number.MAX_VALUE;
        var translation = null;
        if (itemList.length > 0) {
            for (var i = 0; i < itemList.length; i++) {
                offset = itemList[i].element.offset();


                var x = parseInt(offset.left);
                var y = parseInt(offset.top);
                var xw = x + itemList[i].element.width();
                var yh = y + itemList[i].element.height();
                if (x < xMin) {
                    xMin = x;
                }
                if (y < yMin) {
                    yMin = y;
                }
                if (xw > xMax) {
                    xMax = xw;
                }
                if (yh > yMax) {
                    yMax = yh;
                }
            }
        } 

        scale = self.computeScale(xMax-xMin, yMax-yMin, $(window).width()-self.menuWidth, $('#'+self.menuOuter.getId()).height());  
        translation = self.computeTranslation(xMax-xMin, yMax-yMin, $(window).width()-self.menuWidth, $('#'+self.menuOuter.getId()).height());
        var xMag = -xMin;
        var yMag = -yMin;
        var xMag2 = translation[0];
        var yMag2 = $(window).scrollTop() + translation[1];
        var xOrig = 0;
        var yOrig = 0;

        var xP = ($(window).width()-self.menuWidth)/2;
        var yP = $(window).scrollTop() + $(window).height()/2; 
        var xC = (xMax-(xMax-xMin)/2);
        var yC = (yMax-(yMax-yMin)/2);

        $("body").css({
            '-webkit-backface-visibility': 'hidden',
            '-webkit-transform': 'translate3d(0,0,0)',
        });
            $("body").css("transition", "transform "+1.0+"s ease-in"); 
            $('body').css('-webkit-transform-origin', xOrig+'% '+ yOrig+'%');
            $('body').css('-webkit-transform', 'translate(' + xMag2 + 'px, ' + yMag2 + 'px)  scale('+scale+') translate('+xMag+'px, '+yMag+'px) scale('+self.initialScale+')');

    },

    // Function: calculate a new scale to zoom-in
    computeScale: function(wInterval, hInterval, wSpace, hSpace) {
        var scale
            if (wInterval > hInterval) {
                scale = wSpace/wInterval;
            } else {
                scale = hSpace/hInterval;
            }
        return scale;
    },

    // Function: calculate a displacement to zoom-in
    computeTranslation: function(wInterval, hInterval, wSpace, hSpace, w0, h0) {
        var self = this;
        var translation = [];
        var xT = 0;
        var yT = 0;
        var scale = self.computeScale(wInterval, hInterval, wSpace, hSpace);
        if (wInterval > hInterval) {
            yT = ((hSpace-hInterval*scale))/2; 
            translation.push(xT);
            translation.push(yT);
        } else {
            xT = ((wSpace-wInterval*scale))/2; 
            translation.push(xT);
            translation.push(yT);
        }
        return translation;
    },

    // Function: get a color according to the type of object
    getColorStamp: function(item) {
        var tagName = item.prop('tagName');
        var backgroundColor = 'white';
        var borderColor = 'white';
        var color = 'white';
        var text = '';

        switch(tagName) {
            case 'A':
                backgroundColor = 'khaki';
                borderColor = 'goldenrod';
                color = 'goldenrod';
                text = item.text();
                if (text === '') {
                    text = 'NO DESCRIPTION';
                    color = 'red';
                }
                break;
            case 'INPUT':
                if (item.attr('type') === "text") {
                    backgroundColor = '#7F7';
                    borderColor = 'green';
                    text = 'TEXT INPUT';
                    color = '#4F4';
                }
                break;
            default: 
                if (item.hasClass('sbqs_c')) {
                    backgroundColor = 'white';
                    borderColor = '#BBB';
                    text = 'GOOGLE PREDICTION: ' + item.text();
                } else if (item.attr('type') === "submit") { 
                    backgroundColor = '#77F'; 
                    borderColor = 'blue';
                    text = 'SUBMIT BUTTON';
                    color = '#44F';
                }
                break;
        }

        
        return {
            'backgroundColor': backgroundColor,
            'borderColor': borderColor,
            'text': text,
            'color': color,
        };
    },

    // Function: build formatted markers near the candidate objects
    buildPageStamps: function(i, element) {

        var self = this;
        var backgroundColor = self.getColorStamp(element).backgroundColor;
        var borderColor = self.getColorStamp(element).borderColor;

        $('body').append('<div id="onePageStamp'+i+'" class="onePageStamp"></div>');
        $('#onePageStamp'+i).css({
            'position': 'absolute',
            'top': element.offset().top*(1/self.initialScale),
            'left': element.offset().left*(1/self.initialScale),
            'height': self.pageStampSize,
            'width': self.pageStampSize,
            'background': backgroundColor,
            'box-shadow': '0px 0px 0px 1px '+borderColor+' inset',
            'opacity': 0.8,
            'border-radius': '10%',
            'z-index': 2147483647,
        });

        $('body').append('<div id="onePageStampSolid'+i+'" class="onePageStamp"></div>');
        $('#onePageStampSolid'+i).css({
            'position': 'absolute',
            'top': element.offset().top*(1/self.initialScale),
            'left': element.offset().left*(1/self.initialScale),
            'height': self.pageStampSize,
            'width': self.pageStampSize,
            'display': 'table',
            'border-radius': '10%',
            'z-index': 2147483647,
        });
        $('#onePageStampSolid'+i).append('<span id="onePageStampSpan'+i+'">'+i+'</span>');
        $('#onePageStampSpan'+i).css({
            'margin': 'auto',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'font-family': 'helvetica',
            'font-size': '100%',
            'height': '80%',
            'width': '80%',
            'color': 'black',
            'display': 'table-cell',
            'vertical-align': 'middle',
            'text-align': 'center',
            'font-weight': 'bold',
            'border-radius': '10%',
        });
    },

    //  Functions: return a function according to the object
    getAction: function(item) {
        var self = this;
        var tagName = item.element.prop('tagName');
        switch(tagName) {
            case 'A':
                return actionClick;
                break;
            case 'INPUT':
                return actionSelectInput;
                break;
            default:
                // google suggestions
                if (item.element.hasClass('sbqs_c')) {
                    return actionClick;
                } else if (item.element.attr('type') === 'submit') {
                    return actionClick;
                }
                break;
        }
        function actionClick() {
                    self.hide();
                    $('.onePageStamp').remove();
                    self.cancelAction();
                    item.element[0].click(); // clica link 
        }
        function actionSelectInput() {
                    self.hide();
                    $('.onePageStamp').remove();
                    self.keyboardAction(item.element);

                    $("body").css("transition", "transform "+0.5+"s ease-in"); 
                    var x = (-item.x0) + $(window).width()/2 - item.w0/2;
                    var y = (-item.y0) + ($(window).height()-6*self.unit)/2 - item.h0/2;
                    $('body').css('-webkit-transform', 'translate('+x+'px, '+y+'px) scale('+self.initialScale+')');

                    item.element.focus();
                    item.element.val(item.element.val());
        }
    },

    // Function: hide side menu
    hide: function() {
        var self = this;
        $('#'+self.menuOuter.getId()).css('visibility', 'hidden');
        self.cleanLinks();
    },

    // Function: show side menu
    show: function() {
        var self = this;
        $('#'+self.menuOuter.getId()).css('visibility', 'visible');
    }
}
