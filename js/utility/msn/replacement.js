// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var neonReplacements = {
    'http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBuXpYG.img?h=516&w=624&m=6&q=60&u=t&o=t&l=f&f=jpg&x=573&y=299': 'http://imagecdn.neon-lab.com/awx/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_ce93ce468d9ebb7d1bb2c725ae0f764a_w300_h240.jpg',
    'http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBuXgQA.img?h=240&w=300&m=6&q=60&u=t&o=t&l=f&f=jpg&x=318&y=104': 'http://imagecdn.neon-lab.com/zK2/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_f8c4881082bac74d840a2ed6832137cb_w300_h240.jpg',
    // 'http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBuXbK0.img?h=100&w=138&m=6&q=60&u=t&o=t&l=f&f=jpg&x=819&y=447': 'http://imagecdn.neon-lab.com/Xuf/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_d026930a4f64a878691852b1ffc9bd9c_w300_h240.jpg',
    'http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBuWPhm.img?h=64&w=85&m=6&q=60&u=t&o=t&l=f&f=jpg&x=434&y=111': 'http://imagecdn.neon-lab.com/0RL/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_cb7fc57440e7a5c6f9ab22298f3cafa4_w300_h240.jpg',
    'http://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBuXBPg.img?h=170&w=300&m=6&q=60&u=t&o=t&l=f&f=jpg&x=350&y=177': 'http://imagecdn.neon-lab.com/Xuf/neontnjq3y3e46t6fuzq6hzv16kkgs_WrapperTest_d026930a4f64a878691852b1ffc9bd9c_w300_h240.jpg'
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function neonTransform(neonReplacements) {
    for (var key in neonReplacements) {
        var value = neonReplacements[key],
            images = document.querySelectorAll("img[src='" + key + "']")
        ;
        images.forEach(function(image) {
            if (image.classList.contains('loaded')) {
                console.log('Replacement');
                image.src = value;
            }
        });
    }
}

window.onload = function () {
    neonTransform(neonReplacements);    
    var fileRef = document.createElement('script');
    fileRef.src = '//neon-test.s3.amazonaws.com/neonoptimizer_603225904.js';
    document.getElementsByTagName('head')[0].appendChild(fileRef);

    var nInterval1 = setInterval(function() {
        console.log('ping nInterval1');
        if (window._neon !== undefined) {
            window._neon.tracker.masterControlProgram();
            clearInterval(nInterval1);
            console.log('kill nInterval1');
        }
    }, 500);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
