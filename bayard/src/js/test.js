window.setTimeout(function() {
    var div = document.createElement('div'),
        attr = document.createAttribute('data-original')
    ;
    attr.value = 'http://i3.neon-images.com/v1/client/1830901739/neonvid_999999.999.99.999.jpg';
    div.setAttributeNode(attr);
    div.innerHTML = 'Cheese';
    document.body.appendChild(div);
}, 2000);
window.setTimeout(function() {
    var body = document.getElementById('id0');
    body.setAttribute('data-original', 'http://i3.neon-images.com/v1/client/1830901739/neonvid_666666.666.66.66.jpg');
}, 3000);
window.setTimeout(function() {
    var div = document.getElementById('id2');
    div.setAttribute('data-original', 'http://i3.neon-images.com/v1/client/1830901739/neonvid_888888.888.88.88.jpg');
}, 4000);
window.setTimeout(function() {
    var div = document.getElementById('id2');
    div.setAttribute('data-original', 'http://i3.neon-images.com/v1/client/1830901739/neonvid_888888.888.88.88.jpg');
}, 5000);