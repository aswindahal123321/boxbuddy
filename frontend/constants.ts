import type { Product, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Lemon Herb Salmon',
    description: 'Sustainably-sourced Atlantic salmon fillet, pan-seared to perfection with a flaky texture. It\'s seasoned with a vibrant mix of fresh dill, parsley, and a squeeze of lemon, then served on a bed of fluffy quinoa and alongside tender-crisp roasted asparagus. A light, refreshing, and protein-packed meal. (Approx. 40g Protein, 30g Carbs, 18g Fat)',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Fish',
    calories: 450,
  },
  {
    id: 2,
    name: 'Vegan Buddha Bowl',
    description: 'A colorful and nourishing bowl designed to delight your senses. It features roasted sweet potatoes, protein-rich chickpeas, creamy avocado slices, and crisp red cabbage on a bed of mixed greens. Drizzled with our signature creamy tahini-lemon dressing and a sprinkle of sesame seeds for extra crunch. (Approx. 18g Protein, 65g Carbs, 22g Fat)',
    price: 12.50,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Vegan',
    calories: 520,
  },
  {
    id: 3,
    name: 'Classic Beef Stir-fry',
    description: 'Tender strips of grass-fed beef, wok-seared with a colorful medley of broccoli florets, bell peppers, and snap peas. Everything is tossed in a savory, house-made soy-ginger sauce with a hint of garlic. Served over fluffy jasmine rice for a satisfying and flavorful classic. (Approx. 35g Protein, 50g Carbs, 20g Fat)',
    price: 13.75,
    imageUrl: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=781&q=80',
    category: 'Beef',
    calories: 550,
  },
  {
    id: 4,
    name: 'Grilled Chicken & Veggies',
    description: 'Juicy, marinated chicken breast grilled to perfection for that perfect smoky flavor. It\'s paired with a vibrant assortment of seasonal vegetables, including zucchini, bell peppers, and red onion, all lightly seasoned and roasted to bring out their natural sweetness. A clean and classic high-protein meal. (Approx. 45g Protein, 20g Carbs, 15g Fat)',
    price: 13.25,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Chicken',
    calories: 420,
  },
    {
    id: 5,
    name: 'Spicy Tofu Scramble',
    description: 'A hearty, plant-based breakfast-for-dinner option. Firm organic tofu is crumbled and scrambled with nutrient-rich black beans, sweet corn, and onions. A touch of chipotle and turmeric gives it a smoky kick and a beautiful golden hue. A fantastic vegan source of protein. (Approx. 25g Protein, 30g Carbs, 18g Fat)',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba1a506?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Vegan',
    calories: 380,
  },
  {
    id: 6,
    name: 'Teriyaki Chicken Bowl',
    description: 'Tender pieces of chicken thigh marinated in our authentic, house-made teriyaki sauce—a perfect balance of sweet and savory. Served with steamed broccoli florets and carrots on a foundation of fluffy white rice, then garnished with sesame seeds. A comforting and delicious meal. (Approx. 38g Protein, 70g Carbs, 16g Fat)',
    price: 13.50,
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c7373058?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Chicken',
    calories: 580,
  },
];

export const ADMIN_USER: User = {
  id: 999,
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin',
  role: 'admin',
};

export const INITIAL_USERS: User[] = [
  {
    id: 101,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user',
  },
];