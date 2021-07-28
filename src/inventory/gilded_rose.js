// Item constructor. DO NOT MODIFY OR THE GOBLIN WILL EAT YOU!
export function Item(name, sell_in, quality) {
  this.name = name;
  this.sell_in = sell_in;
  this.quality = quality;
}

/*
* Update inventory
* @param {Item[]} items - an array of Items representing the inventory to be updated
* Example usage:

const items = [
  new Item('+5 Dexterity Vest', 10, 20),
  new Item('Aged Brie', 2, 0),
  new Item('Elixir of the Mongoose', 5, 7),
  new Item('Sulfuras, Hand of Ragnaros', 0, 80),
  new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
  new Item('Conjured Mana Cake', 3, 6),
];

updateQuality(items);
*/
export function updateQuality(items) {
  for (let i = 0; i < items.length; i++) {
    switch(items[i].name) {
      case 'Backstage passes to a TAFKAL80ETC concert':
        updateBackstagePasses(items[i]);
        break;
      case 'Sulfuras, Hand of Ragnaros':
        break;
      case 'Aged Brie':
        updateAgedBrie(items[i]);
        break;
      default:
        updateUnspecifiedItem(items[i]);
        break;
    }

    guardItemQualityAndDeprecateSellIn(item);
  }
}


function updateBackstagePasses(item) {
  if      (item.sell_in <= 0) item.quality = 0;
  else if (item.sell_in < 6)  incrementQuality(item, 3);
  else if (item.sell_in < 10) incrementQuality(item, 2);
  else                        incrementQuality(item, 1);
}

function updateAgedBrie(item) {
  (item.sell_in < 0) 
  ? incrementQuality(item, 2)
  : incrementQuality(item, 1);
}

function updateUnspecifiedItem(item) {
  const NORMAL_ITEM_DEPRECATION = 1;

  const normalOrConjuredModifier =
    (item.name.toLowerCase().includes('conjured')) ? 2 : 1;
        
  const deprecation = (item.sell_in >= 0)
    ? normalOrConjuredModifier * NORMAL_ITEM_DEPRECATION
    : 2 * normalOrConjuredModifier * NORMAL_ITEM_DEPRECATION;

  incrementQuality(item, -deprecation);
}

function incrementQuality(item, incrementBy) {
  if (item.quality >= 50 && incrementBy > 0) return;
  item.quality += incrementBy;
}

function guardItemQualityAndDeprecateSellIn(item) {
  if (item.quality < 0)
    item.quality = 0;

  if (item.name !== 'Sulfuras, Hand of Ragnaros') 
    item.sell_in--;
}