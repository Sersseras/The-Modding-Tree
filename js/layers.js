addLayer('Set', {
    name: "Set",
    symbol: "Set",
    position: 0,
    startData() { return {
        unlocked: true,
    }},
    color: "#FFFFFF",
    requires: new Decimal(0),
    baseResource: "Sets",
    baseAmount() {return player.points},
    resource: "Sets",
    type: "none",
    row: 0,
    layerShown(){return true},

    upgrades: {
        11: {
            fullDisplay() {
                return "At first, there was nothing.<br><br>Unlocks the Empty Set.<br><br>Cost: 1 Set"
            },
            canAfford() {
                return true
            },
            pay() {
                player.points = player.points.sub(1)
            },
        },
        12: {
            fullDisplay() {
                return "At last, there was conothing.<br><br>Unlocks the Singleton.<br><br>Cost: 50 Sets"
            },
            canAfford() {
                return player.points.gte(50)
            },
            pay() {
                player.points = player.points.sub(50)
            },
            unlocked () {
                return hasUpgrade(this.layer, 11)
            }
        },
        13: {
            fullDisplay() {
                return "Binary Operations?<br><br>Unlocks Magmas.<br><br>Cost: 500 Sets"
            },
            canAfford() {
                return player.points.gte(500)
            },
            pay() {
                player.points = player.points.sub(500)
            },
            unlocked () {
                return hasUpgrade(this.layer, 12)
            }
        },
        21: {
            fullDisplay() {
                return "Gregor Kempers Blessing<br><br>Sets boost Set gain.<br><br>Effect: " + format(this.effect()) + "x to Set gain<br><br>Cost: 10,000 Sets"
            },
            effect() {
                return player.points.add(1).ln().add(1)
            },
            canAfford() {
                return player.points.gte(10000)
            },
            pay() {
                player.points = player.points.sub(10000)
            },
            unlocked () {
                return hasUpgrade('QGrp', 12)
            }
        },
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return (x == 0) ? 0 : new Decimal(10).pow(x) },
            effect(x) {
                return buyableEffect('QGrp', 11).add(1).mul(x)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Sets<br><br>Effect: +" + format(buyableEffect(this.layer, this.id)) + " Set generation<br><br>Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " Sets"
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
        12: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(2).pow(x.add(1))) },
            effect(x) {
                return x.add(1).mul(buyableEffect('QGrp', 12))
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Singletons<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x Set generation<br><br>Cost: " + this.cost(getBuyableAmount(this.layer, this.id)) + " Empty Sets"
            },
            canAfford() {
                return getBuyableAmount(this.layer, 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
    },

    branches: ['Mag']
})

addLayer('Mag', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#FF0000",                      
    resource: "Magmas",            
    row: 1,                                

    baseResource: "Sets",                 
    baseAmount() { return player.points }, 

    requires: new Decimal(100),              
                                            
    type: "normal",                        
    exponent: 0.5,                          

    effect() {
        return player[this.layer].points.add(1).ln().add(1)
    },

    gainMult() {                           
        return new Decimal(1)               
    },
    gainExp() {                             
        return new Decimal(1)
    },

    layerShown() {
        return hasUpgrade('Set', 13) || player[this.layer].points.gte(1) || hasUpgrade(this.layer, 11) || hasUpgrade(this.layer, 12) || hasUpgrade(this.layer, 13)
    },
    
    tabFormat: [
        "main-display",
        ["display-text",
            function() { return "which multiply point production by " + format(tmp[this.layer].effect)},
        ],
        "blank",
        "prestige-button",
        "blank",
        "resource-display",
        ["display-text",
            function() { return "A Magma (M, &middot;) is a Set M together with a binary operation _&middot;_ : M &times; M &rarr; M" },
        ],
        "blank",
        "blank",
        "blank",
        ["display-text",
            function() { return "Choose one carefully." },
            {"font-size": "32px"},
        ],
        "upgrades"
    ],

    upgrades: {
        11: {
            title: "Divisibility",
            description: "You can divide now.",
            cost: new Decimal(5),
        },
        12: {
            title: "Unitality",
            description: "You have a unit now.",
            cost: new Decimal(5),
        },
        13: {
            title: "Associativity",
            description: "You are associative now.",
            cost: new Decimal(5),
        },
    },

    branches: ['QGrp']
})

addLayer('QGrp', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#00FF00",                      
    resource: "Quasigroups",
    type: "none",          
    row: 2,                                

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points },                        

    layerShown() {
        return hasUpgrade('Mag', 11)
    },
    
    tabFormat: [
        "resource-display",
        ["display-text",
            function() { return "A Quasigroup (Q, &middot;, /, \\) is a Magma (Q, &middot;) together with binary operations _/_, _\\_ : Q &times; Q &rarr; Q such that the following commute" },
        ],
        ["display-image",
            'https://i.imgur.com/ZIWhJNX.png'
        ],
        "buyables",
        "upgrades",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "At first, there was nothing.<br><br>Unlocks the Empty Quasigroup.<br><br>Cost: 1 Magma"
            },
            canAfford() {
                return player['Mag'].points.gte(1)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(1)
            },
        },
        12: {
            fullDisplay() {
                return "At last, there was conothing.<br><br>Unlocks the Trivial Quasigroup.<br><br>Cost: 10 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(10)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(10)
            },
            unlocked () {
                return hasUpgrade(this.layer, 11)
            }
        },
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return Math.round(new Decimal(3).pow(x.add(1))) },
            effect(x) {
                return x.mul(0.5)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Quasigroup<br><br>Effect: +" + format(buyableEffect(this.layer, this.id)) + " to Empty Set effect base<br><br>Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " Empty Sets"
            },
            canAfford() {
                return getBuyableAmount('Set', 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount('Set', 11, getBuyableAmount('Set', 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        12: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(1.5).pow(x.add(1))) },
            effect(x) {
                return new Decimal(1.25).pow(x)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Quasigroups<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Singleton effect base<br><br>Cost: " + this.cost(getBuyableAmount(this.layer, this.id)) + " Singletons"
            },
            canAfford() {
                return getBuyableAmount('Set', 12).gte(this.cost())
            },
            buy() {
                setBuyableAmount('Set', 12, getBuyableAmount('Set', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
    },
})