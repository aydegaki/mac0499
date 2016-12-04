// Class: access button located in side bar
var OneAccessButton = {

    menuElement: null,
    unit: null,

    // Function: set button size
    withUnit: function(unit) {
        this.unit = unit;
        return this;
    },
    // Function: image to be displayed inside
    withImg: function(img) {
        this.img = img;
        return this;
    },
    // Function: set button color
    withColor: function(color) {
        this.color = color;
        return this;
    },
    // Function: set container where the button will reside
    withContainerSrc: function(containerSrc) {
        this.containerSrc = containerSrc;
        return this;
    },
    // Function: set callback function for hoverOn event
    withHoverOn: function(hoverOn) {
        this.hoverOn = hoverOn;
        return this;
    },
    // Function: set callback function for hoverOff event
    withHoverOff: function(hoverOff) {
        this.hoverOff = hoverOff;
        return this;
    },
    // Function: set relative vertical position from container in pixel (from the top)
    withY: function(y) {
        this.y = y;
        return this;
    },

    // Function: create button
    create: function() {
        var self = this;

        self.id = helper.buildDiv('accessButton', self.containerSrc.attr('id'), 
        {
            "height": self.unit+"px",
            "width": self.unit+"px",
            "position": "fixed",
            "top": self.y,
            "right": self.unit*0.25,
            "background": self.color,
            "border-radius": "10%", 
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
        });

        $('#'+self.id).hover(self.hoverOn, self.hoverOff);

    },

    getElement: function() {
        var self = this;
        return $('#'+ self.id);
    },
};

// Class: side bar that contain access buttons
var OneSideBar = {

    // Function: set side bar width in pixels
    withWidth: function(width) {
        this.width = width;
        return this;
    },
    // Function: set side bar height in pixels
    withHeight: function(height) {
        this.height = height;
        return this;
    },
    withContainerSrc: function(container) {
        this.containerSrc = container;
        return this;
    },
    
    // Function: create side bar
    create: function() {

        var self = this;

        self.id = helper.buildDiv('sideBar', self.containerSrc.attr('id'), 
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

    getContainer: function() {
        var self = this;
        return self.element;
    }
}
