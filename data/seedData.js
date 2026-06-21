import { generateId } from '@/hooks/useLocalStorage';

export const seedDatabase = (setItem) => {
  // Create admin user
  const adminId = generateId();
  const users = [
    {
      id: adminId,
      email: 'admin@occasions.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
      created_at: new Date().toISOString()
    }
  ];

  // Create demo store owners
  const owner1Id = generateId();
  const owner2Id = generateId();
  users.push(
    {
      id: owner1Id,
      email: 'store1@example.com',
      password: 'store123',
      role: 'store_owner',
      name: 'Tirana Flowers Shop',
      created_at: new Date().toISOString()
    },
    {
      id: owner2Id,
      email: 'store2@example.com',
      password: 'store123',
      role: 'store_owner',
      name: 'Pristina Gifts',
      created_at: new Date().toISOString()
    }
  );

  // Create stores
  const store1Id = generateId();
  const store2Id = generateId();
  const stores = [
    {
      id: store1Id,
      owner_id: owner1Id,
      name: 'Tirana Flowers & Gifts',
      city: 'Tirana',
      country: 'Albania',
      status: 'approved',
      description: 'Premium flowers and gift baskets in Tirana',
      created_at: new Date().toISOString()
    },
    {
      id: store2Id,
      owner_id: owner2Id,
      name: 'Pristina Artisan Gifts',
      city: 'Pristina',
      country: 'Kosovo',
      status: 'approved',
      description: 'Handcrafted gifts and local specialties',
      created_at: new Date().toISOString()
    }
  ];

  // Helper to create product
  const createProduct = (name, desc, price, cat, img, store, occasion = [], holiday = [], recipient = [], type = 'Standard') => ({
    id: generateId(),
    store_id: store,
    name,
    description: desc,
    price_eur: price,
    image_url: img,
    category: cat,
    stock: 20,
    status: 'active',
    occasion_tags: occasion,
    holiday_tags: holiday,
    recipient_tags: recipient,
    gift_type: type,
    created_at: new Date().toISOString()
  });

  // Create products
  const products = [
    // Original Products (Updated with tags)
    createProduct('Rose Bouquet Deluxe', 'Elegant bouquet of 24 red roses', 45, 'Flowers', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946', store1Id, ['Anniversary', 'ValentinesDay', 'Wedding'], [], ['ForHer', 'Couples'], 'Flowers'),
    createProduct('Chocolate Gift Basket', 'Assorted premium chocolates', 65, 'Gift Baskets', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b', store1Id, ['Birthday', 'ThankYou'], [], ['ForHer', 'ForHim', 'Colleagues'], 'SweetsCakes'),
    
    // New Baby
    createProduct('Personalized Baby Gift Box', 'Customized set for the new arrival', 75, 'Special Occasions', 'https://images.unsplash.com/photo-1616666428759-679a7d578307', store1Id, ['NewBaby'], [], ['Baby', 'Parents'], 'GiftBoxes'),
    createProduct('Newborn Essentials Bundle', 'Everything a new mom needs', 55, 'Special Occasions', 'https://images.unsplash.com/photo-1519689680058-324335c77eba', store2Id, ['NewBaby'], [], ['Baby', 'Parents'], 'GiftBoxes'),
    createProduct('Baby Milestone Photo Frame', 'Capture every precious moment', 35, 'Special Occasions', 'https://images.unsplash.com/photo-1595246140625-573b715d11dc', store2Id, ['NewBaby'], [], ['Parents'], 'PersonalizedGifts'),
    
    // Sympathy
    createProduct('Sympathy Flower Arrangement', 'Elegant white lilies for condolences', 50, 'Flowers', 'https://images.unsplash.com/photo-1662771742652-6f3670e63fb6', store1Id, ['Funeral', 'SympathyFlowers', 'Memorial'], [], ['ForHer', 'ForHim'], 'Flowers'),
    createProduct('Memorial Candle Set', 'Peaceful candlelight memorial', 30, 'Wellness', 'https://images.unsplash.com/photo-1603006905003-be475563bc59', store2Id, ['Memorial'], [], ['ForHer', 'Parents'], 'WellnessSpa'),
    createProduct('Condolence Gift Basket', 'Tea and comfort foods', 60, 'Gift Baskets', 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba', store1Id, ['Funeral', 'SympathyFlowers'], [], ['Colleagues', 'Parents'], 'FoodBeverage'),

    // Ramadan / Eid
    createProduct('Ramadan Gift Set', 'Dates, prayer beads and treats', 45, 'Special Occasions', 'https://images.unsplash.com/photo-1617142860117-c1097c5f9373', store2Id, ['Ramadan'], ['Ramadan', 'EidalFitr'], ['Parents', 'ForHim'], 'GiftBoxes'),
    createProduct('Luxury Eid Perfume', 'Oud based premium scent', 90, 'Beauty', 'https://images.unsplash.com/photo-1594035910387-fea477942698', store2Id, ['EidalFitr', 'EidalAdha'], ['EidalFitr', 'EidalAdha'], ['ForHim', 'ForHer'], 'PerfumeBeauty'),
    createProduct('Eid Greeting Card Set', 'Beautifully calligraphy cards', 20, 'Special Occasions', 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5', store1Id, ['EidalFitr'], ['EidalFitr'], ['Colleagues'], 'GiftBoxes'),

    // Christmas
    createProduct('Christmas Hamper', 'Festive treats and wine', 80, 'Gift Baskets', 'https://images.unsplash.com/photo-1671601063395-9622c427e570', store1Id, ['Christmas'], ['Christmas'], ['Parents', 'Colleagues'], 'FoodBeverage'),
    createProduct('Christmas Candle Set', 'Winter scents and warmth', 40, 'Wellness', 'https://images.unsplash.com/photo-1606830733747-0e6299d4ddf8', store1Id, ['Christmas'], ['Christmas'], ['ForHer'], 'WellnessSpa'),

    // Easter
    createProduct('Easter Egg Gift Box', 'Handcrafted chocolate eggs', 35, 'Sweets', 'https://images.unsplash.com/photo-1700467728387-16ccbe795098', store1Id, ['Easter'], ['Easter'], ['Kids'], 'SweetsCakes'),
    createProduct('Easter Bunny Plush', 'Soft toy for the little ones', 25, 'Special Occasions', 'https://images.unsplash.com/photo-1552596853-3f1915df751b', store1Id, ['Easter'], ['Easter'], ['Kids', 'Baby'], 'GiftBoxes'),

    // Graduation
    createProduct('Graduation Gift Box', 'Pen, notebook and success treats', 55, 'Special Occasions', 'https://images.unsplash.com/photo-1674620213535-9b2a2553ef40', store2Id, ['Graduation', 'Promotion'], [], ['Colleagues', 'ForHim', 'ForHer'], 'GiftBoxes'),
    createProduct('Success Planner Set', 'Premium leather planner', 40, 'Special Occasions', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe', store2Id, ['Graduation', 'NewJob'], [], ['Colleagues'], 'PersonalizedGifts'),

    // Wedding/Housewarming
    createProduct('Welcome Home Plant Set', 'Indoor plants for good vibes', 45, 'Flowers', 'https://images.unsplash.com/photo-1633324157496-5febba55049e', store1Id, ['NewHome'], [], ['Couples', 'Parents'], 'Flowers'),
    createProduct('Kitchen Essentials Bundle', 'Premium olive oil and spices', 60, 'Food & Beverage', 'https://images.unsplash.com/photo-1556910103-1c02745a30bf', store2Id, ['NewHome', 'Wedding'], [], ['Couples'], 'FoodBeverage')
  ];

  setItem('users', users);
  setItem('stores', stores);
  setItem('products', products);
  setItem('orders', []);
  setItem('order_items', []);
  setItem('gift_cards', []);
  setItem('payouts', []);
};