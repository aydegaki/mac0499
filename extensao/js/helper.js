var helper = {
    counter: 0,
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

    idGenerator: function(root) {
        var self = this;
        if (typeof(root) === 'undefined') 
            root = '';
        // var date = new Date;
        // return '' + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
        return root+(self.counter++);
    },
    getUrlIcon: function(url) {
        var iconUrl;
        var parts = url.split('/');

        iconUrl = parts[0] + '//' + parts[2] + '/favicon.ico';

        return iconUrl;
    },

    buildDiv: function(idPrefix, conteinerId, css) {
        var self = this;
        var id = self.idGenerator(idPrefix);
        $('<div/>', {
            id: id
        }).appendTo('#'+conteinerId);
        $('#'+id).css(css);
        return id;
    },

    insertAOE: function(buttonId) {
        var self = this;
        var button = $('#'+buttonId);
        var unit = button.width();
        var idAOE = self.idGenerator('aoe'); 
        button.append('<div id="'+idAOE+'"</div>');
        var aoe = $('#'+idAOE);
        aoe.css({
            // 'background': 'teal',
            'height': 1.5*unit,
            'width': 1.5*unit,
            'position': 'absolute',
            'left':  - unit*0.25,
            'top':  - unit*0.25,
            // 'z-index': -10,
            // 'box-shadow': '0px 0px 0px 5px green inset',
        });
    },

    buildSpan: function(idPrefix, text, conteinerId, css) {
        var self = this;
        var id = self.idGenerator(idPrefix);
        $('<span/>', {
            id: id
        }).appendTo('#'+conteinerId);
        $('#'+id).css(css);
        $('#'+id).html(text);
        return id;
    },

    buildImg: function(idPrefix, imgUrl, conteinerId, css, realUrl) {
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
        }).appendTo('#'+conteinerId);
        $('#'+id).css(css);
        return id;
    },

}

function NEW(obj){
    function N(){};
    N.prototype = obj;
    return new N();
}
