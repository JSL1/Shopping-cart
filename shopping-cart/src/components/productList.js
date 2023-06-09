import uniqid from "uniqid";

export const productPool = [
  {
    id: uniqid(),
    name: 'Legend of Zelda Game & Watch',
    price: 79.99,
    img: 'product-images/zeldagandw.jpg',
    img2: 'product-images/zelda_bg.jpg',
  },
  {
    id: uniqid(),
    name: '3.5mm Gaming Headset Mic LED Headphones Stereo Bass Surround For PC PS4 Xbox One',
    price: 39.99,
    img: 'product-images/headset_2.jpg',
    img2: 'product-images/gamerheadset.jpg',
  },
  {
    id: uniqid(),
    name: 'BAKTH RGB Gaming Mouse Keyboard Combo',
    price: 49.99,
    img: 'product-images/gamingkeyboard.jpg',
    img2: 'product-images/keyboard_2.jpg',
  },
  {
    id: uniqid(),
    name: 'Battletoads NES cartridge',
    price: 29.99,
    img: 'product-images/battletoads.jpg',
    img2: 'product-images/battletoads_2.jpg',
  },
  {
    id: uniqid(),
    name: 'Fuzzy Pink Girl Gamer Controller XBOX One PC Nintendo Switch',
    price: 59.99,
    img: 'product-images/pinkcontroller.jpg',
    img2: 'product-images/pinkcontroller_2.jpg',
  },
];

export default { productPool, };