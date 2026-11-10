import { uid } from '../utils/storage';

export const CATEGORIES = [
  'Power Tools',
  'Hand Tools',
  'Home & Garden',
  'Cleaning',
  'Other',
];

export const STATUSES = ['Pending', 'Approved', 'Declined'];

export function buildInitialData() {
  const u1 = { id: 'u_demo1', name: 'Alex Carter', email: 'alex@demo.com', password: 'demo123', location: 'Portland, OR', bio: 'Weekend woodworker and DIY enthusiast. Happy to lend out my gear.' };
  const u2 = { id: 'u_demo2', name: 'Jamie Rivera', email: 'jamie@demo.com', password: 'demo123', location: 'Seattle, WA', bio: 'Home renovator with a garage full of tools I rarely use anymore.' };
  const u3 = { id: 'u_demo3', name: 'Sam Patel', email: 'sam@demo.com', password: 'demo123', location: 'Austin, TX', bio: 'Gardener and occasional fixer-upper around the house.' };

  const users = [u1, u2, u3];

  const tools = [
    {
      id: 't_1', name: 'Cordless Drill Driver', category: 'Power Tools',
      description: '20V MAX cordless drill with two batteries and a charger. Great for drilling and screwdriving jobs.',
      ownerId: u1.id, location: 'Portland, OR', fee: 5, availability: true,
      image: 'https://images.pexels.com/photos/3877525/pexels-photo-3877525.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_2', name: 'Circular Saw', category: 'Power Tools',
      description: '7-1/4 inch circular saw with a sharp carbide blade. Cuts through wood like butter.',
      ownerId: u1.id, location: 'Portland, OR', fee: 8, availability: true,
      image: 'https://images.pexels.com/photos/7492584/pexels-photo-7492584.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_3', name: 'Hammer Drill Set', category: 'Power Tools',
      description: 'Rotary hammer drill with multiple bits. Perfect for masonry and concrete work.',
      ownerId: u2.id, location: 'Seattle, WA', fee: 10, availability: true,
      image: 'https://images.pexels.com/photos/4792512/pexels-photo-4792512.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_4', name: 'Wrench Set (40 pc)', category: 'Hand Tools',
      description: 'Complete combination wrench set, metric and SAE. Organized in a sturdy case.',
      ownerId: u2.id, location: 'Seattle, WA', fee: 0, availability: true,
      image: 'https://images.pexels.com/photos/9606950/pexels-photo-9606950.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_5', name: 'Garden Tiller', category: 'Home & Garden',
      description: 'Electric garden tiller for preparing flower beds and vegetable plots.',
      ownerId: u3.id, location: 'Austin, TX', fee: 7, availability: true,
      image: 'https://images.pexels.com/photos/36183685/pexels-photo-36183685.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_6', name: 'Pressure Washer', category: 'Cleaning',
      description: '2000 PSI electric pressure washer. Great for driveways, decks, and siding.',
      ownerId: u3.id, location: 'Austin, TX', fee: 12, availability: true,
      image: 'https://images.pexels.com/photos/32520873/pexels-photo-32520873.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_7', name: 'Orbital Sander', category: 'Power Tools',
      description: 'Random orbit sander with dust collection. Leaves a smooth finish every time.',
      ownerId: u1.id, location: 'Portland, OR', fee: 4, availability: false,
      image: 'https://images.pexels.com/photos/5974329/pexels-photo-5974329.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 't_8', name: 'Step Ladder (8 ft)', category: 'Home & Garden',
      description: 'Aluminum step ladder, 8 feet. Lightweight and sturdy. Great for painting and ceiling work.',
      ownerId: u2.id, location: 'Seattle, WA', fee: 0, availability: true,
      image: 'https://images.pexels.com/photos/5691618/pexels-photo-5691618.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const now = Date.now();
  const day = 86400000;
  const requests = [
    {
      id: 'r_1', toolId: 't_4', borrowerId: u1.id, lenderId: u2.id,
      startDate: new Date(now + 2 * day).toISOString().slice(0, 10),
      endDate: new Date(now + 5 * day).toISOString().slice(0, 10),
      message: 'Need these for a plumbing project this weekend.',
      status: 'Pending', createdAt: now - 100000,
    },
    {
      id: 'r_2', toolId: 't_1', borrowerId: u3.id, lenderId: u1.id,
      startDate: new Date(now - 3 * day).toISOString().slice(0, 10),
      endDate: new Date(now - 1 * day).toISOString().slice(0, 10),
      message: 'Assembling some shelves at home.',
      status: 'Approved', createdAt: now - 200000,
    },
  ];

  const reviews = [
    {
      id: uid(), toolId: 't_1', userId: u3.id, rating: 5,
      comment: 'Alex was super responsive and the drill worked perfectly. Would borrow again!',
      createdAt: now - 50000,
    },
  ];

  return { users, tools, requests, reviews };
}
