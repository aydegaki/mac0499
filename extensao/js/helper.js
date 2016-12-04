// Module: helper functions
var helper = {

    counter: 0,

    // Function: print called function with a message 'msg'
    printDebug: function (msg) {
        var date = new Date; 
        var stack = new Error().stack;
        caller = (stack.split('\n')[2].trim()).split(' ')[1];
        console.log('%cCALLED ' + caller + ' at ' + date.toLocaleTimeString(), 'background: #222; color: #bada55; font-weight: bold');
        alert(caller + ' at ' + date.toLocaleTimeString());
        if (msg !== undefined) {
            console.log('   %c'+msg, 'background: #222; color: #bada55');
        }
    },

    // Function: generate a new id number concatenate with 'root'
    idGenerator: function(root) {
        var self = this;
        if (typeof(root) === 'undefined') 
            root = '';
        return root+(self.counter++);
    },

    // Function: get icon address
    getUrlIcon: function(url) {
        var iconUrl;
        var parts = url.split('/');

        iconUrl = parts[0] + '//' + parts[2] + '/favicon.ico';

        return iconUrl;
    },

    // Function: build a div object in a container 'containerId' using 'idPrefix' to generate a new id with  a 'css' configuration
    buildDiv: function(idPrefix, containerId, css) {
        var self = this;
        var id = self.idGenerator(idPrefix);
        $('<div/>', {
            id: id
        }).appendTo('#'+containerId);
        $('#'+id).css(css);
        return id;
    },

    // Function: insert an invisible area around a button with id 'buttonId'
    insertAOE: function(buttonId) {
        var self = this;
        var button = $('#'+buttonId);
        var unit = button.width();
        var idAOE = self.idGenerator('aoe'); 
        button.append('<div id="'+idAOE+'"</div>');
        var aoe = $('#'+idAOE);
        aoe.css({
            'height': 1.5*unit,
            'width': 1.5*unit,
            'position': 'absolute',
            'left':  - unit*0.25,
            'top':  - unit*0.25,
        });
    },

    // Function: build a span object in a container 'containerId' using 'idPrefix' to generate a new id with  a 'css' configuration and a 'text' within
    buildSpan: function(idPrefix, text, containerId, css) {
        var self = this;
        var id = self.idGenerator(idPrefix);
        $('<span/>', {
            id: id
        }).appendTo('#'+containerId);
        $('#'+id).css(css);
        $('#'+id).html(text);
        return id;
    },

    // Function: build an image object with  in a container 'containerId' using 'idPrefix' to generate a new id with  a 'css' configuration. 'igmUrl' is its location in the web whereas 'realUrl' is its location in the extension itself. 
    buildImg: function(idPrefix, imgUrl, containerId, css, realUrl) {
        var self = this;
        var id = self.idGenerator(idPrefix);
        var url = imgUrl;
        if (typeof(realUrl) === 'undefined') {
            url = chrome.extension.getURL(imgUrl);
        }
        $('<img/>', {
            id: id,
            src: url,
            onerror: 'this.src="'+ chrome.extension.getURL('img/defaultIcon.png') +'"'
        }).appendTo('#'+containerId);
        $('#'+id).css(css);
        return id;
    },

}

// Function: instantiate a new object from a class (oneClass param)
function NEW(oneClass){
    function N(){};
    N.prototype = oneClass;
    return new N();
}
