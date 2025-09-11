"use strict"

const // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
zzfxV=.3,               // volume
zzfxX=new AudioContext, // audio context
zzfx=                   // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
=f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2
)%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a
<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(
h-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
b.buffer=p;b.connect(zzfxX.destination);b.start()}

const SLOTS = [-1.5, -0.5, 0.5, 1.5],
	PLAYERS = [],
	TURNBARS = []

let flash,
	zIndex = 999,
	turn = 0,
	topCard

function updateTurnBars() {
	TURNBARS.forEach((e) => e.style.visibility = "hidden")
	TURNBARS[turn].style.visibility = "visible"
}

function alignCard(card, side, slot) {
	card.className = "card " + (side || "")
	card.style.setProperty('--i', SLOTS[slot || 0]);
	card.game.side = side
	card.game.slot = slot
}

function playCard(card) {
	if (card.game.side != PLAYERS[turn]) {
		zzfx(...[2.1,,82,,.02,.006,4,4,,25,,,,,15,,.11,.5,.02])
		flash.animate([
			{background: "#f00f"},
			{background: "#0000"},
		],{
			duration: 200,
			fill: "forwards"
		}).play()
		return
	}

	card.onclick = function() { return false }
	card.style.zIndex = ++zIndex

	requestAnimationFrame(() => {
		card.style.transform = `translate(-50%, -50%) rotateZ(${
			Math.random() * 10 - 5}deg) scale(2)`
	})

	if (topCard != null && topCard.game.value > card.game.value) {
		const backCard = topCard
		alignCard(backCard, card.game.side, card.game.slot)
		backCard.onclick = function() {
			playCard(backCard)
			return false
		}
		requestAnimationFrame(() => {
			backCard.style.transform = ""
		})
		zzfx(...[.6,,527,.1,.17,.21,1,.5,,,120,.07,.1,,7.4,,,.66,.16,.05,358])
	} else {
		const next = newCard(card.game.side, card.game.slot)
		document.body.appendChild(next)
		next.style.transform = "translate(-60vw, -60vh)"
		requestAnimationFrame(() => {
			next.style.transform = ""
		})
		zzfx(...[4.2,,60,.03,.01,.06,,3.7,,125,,,,.6,,,.02,.71,.04,,561])
	}

	topCard = card
	turn = ++turn % PLAYERS.length
	updateTurnBars()
}

function newCard(side, slot) {
	const card = document.createElement("a"),
		value = 1 + (Math.random() * 5 | 0)

	card.href = "#"
	card.onclick = function() {
		playCard(card)
		return false
	}

	card.game = {
		value: value
	}
	card.innerHTML = value

	alignCard(card, side, slot)

	return card
}

function newCatCard(side, slot) {
	const card = newCard(side, slot)
	card.classList.add("cat")
	card.game.value = 0
	card.innerHTML = "&nbsp"
	return card
}

function setup(nplayers) {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen()
	}

	document.body.innerHTML = ""

	flash = document.createElement("div")
	flash.className = "flash"
	document.body.appendChild(flash)

	const sides = ["bottom", "left", "top", "right"],
		cardsPerPlayer = SLOTS.length
	for (let i = 0, step = nplayers == 2 ? 2 : 1; i < nplayers; ++i) {
		const side = sides[i * step]
		PLAYERS.push(side)

		const bar = document.createElement("div")
		bar.className = "bar " + side
		bar.innerHTML = "TURN"
		document.body.appendChild(bar)
		TURNBARS.push(bar)

		const last = cardsPerPlayer - 1;
		for (let j = 0; j < last; ++j) {
			document.body.appendChild(newCard(side, j))
		}
		document.body.appendChild(newCatCard(side, last))
	}

	updateTurnBars()
}

window.onload = function() {
	document.body.innerHTML = `
<div class="dialog">
<p>Number of players</p>
<a href="#" onclick="setup(2); return false" class="play">2</a>
<a href="#" onclick="setup(3); return false" class="play">3</a>
<a href="#" onclick="setup(4); return false" class="play">4</a>
</div>
`
}
