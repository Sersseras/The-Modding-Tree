addLayer("Numbers", {
  symbol: "N",
  position: 0,
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
  type: "normal",
  exponent: 0.5,
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
      description: "Bre gain is twice as fast",
      effect() {
        return new Decimal(2);
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
  },
  buyables: {
    11: {
      title: "0",
      cost(x) {
        return new Decimal(1);
      },
      display() {
        return (
          "You have " + getBuyableAmount(this.layer, this.id) + " ∅\nCost: {}"
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
        return new Decimal(1);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          (hasUpgrade(this.layer, 14)
            ? " {∅}\nCost: <b>0</b>"
            : " {∅}\nCost: <b>0</b> and {}")
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
        return new Decimal(1);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          (hasUpgrade(this.layer, 14)
            ? " {∅, {∅}}\nCost: <b>1</b>"
            : " {∅, {∅}}\nCost: <b>0</b>, <b>1</b> and {}")
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
        return new Decimal(1);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}, {∅, {∅}}}\nCost: <b>0</b>, <b>1</b>, <b>2</b> and {}"
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
        return new Decimal(1);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}, {∅, {∅}}, {∅, {∅}, {∅, {∅}}}}\nCost: <b>0</b>, <b>1</b>, <b>2</b>, <b>3</b> and {}"
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
          getBuyableAmount(this.layer, 14).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1) ||
          getBuyableAmount(this.layer, 16).gte(1)
        );
      },
    },
    16: {
      title: "5",
      cost(x) {
        return new Decimal(1);
      },
      display() {
        return (
          "You have " +
          getBuyableAmount(this.layer, this.id) +
          " {∅, {∅}, {∅, {∅}}, {∅, {∅}, {∅, {∅}}}, {∅, {∅}, {∅, {∅}}, {∅, {∅}, {∅, {∅}}}}}\nCost: <b>0</b>, <b>1</b>, <b>2</b>, <b>3</b>, <b>4</b> and {}"
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
          getBuyableAmount(this.layer, 13).sub(this.cost())
        );
        setBuyableAmount(
          this.layer,
          15,
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
