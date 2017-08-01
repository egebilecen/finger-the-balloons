const __XMASD = {
    basePath : 'js/',
    scripts  : [
        'translate.js',
        'func.js',
        'class.game.js',
        'class.particule.js',
        'init.js'
    ]
};

document.addEventListener('deviceready', () => {
    for( let i in __XMASD.scripts )
    {
        let script = document.createElement('script');

        script.src    = __XMASD.basePath + __XMASD.scripts[i];
        script.async  = false;
        script.id     = 'game-file';
        document.body.appendChild(script);
    }

    document.querySelector('script#game-loader').remove();
});