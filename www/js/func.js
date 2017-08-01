const DEVICE = {
      lang : 'en' //default
};

//set device language
navigator.globalization.getPreferredLanguage( 
      ( lang ) => {
            let value = lang.value;

            if( value.split('-')[0] && TRANSLATE_DATA[value.split('-')[0]] )
                  DEVICE.lang = value.split('-')[0];
      }
);

//set device language
navigator.globalization.getPreferredLanguage( 
      ( lang ) => {
            let value = lang.value;

            if( value.split('-')[0] && TRANSLATE_DATA[value.split('-')[0]] )
                  DEVICE.lang = value.split('-')[0];
      }
);

function getElementById( element ){
    return document.getElementById(element);
}
function querySelector( query ){
    return document.querySelector(query);
}
function delay( func, time ){
    setTimeout( () => {
        func();
    }, time );
}
function repeat( func, count ){
    for( let i=1; i <= count; i++ )
    {
        func();
    }
}
function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function randomColor(opacity=1){
    return 'rgba('+this.randomNumber(1,255)+','+this.randomNumber(1,255)+','+this.randomNumber(1,255)+','+opacity+')';
}
/**
 * Get distance between points
 * @param  {object} first 
 * @param  {object} second
 * @return {object}
 */
function getDistanceBetween(first,second){
    return Math.hypot( second.x - first.x, second.y - first.y );
}
/**
 * ADD MEDIA
 */
function addMedia( obj ){
    // Example:
    // {name:'window_closeMedia',path:'sounds/window_close.mp3',volume:0.1,autoPlay:false}
    if( !obj.volume ) obj.volume = 1.0;
    if( !obj.name )   obj.name   = Math.random();

    let media = new Media( ROOT_PATH + obj.path );

    if( obj.volume )     media.setVolume(obj.volume);
    if( obj.autoPlay )   media.play();

    MEDIA_LIST[obj.name] = media;

    return;
}