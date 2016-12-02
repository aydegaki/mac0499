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

    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },

    withConteinerSrc: function(conteinerSrc) {
        this.conteinerSrc = conteinerSrc;
        return this;
    },

    withCancelAction: function(cancelAction) {
        this.cancelAction = cancelAction;
        return this;
    },

    create: function() {
        var self = this;

        self.sufix = helper.idGenerator();
        self.height = self.unit*4+ 8*(self.unit*0.25);

        self.id = helper.buildDiv('oneKeyboard', self.conteinerSrc.attr('id'), {
            'position': 'fixed',
            'left': 0,
            'bottom': -self.height,
            'height': self.height,
            'width': $(window).width(),
            'font-family': 'helvetica',
            // 'opacity': '0.85',
            'background': 'black',
            // 'visibility': 'hidden',
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


        // $('#'+idKeyboardContainer).append('<div id="keyboardQuit'+self.sufix+'"></div>');
        self.idKeyboardQuit = helper.buildDiv('keyboardQuit', idKeyboardContainer, {
            'position': 'fixed',
            'top': ($(window).height()- self.height)/2  - self.unit/2,
            'right': self.unit*0.25,
            'height': self.unit,
            'width': self.unit,
            'background': '#F44',
            // 'box-shadow': '0px 0px 0px 5px darkred inset',
            'box-shadow': '0px 2px 4px darkred',
            'opacity': '0.9',
            // 'border-radius': '50%/50%',
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
                //////////////////////////////////////////////////////////
                var idKeyUnshift = helper.buildDiv('keyUnshift'+j+i, idKeyboardContainer, {
                    'position': 'absolute',
                    'left': 0.25*self.unit + i*(1.5*self.unit),
                    'top': 0.25*self.unit + j*(1.5*self.unit),
                    'height': self.unit,
                    'width': self.unit,
                    'background': '#333',
                    'border-radius': '10%',
                    'box-shadow': '5px 5px 5px black',
                    // 'border': 'solid white 1px',
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
                    // 'border': 'solid white 1px',
                    'display': 'table',
                });
                helper.insertAOE(idKeyShift);
                $('#'+idKeyShift).toggleClass('pressedShift');
                //////////////////////////////////////////////////////////

                if(j > 0) {
                    var idKeyLowSpan = helper.buildSpan('keyLowSpan'+j+i, self.keyMap[j][i], idKeyUnshift, {
                        // 'position': 'absolute',
                        // 'margin': 'auto',
                        // 'top': 0,
                        // 'bottom': 0,
                        // 'left': 0,
                        // 'right': 0,
                        // 'height': '80%',
                        // 'width': '80%',
                        // 'background': '#444',
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
                        // 'position': 'absolute',
                        // 'margin': 'auto',
                        // 'top': 0,
                        // 'bottom': 0,
                        // 'left': 0,
                        // 'right': 0,
                        // 'height': '80%',
                        // 'width': '80%',
                        // 'background': '#444',
                        'color': color,
                        'font-size': 0.4*self.unit,
                        'text-align': 'center',
                        'display': 'table-cell',
                        'vertical-align': 'middle',
                        // 'border': 'solid white 1px',
                    });
                    self.insertAction($('#'+idKeyShift), self.keyMapShift[j][i]);
                } else {

                    var idKeyLowSpanUp = helper.buildSpan('keyLowSpanUp'+j+i, self.keyMapShift[j][i], idKeyUnshift, {
                        'position': 'absolute',
                        'top': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        // 'background': 'green',
                        'color': '#666',
                        'font-size': 0.3*self.unit,
                    });

                    var idKeyLowSpanDown = helper.buildSpan('keyLowSpanDown'+j+i, self.keyMap[j][i], idKeyUnshift, {
                        'position': 'absolute',
                        'bottom': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        // 'background': 'blue',
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
                        // 'background': 'green',
                        'color': 'white',
                        'font-size': 0.3*self.unit,
                    });

                    var idKeyShiftSpanDown = helper.buildSpan('keyShiftSpanDown'+j+i, self.keyMap[j][i], idKeyShift, {
                        'position': 'absolute',
                        'bottom': 0.1*self.unit,
                        'left': 0.1*self.unit,
                        'height': '40%',
                        'width': '40%',
                        // 'background': 'blue',
                        'color': '#666',
                        'font-size': 0.3*self.unit,
                    });
                    self.insertAction($('#'+idKeyShift), self.keyMapShift[j][i]);
                }
            }
        }
        $('.pressedShift').css('visibility', 'hidden');
    },

    hide: function() {
        var self = this;
        // $('#'+self.id).css('visibility', 'hidden');
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

    show: function(input) {
        var self = this;
        self.setInputSelected(input);
        // $('#'+self.id).css('visibility', 'visible');
        $('#'+self.idKeyboardQuit).css('visibility', 'visible');
        $('#'+self.id).css('bottom', '0');
        $('.pressedShift').css('visibility', 'hidden');
        $('.unpressedShift').css('visibility', 'visible');
    },


    insertAction: function(key, msg) {
        var self = this;
        key.hover(function() {
            OneDwellTimeBar.dwell(function() {
                console.log('PRESSED: ' + msg);
                var input = self.getInputSelected();
                switch(msg) {
                    case '&uArr;':
                        console.log('pressed!!!');
                        // console.log($('.unpressedShift'+self.sufix));
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
                        console.log('IN: &larr;');
                        // var text = self.getInputSelected().val() + ' ';
                        // self.getInputSelected().val(text);

                        self.getInputSelected().trigger(jQuery.Event('keypress', {keyCode: 13}));

                        // self.refocus();
                        break;
                    default:
                        console.log('DEFAULT');
                        self.getInputSelected().val(self.getInputSelected().val()+msg);
                        self.refocus();
                        break;
                }
            }, $(this), self.unit)
        }, function() {
            OneDwellTimeBar.clear();
        });
    },
    refocus: function() {
        var self = this;
        self.getInputSelected().blur().focus().val(self.getInputSelected().val());
        self.googleBarProcedure();
    },
    googleBarProcedure: function() {
        var self = this;
        var input = self.getInputSelected();
        if (input.attr('id') === 'lst-ib') {
            console.log('Google Proc');
            $("body").css("transition", "transform "+0.0+"s ease-in"); 
            x = 0;
            y = 0;
            // var x = (-input.offset().left) + $(window).width()/2 - input.width()/2;
            // var y = (-input.offset().top) + ($(window).height()-self.height)/2 - input.height()/2;
            $('body').css('-webkit-transform', 'translate('+x+'px, '+y+'px) scale(1.0)');
        }
    },

    getHeight: function() {
        var self = this;
        return self.height;
    }
};
