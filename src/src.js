"use strict"

const SLOTS = [-1.5, -0.5, 0.5, 1.5],
	PLAYERS = []

let zIndex = 999,
	turn = 0,
	topCard

function alignCard(card, side, slot) {
	card.className = "card " + (side || "")
	card.style.setProperty('--i', SLOTS[slot || 0]);
	card.game.side = side
	card.game.slot = slot
}

function playCard(card) {
	if (card.game.side != PLAYERS[turn]) {
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
	} else {
		const next = newCard(card.game.side, card.game.slot)
		document.body.appendChild(next)
		next.style.transform = "translate(-60vw, -60vh)"
		requestAnimationFrame(() => {
			next.style.transform = ""
		})
	}

	topCard = card
	turn = ++turn % PLAYERS.length
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

function setup(nplayers) {
	document.body.innerHTML = ""

	const sides = ["bottom", "left", "top", "right"],
		cardsPerPlayer = SLOTS.length
	for (let i = 0, step = nplayers == 2 ? 2 : 1; i < nplayers; ++i) {
		const side = sides[i * step]
		PLAYERS.push(side)
		for (let j = 0; j < cardsPerPlayer; ++j) {
			document.body.appendChild(newCard(side, j))
		}
	}
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
