/**
 * @fileoverview Contains the class for constructing items in our system,
 * and contains the updateQuality function to update the quality and
 * sell_in after a day has passed in the system.
 * 
 * Here's the current system's business logic for updating the quality:
 * 
 * - All items have a sell_in value which denotes the number of days we have 
 *   to sell the item
 * 
 * - All items have a quality value which denotes how valuable the item is
 * 
 * - At the end of each day our system lowers both values for every item
 * 
 * - Once the sell_in days is less then zero, quality degrades twice as fast
 * 
 * - The quality of an item is never negative
 * 
 * - Aged Brie actually increases in *quality* the older it gets
 * 
 * - The *quality* of an item is never more than 50
 * 
 * - Sulfuras, being a legendary item, never has to be sold nor does it decrease in quality
 * 
 * - Backstage passes, like aged brie, increases in quality as it's sell_in
 *   value decreases quality increases by 2 when there are 10 days or less
 *   and by 3 when there are 5 days or less but 
 *   quality drops to 0 after the concert
 * 
 * - Conjured items degrade in quality twice as fast as normal items
 */

// I would like to pull this out into a config json file,
// but client side JS doesn't allow require or import
// without a package of some sort.
const  NORMAL_ITEM_DEPRECATION = 1;
const  CONJURED_MODIFIER = 2;
const  NORMAL_MODIFIER = 1;
const  MAX_QUALITY_INCREASE = 50;

// Item constructor. DO NOT MODIFY OR THE GOBLIN WILL EAT YOU!
export function Item(name, sell_in, quality) {
  this.name = name;
  this.sell_in = sell_in;
  this.quality = quality;
}

/**
 * Update inventory
 * @param {Item[]} items - an array of Items representing the inventory to be updated
 * @returns {void}
 */
export const updateQuality = (items) => {
  items.forEach(item => {
    updateItemQuality(item);
    guardItemQuality(item);
    deprecateSellIn(item);
  });
}

/**
 * Updates an item
 * @param {Item} item
 * @returns {void}
 */
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


/**
 * Updates the item 'Backstage passes to a TAFKAL80ETC concert'
 * @param {Item} item such that the item's
 * name is 'Backstage passes to a TAFKAL80ETC concert'
 * @returns {void}
 */
const updateBackstagePasses = (item) => {
  if      (item.sell_in <= 0) item.quality = 0;
  else if (item.sell_in <  6) incrementQuality(item, 3 * NORMAL_MODIFIER);
  else if (item.sell_in < 10) incrementQuality(item, 2 * NORMAL_MODIFIER);
  else                        incrementQuality(item, NORMAL_MODIFIER);
}

/**
 * Updates the item 'Aged Brie'
 * @param {Item} item such that the item's name is 'Aged Brie'
 * @returns {void}
 */
const updateAgedBrie = (item) => {
  (item.sell_in < 0)
  ? incrementQuality(item, 2 * NORMAL_MODIFIER)
  : incrementQuality(item, NORMAL_MODIFIER);
}

/**
 * Updates any other non-edge-case item, including 'conjured' items
 * @param {Item} item which can be considered conjured or not
 * @returns {void}
 */
const updateUnspecifiedItem = (item) => {
  incrementQuality(item, -calculateDeprecation(item, selectModifier(item)));
}

/**
 * Increments the item's quality by the number given
 * @param {Item} item
 * @param {number} incrementBy number to be incremented by (can be negative)
 * @returns {void}
 */
const incrementQuality = (item, incrementBy) => {
  if (! itemQualityIsUnincrementable(item))
    item.quality += incrementBy;
}

/**
 * Disallows negative quality items
 * @param {Item} item
 * @returns {void}
 */
const guardItemQuality = (item) => {
  if (item.quality < 0)
    item.quality = 0;
}

/**
 * Deprecates the sell_in value of the given item
 * @param {Item} item
 * @returns {void}
 */
const deprecateSellIn = (item) => {
  if (item.name !== 'Sulfuras, Hand of Ragnaros')
    item.sell_in--;
}

/**
 * Calculates the quality deprecation to be applied
 * to an item's next deprecation step
 * @param {Item} item 
 * @param {number} modifier modifier based on item type
 * @returns {number} the quality deprecation value
 */
const calculateDeprecation = (item, modifier) =>
  modifier * NORMAL_ITEM_DEPRECATION * (item.sell_in >= 0) ? 2 : 1;

/**
 * Selects a modifier for deprecation based on item type
 * @param {Item} item 
 * @returns {number} selected modifier
 */
const selectModifier =
  (item) => (isConjuredItem(item)) ? CONJURED_MODIFIER : NORMAL_MODIFIER;


/**
 * Determines whether or not the item is conjured
 * @param {Item} item 
 * @returns {boolean} whether or not the item is conjured
 */
const isConjuredItem = (item) => item.name.toLowerCase().includes('conjured');

/**
 * Determines whether or not the item is allowed to be incremented
 * under current business logic.
 * @param {Item} item 
 * @returns {boolean} whether or not the item is allowed to be incremented
 * under current business logic.
 */
const itemQualityIsUnincrementable =
  (item) => item.quality >= MAX_QUALITY_INCREASE && incrementBy > 0;