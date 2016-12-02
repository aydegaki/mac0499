var OneGazer = {

    id: null,
    unit: null,
    conteinerScr: null,
    initialPositions: {},
    isPaused: false,
    itemList: [],

    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    withScroller: function(scroller) {
        this.scroller = scroller;
        return this;
    },
    withConteinerSrc: function(conteinerSrc) {
        this.conteinerSrc = conteinerSrc;
        return this;
    },
    withAccessButton: function(accessButton) {
        this.accessButton = accessButton;
        return this;
    },

    create: function() {
        var self = this;
        self.idFeedback = self.buildVisualFeedback();

        self.scroller.setGazerId(self.idFeedback);

        self.enableCursorTracking();
        self.enableFixation(self.unit/2, 500);
    },

    buildVisualFeedback: function() {
        var self = this;
        return helper.buildDiv('oneGazer', self.conteinerSrc.attr('id'), { 
            'position': 'absolute',
            // 'top': 200, //random valid value
            // 'left': 200, //random valid value
            'background': 'red',
            'z-index': 2147483647,
            'height': self.unit,
            'width': self.unit,
            'border-radius': '50%/50%', 
            'opacity': '0.5',
            // 'opacity': '0.0',
            'pointer-events': 'none',
        });
    },

    enableCursorTracking: function() {
        var self = this;
        $('html').mousemove(function(ev){
            window.mouseX = ev.pageX;
            window.mouseY = ev.pageY;
            $('#'+self.idFeedback).css({
                left: window.mouseX-self.unit/2,
                top: window.mouseY-self.unit/2,
            });
        });
    },

    enableFixation: function(threshold, timeMs) {
        var self = this;
        var coordBefore = [0,0];
        var fixThreshold = threshold;
        var fixTime = 0;
        var menCoord = [0,0]; // permite a atualizacao da fixacao apos detectada uma fixacao e um deslocamento maior que fixThershold
        var timeIteration = 50;
        timex = setInterval(function(){
                if (!self.isPaused){
                    var coordNow = [window.mouseX, window.mouseY];
                    // if not fixed
                    if (Math.abs(coordNow[0]-coordBefore[0]) > fixThreshold ||
                        Math.abs(coordNow[1]-coordBefore[1]) > fixThreshold ||
                        Math.abs(coordNow[0] - menCoord[0]) > fixThreshold ||
                        Math.abs(coordNow[1] - menCoord[1]) > fixThreshold 
                       ) {
                           fixTime = 0;
                           if (fixTime === 0) {
                               menCoord = [coordNow[0], coordNow[1]];
                           }
                           $('#'+self.idFeedback).css({ "background": "red", });
                       } else {
                           fixTime += timeIteration;
                       } 
                    if (fixTime === timeMs) {
                        coordFix = [coordNow[0], coordNow[1]];
                        console.log("FIXATION DETECTED");
                        $('#'+self.idFeedback).css({ "background": "#4F4", });
                        self.itemList = self.findNearElements(coordNow[0], coordNow[1], self.unit);
                        if (self.itemList.length > 0) {
                            self.accessButton.getElement().css('background', '#4F4');
                        } else {
                            self.accessButton.getElement().css('background', 'gray');
                        }
                    }
                    coordBefore[0] = coordNow[0];
                    coordBefore[1] = coordNow[1];
                }
        }, timeIteration);
    },

    lastCounterId: null,
    findNearElements: function(xC, yC, unit) {

        var self = this;
        var xA0 = xC - unit/2;
        var yA0 = yC - unit/2;
        var xAM = xC + unit/2; 
        var yAM = yC + unit/2; 
        var counterId = 0;
        var listItems = [];

        $('body a, body input[type=text], body input[type=search], [type=submit], .sbqs_c').each(function(){
            var element = $(this);
            if(element.css('visibility') != 'hidden') {
                var element = $(this);
                var offset = element.offset();
                var x0 = offset.left;
                var y0 = offset.top;
                var xM = x0 + element.width();
                var yM = y0 + element.height();

                if ( xA0 < xM && xAM > x0 && yA0 < yM && yAM > y0) {
                    listItems.push({
                        element: element,
                        x0: element.offset().left,
                        y0: element.offset().top,
                        w0: element.width(),
                        h0: element.height(),
                    });
                    $('.miniMarker'+counterId).remove();
                    self.buildMiniMarkers(element, self.conteinerSrc, 'miniMarker'+(counterId++));
                }

            }
        }); 

        /*
         * BUG: select google plugin, search something.
         * In the result page, some new marker will be removed
         * The follwing lines are a temporary solution
         */
        if (counterId < self.lastCounterId) {
            for(var i = counterId; i < self.lastCounterId; i++) {
                $('#miniMarker'+i).remove();
            }
        }
        self.lastCounterId = counterId;

        return listItems;
    },

    buildMiniMarkers: function(element, conteinerScr, id) {
        var xC = element.offset().left;
        var yC = element.offset().top + element.height()/2;
        var markerSize = 10;
        conteinerScr.append('<div id="'+id+'" class="miniMarker"></div>');

        var x = xC - markerSize;
        if (x < 0) {
            x = 0;
        }

        $('#'+id).css({
            'background': 'red',
            'position': 'absolute',
            'top': yC - markerSize/2,
            'left': x,
            'height': markerSize,
            'width': markerSize,
            'border-radius': '50%/50%', 
            'opacity': 0.5,
            'z-index': '2147483647',
        });
    },

    pause: function() {
        var self = this;
        // helper.printDebug('pause');
        self.isPaused = true;
    },

    resume: function() {
        var self = this;
        // helper.printDebug('resume');
        if (!self.resumeLock) {
            self.isPaused = false;
        }
    },

    resumeLock: false,
    lockResume: function() {
        var self = this;   
        self.resumeLock = true;
    },    
    unlockResume: function() {
        var self = this;   
        self.resumeLock = false;
    },    

    getItemList: function() {
        var self = this;
        return self.itemList;
    },


    removeMiniMarkers: function() {
        $('.miniMarker').remove();
    }
};
