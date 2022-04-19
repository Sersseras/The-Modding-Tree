addLayer("alvi", {
    symbol: "A",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#FF0000",
    requires: new Decimal(10),
    resource: "alvi points",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        { key: "a", description: "A: Reset for Alvi points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
        11: {
            title: "Start",
            description: "Gain 1 point per second.",
            cost: new Decimal(1),
            effect() {
                return 1
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id)) },
        },
        12: {
            title: "Start more you Naischer",
            description: "Multiply point gain based on Alvi points\nFormula: x^(1/2)+1",
            cost: new Decimal(1),
            effect() {
                return player[this.layer].points.pow(0.5).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade(this.layer, 11) }
        },
        13: {
            title: "More Alvi is always better",
            description: "Multiply Alvi point gain based on points\nFormula: ln(x+1)",
            cost: new Decimal(10),
            effect() {
                return player.points.add(1).ln()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade(this.layer, 12) }
        },
        14: {
            title: "Why, when I start a Modding Tree, it is always you four?",
            description: "Multiply point gain based on points\nFormula: log(x+1)+1",
            cost: new Decimal(25),
            effect() {
                return player.points.add(1).log(10).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade(this.layer, 13) }
        }
    },
    layerShown() { return true }
})