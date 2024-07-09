addLayer("Numbers", {
  symbol: "N",
  position: 0,
  branches: ["Groups"],
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
    };
  },
  color: "#00FF00",
  requires: new Decimal(10),
  resource: "{}",
  baseResource: "points",
  baseAmount() {
    return player.points;
  },
  type: "static",
  exponent: 1,
  base: 10,
  gainMult() {
    mult = new Decimal(1);

    return mult;
  },
  gainExp() {
    return new Decimal(1);
  },
  row: 0,
  hotkeys: [
    {
      key: "n",
      description: "n: Reset for {}",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  upgrades: {
    11: {
      title: "Bregeneration",
      description: "Start generating Bres",
      effect() {
        return new Decimal(1);
      },
      fullDisplay() {
        return (
          "<h3>" +
          this.title +
          "</h3><br>" +
          this.description +
          "<br>Currently: +" +
          this.effect() +
          "<br><br>Cost:" +
          this.cost +
          " <b>0</b>"
        );
      },
      cost: new Decimal(1),
      currencyInternalName() {
        return "11";
      },
      currencyLocation() {
        return player[this.layer].buyables;
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 11).gte(1) || hasUpgrade(this.layer, 11)
        );
      },
    },
    12: {
      title: "Bregeneration II",
      description: "Bre gain is tripled",
      effect() {
        return new Decimal(3);
      },
      fullDisplay() {
        return (
          "<h3>" +
          this.title +
          "</h3><br>" +
          this.description +
          "<br>Currently: x" +
          this.effect() +
          "<br><br>Cost:" +
          this.cost +
          " <b>2</b>"
        );
      },
      cost: new Decimal(1),
      currencyInternalName() {
        return "13";
      },
      currencyLocation() {
        return player[this.layer].buyables;
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 13).gte(1) || hasUpgrade(this.layer, 12)
        );
      },
    },
    13: {
      title: "Frieseckes Blessing",
      description: "Point gain is boosted, based on itself",
      effect() {
        return player.points.add(1).pow(0.2);
      },
      fullDisplay() {
        return (
          "<h3>" +
          this.title +
          "</h3><br>" +
          this.description +
          "<br>Currently: x" +
          format(this.effect()) +
          "<br><br>Cost:" +
          this.cost +
          " <b>3</b>"
        );
      },
      cost: new Decimal(1),
      currencyInternalName() {
        return "14";
      },
      currencyLocation() {
        return player[this.layer].buyables;
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 14).gte(1) || hasUpgrade(this.layer, 13)
        );
      },
    },
    14: {
      title: "Powerset",
      description: "Costs of <b>1</b> and <b>2</b> reduced",
      fullDisplay() {
        return (
          "<h3>" +
          this.title +
          "</h3><br>" +
          this.description +
          "<br><br>Cost:" +
          this.cost +
          " <b>4</b>"
        );
      },
      cost: new Decimal(1),
      currencyInternalName() {
        return "15";
      },
      currencyLocation() {
        return player[this.layer].buyables;
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 15).gte(1) || hasUpgrade(this.layer, 14)
        );
      },
    },
    15: {
      title: "Binary Operations",
      description: "Unlock Groups",
      fullDisplay() {
        return (
          "<h3>" +
          this.title +
          "</h3><br>" +
          this.description +
          "<br><br>Cost:" +
          this.cost +
          " <b>5</b>"
        );
      },
      cost: new Decimal(1),
      currencyInternalName() {
        return "16";
      },
      currencyLocation() {
        return player[this.layer].buyables;
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 16).gte(1) || hasUpgrade(this.layer, 14)
        );
      },
    },
  },
  buyables: {
    11: {
      title: "0",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " ∅\nCost: " +
          this.cost() +
          " {}"
        );
      },
      canAfford() {
        return player[this.layer].points.gte(this.cost());
      },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost());
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
    12: {
      title: "1",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅}\nCost: " +
          this.cost() +
          (hasUpgrade(this.layer, 14) ? " <b>0</b>" : " <b>0</b> and {}")
        );
      },
      canAfford() {
        return (
          (player[this.layer].points.gte(this.cost()) ||
            hasUpgrade(this.layer, 14)) &&
          getBuyableAmount(this.layer, 11).gte(this.cost())
        );
      },
      buy() {
        if (!hasUpgrade(this.layer, 14))
          player[this.layer].points = player[this.layer].points.sub(
            this.cost()
          );
        setBuyableAmount(
          this.layer,
          11,
          getBuyableAmount(this.layer, 11).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 11).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1) ||
          getBuyableAmount(this.layer, 13).gte(1) ||
          getBuyableAmount(this.layer, 14).gte(1) ||
          getBuyableAmount(this.layer, 15).gte(1) ||
          getBuyableAmount(this.layer, 16).gte(1)
        );
      },
    },
    13: {
      title: "2",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}}\nCost: " +
          this.cost() +
          (hasUpgrade(this.layer, 14)
            ? " <b>1</b>"
            : " <b>0</b>, <b>1</b> and {}")
        );
      },
      canAfford() {
        return (
          (player[this.layer].points.gte(this.cost()) ||
            hasUpgrade(this.layer, 14)) &&
          (getBuyableAmount(this.layer, 11).gte(this.cost()) ||
            hasUpgrade(this.layer, 14)) &&
          getBuyableAmount(this.layer, 12).gte(this.cost())
        );
      },
      buy() {
        if (!hasUpgrade(this.layer, 14))
          player[this.layer].points = player[this.layer].points.sub(
            this.cost()
          );
        if (!hasUpgrade(this.layer, 14))
          setBuyableAmount(
            this.layer,
            11,
            getBuyableAmount(this.layer, 11).sub(this.cost())
          );
        setBuyableAmount(
          this.layer,
          12,
          getBuyableAmount(this.layer, 12).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 12).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1) ||
          getBuyableAmount(this.layer, 14).gte(1) ||
          getBuyableAmount(this.layer, 15).gte(1) ||
          getBuyableAmount(this.layer, 16).gte(1)
        );
      },
    },
    14: {
      title: "3",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}, {∅, {∅}}}\nCost: " +
          this.cost() +
          " <b>0</b>, <b>1</b>, <b>2</b> and {}"
        );
      },
      canAfford() {
        return (
          player[this.layer].points.gte(this.cost()) &&
          getBuyableAmount(this.layer, 11).gte(this.cost()) &&
          getBuyableAmount(this.layer, 12).gte(this.cost()) &&
          getBuyableAmount(this.layer, 13).gte(this.cost())
        );
      },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost());
        setBuyableAmount(
          this.layer,
          11,
          getBuyableAmount(this.layer, 11).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          12,
          getBuyableAmount(this.layer, 12).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          13,
          getBuyableAmount(this.layer, 13).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 13).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1) ||
          getBuyableAmount(this.layer, 15).gte(1) ||
          getBuyableAmount(this.layer, 16).gte(1)
        );
      },
    },
    15: {
      title: "4",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}, {∅, {∅}}, {∅, {∅}, {∅, {∅}}}}\nCost: " +
          this.cost() +
          " <b>0</b>, <b>1</b>, <b>2</b>, <b>3</b> and {}"
        );
      },
      canAfford() {
        return (
          player[this.layer].points.gte(this.cost()) &&
          getBuyableAmount(this.layer, 11).gte(this.cost()) &&
          getBuyableAmount(this.layer, 12).gte(this.cost()) &&
          getBuyableAmount(this.layer, 13).gte(this.cost()) &&
          getBuyableAmount(this.layer, 14).gte(this.cost())
        );
      },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost());
        setBuyableAmount(
          this.layer,
          11,
          getBuyableAmount(this.layer, 11).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          12,
          getBuyableAmount(this.layer, 12).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          13,
          getBuyableAmount(this.layer, 13).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          14,
          getBuyableAmount(this.layer, 14).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 14).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1) ||
          getBuyableAmount(this.layer, 16).gte(1)
        );
      },
    },
    16: {
      title: "5",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}, {∅, {∅}}, {∅, {∅}, {∅, {∅}}}, {∅, {∅}, {∅, {∅}}, {∅, {∅}, {∅, {∅}}}}}\nCost: " +
          this.cost() +
          " <b>0</b>, <b>1</b>, <b>2</b>, <b>3</b>, <b>4</b> and {}"
        );
      },
      canAfford() {
        return (
          player[this.layer].points.gte(this.cost()) &&
          getBuyableAmount(this.layer, 11).gte(this.cost()) &&
          getBuyableAmount(this.layer, 12).gte(this.cost()) &&
          getBuyableAmount(this.layer, 13).gte(this.cost()) &&
          getBuyableAmount(this.layer, 14).gte(this.cost()) &&
          getBuyableAmount(this.layer, 15).gte(this.cost())
        );
      },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost());
        setBuyableAmount(
          this.layer,
          11,
          getBuyableAmount(this.layer, 11).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          12,
          getBuyableAmount(this.layer, 12).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          13,
          getBuyableAmount(this.layer, 13).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          14,
          getBuyableAmount(this.layer, 14).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          15,
          getBuyableAmount(this.layer, 15).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 15).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1)
        );
      },
    },
  },
  layerShown() {
    return true;
  },
});

addLayer("Groups", {
  symbol: "G",
  position: 0,
  row: 1,
  startData() {
    return {
      unlocked: true,
    };
  },
  color: "#FF00FF",
  type: "none",
  upgrades: {
    11: {
      title: "Direct Product",
      description: "Unlock more Groups by combining existing",
      fullDisplay() {
        return (
          "<h3>" +
          this.title +
          "</h3><br>" +
          this.description +
          "<br><br>Cost:" +
          this.cost +
          " {}"
        );
      },
      cost: new Decimal(4),
      currencyInternalName() {
        return "points";
      },
      currencyLayer() {
        return "Numbers";
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 15).gte(1) || hasUpgrade(this.layer, 11)
        );
      },
    },
  },
  buyables: {
    11: {
      title: "{e}",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      effect() {
        return getBuyableAmount(this.layer, this.id);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " Trivial Groups\nCost: " +
          this.cost() +
          " <b>1</b><br><br>Currently: +" +
          this.effect() +
          " base Bre gain"
        );
      },
      canAfford() {
        return getBuyableAmount("Numbers", 12).gte(this.cost());
      },
      buy() {
        setBuyableAmount(
          "Numbers",
          12,
          getBuyableAmount("Numbers", 12).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
    12: {
      title: "Z2 = S2 = D2",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      effect() {
        return getBuyableAmount(this.layer, this.id).add(1).pow(0.5);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " Cyclic Groups of Order 2\nCost: " +
          this.cost() +
          " <b>2</b><br><br>Currently: ^" +
          format(this.effect()) +
          " Bre gain"
        );
      },
      canAfford() {
        return getBuyableAmount("Numbers", 13).gte(this.cost());
      },
      buy() {
        setBuyableAmount(
          "Numbers",
          13,
          getBuyableAmount("Numbers", 13).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
    13: {
      title: "Z3 = A3",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      effect() {
        return getBuyableAmount(this.layer, this.id).add(1).pow(0.66);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " Cyclic Groups of Order 3\nCost: " +
          this.cost() +
          " <b>3</b><br><br>Currently: ^" +
          format(this.effect()) +
          " Bre gain"
        );
      },
      canAfford() {
        return getBuyableAmount("Numbers", 14).gte(this.cost());
      },
      buy() {
        setBuyableAmount(
          "Numbers",
          14,
          getBuyableAmount("Numbers", 14).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
    14: {
      title: "Z4 = Dic1",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      effect() {
        return getBuyableAmount(this.layer, this.id).add(1).pow(0.75);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " Cyclic Groups of Order 4\nCost: " +
          this.cost() +
          " <b>4</b><br><br>Currently: ^" +
          format(this.effect()) +
          " Bre gain"
        );
      },
      canAfford() {
        return getBuyableAmount("Numbers", 15).gte(this.cost());
      },
      buy() {
        setBuyableAmount(
          "Numbers",
          15,
          getBuyableAmount("Numbers", 15).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
    15: {
      title: "Z5",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      effect() {
        return getBuyableAmount(this.layer, this.id).add(1).pow(0.8);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " Cyclic Groups of Order 5\nCost: " +
          this.cost() +
          " <b>5</b><br><br>Currently: ^" +
          format(this.effect()) +
          " Bre gain"
        );
      },
      canAfford() {
        return getBuyableAmount("Numbers", 16).gte(this.cost());
      },
      buy() {
        setBuyableAmount(
          "Numbers",
          16,
          getBuyableAmount("Numbers", 16).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
    16: {
      title: "Z6 = Z2 × Z3",
      cost(x) {
        return new Decimal(2).pow(x);
      },
      effect() {
        return getBuyableAmount(this.layer, this.id).add(1).pow(0.83);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " Cyclic Groups of Order 6\nCost: " +
          this.cost() +
          " <b>Z2</b> and <b>Z3</b><br><br>Currently: ^" +
          format(this.effect()) +
          " Bre gain"
        );
      },
      canAfford() {
        return (
          getBuyableAmount(this.layer, 12).gte(this.cost()) &&
          getBuyableAmount(this.layer, 13).gte(this.cost())
        );
      },
      buy() {
        setBuyableAmount(
          this.layer,
          12,
          getBuyableAmount(this.layer, 12).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          13,
          getBuyableAmount(this.layer, 13).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
    },
  },
  layerShown() {
    return hasUpgrade("Numbers", 15);
  },
});

addLayer("achievements", {
  symbol: "O",
  startData() {
    return {
      unlocked: true,
    };
  },
  row: "side",
  tooltip() {
    return "Achievements";
  },
  achievements: {},
});
