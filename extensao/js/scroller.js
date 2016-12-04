// Class: scroller bars to scroll pages in the browser
var OneScroller = {

    // Function: set scroller width in pixels
    withWidth: function(width) {
        this.width = width;
        return this;
    },

    // Function: set scroller height in pixels
    withHeight: function(height) {
        this.height = height;
        return this;
    },

    // Function: set source container
    withContainerSrc: function(container) {
        this.containerSrc = container;
        return this;
    },

    // Funtions: create scroll bars in the viewport
    create: function() {
        var self = this;
        self.containerSrc.append('<div class="scroll scrollUp"><p></p></div>');
        self.containerSrc.append('<div class="scroll scrollDown"><p></p></div>');

        $('.scroll').toggleClass('oneClass');

        $('.scroll').css({
            "width": self.width,
            "height": self.height,
            "background-color": "gray",
            "position": "fixed",
            'z-index': 2147483647,
            "opacity": "0",
            "padding": "0",
            "text-align": "center",
        });

        $('.scrollUp').css({
            "left": "0px",
            "top": "0px",
        });

        $('.scrollDown').css({
            "left": "0px",
            "bottom": "0px",
        });
        this.scrollerHover();
    },

    setGazerId: function(gazerId) {
        var self = this;
        self.gazerId = gazerId;
    },

    getGazerId: function() {
        var self = this;
        return self.gazerId;
    },

    // Functions: callback function triggered when a hover event occur in a scroll bar
    scrollerHover: function() {
        var self = this;
        var timer = '';
        var lock = false;
        var someInvisible = false; // evita que codigo da parteX seja executado o tempo todo quando scrolling
        var lastDocH = Number.MAX_VALUE;
        $('.scroll').hover( function(ev){

            $(this).css("background-color", "#333333");
            $(this).css("opacity", "0.5");

            var speed = 10;
            if($(ev.target).hasClass('scrollUp')) speed *= -1;
            timer = setInterval(function(){ 

                if (!lock) {
                    window.scrollBy(0, speed);

                    var yOuter = $('#'+self.getGazerId()).offset().top;
                    $('#'+self.getGazerId()).offset({top: yOuter+speed});

                }

                // parteX: restaura visibilidade dos scrollings 
                if ($(ev.target).hasClass('scrollUp') && someInvisible) {
                    $('.scrollDown').css("visibility", "visible");
                    $('.scrollDown').css("opacity", "0");
                    someInvisible = false;
                } else if ($(ev.target).hasClass('scrollDown') && someInvisible) {
                    $('.scrollUp').css("visibility", "visible");
                    $('.scrollUp').css("opacity", "0");
                    someInvisible = false;
                }

                // correcao do bug do constante aumento do documento
                if ($(document).height() <= lastDocH) {
                    lastDocH = $(document).height();
                }

                if(parseInt($(window).scrollTop() + $(window).height()) > lastDocH) {
                    lock = true;
                    someInvisible = true;
                    $(ev.target).css("visibility", "hidden");
                } else if ($(window).scrollTop() == 0){
                    lock = true;
                    someInvisible = true;
                    $(ev.target).css("visibility", "hidden");
                } else {
                    lock = false;
                }
            },30)
        },

            function(){
                lock = false;
                $(this).css("background-color", "gray");
                $(this).css("opacity", "0");
                window.clearInterval(timer);
            }
        );
    },

    // Function: hide scroll bars
    hide: function() {
        $('.scroll').css('visibility', 'hidden');
    },

    // Function: show scroll bars
    show: function(width) {
        $('.scroll').css('visibility', 'visible');
        $('.scroll').css('width', width);
    }
};
