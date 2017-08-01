/*
 ______      ______     ______   
|_   _ \   .' ___  |  .' ___  |  
  | |_) | / .'   \_| / .'   \_|  
  |  __'. | |   ____ | |   ____  
 _| |__) |\ `.___]  |\ `.___]  | 
|_______/  `._____.'  `._____.'          
                       
*/
class _GAME {
    constructor( version, debug=0,startDelay=3, background="#000" ){
        this.canvas = getElementById('game-canvas');
        this.ctx    = this.canvas.getContext('2d');
        this.testedDevice = { width:412, height:732, name:'Nexus 5X' };
    
        /**
         * HTML SETTINGS OF MAIN PAGE
         */
        this.settings = {
            version : version,
            startDelay  : startDelay,
            background  : background,
            creator     : 'BG Games',
            particuleCount : 50,
            debug : debug
        };

        /**
         * GAME SETTINGS
         */
        this.game = {
            state:0, //1 -> Game Running, 0 -> Game Finished
            circle_size:20,
            bonus_size:35,
            score:0,
            bonusScore:10, //score amount of bonus rectange
            maxTime:30, //time
            time:0, //current time
            fps:60,
            width:window.innerWidth,
            height:window.innerHeight,
            maxBall  : 20,
            ballList : [],
            bonusList: [],
            createBall:function(){
                if( this.ballList.length < this.maxBall )
                {
                    let self = {
                        x:randomNumber(0,this.width),
                        y:randomNumber(0,this.height),
                        color:randomColor(0.90)
                    };
                    self.points = {
                        up   : self.y - this.circle_size,
                        down : self.y + this.circle_size,
                        right: self.x + this.circle_size,
                        left : self.x - this.circle_size,
                    };

                    if( (self.points.up < 0 || self.points.up > this.height) || (self.points.down < 0 || self.points.down > this.height) || (self.points.left < 0 || self.points.left > this.width) || (self.points.right < 0 || self.points.right > this.width) )
                        this.createBall();
                    else
                        this.ballList.push(self);
                }
            },
            createBonusRect : function(){
                let self = {
                    x : randomNumber(0,this.width),
                    y : randomNumber(0, this.height),
                    color : randomColor(0.90)
                };
                self.center = {
                    x: self.x + this.bonus_size/2,
                    y: self.y + this.bonus_size/2
                }; //center points of rectangle
                self.points = {
                    up   : self.center.y - this.bonus_size/2,
                    down : self.center.y + this.bonus_size/2,
                    right: self.center.x + this.bonus_size/2,
                    left : self.center.x - this.bonus_size/2,
                };

                if( (self.points.up < 0 || self.points.up > this.height) || (self.points.down < 0 || self.points.down > this.height) || (self.points.left < 0 || self.points.left > this.width) || (self.points.right < 0 || self.points.right > this.width) )
                    this.createBonusRect();
                else
                {
                    this.bonusList.push(self);
                    this.bonusMemory++;
                }
            },
            clearBalls   : function(){
                this.ballList = [];
            },
            setHighScore : function( score ){
                localStorage.setItem('highscore',score);
            },
            currentSpeed : 1000 //ms
        }; //end of @var game

        this.screen = {

            mainMenu  : getElementById('main-menu'),
            loading   : getElementById('loading'),
            version   : getElementById('game-version'),
            changelog : getElementById('changelog'),
            creator   : getElementById('creator'),
            highscore : getElementById('highscore')

        };
    }
    showMainScreen(){
        if( this.settings.debug )
            console.log('DEBUG: showMainScreen()');

        //initialize main page
        document.title                                   = TRANSLATE_DATA[DEVICE.lang].main_menu.game_name;
        document.body.style.background                   = this.settings.background;
        getElementById('game-name').innerHTML            = TRANSLATE_DATA[DEVICE.lang].main_menu.game_name;
        getElementById('game-version').innerHTML         = 'v'+this.settings.version;
        getElementById('game-credit').innerHTML          = TRANSLATE_DATA[DEVICE.lang].main_menu.game_credit;
        getElementById('game-start-button').innerHTML    = TRANSLATE_DATA[DEVICE.lang].main_menu.start_button;
        getElementById('loading').innerHTML              = TRANSLATE_DATA[DEVICE.lang].main_menu.loading;
        getElementById('creator').innerHTML              = this.settings.creator;
        querySelector('#changelog > #version').innerHTML = '-v'+this.settings.version+'-';

        //remove loading span
        this.screen.loading.style.opacity = 0;
        
        //initilize main screen HTML elements' positions
        this.screen.mainMenu.style.top  = '0';
        this.screen.changelog.style.top = '0';
        this.screen.creator.style.top   = '0';
        this.screen.highscore.style.top = '0';
        this.screen.version.style.top   = '5px';
        this.screen.version.style.right = '5px'; 

        //set highscore to HTML element
        querySelector('#highscore').innerHTML = TRANSLATE_DATA[DEVICE.lang].main_menu.highscore;
        let highscore_data = document.createElement('span');
        highscore_data.id  = 'data';
        querySelector('#highscore').appendChild(highscore_data);
        delay( () => {  
            querySelector('#highscore > #data').innerHTML = localStorage.getItem('highscore');
        }, 100);

        //set changelogs
        getElementById('changes').innerHTML = '';
        for( let i = 0;  i < TRANSLATE_DATA[DEVICE.lang].main_menu.changelog.length; i++ )
        {
            let li = document.createElement('li');
            li.innerHTML = '<i class="dot"></i> ' + TRANSLATE_DATA[DEVICE.lang].main_menu.changelog[i];

            getElementById('changes').appendChild(li);
        }

        delay( () => {
            this.screen.loading.style.display   = 'none';
            
            this.screen.mainMenu.style.display  = 'block';
            this.screen.changelog.style.display = 'block';
            this.screen.creator.style.display   = 'block';
            this.screen.version.style.display   = 'block';
            this.screen.highscore.style.display = 'block';

            delay( () =>{
                //start main menu music
                MEDIA_LIST['main_menu_music'].play();
                
                this.screen.mainMenu.style.opacity  = '1';
                this.screen.changelog.style.opacity = '1';
                this.screen.creator.style.opacity   = '1';
                this.screen.version.style.opacity   = '1';
                this.screen.highscore.style.opacity = '1';

                this.screen.mainMenu.style.top  = '25%';
                this.screen.changelog.style.top = '60%';
                this.screen.highscore.style.top = '50%';
                this.screen.creator.style.top   = this.canvas.height - 30 + 'px';

                //create background particules
                PARTICULE.settings.bounce = 1;
                PARTICULE.settings.particule.maxDuration = 0;
                PARTICULE.createParticule(this.settings.particuleCount,window.innerWidth/2,300);

            }, 500 );
        } , 1000 );
    }
    prepareGame(){
        if( this.settings.debug )
            console.log('DEBUG: prepareGame()');
        
        //request new ad
        admob.cacheInterstitial();

        this.screen.loading.style.opacity   = '0';
        this.screen.version.style.opacity   = '0';
        this.screen.changelog.style.opacity = '0';
        this.screen.creator.style.opacity   = '0';
        this.screen.mainMenu.style.opacity  = '0';
        this.screen.highscore.style.opacity = '0';

        delay( () => {
            let count_span           = document.createElement('span'); 
            count_span.id            = 'start-counter';
            count_span.style.cssText = 'top:0;position:absolute;display:none;width:100%;text-align:center;margin-top:50%;font-size:230%;color:'+randomColor()+';transition:500ms all;z-index:3;';
            
            if( DEVICE.lang == 'tr' )
                count_span.style.fontSize = '200%';

            count_span.innerHTML     = TRANSLATE_DATA[DEVICE.lang].game_prepare_screen.text;

            let startDelay           = document.createElement('span');
            let startDelayNumber     = GAME.settings.startDelay;
            startDelay.style.cssText = 'top:0;position:absolute;display:none;width:100%;text-align:center;margin-top:12%;font-size:150%;color:'+randomColor()+';transition:500ms all;z-index:3;';
            
            if( DEVICE.lang == 'tr' )
                startDelay.style.marginTop = '10%';

            startDelay.innerHTML     = startDelayNumber;

            count_span.appendChild(startDelay);
            document.body.appendChild(count_span);

            delay( () => {
                PARTICULE.clearParticules();
                PARTICULE.clearCanvas();
                
                this.screen.mainMenu.style.display  = 'none';
                this.screen.version.style.display   = 'none';
                this.screen.changelog.style.display = 'none';
                this.screen.creator.style.display   = 'none';
                this.screen.highscore.style.display = 'none';
                
                count_span.style.display = 'block';
                startDelay.style.display = 'block';
                
                //pause main menu music    
                MEDIA_LIST['main_menu_music'].stop();
                MEDIA_LIST['number3'].play();

                var gsd = setInterval( () => {
                    if( startDelayNumber > 1 )
                    {
                        startDelayNumber--;
                        MEDIA_LIST['number'+startDelayNumber].play();

                        count_span.style.color = randomColor();
                        startDelay.style.color = randomColor();
                        startDelay.innerHTML = startDelayNumber;
                    }
                    else
                    {
                        getElementById('start-counter').style.opacity = 0;

                        delay( () => {
                            getElementById('start-counter').remove();
                        }, 500 );

                        clearInterval(gsd);

                        this.startGame();
                    }
                }, 1000 );
            }, 500);
        }, 500 );
    }
    startGame(){
        if( this.settings.debug )
            console.log('DEBUG: startGame()');

        //set game state
        this.game.state = 1; //game started

        //reset the score from before's game
        this.game.score = 0;

        //reset balls from before's game
        this.game.clearBalls();

        //reset time from before's game
        this.game.time = this.game.maxTime;

        //set time in HTML
        let time_span = document.createElement('span');
        time_span.id  = 'time';
        time_span.style.cssText = 'display:block;position:absolute;left:5px;top:5px;font-size:125%;color:#fff;z-index:3;transition:opacity,500ms;';
        time_span.innerHTML = TRANSLATE_DATA[DEVICE.lang].game_screen.time;

        let time = document.createElement('span');
        time.id  = 'data';
        time.innerHTML = this.game.maxTime;

        time_span.appendChild(time);
        document.body.appendChild(time_span);

        //set score in HTML
        let score_span = document.createElement('span');
        score_span.id  = 'score';
        score_span.style.cssText = 'display:block;position:absolute;right:5px;top:5px;font-size:125%;color:#fff;z-index:3;transition:opacity,500ms;';
        score_span.innerHTML = TRANSLATE_DATA[DEVICE.lang].game_screen.score;

        let score = document.createElement('span');
        score.id  = 'data';
        score.innerHTML = this.game.score;

        score_span.appendChild(score);
        document.body.appendChild(score_span);

        //create frist circle
        if( this.game.state )
            this.game.createBall( randomNumber(0, this.canvas.width), randomNumber(0, this.canvas.height), randomColor() );

        //start creating circles
        var ball_creater = setInterval( () => {
            if( this.game.state )
                this.game.createBall();
            else
                clearInterval(ball_creater);
        }, this.game.currentSpeed );

        //set update loop
        var ball_drawer = setInterval( () => {
            if( this.game.state )
            {
                this.clearCanvas();

                //set the score
                score.innerHTML = this.game.score;

                //draw balls(circles)
                for( let i=0; i < this.game.ballList.length; i++ )
                {
                    let ball = this.game.ballList[i];
                    this.ctx.beginPath();
                    this.ctx.fillStyle = ball.color;
                    this.ctx.arc( ball.x, ball.y, this.game.circle_size, 0, 2*Math.PI );
                    this.ctx.fill();
                    this.ctx.closePath();
                }

                //draw rectangles(bonus things)
                for( let i=0; i < this.game.bonusList.length; i++ )
                {
                    let bonusRect = this.game.bonusList[i];
                    this.ctx.beginPath();
                    this.ctx.fillStyle = bonusRect.color;
                    this.ctx.fillRect( bonusRect.x, bonusRect.y, this.game.bonus_size, this.game.bonus_size );
                    this.ctx.closePath();
                }
            }
            else
                clearInterval(ball_drawer);
        }, 1000/this.game.fps );

        //game time , timing
        var time_decreaser = setInterval( () => {
            if( this.game.state )
            {
                if( this.game.time > 0 )
                    this.game.time--
                time.innerHTML = this.game.time;

                //timeout
                if( this.game.time < 1 )
                {
                    this.finishGame();
                    clearInterval(time_decreaser);
                }
            }
            else
                clearInterval(time_decreaser);
        }, 1000 );

        //add event listener to canvas
        var canvas_event_listener = this.canvas.addEventListener('click',(e) => {
            if( this.game.state )
            {
                let x = e.clientX;
                let y = e.clientY;

                //find the closest ball from tapped coords
                for( let i=0; i < this.game.ballList.length; i++ )
                {
                    let ball     = this.game.ballList[i];
                    let distance = getDistanceBetween( {x:x,y:y}, {x:ball.x,y:ball.y} ); 

                    if( distance < 25 )
                    {
                        MEDIA_LIST['tap'].stop();
                        MEDIA_LIST['tap'].play();
                        this.game.score++;
                        this.game.ballList.splice(i,1);

                        //create bonus rectangle if its time for that
                        if( this.game.score % 30 == 0 )
                            this.game.createBonusRect();
                        
                        //instantly create a new one
                        if( this.game.score > 20 && this.game.score < 40 )
                        { //make game a little bit hard, create 2 balls
                            repeat( () => {
                                this.game.createBall();
                            }, 2 );
                        }
                        else if( this.game.score > 40 )
                        { //make game a little bit hard, create 3 balls
                            repeat( () => {
                                this.game.createBall();
                            }, 3 );
                        }
                        else 
                            this.game.createBall();
                        
                        PARTICULE.settings.bounce = 0;
                        PARTICULE.settings.particule.maxDuration = 50;
                        PARTICULE.createParticule(10,x,y);
                    }
                }

                //find closest rectange if there is/are
                if( this.game.bonusList.length > 0 )
                {
                    for( let i=0; i < this.game.bonusList.length; i++ )
                    {
                        let bonusRect = this.game.bonusList[i];
                        let distance  = getDistanceBetween( {x:x,y:y}, {x:bonusRect.center.x,y:bonusRect.center.y} );

                        if( distance < 25 )
                        {
                            MEDIA_LIST['tap'].stop();
                            MEDIA_LIST['tap'].play();
                            this.game.score += this.game.bonusScore;
                            this.game.bonusList.splice(i,1);
                            
                            PARTICULE.settings.bounce = 0;
                            PARTICULE.settings.particule.maxDuration = 50;
                            PARTICULE.createParticule(10,x,y);
                        }
                    }
                }
            }
            else
                clearInterval(canvas_event_listener);
        });
    }
    finishGame(){
        if( this.settings.debug )
            console.log('DEBUG: finishGame()');
        //set game state
        this.game.state = 0; //finished

        //clear canvas
        this.clearCanvas();
        PARTICULE.clearParticules();
        PARTICULE.clearCanvas();

        //hide score and time spans
        getElementById('score').style.opacity = '0';
        getElementById('time').style.opacity  = '0';

        delay( () => {
            getElementById('score').remove();
            getElementById('time').remove();
        }, 500 );

        //show ad
        admob.showInterstitial();

        //show div about our score and time
        let info_div = document.createElement('div');//info did
        info_div.id  = 'info-div';
        info_div.style.cssText = 'display:block;position:absolute;opacity:0;top:0;width:100%;text-align:center;transition:top,opacity,1000ms;z-index:3;';
        
        let game_over = document.createElement('span');
        game_over.innerHTML = TRANSLATE_DATA[DEVICE.lang].end_screen.time_over;
        game_over.style.cssText = 'color:crimson;font-size:240%;display:block;font-weight:bold;margin-bottom:5px;';

        let score_span = document.createElement('span');//score span
        score_span.innerHTML = TRANSLATE_DATA[DEVICE.lang].end_screen.score + '<span style="color:darkorchid;font-weight:bold;">'+this.game.score+'</span>';
        score_span.style.cssText = 'margin-bottom:5px;font-size:170%;display:block;';

        let return_mainpage = document.createElement('span');
        return_mainpage.innerHTML = TRANSLATE_DATA[DEVICE.lang].end_screen.tap_anywhere;
        return_mainpage.style.cssText = 'font-size:105%;color:#aaa;display:block;margin-top:10px;';

        info_div.appendChild(game_over);
        info_div.appendChild(score_span);

        //set highscore if this score higher than before
        if( this.game.score > parseInt(localStorage.getItem('highscore')) )
        {
            this.game.setHighScore( this.game.score );

            //show HTML elements
            let highscore_span = document.createElement('span');
            highscore_span.innerHTML = TRANSLATE_DATA[DEVICE.lang].end_screen.new_highscore;
            highscore_span.style.cssText = 'font-size:260%;color:#1185da;';
            
            //set adjustments
            if( DEVICE.lang == 'tr' )
                highscore_span.style.fontSize = '240%';
            
            info_div.appendChild(highscore_span);

            //firework effects
            delay( () => {
                PARTICULE.settings.bounce = 0;
                PARTICULE.settings.particule.maxDuration = 100;

                let a = (window.innerWidth  > this.testedDevice.width)  ? window.innerWidth / this.testedDevice.width   : this.testedDevice.width / window.innerWidth;
                let b = (window.innerHeight > this.testedDevice.height) ? window.innerHeight / this.testedDevice.height : this.testedDevice.height / window.innerHeight;

                PARTICULE.createParticule(25, window.innerWidth * a / 2.8  / a, window.innerHeight * b / 4.85  / b);
                PARTICULE.createParticule(25, window.innerWidth * a / 1.64 / a, window.innerHeight * b / 3.25  / b);
                PARTICULE.createParticule(25, window.innerWidth * a / 2.8  / a, window.innerHeight * b / 2.44  / b);
                PARTICULE.createParticule(25, window.innerWidth * a / 2.05 / a, window.innerHeight * b / 1.83  / b);

                MEDIA_LIST['firework'].play();
            }, 500 );
        }

        info_div.appendChild(return_mainpage);
        document.body.appendChild(info_div);

        delay( () => {
            MEDIA_LIST['game_over'].play();
            info_div.style.opacity = '1';
            info_div.style.top = '30%';

            document.body.onclick = () => {
                if( !this.game.state )
                {
                    document.body.onclick = ()=>{};
                    info_div.style.opacity = '0';

                    delay( () => {
                        info_div.remove();

                        //show loading
                        getElementById('loading').style.display = 'block';
                        getElementById('loading').style.opacity = '1';

                        delay( () => {
                            //show menu
                            this.showMainScreen();
                        } , 300 );
                        
                    }, 1000 );
                }
                else
                    document.body.onclick = ()=>{};
            }
        }, 350 );    
    }
    addAudio( obj ){
        // Example:
        // {name:'window_closeAudio',path:'sounds/window_close.mp3',loop:false,volume:0.1,autoPlay:false}
        if( !obj.volume ) obj.volume = 1.0;
        if( !obj.name )   obj.name   = Math.random();

        let audio = new Audio();
        audio.src = obj.path;

        if( obj.loop )       audio.loop   = true;
        if( obj.volume )     audio.volume = obj.volume;
        if( obj.autoPlay )   audio.play();

        this.AUDIO_LIST[obj.name] = audio;

        return;
    }
    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    setHighScore(){

    }
}