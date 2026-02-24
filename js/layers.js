addLayer("p", {
    name: "Set",
    symbol: "Set",
    position: 0,
    startData() { return {
        unlocked: true,
    }},
    color: "#FFFFFF",
    requires: new Decimal(10),
    baseResource: "Sets",
    baseAmount() {return player.points},
    type: "none",
    row: 0,
    layerShown(){return true},

    upgrades: {
        11: {
            fullDisplay() {
                return "At first, there was nothing.<br><br>Unlocks the Empty Set."
            },
            canAfford() {
                return true
            },
            pay() {
                player.points = player.points.sub(new Decimal(10))
            },
        },
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return new Decimal(1).mul(x) },
            effect(x) {
                return x
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Sets<br>Effect: +" + buyableEffect(this.layer, this.id) + " Set generation"
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
    },
})
