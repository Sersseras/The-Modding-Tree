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

    tabFormat: [
        "resource-display",
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],

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
                return hasUpgrade(this.layer, 12) && ! player['Mag'].points.gte(1) && ! hasUpgrade('Mag', 11) && ! hasUpgrade('Mag', 12) && ! hasUpgrade('Mag', 13)
            }
        },
        21: {
            fullDisplay() {
                return "Gregor Kempers blessing<br><br>Sets boost Set gain.<br><br>Currently: " + format(this.effect()) + "x to Set gain<br><br>Cost: 9,001 Sets"
            },
            effect() {
                return player.points.add(1).ln().add(1)
            },
            canAfford() {
                return player.points.gte(9001)
            },
            pay() {
                player.points = player.points.sub(9001)
            },
            unlocked () {
                return hasUpgrade('QGrp', 12) || hasUpgrade('UMag', 21) || hasUpgrade('SGrp', 13)
            }
        },
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return (x == 0) ? 0 : new Decimal(10).pow(x).mul(buyableEffect('SGrp', 12).mul(tmp['Grp'].effect)) },
            effect(x) {
                return buyableEffect('QGrp', 11).add(1).mul(x)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Sets<br><br>Effect: +" + format(buyableEffect(this.layer, this.id)) + " Set gain<br><br>Cost: " + format(this.cost()) + " Sets"
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 0))
                    player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        12: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(2).pow(x.add(1)).mul(tmp['Grp'].effect).sub(buyableEffect('SGrp', 11))) },
            effect(x) {
                return x.add(1).mul(buyableEffect('QGrp', 12))
            },
            display() {
                if (hasUpgrade('SGrp', 21))
                    return "You have " + getBuyableAmount(this.layer, this.id) + " Singletons<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x Set and Magma gain<br><br>Cost: " + this.cost() + " Empty Sets"
                return "You have " + getBuyableAmount(this.layer, this.id) + " Singletons<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x Set gain<br><br>Cost: " + this.cost() + " Empty Sets"
            },
            canAfford() {
                return getBuyableAmount(this.layer, 11).gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 0))
                    setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).sub(Math.max(this.cost(getBuyableAmount(this.layer, this.id)), 0)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
        16: {
            title: "Devvvv",
            cost(x) { return new Decimal(0) },
            canAfford() {
                return true
            },
            display() {
                return "+1 Group leel"
            },
            buy() {
                player['Grp'].points = player['Grp'].points.add(1)
                player['Grp'].total = player['Grp'].total.add(1)
            },
            unlocked() {
                return true
            }
        },
        17: {
            title: "Devvv",
            cost(x) { return new Decimal(0) },
            canAfford() {
                return true
            },
            display() {
                return "x10 Sets leel"
            },
            buy() {
                player.points = player.points.mul(10)
            },
            unlocked() {
                return true
            }
        },
        18: {
            title: "Devv",
            cost(x) { return new Decimal(0) },
            canAfford() {
                return true
            },
            display() {
                return "x10 Magma leel"
            },
            buy() {
                player['Mag'].points = player['Mag'].points.mul(10)
            },
            unlocked() {
                return true
            }
        },
        19: {
            title: "Dev",
            cost(x) { return new Decimal(0) },
            canAfford() {
                return true
            },
            display() {
                return "+10 Magma leel"
            },
            buy() {
                player['Mag'].points = player['Mag'].points.add(10)
            },
            unlocked() {
                return true
            }
        },
    },

    automate() {
        if (hasMilestone('Mag', 0))
            buyBuyable(this.layer, 11)
        if (hasMilestone('Mag', 2))
            buyBuyable(this.layer, 12) 
    },

    branches: ['Mag']
})

addLayer('Mag', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#A0A0A0",                      
    resource: "Magmas",            
    row: 1,                                

    baseResource: "Sets",                 
    baseAmount() { return player.points }, 

    requires: new Decimal(100),              
                                            
    type: "normal",                        
    exponent: 0.5,                          

    effect() {
        return player[this.layer].points.add(1).ln().add(1).pow((hasUpgrade('UMag', 22)) ? 2 : 1)
    },

    gainMult() {
        mul = new Decimal (1)
        if (hasUpgrade('QGrp', 21))
            mul = mul.mul(upgradeEffect('QGrp', 21))
        mul = mul.mul(buyableEffect('UMag', 11))
        if (hasUpgrade('UMag', 21))
            mul = mul.mul(upgradeEffect('UMag', 21))
        mul = mul.mul(buyableEffect('SGrp', 21))
        if (hasUpgrade('SGrp', 21))
            mul = mul.mul(buyableEffect('Set', 12))
        if (hasUpgrade('Loop', 21))
            mul = mul.mul(buyableEffect('Loop', 11))
        if (hasUpgrade('AssQGrp', 21))
            mul = mul.mul(upgradeEffect('AssQGrp', 21))

        return mul             
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
            function() { return "which boost Set gain by " + format(tmp[this.layer].effect)},
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
        "upgrades",
        "blank",
        "milestones",
    ],

    upgrades: {
        11: {
            title: "Divisibility",
            description: "You can divide now.",
            cost: new Decimal(5),
            unlocked() {
                return hasMilestone(this.layer, 4) || (hasMilestone(this.layer, 1) && ! (hasUpgrade(this.layer, 12) && hasUpgrade(this.layer, 13))) || (! hasUpgrade(this.layer, 12) && ! hasUpgrade(this.layer, 13))
            }
        },
        12: {
            title: "Unitality",
            description: "You have a unit now.",
            cost: new Decimal(5),
            unlocked() {
                return hasMilestone(this.layer, 4) || (hasMilestone(this.layer, 1) && ! (hasUpgrade(this.layer, 11) && hasUpgrade(this.layer, 13))) || (! hasUpgrade(this.layer, 11) && ! hasUpgrade(this.layer, 13))
            }
        },
        13: {
            title: "Associativity",
            description: "You are associative now.",
            cost: new Decimal(5),
            unlocked() {
                return hasMilestone(this.layer, 4) || (hasMilestone(this.layer, 1) && ! (hasUpgrade(this.layer, 11) && hasUpgrade(this.layer, 12))) || (! hasUpgrade(this.layer, 11) && ! hasUpgrade(this.layer, 12))
            }
        },
        21: {
            fullDisplay() {
                return "You can have both?<br><br>Unlocks Loops.<br><br>Cost: " + format(new Decimal(5e6).mul((hasUpgrade(this.layer, 22)) ? 100 : 1).mul((hasUpgrade(this.layer, 23)) ? 5000 : 1).div((hasUpgrade(this.layer, 22) && hasUpgrade(this.layer, 23)) ? 25 : 1)) + " Sets"
            },
            canAfford() {
                return player.points.gte(new Decimal(5e6).mul((hasUpgrade(this.layer, 22)) ? 100 : 1).mul((hasUpgrade(this.layer, 23)) ? 5000 : 1).div((hasUpgrade(this.layer, 22) && hasUpgrade(this.layer, 23)) ? 25 : 1))
            },
            pay() {
                player.points = player.points.sub(new Decimal(5e6).mul((hasUpgrade(this.layer, 22)) ? 100 : 1).mul((hasUpgrade(this.layer, 23)) ? 5000 : 1).div((hasUpgrade(this.layer, 22) && hasUpgrade(this.layer, 23)) ? 25 : 1))
            },
            unlocked () {
                return hasUpgrade('Mag', 11) && hasUpgrade('Mag', 12)
            }
        },
        22: {
            fullDisplay() {
                return "Can you have both?<br><br>Unlocks Associative Quasigroups.<br><br>Cost: " + format(new Decimal(5e6).mul((hasUpgrade(this.layer, 21)) ? 1000 : 1).mul((hasUpgrade(this.layer, 23)) ? 5000 : 1).div((hasUpgrade(this.layer, 21) && hasUpgrade(this.layer, 23)) ? 25 : 1)) + " Sets"
            },
            canAfford() {
                return player.points.gte(new Decimal(5e6).mul((hasUpgrade(this.layer, 21)) ? 1000 : 1).mul((hasUpgrade(this.layer, 23)) ? 5000 : 1).div((hasUpgrade(this.layer, 21) && hasUpgrade(this.layer, 23)) ? 25 : 1))
            },
            pay() {
                player.points = player.points.sub(new Decimal(5e6).mul((hasUpgrade(this.layer, 21)) ? 1000 : 1).mul((hasUpgrade(this.layer, 23)) ? 5000 : 1).div((hasUpgrade(this.layer, 21) && hasUpgrade(this.layer, 23)) ? 25 : 1))
            },
            unlocked () {
                return hasUpgrade('Mag', 11) && hasUpgrade('Mag', 13)
            }
        },
        23: {
            fullDisplay() {
                return "Both you can have.<br><br>Unlocks Monoids.<br><br>Cost: " + format(new Decimal(5e6).mul((hasUpgrade(this.layer, 21)) ? 1000 : 1).mul((hasUpgrade(this.layer, 22)) ? 100 : 1).div((hasUpgrade(this.layer, 21) && hasUpgrade(this.layer, 22)) ? 20 : 1)) + " Sets"
            },
            canAfford() {
                return player.points.gte(new Decimal(5e6).mul((hasUpgrade(this.layer, 21)) ? 1000 : 1).mul((hasUpgrade(this.layer, 22)) ? 100 : 1).div((hasUpgrade(this.layer, 21) && hasUpgrade(this.layer, 22)) ? 20 : 1))
            },
            pay() {
                player.points = player.points.sub(new Decimal(5e6).mul((hasUpgrade(this.layer, 21)) ? 1000 : 1).mul((hasUpgrade(this.layer, 22)) ? 100 : 1).div((hasUpgrade(this.layer, 21) && hasUpgrade(this.layer, 22)) ? 20 : 1))
            },
            unlocked () {
                return hasUpgrade('Mag', 12) && hasUpgrade('Mag', 13)
            }
        },
        31: {
            fullDisplay() {
                return "Finally, all three.<br><br>Unlocks Groups.<br><br>Cost: 1e14 Sets"
            },
            canAfford() {
                return player.points.gte(1e14)
            },
            pay() {
                player.points = player.points.sub(1e14)
            },
            unlocked () {
                return hasUpgrade('Mag', 21) && hasUpgrade('Mag', 22) && hasUpgrade('Mag', 23) && ! player['Grp'].total.gte(1)
            }
        },
        32: {
            fullDisplay() {
                return "A Flexibility?<br><br>Unlocks Flexible Magmas<br><br>Cost: 6 Singletons"
            },
            canAfford() {
                return getBuyableAmount('Set', 12).gte(6)
            },
            pay() {
                setBuyableAmount('Set', 12, getBuyableAmount('Set', 12).sub(6))
            },
            unlocked () {
                return hasMilestone('Grp', 0) && ! player['FlexMag'].total.gte(1)
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "100 Magmas",
            effectDescription: "Autobuy Empty Sets",
            done() { return player[this.layer].points.gte(100) }
        },
        1: {
            requirementDescription: "1,000 Magmas",
            effectDescription: "You may choose once more",
            done() { return player[this.layer].points.gte(1000) }
        },
        2: {
            requirementDescription: "1,000,000 Magmas",
            effectDescription: "Autobuy Singletons",
            done() { return player[this.layer].points.gte(1e6) }
        },
        3: {
            requirementDescription: "10,000,000 Magmas",
            effectDescription: "Get 10% of Magma gain per second",
            done() { return player[this.layer].points.gte(1e7) }
        },
        4 : {
            requirementDescription: "100,000,000 Magmas",
            effectDescription: "Your choices did not matter",
            done() { return player[this.layer].points.gte(1e8) }
        },
    },  

    passiveGeneration() {
        if (hasMilestone(this.layer, 3))
            return new Decimal(0.1)
        return new Decimal(0)
    },

    branches: ['QGrp', 'UMag', 'SGrp', 'FlexMag']
})

addLayer('QGrp', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#FF0000",                      
    resource: "Quasigroups",
    type: "none",          
    row: 2,
    position: 0,                         

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
        "blank",
        ["display-image",
            'https://i.imgur.com/ZIWhJNX.png'
        ],
        "blank",
        "buyables",
        "blank",
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
        21: {
            fullDisplay() {
                return "Finite Quasigroups are Latin Squares.<br><br>Quasigroup count boosts Magma gain.<br><br>Currently: " + format(this.effect()) + "x to Magma gain<br><br>Cost: 150 Magmas"
            },
            effect () {
                return getBuyableAmount(this.layer, 11).add(getBuyableAmount(this.layer, 12)).mul(2).add(1)
            },
            canAfford() {
                return player['Mag'].points.gte(150)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(150)
            },
            unlocked () {
                return hasUpgrade(this.layer, 12)
            }
        },
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return Math.round(new Decimal(2.5).pow(x.add(1)).mul(buyableEffect('AssQGrp', 12)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return x.mul(0.5).mul((hasUpgrade('Loop', 22)) ? buyableEffect('Loop', 11) : 1)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Quasigroups<br><br>Effect: +" + format(buyableEffect(this.layer, this.id)) + " to Empty Set effect base<br><br>Cost: " + this.cost() + " Empty Sets"
            },
            canAfford() {
                return getBuyableAmount('Set', 11).gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 2))
                    setBuyableAmount('Set', 11, getBuyableAmount('Set', 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        12: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(1.5).pow(x.add(1)).mul(tmp['Grp'].effect).sub(buyableEffect('AssQGrp', 11))) },
            effect(x) {
                return new Decimal(1.25).mul(buyableEffect('Loop', 11)).pow(x)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Quasigroups<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Singleton effect base<br><br>Cost: " + this.cost() + " Singletons"
            },
            canAfford() {
                return getBuyableAmount('Set', 12).gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 2))
                    setBuyableAmount('Set', 12, getBuyableAmount('Set', 12).sub(Math.min(new Decimal(0), this.cost(getBuyableAmount(this.layer, this.id)))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
    },

    automate() {
        if (hasMilestone('Grp', 2)) {
            buyBuyable(this.layer, 11)
            buyBuyable(this.layer, 12)
        }
    },

    branches: ['Loop', 'AssQGrp']
})

addLayer('UMag', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#0000FF",                      
    resource: "Unital Magmas",
    type: "none",          
    row: 2,
    position: 1,                             

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points },                        

    layerShown() {
        return hasUpgrade('Mag', 12)
    },
    
    tabFormat: [
        "resource-display",
        ["display-text",
            function() { return "A Unital Magma (U, &middot;, 1) is a Magma (Q, &middot;) together with a nullary operation 1 : &lowast; &rarr; U such that the following commutes" },
        ],
        "blank",
        ["display-image",
            'https://i.imgur.com/fptVQy5.png'
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "Something something first last.<br><br>Unlocks the Trivial Unital Magma<br><br>Cost: 1 Magma"
            },
            canAfford() {
                return player['Mag'].points.gte(1)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(1)
            },
        },
        21: {
            fullDisplay() {
                return "Gero Frieseckes blessing<br><br>Magmas boost Magma gain<br><br>Effect: " + format(this.effect()) + "x Magma gain<br><br>Cost: 2 Trvial Unital Magmas"
            },
            effect() {
                return player['Mag'].points.add(1).ln().add(1)
            },
            canAfford() {
                return getBuyableAmount(this.layer, 11).gte(2)
            },
            pay() {
                setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).sub(2))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        22: {
            fullDisplay() {
                return "Gero Frieseckes second blessing<br><br>Squares Magmas Layer Effect<br><br>Cost: 3 Trvial Unital Magmas"
            },
            canAfford() {
                return getBuyableAmount(this.layer, 11).gte(3)
            },
            pay() {
                setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).sub(3))
            },
            unlocked() {
                return hasUpgrade(this.layer, 21)
            }
        },
    },

    buyables: {
        11: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(10).pow(x).mul(tmp['Grp'].effect)) },
            effect(x) {
                return x.add(1)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Unital Magmas<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x Magma gain<br><br>Cost: " + format(this.cost()) + " Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 1))
                    player['Mag'].points = player['Mag'].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
    },

    automate() {
        if (hasMilestone('Grp', 1))
            buyBuyable(this.layer, 11)
    },

    branches: ['Loop', 'Mon']
})

addLayer('SGrp', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#00FF00",                      
    resource: "Semigroups",
    type: "none",          
    row: 2,
    position: 2,                              

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points },                        

    layerShown() {
        return hasUpgrade('Mag', 13)
    },
    
    tabFormat: [
        "resource-display",
        ["display-text",
            function() { return "A Semigroup (S, &middot;) is a Magma (S, &middot;) such that the following commutes" },
        ],
        "blank",
        ["display-image",
            'https://i.imgur.com/8mTddkP.png'
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "At first, there was nothing.<br><br>Unlocks the Empty Semigroup.<br><br>Cost: 1 Magma"
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
                return "At last, there was conothing.<br><br>Unlocks the Trivial Semigroup.<br><br>Cost: 10 Magmas"
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
        13: {
            fullDisplay() {
                return "Set of non-empty words from an alphabet X.<br><br>Unlocks the free Semigroup on one element.<br><br>Cost: 20 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(20)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(20)
            },
            unlocked () {
                return hasUpgrade(this.layer, 12)
            }
        },
        21: {
            fullDisplay() {
                return "Andreas Wieses blessing<br><br>Singletons boost Magma gain<br><br>Cost: 3 Semigroups of positive integers"
            },
            canAfford() {
                return getBuyableAmount(this.layer, 21).gte(3)
            },
            pay() {
                setBuyableAmount(this.layer, 21, getBuyableAmount(this.layer, 21).sub(3))
            },
            unlocked () {
                return hasUpgrade(this.layer, 13)
            }
        },
    },
    
    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return Math.round(new Decimal(2).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return x.add((hasUpgrade('Grp', 11) ? buyableEffect('Mon', 11) : 1))
            },
            display() {
                if (hasUpgrade('Grp', 11) && getBuyableAmount('Mon', 11).gte(1))
                    return "You have " + getBuyableAmount(this.layer, this.id) + " + " + buyableEffect('Mon', 11) + " Empty Semigroups<br><br>Effect: -" + buyableEffect(this.layer, this.id) + " to Singleton price<br><br>Cost: " + this.cost() + " Empty Sets"
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Semigroups<br><br>Effect: -" + buyableEffect(this.layer, this.id) + " to Singleton price<br><br>Cost: " + this.cost() + " Empty Sets"
            },
            canAfford() {
                return getBuyableAmount('Set', 11).gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 2))
                    setBuyableAmount('Set', 11, getBuyableAmount('Set', 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        12: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(1.5).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return new Decimal(0.5).pow(x.add(buyableEffect('Mon', 11)))
            },
            display() {
                if (getBuyableAmount('Mon', 11).gte(1))
                    return "You have " + getBuyableAmount(this.layer, this.id) + " + " + buyableEffect('Mon', 11) + " Trivial Semigroups<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Empty Set price<br><br>Cost: " + this.cost() + " Singletons"
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Semigroups<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Empty Set price<br><br>Cost: " + this.cost() + " Singletons"
            },
            canAfford() {
                return getBuyableAmount('Set', 12).gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 2))
                    setBuyableAmount('Set', 12, getBuyableAmount('Set', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
        21: {
            title: "&#8469;<sup>+</sup>",
            cost(x) { return Math.round(new Decimal(10).pow(x).mul(tmp['Grp'].effect)) },
            effect(x) {
                return player.points.add(1).ln().add(1).ln().mul(x).add(1)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Semigroups of positive integers<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Magma gain based on Sets<br><br>Cost: " + format(this.cost()) + " Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(this.cost())
            },
            buy() {
                if (! hasMilestone('Grp', 1))
                    player['Mag'].points = player['Mag'].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 13)
            }
        },
    },

    automate() {
        if (hasMilestone('Grp', 1))
            buyBuyable(this.layer, 21)
        if (hasMilestone('Grp', 2)) {
            buyBuyable(this.layer, 11)
            buyBuyable(this.layer, 12)
        }
    },

    branches: ['AssQGrp', 'Mon']
})

addLayer('FlexMag', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),
        total: new Decimal(0),          
    }},

    color: "#ADBCA5",                      
    resource: "Flexible Magmas",            
    row: 2,
    position: -1,       

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points }, 

    requires: new Decimal(1e18),
                                            
    type: "static",
    base: new Decimal(100),
    exponent: new Decimal(1.585),

    effect() {
        return new Decimal(0.9).pow(player[this.layer].points)
    },

    gainMult() {
        return new Decimal(1)        
    },
    gainExp() {                             
        return new Decimal(1)
    },

    layerShown() {
        return hasUpgrade('Mag', 32) || player[this.layer].total.gte(1)
    },
    
    tabFormat: [
        "main-display",
        ["display-text",
            function() { return "which multiply all lower layer buyable prices by " + format(tmp[this.layer].effect)},
        ],
        "blank",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
            function() { return "A Flexible Magma (F, &middot;) is a Magma (F, &middot;) such that the following commutes" },
        ],
        "blank",
        ["display-image",
            'https://i.imgur.com/uw9rc5n.png'
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
        "milestones",
    ],
    
    upgrades: {
        11: {
            fullDisplay() {
                return "Sixth Singleton?<br><br>Trivial Monoid effect now also effects Empty Semigroups.<br><br>Cost: 1e20 Set"
            },
            canAfford() {
                return player.points.gte(1e20)
            },
            pay() {
                player.points = player.points.sub(1e20)
            },
            unlocked() {
                return hasMilestone(this.layer, 2)
            }
        },
    },

    buyables: {
        11: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(1.5).pow(x.add(2))) },
            effect(x) {
                return x
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Groups<br><br>Effect: +" + buyableEffect(this.layer, this.id) + " to Trivial Monoid effect base and simulated Trivial Loops<br><br>Cost: " + this.cost() + " Trivial Associative Quasigroups"
            },
            canAfford() {
                return getBuyableAmount('AssQGrp', 12).gte(this.cost())
            },
            buy() {
                setBuyableAmount('AssQGrp', 12, getBuyableAmount('AssQGrp', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return true
            }
        },
        12: {
            title: "S<sub>n</sub>",
            cost(x) { return Math.round(new Decimal(1.5).pow(x)) },
            effect(x) {
                return x.factorial()
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Symmetric Groups of order n<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Set gain<br><br>Cost: " + this.cost() + " Empty Associative Quasigroups"
            },
            canAfford() {
                return getBuyableAmount('AssQGrp', 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount('AssQGrp', 11, getBuyableAmount('AssQGrp', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasMilestone(this.layer, 1)
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 Group total",
            effectDescription: "Set buyables don't substract their cost",
            done() { return player[this.layer].total.gte(1) }
        },
        1: {
            requirementDescription: "2 Groups total",
            effectDescription: "Autobuy Trivial Unital Magmas and Semigroups of positive integers and they don't substract their cost",
            done() { return player[this.layer].total.gte(2) }
        },
        2: {
            requirementDescription: "3 Groups total",
            effectDescription: "Autobuy Quasigroup and Semigroup buyables and they don't substract their cost",
            done() { return player[this.layer].total.gte(3) }
        },
    },
})

addLayer('Loop', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#FF00FF",                      
    resource: "Loops",
    type: "none",          
    row: 3,
    position: 0,                         

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points },                        

    layerShown() {
        return hasUpgrade('Mag', 21)
    },
    
    tabFormat: [
        "resource-display",
        ["display-text",
            function() { return "A Loop (L, &middot;, /, \\, 1) is a Quasigroup (L, &middot;, /, \\) and a Unital Magma (L, &middot;, 1)" }
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "Loop de Loop.<br><br>Unlocks the Trivial Loop.<br><br>Cost: 500,000 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(5e5)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(5e5)
            },
        },
        21: {
            fullDisplay() {
                return "Johannes Zimmers blessing<br><br>Trivial Loops also boost Magma gain<br><br>Cost: 2 Trivial Loops"
            },
            canAfford() {
                return getBuyableAmount(this.layer, 11).gte(2)
            },
            pay() {
                setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).sub(2))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        22: {
            fullDisplay() {
                return "Johannes Zimmers second blessing<br><br>Trivial Loops also boost Empty Quasigroup effect base<br><br>Cost: 3 Trivial Loops"
            },
            canAfford() {
                return getBuyableAmount(this.layer, 11).gte(3)
            },
            pay() {
                setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).sub(3))
            },
            unlocked() {
                return hasUpgrade(this.layer, 21)
            }
        },
    },

    buyables: {
        11: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(2).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return new Decimal(1.25).pow(x.add(buyableEffect('Grp', 11)))
            },
            display() {
                if (hasUpgrade(this.layer, 22)) {
                    if (getBuyableAmount('Grp', 11).gte(1))
                        return "You have " + getBuyableAmount(this.layer, this.id) + " + " + buyableEffect('Grp', 11) + " Trivial Loops<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Empty and Trivial Quasigroup effect base and Magma gain<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
                    return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Loops<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Empty and Trivial Quasigroup effect base and Magma gain<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
                }
                if (hasUpgrade(this.layer, 21)) {
                    if (getBuyableAmount('Grp', 11).gte(1))
                        return "You have " + getBuyableAmount(this.layer, this.id) + " + " + buyableEffect('Grp', 11) + " Trivial Loops<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Trivial Quasigroup effect base and Magma gain<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
                    return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Loops<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Trivial Quasigroup effect base and Magma gain<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
                }
                if (getBuyableAmount('Grp', 11).gte(1))
                    return "You have " + getBuyableAmount(this.layer, this.id) + " + " + buyableEffect('Grp', 11) + " Trivial Loops<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Trivial Quasigroup effect base<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Loops<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Trivial Quasigroup effect base<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
            },
            canAfford() {
                return getBuyableAmount('UMag', 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount('UMag', 11, getBuyableAmount('UMag', 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
    },

    branches: ['Grp']
})

addLayer('AssQGrp', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#FFFF00",                      
    resource: "Associative Quasigroups",
    type: "none",          
    row: 3,
    position: 1,                         

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points },                        

    layerShown() {
        return hasUpgrade('Mag', 22)
    },
    
    tabFormat: [
        "resource-display",
        ["display-text",
            function() { return "An Associative Quasigroup (A, &middot;, /, \\) is a Quasigroup (A, &middot;, /, \\) and a Semigroup (A, &middot;)" }
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "At first, there was nothing.<br><br>Unlocks the Empty Associative Quasigroup.<br><br>Cost: 250,000 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(25e4)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(25e4)
            },
        },
        12: {
            fullDisplay() {
                return "At last, there was conothing.<br><br>Unlocks the Trivial Associative Quasigroup.<br><br>Cost: 500,000 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(5e5)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(5e5)
            },
            unlocked () {
                return hasUpgrade(this.layer, 11)
            }
        },
        21: {
            fullDisplay() {
                return "Non-empty Associatives Quasigroups are Groups<br><br>Associative Quasigroup count boosts Magma gain.<br><br>Currently: " + format(this.effect()) + "x to Magma gain<br><br>Cost: 1,000,000 Magmas"
            },
            effect() {
                return getBuyableAmount(this.layer, 11).add(getBuyableAmount(this.layer, 12)).mul(2).add(1)
            },
            canAfford() {
                return player['Mag'].points.gte(1e6)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(1e6)
            },
            unlocked () {
                return hasUpgrade(this.layer, 12)
            }
        },
    },

    buyables: {
        11: {
            title: "&empty;",
            cost(x) { return Math.round(new Decimal(1.5).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return x
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Empty Associative Quasigroups<br><br>Effect: -" + buyableEffect(this.layer, this.id) + " to Trivial Quasigroup price<br><br>Cost: " + this.cost() + " Empty Semigroups"
            },
            canAfford() {
                return getBuyableAmount('SGrp', 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount('SGrp', 11, getBuyableAmount('SGrp', 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        12: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(1.35).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return new Decimal(0.5).pow(x)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Associative Quasigroups<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Empty Quasigroup price<br><br>Cost: " + this.cost() + " Trivial Semigroups"
            },
            canAfford() {
                return getBuyableAmount('SGrp', 12).gte(this.cost())
            },
            buy() {
                setBuyableAmount('SGrp', 12, getBuyableAmount('SGrp', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
    },

    branches: ['Grp']
})

addLayer('Mon', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),             
    }},

    color: "#00FFFF",                      
    resource: "Monoids",
    type: "none",          
    row: 3,
    position: 2,                         

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points },                        

    layerShown() {
        return hasUpgrade('Mag', 23)
    },
    
    tabFormat: [
        "resource-display",
        ["display-text",
            function() { return "A Monoid (L, &middot;, 1) is a Semigroup (L, &middot;) and a Unital Magma (L, &middot;, 1)" }
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "Monoid is love, Monoid is life.<br><br>Unlocks the Trivial Monoid.<br><br>Cost: 1,000,000 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(1e6)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(1e6)
            },
        },
        12: {
            fullDisplay() {
                return "Set of words from an alphabet X.<br><br>Unlocks the free Monoid on one element.<br><br>Cost: 2,500,000 Magmas"
            },
            canAfford() {
                return player['Mag'].points.gte(25e5)
            },
            pay() {
                player['Mag'].points = player['Mag'].points.sub(25e5)
            },
        },
    },

    buyables: {
        11: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(2).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return buyableEffect('Grp', 11).add(1).mul(x)
            },
            display() {
                if (hasUpgrade('Grp', 11))
                    return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Monoids<br><br>Effect: +" + buyableEffect(this.layer, this.id) + " simulated Empty and Trivial Semigroups<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Monoids<br><br>Effect: +" + buyableEffect(this.layer, this.id) + " simulated Trivial Semigroups<br><br>Cost: " + this.cost() + " Trivial Unital Magmas"
            },
            canAfford() {
                return getBuyableAmount('UMag', 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount('UMag', 11, getBuyableAmount('UMag', 11).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 11)
            }
        },
        21: {
            title: "&#8469;",
            cost(x) { return Math.round(new Decimal(2).pow(x.add(1)).mul(tmp['Grp'].effect)) },
            effect(x) {
                return player['Mag'].points.add(1).ln().add(1).ln().mul(x).add(1).pow(2)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Monoids of naturals<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Set gain based on Magmas<br><br>Cost: " + this.cost() + " Semigroups of positive integers"
            },
            canAfford() {
                return getBuyableAmount('SGrp', 21).gte(this.cost())
            },
            buy() {
                setBuyableAmount('SGrp', 21, getBuyableAmount('SGrp', 21).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
    },

    branches: ['Grp']
})

addLayer('Grp', {
    startData() { return {                  
        unlocked: true,                    
        points: new Decimal(0),
        total: new Decimal(0),          
    }},

    color: "#505050",                      
    resource: "Groups",            
    row: 4,                                

    baseResource: "Magmas",                 
    baseAmount() { return player['Mag'].points }, 

    requires: new Decimal(1e18),
                                            
    type: "static",
    base: new Decimal(100),
    exponent: new Decimal(1.585),

    effect() {
        return new Decimal(0.9).pow(player[this.layer].points)
    },

    gainMult() {
        return new Decimal(1)        
    },
    gainExp() {                             
        return new Decimal(1)
    },

    layerShown() {
        return hasUpgrade('Mag', 31) || player[this.layer].total.gte(1)
    },
    
    tabFormat: [
        "main-display",
        ["display-text",
            function() { return "which multiply all lower layer buyable prices by " + format(tmp[this.layer].effect)},
        ],
        "blank",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        ["display-text",
            function() { return "A Group (G, &middot;, /, \\, 1) is a Quasigroup (G, &middot;, /, \\), a Unital Magma (G, &middot;, 1), and a Semigroup (G, &middot;)<br>Equivalently, a Group (G, &middot;, 1, _<sup>-1</sup>) is a Monoid (G, &middot;, 1) such that the following commutes" },
        ],
        "blank",
        ["display-image",
            'https://i.imgur.com/AkEwtsJ.png'
        ],
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
        "milestones",
    ],
    
    upgrades: {
        11: {
            fullDisplay() {
                return "Sixth Singleton?<br><br>Trivial Monoid effect now also effects Empty Semigroups.<br><br>Cost: 1e20 Set"
            },
            canAfford() {
                return player.points.gte(1e20)
            },
            pay() {
                player.points = player.points.sub(1e20)
            },
            unlocked() {
                return hasMilestone(this.layer, 2)
            }
        },
    },

    buyables: {
        11: {
            title: "&lowast;",
            cost(x) { return Math.round(new Decimal(1.5).pow(x.add(2))) },
            effect(x) {
                return x
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Trivial Groups<br><br>Effect: +" + buyableEffect(this.layer, this.id) + " to Trivial Monoid effect base and simulated Trivial Loops<br><br>Cost: " + this.cost() + " Trivial Associative Quasigroups"
            },
            canAfford() {
                return getBuyableAmount('AssQGrp', 12).gte(this.cost())
            },
            buy() {
                setBuyableAmount('AssQGrp', 12, getBuyableAmount('AssQGrp', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return true
            }
        },
        12: {
            title: "S<sub>n</sub>",
            cost(x) { return Math.round(new Decimal(1.5).pow(x)) },
            effect(x) {
                return x.factorial()
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " Symmetric Groups of order n<br><br>Effect: " + format(buyableEffect(this.layer, this.id)) + "x to Set gain<br><br>Cost: " + this.cost() + " Empty Associative Quasigroups"
            },
            canAfford() {
                return getBuyableAmount('AssQGrp', 11).gte(this.cost())
            },
            buy() {
                setBuyableAmount('AssQGrp', 11, getBuyableAmount('AssQGrp', 12).sub(this.cost(getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasMilestone(this.layer, 1)
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 Group total",
            effectDescription: "Set buyables don't substract their cost",
            done() { return player[this.layer].total.gte(1) }
        },
        1: {
            requirementDescription: "2 Groups total",
            effectDescription: "Autobuy Trivial Unital Magmas and Semigroups of positive integers and they don't substract their cost",
            done() { return player[this.layer].total.gte(2) }
        },
        2: {
            requirementDescription: "3 Groups total",
            effectDescription: "Autobuy Quasigroup and Semigroup buyables and they don't substract their cost",
            done() { return player[this.layer].total.gte(3) }
        },
    },
})