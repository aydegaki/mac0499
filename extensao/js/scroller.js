var OneScroller = {
    withWidth: function(width) {
        this.width = width;
        return this;
    },
    withHeight: function(height) {
        this.height = height;
        return this;
    },
    withConteinerSrc: function(conteiner) {
        this.conteinerSrc = conteiner;
        return this;
    },
    // create: function(width, height, conteiner) {
    create: function() {
        var self = this;
        console.log("scroll: create()");
        // console.log("width: " + width);
        self.conteinerSrc.append('<div class="scroll scrollUp"><p></p></div>');
        self.conteinerSrc.append('<div class="scroll scrollDown"><p></p></div>');

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

                // console.log(parseInt($(window).scrollTop() + $(window).height()) + " " + $(document).height());

                // correcao do bug do constante aumento do documento
                if ($(document).height() <= lastDocH) {
                    lastDocH = $(document).height();
                }

                if(parseInt($(window).scrollTop() + $(window).height()) > lastDocH) {
                    // console.log("BOTTOM");
                    lock = true;
                    someInvisible = true;
                    $(ev.target).css("visibility", "hidden");
                } else if ($(window).scrollTop() == 0){
                    // console.log("TOP");
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

    hide: function() {
        $('.scroll').css('visibility', 'hidden');
    },

    show: function(width) {
        $('.scroll').css('visibility', 'visible');
        $('.scroll').css('width', width);
    }
};
