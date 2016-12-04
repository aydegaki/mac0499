// Object: dwell-time element that triggers a callback function
var OneDwellTimeBar = {

    width: 100, 
    height: 20, 
    dwellTimer: null,
    time: 500,
    sufix: null,

    // Function: create a dwell-time bar in 'element' with dimensions based in 'unit'
    dwell: function(func, element, unit) {

        var conteiner = $('html');
        var size = 150;
        if (unit) {
            size = unit;
        }
        var self = this;

        self.width = size*0.8;
        self.height = size*0.24;
        self.sufix = helper.idGenerator('dwell');

        conteiner.append('<div id="dwellConteiner'+self.sufix+'"></div>');
        $('#dwellConteiner'+self.sufix).append('<div id="dwellTime'+self.sufix+'"></div>');

        $('#dwellTime'+self.sufix).css({
            "position": "absolute",
            "width": "0%",
            "height": "100%",
            "background-color": "green",
            "visibility": "visible",
            "border-radius": "5%", 
        });

        $('#dwellConteiner'+self.sufix).css({
            "width": self.width+"px",
            "height": self.height+"px",
            "background": "gray",
            "visibility": "hidden",
            "position": "absolute",
            "top": "5%",
            "left": "5%",
            "z-index": 2999999999,
            "opacity": '1.0',
            "pointer-events": "none",
        });

        var x = element.offset().left + element.width()/2 
        var y = element.offset().top + element.height()/2
        var conteiner = $('#dwellConteiner'+self.sufix);
        conteiner.css("left", x-self.width/2);
        conteiner.css("top", y-self.height/2);

        var width = 0;
        var r = 0;
        var g = 255;
        var b = 0;

        clearInterval(self.dwellTimer);
        console.log('dwell: ' + self.time);
        self.dwellTimer = setInterval(frame, self.time/100);

        // Function: change dynamically the bar color and once it is full the 
        // callback is triggered
        function frame() {
            if (width >= 100) {
                r = 0;
                g = 255;
                b = 0;
                clearInterval(self.dwellTimer);
                $('#dwellTime'+self.sufix).css('width', 0+'%'); 
                func();
            } else {
                width += 1; 
                if (width < 50) {
                    var percentage = (width*2)/100;
                    r = 255*(percentage);
                } else {
                    var percentage = ((width-50)*2)/100;
                    g = 255*(1-percentage);
                }
                var val = $('#dwellTime'+self.sufix).css('width');
                $('#dwellTime'+self.sufix).css('background', 'rgb('+parseInt(r)+','+parseInt(g)+','+parseInt(b)+')'); 
                $('#dwellTime'+self.sufix).css('width', width+'%'); 
            }
        }
    },

    // Function: remove dwell-time bar
    clear: function() {
        var self = this;
        clearInterval(self.dwellTimer);
        $('#dwellTime'+self.sufix).css('width', 0+'%'); 
        $('#dwellConteiner'+self.sufix).remove();
    },

    // Set dwell-time
    setTime: function(time) {
        console.log('setTime:' + time);
        var self = this;
        self.time = time;
    },
};
