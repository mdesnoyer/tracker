// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// http://imagecdn.neon-lab.com/awx/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_ce93ce468d9ebb7d1bb2c725ae0f764a_w300_h240.jpg
// http://imagecdn.neon-lab.com/zK2/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_f8c4881082bac74d840a2ed6832137cb_w300_h240.jpg
// http://imagecdn.neon-lab.com/Xuf/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_d026930a4f64a878691852b1ffc9bd9c_w300_h240.jpg
// http://imagecdn.neon-lab.com/0RL/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_cb7fc57440e7a5c6f9ab22298f3cafa4_w300_h240.jpg
// http://imagecdn.neon-lab.com/CjK/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_aaa579634777bd96f404ad372ac7a245_w300_h152.jpg

var neonReplacements = {
    'http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBuXpYG.img?h=516&w=624&m=6&q=60&u=t&o=t&l=f&f=jpg&x=573&y=299': 'http://imagecdn.neon-lab.com/awx/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_ce93ce468d9ebb7d1bb2c725ae0f764a_w300_h240.jpg'
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function neonTransform(neonReplacements) {
    for (var key in neonReplacements) {
        var value = neonReplacements[key],
            images = document.querySelectorAll("img[src='" + key + "']")
        ;
        images.forEach(function(image) {
            image.src = value;
        });
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

window.nInterval1 = setInterval(function() {
    console.log('ping nInterval1');
    if (window._neon !== undefined) {
        window._neon.tracker.masterControlProgram();
        clearInterval(nInterval1);
        console.log('kill nInterval1');
    }
}, 500);

window.nInterval2 = setInterval(function() {
    console.log('ping nInterval2');
    if (document.body) {
        var fileRef = document.createElement('script');
        fileRef.setAttribute('type', 'text/javascript');
        fileRef.setAttribute('src', '//neon-test.s3.amazonaws.com/neonoptimizer_603225904.js');
        document.body.appendChild(fileRef);
        clearInterval(nInterval2);
        console.log('kill nInterval2');
    }
}, 500);

window.nInterval3 = setInterval(function() {
    console.log('ping nInterval3');
    if (document) {
        neonTransform(neonReplacements);
        clearInterval(nInterval3);
        console.log('kill nInterval3');
    }
}, 500);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
