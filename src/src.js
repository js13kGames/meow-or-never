"use strict"

const SLOTS = [-1.5, -0.5, 0.5, 1.5]

let zIndex = 999

function playCard(card) {
	card.onclick = function() { return false }
	card.style.zIndex = ++zIndex

	const cardTransform = card.style.transform
	card.animate(
		[
			{transform: cardTransform},
			{transform: `translate(-50%, -50%) rotateZ(${
				Math.random() * 10 - 5
				}deg) scale(2)`},
		], {
			duration: 200,
			fill: "forwards",
		}
	).play()

	const next = newCard(card.game.side, card.game.slot)
	next.style.transform = cardTransform
	document.body.appendChild(next)
	next.animate(
		[
			{transform: `translate(-60vw, -60vh)`},
			{transform: cardTransform},
		], {
			duration: 200,
			fill: "forwards",
		}
	).play()
}

function newCard(side, slot) {
	const card = document.createElement("a"),
		value = 1 + (Math.random() * 5 | 0)

	card.href = "#"
	card.onclick = function() {
		playCard(card)
		return false
	}

	card.className = "card " + (side || "")
	card.style.setProperty('--i', SLOTS[slot || 0]);

	card.game = {
		value: value,
		side: side,
		slot: slot,
	}

	card.innerHTML = value

	return card
}

function setup(nplayers) {
	document.body.innerHTML = ""

	const sides = ["top", "bottom", "left", "right"],
		cardsPerPlayer = SLOTS.length
	for (let i = 0; i < nplayers; ++i) {
		const side = sides[i]
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
