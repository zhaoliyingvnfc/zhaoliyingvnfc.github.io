/*
a Pen by DIACO : twitter.com/Diaco_ml || codepen.io/MAW
powered by GSAP : http://www.greensock.com/
*/

var total=80,
    container=document.getElementById('container'),
    w=window.innerWidth,
    h=window.innerHeight,
    Tweens=[],
    SPs=1;



for (var i=total;i--;){ 
	var Div=document.createElement('div');
	TweenLite.set(Div,{attr:{class:'dot'},x:R(w),y:R(h),opacity:0});
	container.appendChild(Div);	Anim(Div);	Tweens.push(Div);
};

function Anim(elm){ 
	  top: $.dot.offsetTop + $.dot.random(($.dot.eleHeight-50)),	//offsets
	  left: $.dot.offsetLeft + $.dot.random(($.dot.eleWidth-50)),
	  opacity: $.dot.opacity($.dot.settings.twinkle)
  }, (($.dot.random(10) + 5) * 2000),function(){  $.dot.fly(sp) } );
};

for(var i=total;i--;){
  Tweens[i].Tween.play()};


function R(max){return Math.random()*max};