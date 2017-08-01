/**
 * VARIABLES
 */
const GAME = new _GAME( '1.1.0' ),
PARTICULE  = new EBG_Particule( getElementById('effect-canvas'), 1, 0, 60 ),
MEDIA_LIST = {},
ROOT_PATH  = '/android_asset/www/';

//set canvas
GAME.canvas.width  = window.innerWidth;
GAME.canvas.height = window.innerHeight-3;

getElementById('effect-canvas').width  = window.innerWidth;
getElementById('effect-canvas').height = window.innerHeight-3;

/**
 * LOCAL STORAGE
 */
//check high score and set it to 0 if there isn't any data.
if( !localStorage.getItem('highscore') ) localStorage.setItem('highscore','0');

/**
 * SHOW MAIN MENU
 */
GAME.showMainScreen();

/**
 * PARTICULE DRAWING
 */
var particule_drawer = setInterval( () => {
      PARTICULE.update();
}, 1000/PARTICULE.settings.fps );

/**
 * ADD AUDIO FILES
 */
addMedia({name:'main_menu_music',path:'sound/mm_music.mp3', volume:1, autoPlay:false});
addMedia({name:'game_over',      path:'sound/game_over.wav',volume:1, autoPlay:false});
addMedia({name:'number1',        path:'sound/number1.wav',  volume:1, autoPlay:false});
addMedia({name:'number2',        path:'sound/number2.wav',  volume:1, autoPlay:false});
addMedia({name:'number3',        path:'sound/number3.wav',  volume:1, autoPlay:false});
addMedia({name:'firework',       path:'sound/firework.wav', volume:1, autoPlay:false});
addMedia({name:'tap',            path:'sound/blop2.wav',    volume:1, autoPlay:false});

/**
 * EVENT PREVENTERS
 */
document.body.addEventListener('click', (e) => {
      e.preventDefault();
});
document.body.addEventListener('mousedown', (e) => {
      e.preventDefault();
});

//AdMob
admob.initAdmob('ca-app-pub-xxxxxxxxxxxxxxxxxxx/xxxxxxxxxx','ca-app-pub-3169633196689345/8644929719');
admob.cacheInterstitial();// load admob Interstitial