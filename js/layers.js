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
                return "At last, there was conothing.<br><br>Unlocks the Singleton.<br><br>Cost: 100 Sets"
            },
            canAfford() {
                return player.points.gte(100)
            },
            pay() {
                player.points = player.points.sub(100)
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
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return new Decimal(10).pow(x) },
            effect(x) {
                return x
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
                return x.add(1)
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
    exponent: 0.3,                          

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
        return hasUpgrade('Set', 13) || player[this.layer].points.gte(1)
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
            cost: new Decimal(10),
        },
        12: {
            title: "Unitality",
            description: "You have a unit now.",
            cost: new Decimal(10),
        },
        13: {
            title: "Associativity",
            description: "You are associative now.",
            cost: new Decimal(10),
        },
    },

    branches: ['Qgrp']
})

addLayer('Qgrp', {
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
    ]
})