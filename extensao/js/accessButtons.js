var oneAccessButtonSize = 200;
var OneAccessButton = {
    menuElement: null,
    unit: null,

    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    withImg: function(img) {
        this.img = img;
        return this;
    },
    withColor: function(color) {
        this.color = color;
        return this;
    },
    withConteinerSrc: function(conteinerSrc) {
        this.conteinerSrc = conteinerSrc;
        return this;
    },
    withHoverOn: function(hoverOn) {
        this.hoverOn = hoverOn;
        return this;
    },
    withHoverOff: function(hoverOff) {
        this.hoverOff = hoverOff;
        return this;
    },
    withY: function(y) {
        this.y = y;
        return this;
    },

    create: function() {
        var self = this;


        // console.log(conteiner.attr('id'));
        self.id = helper.buildDiv('accessButton', self.conteinerSrc.attr('id'), 
        {
            "height": self.unit+"px",
            "width": self.unit+"px",
            "position": "fixed",
            // "margin": 'auto',
            "top": self.y,
            // "bottom": '0px',
            "right": self.unit*0.25,
            "background": self.color,
            // "border-radius": "50%/50%", 
            "border-radius": "10%", 
            // "opacity": "0.5",
        });
        helper.insertAOE(self.id);

        helper.buildImg('imgMenu', self.img, self.id, 
        {
            "position": "absolute",
            "margin": "auto",
            "top": "0px",
            "left": "0px",
            "right": "0px",
            "bottom": "0px",
            "height": "60%",
            "width": "60%",
            // "visibility": "hidden",
        });

        $('#'+self.id).hover(self.hoverOn, self.hoverOff);

    },

    getElement: function() {
        var self = this;
        return $('#'+ self.id);
    },
};

var OneSideBar = {

    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
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
    
    create: function() {

        var self = this;

        // self.mainConteiner.append('<div id="sideBar'+self.sufix+'"></div>');
        self.id = helper.buildDiv('sideBar', self.conteinerSrc.attr('id'), 
        {
            'height': self.height,
            'width': self.width,
            'position': 'fixed',
            'top': 0,
            'right': 0,
            'z-index': 2147483644,
            'background': '#333',
        });

        self.element = $('#'+self.id); 
    },

    hide: function() {
        var self = this;
        $('#'+ self.id).css('visibility', 'hidden');
    },

    show: function() {
        var self = this;
        $('#'+ self.id).css('visibility', 'visible');
    },

    getConteiner: function() {
        var self = this;
        return self.element;
    }
}
