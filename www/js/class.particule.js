/**
 * ## JS Particule Effect ##
 * Coded by Ege Bilecen
 * 
 * Contact: blackclown0@gmail.com | fb.com/eqebilecen
 * @version: 2.1.0
 */
class EBG_Particule{
	constructor( canvas, bounce=0, debug=0, fps=60 ){
		this.canvas   = canvas;
		this.ctx	  = this.canvas.getContext('2d');
		this.settings = {
			fps    : fps,
			bounce : bounce, //1 - on | 0 - off
			particule : { 
                //DEFAULT SETTINGS
				maxDuration : 0,
				maxSpdX   : 4,
				maxSpdY   : 4,
				width  : 5,
				height : 5
			},
			debug:debug
		};
		this.particules = [];
	}
	randomNumber(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}
	randomColor(){
		return 'rgba('+this.randomNumber(1,255)+','+this.randomNumber(1,255)+','+this.randomNumber(1,255)+',0.90)';
	}
	newParticule(x,y,width,height,color,duration,moveX,moveY,rX,rY){
		let self = {
			id:this.randomNumber(0,12412412*1251251231),
			x:x,
			y:y,
			width:width,
			height:height,
			color:color,
			curDuration:0,
			maxDuration:duration,
			moveX:moveX, //1-> + | 2-> -
			moveY:moveY, //1-> + | 2-> -
			randomX:rX, //speed x
			randomY:rY, //speed y
			draw:function(ctx){
				ctx.beginPath();
				ctx.rect(this.x,this.y,this.width,this.height);
				ctx.fillStyle = this.color;
				ctx.fill();
			}
		};
		
		this.particules.push(self);
	}
	createParticule(count,x,y){
		for( var i=1; i <= count; i++ )
		{
			let mX = this.randomNumber(1,2); //1 -> + | 2-> -
			let mY = this.randomNumber(1,2); //1-> + | 2-> -
			let randomX = this.randomNumber(1,this.settings.particule.maxSpdX); //speed x
			let randomY = this.randomNumber(1,this.settings.particule.maxSpdY); //speed y
				
			this.newParticule(x, y, this.settings.particule.width, this.settings.particule.height, this.randomColor(),this.settings.particule.maxDuration,mX,mY,randomX,randomY);
		}
	}
	moveParticule(){
		if( this.particules.length > 0 )
		{
			for( let i=0; i < this.particules.length; i++ )
			{
				//Particule move
				if(this.particules[i].moveX === 1)
					this.particules[i].x += this.particules[i].randomX;
				if(this.particules[i].moveX === 2)
					this.particules[i].x -= this.particules[i].randomX;
				if(this.particules[i].moveY === 1)
					this.particules[i].y += this.particules[i].randomY;
				if(this.particules[i].moveY === 2)
					this.particules[i].y -= this.particules[i].randomY;
				
				//Particule bounce
				if( this.settings.bounce === 1 )
				{
					if(this.particules[i].x > this.canvas.width)
					this.particules[i].randomX = -this.particules[i].randomX;
					if(this.particules[i].x < 0)
						this.particules[i].randomX = -this.particules[i].randomX;
					if(this.particules[i].y > this.canvas.height)
						this.particules[i].randomY = -this.particules[i].randomY;
					if(this.particules[i].y < 0)
						this.particules[i].randomY = -this.particules[i].randomY;
				}
				
				this.particules[i].draw(this.ctx);
				
				if( this.settings.particule.maxDuration !== 0 )
				{
					this.particules[i].curDuration++;
				
					if(this.particules[i].curDuration === this.particules[i].maxDuration )
					{
						this.ctx.clearRect(this.particules[i].x,this.particules[i].y,this.particules[i].width,this.particules[i].height);
						this.particules.splice(i,1);
					}
				}
			}
		}
	}	
    clearParticules(){
		if( this.settings.debug )
			console.log('EBG_PARTICULE DEBUG: clearParticules()');

        this.particules = [];
    }
    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
	update(){
        if( this.particules.length > 0 )
        {
            this.clearCanvas();
            this.moveParticule();
        }
	}
}