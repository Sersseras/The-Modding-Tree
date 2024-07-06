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
  requires: new Decimal(0),
  resource: "{}",
  baseResource: "points",
  baseAmount() {
    return player.points;
  },
  type: "static",
  getResetGain() {
    return 1;
  },
  prestigeButtonText() {
    return "Reset for " + format(getResetGain(this.layer)) + " {}";
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
  upgrades: {},
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
          " {∅}\nCost: 0 and {}"
        );
      },
      canAfford() {
        return (
          player[this.layer].points.gte(this.cost()) &&
          getBuyableAmount(this.layer, 11).gte(this.cost())
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
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 11).gte(this.cost()) ||
          getBuyableAmount(this.layer, this.id).gte(1) ||
          getBuyableAmount(this.layer, 13).gte(1)
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
          " {∅, {∅}}\nCost: 0, 1 and {}"
        );
      },
      canAfford() {
        return (
          player[this.layer].points.gte(this.cost()) &&
          getBuyableAmount(this.layer, 11).gte(this.cost()) &&
          getBuyableAmount(this.layer, 12).gte(this.cost())
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
          this.id,
          getBuyableAmount(this.layer, this.id).add(1)
        );
      },
      unlocked() {
        return (
          getBuyableAmount(this.layer, 12).gte(this.cost()) ||
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
