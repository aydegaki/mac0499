// Class: dwell-time keyboard
var OneKeyboard = {

    sufix: null,
    id: null,
    unit: null,
    shift: false,
    cancelAction: null,

    keyMap: [
        "1234567890",
        "qwertyuiop",
        "asdfghjkl.",
        ['&uArr;', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '&#9251;', '&larr;']
    ],

    keyMapShift: [
        ",!?@_/#&%$",
        "QWERTYUIOP",
        "ASDFGHJKL.",
        ['&uArr;', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '&#9251;', '&larr;']
    ],

    // Function: set unit (in pixels) to set keyboard and key buttons size
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },

    // Function: set source container
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },

    // Function: set cancel callback function triggered when quitting keyboard mode
    withCancelAction: function(cancelAction) {
        this.cancelAction = cancelAction;
        return this;
    },

    // Function: create keyboard
    create: function() {
        var self = this;

        self.sufix = helper.idGenerator();
        self.height = self.unit*4+ 8*(self.unit*0.25);

        self.id = helper.buildDiv('oneKeyboard', self.containerSrc.attr('id'), {
            'position': 'fixed',
            'left': 0,
            'bottom': -self.height,
            'height': self.height,
            'width': $(window).width(),
            'font-family': 'helvetica',
            'background': 'black',
            'z-index': 2147483646,
        });
        $('#'+self.id).css("transition", "bottom "+0.5+"s ease-out"); 

        var idKeyboardContainer = helper.buildDiv('keyboardContainer', self.id, {
            'position': 'absolute',
            'margin': 'auto',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'background': '#555',
            'height': self.height,
            'width': 10*self.unit + 5*self.unit,
        });


        self.idKeyboardQuit = helper.buildDiv('keyboardQuit', idKeyboardContainer, {
            'position': 'fixed',
            'top': ($(window).height()- self.height)/2  - self.unit/2,
            'right': self.unit*0.25,
            'height': self.unit,
            'width': self.unit,
            'background': '#F44',
            'box-shadow': '0px 2px 4px darkred',
            'opacity': '0.9',
            'border-radius': '10%',
            'visibility': 'hidden',
        });

        var imgUrl ='img/close.svg';
        helper.buildImg('keyboardImg', imgUrl, self.idKeyboardQuit, {
            'position': 'absolute',
            'height': '60%',
            'width': '60%',
            'margin': 'auto',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'pointer-events': 'none',
        });
        helper.insertAOE(self.idKeyboardQuit);
        
        $('#'+self.idKeyboardQuit).hover(function() {
            OneDwellTimeBar.dwell(function() {
                self.hide();
            }, $(this), self.unit);
        }, function() {
            OneDwellTimeBar.clear();
        });

        for(var i = 0;  i < 10; i++) {
            for(var j = 0; j < 4; j++) {
                var idKeyUnshift = helper.buildDiv('keyUnshift'+j+i, idKeyboardContainer, {
                    'position': 'absolute',
                    'left': 0.25*self.unit + i*(1.5*self.unit),
                    'top': 0.25*self.unit + j*(1.5*self.unit),
                    'height': self.unit,
                    'width': self.unit,
                    'background': '#333',
                    'border-radius': '10%',
                    'box-shadow': '5px 5px 5px black',
                    'display': 'table',
                });
                helper.insertAOE(idKeyUnshift);
                $('#'+idKeyUnshift).toggleClass('unpressedShift');


                var idKeyShift = helper.buildDiv('keyShift'+j+i, idKeyboardContainer, {
                    'position': 'absolute',
                    'left': 0.25*self.unit + i*(1.5*self.unit),
                    'top': 0.25*self.unit + j*(1.5*self.unit),
                    'height': self.unit,
                    'width': self.unit,
                    'background': '#333',
                    'border-radius': '10%',
                    'box-shadow': '5px 5px 5px black',
                    'display': 'table',
                });
                helper.insertAOE(idKeyShift);
                $('#'+idKeyShift).toggleClass('pressedShift');

                if(j > 0) {
                    var idKeyLowSpan = helper.buildSpan('keyLowSpan'+j+i, self.keyMap[j][i], idKeyUnshift, {
                        'color': 'white',
                        'font-size': 0.4*self.unit,
                        'text-align': 'center',
                        'display': 'table-cell',
                        'vertical-align': 'middle',
                    });
                    self.insertAction($('#'+idKeyUnshift), self.keyMap[j][i]);

                    var color = 'white';
                    if (self.keyMapShift[j][i] === '&uArr;') {
                        color = 'lightgreen';
                    }
                    var idKeyShiftSpan = helper.buildSpan('keyShiftSpan'+j+i, self.keyMapShift[j][i], idKeyShift, {
                        'color': color,
                        'font-size': 0.4*self.unit,
                        'text-align': 'center',
                        'display': 'table-cell',
                        'vertical-align': 'middle',
                    });
                    self.insertAction($('#'+idKeyShift), self.keyMapShift[j][i]);
                } else {

                    var idKeyLowSpanUp = helper.buildSpan('keyLowSpanUp'+j+i, self.keyMapShift[j][i], idKeyUnshift, {
                        'position': 'absolute',
                        'top': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        'color': '#666',
                        'font-size': 0.3*self.unit,
                    });

                    var idKeyLowSpanDown = helper.buildSpan('keyLowSpanDown'+j+i, self.keyMap[j][i], idKeyUnshift, {
                        'position': 'absolute',
                        'bottom': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        'color': 'white',
                        'font-size': 0.3*self.unit,
                    });
                    self.insertAction($('#'+idKeyUnshift), self.keyMap[j][i]);

                    var idKeyShiftSpanUp = helper.buildSpan('keyShiftSpanUp'+j+i, self.keyMapShift[j][i], idKeyShift, {
                        'position': 'absolute',
                        'top': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        'color': 'white',
                        'font-size': 0.3*self.unit,
                    });

                    var idKeyShiftSpanDown = helper.buildSpan('keyShiftSpanDown'+j+i, self.keyMap[j][i], idKeyShift, {
                        'position': 'absolute',
                        'bottom': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        'color': '#666',
                        'font-size': 0.3*self.unit,
                    });
                    self.insertAction($('#'+idKeyShift), self.keyMapShift[j][i]);
                }
            }
        }
        $('.pressedShift').css('visibility', 'hidden');
    },

    // Function: hide keyboard
    hide: function() {
        var self = this;
        $('#'+self.id).css('bottom', -self.height);
        $('#'+self.idKeyboardQuit).css('visibility', 'hidden');
        self.cancelAction();
    },

    setInputSelected: function(inputSelected) {
        var self = this;
        self.inputSelected = inputSelected; 
    },

    getInputSelected: function() {
        var self = this;
        return self.inputSelected;
    },

    // Function: show keyboard
    show: function(input) {
        var self = this;
        self.setInputSelected(input);
        $('#'+self.idKeyboardQuit).css('visibility', 'visible');
        $('#'+self.id).css('bottom', '0');
        $('.pressedShift').css('visibility', 'hidden');
        $('.unpressedShift').css('visibility', 'visible');
    },

    // Function: set a callback function triggered when a hover event occur in 'key' object. 'msg' determines which action to happen  
    insertAction: function(key, msg) {
        var self = this;
        key.hover(function() {
            OneDwellTimeBar.dwell(function() {
                var input = self.getInputSelected();
                switch(msg) {
                    case '&uArr;':
                        if(!self.shift) {
                            self.shift = true;
                            $('.pressedShift').css('visibility', 'visible');
                            $('.unpressedShift').css('visibility', 'hidden');
                        } else {
                            self.shift = false;
                            $('.pressedShift').css('visibility', 'hidden');
                            $('.unpressedShift').css('visibility', 'visible');
                        }
                        break;
                    case '&larr;':
                        var text = self.getInputSelected().val();
                        text = text.slice(0, text.length-1);
                        self.getInputSelected().val(text);
                        self.refocus();
                        break;
                    case '&#9251;':
                        self.getInputSelected().trigger(jQuery.Event('keypress', {keyCode: 13}));
                        break;
                    default:
                        self.getInputSelected().val(self.getInputSelected().val()+msg);
                        self.refocus();
                        break;
                }
            }, $(this), self.unit)
        }, function() {
            OneDwellTimeBar.clear();
        });
    },

    // Function: refocus input bar
    refocus: function() {
        var self = this;
        self.getInputSelected().blur().focus().val(self.getInputSelected().val());
        self.googleBarProcedure();
    },

    // Function: center input bar in case it is google search bar.
    // It is necessary because google search bar is actually a div not an input bar.
    googleBarProcedure: function() {
        var self = this;
        var input = self.getInputSelected();
        if (input.attr('id') === 'lst-ib') {
            $("body").css("transition", "transform "+0.0+"s ease-in"); 
            x = 0;
            y = 0;
            $('body').css('-webkit-transform', 'translate('+x+'px, '+y+'px) scale(1.0)');
        }
    },

    // Function: get keyboard height
    getHeight: function() {
        var self = this;
        return self.height;
    }
};
