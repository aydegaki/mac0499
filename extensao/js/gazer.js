// Class: responsible for fixation detection, finding candidate objects, and showing feedback marks
var OneGazer = {

    id: null,
    unit: null,
    containerScr: null,
    initialPositions: {},
    isPaused: false,
    itemList: [],

    // Function: the unit (pixels) will set the fixation area that determines candidate objects
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    // Function: the scroller that will receive this object id
    withScroller: function(scroller) {
        this.scroller = scroller;
        return this;
    },
    // Function: set source container
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },
    // Function: set click access button
    withAccessButton: function(accessButton) {
        this.accessButton = accessButton;
        return this;
    },

    // Function: initialize gazer activities
    create: function() {
        var self = this;

        self.idFeedback = self.buildVisualFeedback();
        self.scroller.setGazerId(self.idFeedback);
        self.enableCursorTracking();
        self.enableFixation(self.unit/2, 500);
    },

    // Function: create gazer visual feedback
    buildVisualFeedback: function() {
        var self = this;
        return helper.buildDiv('oneGazer', self.containerSrc.attr('id'), { 
            'position': 'absolute',
            'background': 'red',
            'z-index': 2147483647,
            'height': self.unit,
            'width': self.unit,
            'border-radius': '50%/50%', 
            'opacity': '0.5',
            'pointer-events': 'none',
        });
    },

    // Function: get cursor position and update visual feedback
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

    // Function: detect fixations considering 'distanceThreshold' (pixels) and 'timeThreshold' (in milliseconds)
    enableFixation: function(distanceThreshold, timeThreshold) {
        var self = this;
        var coordBefore = [0,0];
        var fixThreshold = distanceThreshold;
        var fixTime = 0;
        var menCoord = [0,0]; // allow a new fixation after a previous one have already been detected and a distance threshold have occured
        var timeIteration = 50;
        timex = setInterval(function(){
                if (!self.isPaused){
                    var coordNow = [window.mouseX, window.mouseY];
                    /* if not fixed */
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
                    if (fixTime === timeThreshold) {
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
    // Function: find near elements in a page within a square area centered in 'xC' and 'yC' and side size 'unit' pixels 
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
                    self.buildMiniMarkers(element, self.containerSrc, 'miniMarker'+(counterId++));
                }

            }
        }); 

        /*
         * BUG: select google plugin, search something.
         * In the result page, some new markers will be removed
         * The following is a quick-and-dirty solution 
         */
        if (counterId < self.lastCounterId) {
            for(var i = counterId; i < self.lastCounterId; i++) {
                $('#miniMarker'+i).remove();
            }
        }
        self.lastCounterId = counterId;

        return listItems;
    },

    // Function: visual feedback for each candidate objects
    buildMiniMarkers: function(element, containerScr, id) {
        var xC = element.offset().left;
        var yC = element.offset().top + element.height()/2;
        var markerSize = 10;
        containerScr.append('<div id="'+id+'" class="miniMarker"></div>');

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

    // Function: pause fixation detection
    pause: function() {
        var self = this;
        self.isPaused = true;
    },

    // Function: resume fixation detection
    resume: function() {
        var self = this;
        if (!self.resumeLock) {
            self.isPaused = false;
        }
    },

    resumeLock: false,

    // Function: lock resume function
    lockResume: function() {
        var self = this;   
        self.resumeLock = true;
    },    

    // Function: unlock resume function
    unlockResume: function() {
        var self = this;   
        self.resumeLock = false;
    },    

    // Function: get list of candidate objects
    getItemList: function() {
        var self = this;
        return self.itemList;
    },

    // Function: remove visual feedback for candidate objects
    removeMiniMarkers: function() {
        $('.miniMarker').remove();
    }
};
