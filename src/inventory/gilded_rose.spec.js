import { Item, updateQuality } from './gilded_rose';

describe('`updateQuality`', () => {
  it('deprecates the sell_in by one for a Haunted Shoe', () => {
    const standardItem = new Item('Haunted Shoe', 10, 10);
    updateQuality([standardItem]);
    expect(standardItem.sell_in).toBe(9);
  });

  it('deprecates the quality by by 2 when the sell_in is less than zero', () => {
    const i = new Item('item', -1, 3);
    updateQuality([i]);
    expect(i.quality).toBe(1);
  });

  it('never allows the quality to be updated to a negative value', () => {
    const zeroQualityItem = new Item('item', -1, 0);
    updateQuality([zeroQualityItem]);
    expect(zeroQualityItem.quality).toBeGreaterThanOrEqual(0);
  });

  it('increases the quality of "Aged Brie" the older it gets', () => {
    const agedBrieItem = new Item('Aged Brie', 2, 2);
    updateQuality([agedBrieItem]);
    expect(agedBrieItem.quality).toBe(3);

    const negativeSellInAgedBrieItem = new Item('Aged Brie', -2, 33);
    updateQuality([negativeSellInAgedBrieItem]);
    expect(negativeSellInAgedBrieItem.quality).toBe(35);
  });
  
  it('allows the quality to be initialized above 50, but not increase above 50', () => {
    const fiftyQualityItem = new Item('Aged Brie', 50, 50);
    expect(fiftyQualityItem.quality).toBe(50);
    updateQuality([fiftyQualityItem]);
    expect(fiftyQualityItem.quality).toBe(50);

    const sixtySevenQualityItem = new Item('Aged Brie', 2, 67);
    updateQuality([sixtySevenQualityItem]);
    expect(sixtySevenQualityItem.quality).toBe(67);
  });
  
  it('never deprecates the sell in value of "Sulfuras, Hand of Ragnaros"', () => {
    const sulfurasItem = new Item('Sulfuras, Hand of Ragnaros', 2, 67);
    updateQuality([sulfurasItem]);
    expect(sulfurasItem.quality).toBe(67);
  });
  
  it('never decreases the quality of "Sulfuras, Hand of Ragnaros"', () => {
    const sulfurasItem = new Item('Sulfuras, Hand of Ragnaros', 2, 67);
    updateQuality([sulfurasItem]);
    expect(sulfurasItem.quality).toBe(67);
  });
  
  it('increases the quality of "Backstage passes to a TAFKAL80ETC concert" the older it gets above 10 days', () => {
    const backstagePassesItem = new Item('Backstage passes to a TAFKAL80ETC concert', 11, 24);
    updateQuality([backstagePassesItem]);
    expect(backstagePassesItem.quality).toBe(25);
  });
  
  it(
    'incrases the quality by 2 per update when the sell_in of '
    + '"Backstage passes to a TAFKAL80ETC concert" is in the range (5-10]' , () => {
    
    const backstagePassesItem = new Item('Backstage passes to a TAFKAL80ETC concert', 8, 24);
    updateQuality([backstagePassesItem]);
    expect(backstagePassesItem.quality).toBe(26);
  });
  
  // I am interpreting 0 to be the day of the concert.
  // A bit worried that users will purchase worthless tickets during or
  // after the concert, though!

  // When we update to sell_in being -1, the concert ticket must be worthless.
  it(
    'incrases the quality by 2 per update when the sell_in of '
    + '"Backstage passes to a TAFKAL80ETC concert" is in the range (0-5]', () => {

    const backstagePassesItem = new Item('Backstage passes to a TAFKAL80ETC concert', 2, 24);
    updateQuality([backstagePassesItem]);
    expect(backstagePassesItem.quality).toBe(27);
    updateQuality([backstagePassesItem]);
    expect(backstagePassesItem.quality).toBe(30);
  });
  
  it('always makes the quality of expired "Backstage passes to a TAFKAL80ETC concert" 0', () => {
    const backstagePassesItem = new Item('Backstage passes to a TAFKAL80ETC concert', 0, 24);
    updateQuality([backstagePassesItem]);
    expect(backstagePassesItem.quality).toBe(0);
  });
});
