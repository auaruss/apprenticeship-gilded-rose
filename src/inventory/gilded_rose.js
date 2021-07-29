import {
  NORMAL_ITEM_DEPRECATION,
  CONJURED_MODIFIER,
  NORMAL_MODIFIER,
  MAX_QUALITY_INCREASE
} from './gilded_rose.config.json';

// Item constructor. DO NOT MODIFY OR THE GOBLIN WILL EAT YOU!
export function Item(name, sell_in, quality) {
  this.name = name;
  this.sell_in = sell_in;
  this.quality = quality;
}

/**
 * Update inventory
 * @param {Item[]} items - an array of Items representing the inventory to be updated
 * @returns nothing
 */
export const updateQuality = (items) => {
  items.forEach(item => {
    updateItemQuality(item);
    guardItemQuality(item);
    deprecateSellIn(item);
  });
}


const updateItemQuality = (item) => {
  switch(item.name) {
    case 'Backstage passes to a TAFKAL80ETC concert':
      updateBackstagePasses(item);
      break;
    case 'Sulfuras, Hand of Ragnaros':
      break;
    case 'Aged Brie':
      updateAgedBrie(item);
      break;
    default:
      updateUnspecifiedItem(item);
      break;
  }
}

const updateBackstagePasses = (item) => {
  if      (item.sell_in <= 0) item.quality = 0;
  else if (item.sell_in <  6) incrementQuality(item, 3 * NORMAL_MODIFIER);
  else if (item.sell_in < 10) incrementQuality(item, 2 * NORMAL_MODIFIER);
  else                        incrementQuality(item, NORMAL_MODIFIER);
}

const updateAgedBrie = (item) => {
  (item.sell_in < 0)
  ? incrementQuality(item, 2 * NORMAL_MODIFIER)
  : incrementQuality(item, NORMAL_MODIFIER);
}

const updateUnspecifiedItem = (item) => {
  incrementQuality(item, -calculateDeprecation(item, selectModifier(item)));
}

const incrementQuality = (item, incrementBy) => {
  if (! itemQualityIsUnincrementable(item))
    item.quality += incrementBy;
}

const guardItemQuality = (item) => {
  if (item.quality < 0)
    item.quality = 0;
}

const deprecateSellIn = (item) => {
  if (item.name !== 'Sulfuras, Hand of Ragnaros')
    item.sell_in--;
}

const calculateDeprecation = (item, modifier) =>
  modifier * NORMAL_ITEM_DEPRECATION * (item.sell_in >= 0) ? 2 : 1;

const selectModifier =
  (item) => (isConjuredItem(item)) ? CONJURED_MODIFIER : NORMAL_MODIFIER;

const isConjuredItem = (item) => item.name.toLowerCase().includes('conjured');

const itemQualityIsUnincrementable =
  (item) => item.quality >= MAX_QUALITY_INCREASE && incrementBy > 0;