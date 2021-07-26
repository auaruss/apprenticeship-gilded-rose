import { Item, updateQuality } from './gilded_rose';

function testItemUpdate(item, test) {
  updateQuality([item]);
  test(item);
}

function testItemUpdateEquals(item, field, toBeEqTo) {
  testItemUpdate(item, i => expect(i[field]).toBe(toBeEqTo));
}

function testItemUpdateGreaterThanOrEqualTo(item, field, toBeGreaterThanEqTo) {
  testItemUpdate(item, i => expect(i[field]).toBeGreaterThanOrEqual(toBeGreaterThanEqTo));
}

describe('`updateQuality`', () => {
  it('deprecates the sell_in by one for a Haunted Shoe', () => {
    testItemUpdateEquals(new Item('Haunted Shoe', 10, 10), 'sell_in', 9);
  });

  it('deprecates the quality by by 2 when the sell_in is less than zero', () => {
    testItemUpdateEquals(new Item('item', -1, 3), 'quality', 1);
  });

  it('never allows the quality to be updated to a negative value', () => {
    testItemUpdateGreaterThanOrEqualTo(new Item('item', -1, 0), 'quality', 0);
  });

  it('increases the quality of "Aged Brie" the older it gets', () => {
    testItemUpdateEquals(new Item('Aged Brie', 2, 2), 'quality', 3);
    testItemUpdateEquals(new Item('Aged Brie', -2, 33), 'quality', 35);
  });
  
  it('allows the quality to be initialized above 50, but not increase above 50', () => {    
    testItemUpdateEquals(new Item('Aged Brie', 50, 50), 'quality', 50);
    testItemUpdateEquals(new Item('Aged Brie', 2, 67), 'quality', 67);
  });
  
  it('never deprecates the sell in value of "Sulfuras, Hand of Ragnaros"', () => {
    testItemUpdateEquals(new Item('Sulfuras, Hand of Ragnaros', 2, 67), 'quality', 67);
  });
  
  it('never decreases the quality of "Sulfuras, Hand of Ragnaros"', () => {
    testItemUpdateEquals(new Item('Sulfuras, Hand of Ragnaros', 2, 67), 'sell_in', 2);
  });
  
  it('increases the quality of "Backstage passes to a TAFKAL80ETC concert" the older it gets above 10 days', () => {
    testItemUpdateEquals(new Item('Backstage passes to a TAFKAL80ETC concert', 11, 24), 'quality', 25);
  });
  
  it(
    'incrases the quality by 2 per update when the sell_in of '
    + '"Backstage passes to a TAFKAL80ETC concert" is in the range (5-10]' , () => {
    testItemUpdateEquals(new Item('Backstage passes to a TAFKAL80ETC concert', 8, 24), 'quality', 26);
  });
  
  // I am interpreting 0 to be the day of the concert.
  // A bit worried that users will purchase worthless tickets during or
  // after the concert, though!

  // When we update to sell_in being -1, the concert ticket must be worthless.
  it(
    'incrases the quality by 2 per update when the sell_in of '
    + '"Backstage passes to a TAFKAL80ETC concert" is in the range (0-5]', () => {
    testItemUpdateEquals(new Item('Backstage passes to a TAFKAL80ETC concert', 2, 24), 'quality', 27);
    testItemUpdateEquals(new Item('Backstage passes to a TAFKAL80ETC concert', 1, 27), 'quality', 30);
  });
  
  it('always makes the quality of expired "Backstage passes to a TAFKAL80ETC concert" 0', () => {
    testItemUpdateEquals(new Item('Backstage passes to a TAFKAL80ETC concert', 0, 24), 'quality', 0);
  });

  it('properly supports conjured items', () => {
    testItemUpdateEquals(new Item('Conjured mana item', 4, 26), 'quality', 24);
    
    testItemUpdateEquals(new Item('the CoNjuRed mana item', 14, 22), 'quality', 20);
    
    testItemUpdateEquals(new Item('Sconjured mana item', -4, 44), 'quality', 40);
    
    testItemUpdateEquals(new Item('CONJURED_MANA_ITEM', 414, 32), 'quality', 30);
  })
});