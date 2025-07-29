import { db, Users, Trips } from 'astro:db';
import bcrypt from 'bcryptjs';

export default async function seed() {
  // Create two hardcoded users for the couple
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);

  await db.insert(Users).values([
    {
      id: 1,
      username: 'alex',
      password_hash: hashedPassword1,
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      username: 'sam',
      password_hash: hashedPassword2,
      avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Create sample trips
  await db.insert(Trips).values([
    {
      id: 1,
      user_id: 1,
      title: 'Paris Getaway',
      description: 'Our romantic weekend in the City of Light. We visited the Eiffel Tower, walked along the Seine, and enjoyed amazing French cuisine.',
      date_start: new Date('2024-02-14'),
      date_end: new Date('2024-02-17'),
      ubicacion: 'Paris, France',
      location_lat: 48.8566,
      location_lng: 2.3522,
      tags: ['romantic', 'city', 'culture', 'food'],
      images: [
        'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      is_favorite: true,
      is_public: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      user_id: 2,
      title: 'Beach Paradise in Bali',
      description: 'An incredible week in Bali exploring temples, beaches, and local markets. The sunsets were absolutely breathtaking.',
      date_start: new Date('2024-03-10'),
      date_end: new Date('2024-03-17'),
      ubicacion: 'Bali, Indonesia',
      location_lat: -8.3405,
      location_lng: 115.0920,
      tags: ['beach', 'tropical', 'adventure', 'temples'],
      images: [
        'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      is_favorite: false,
      is_public: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      user_id: 1,
      title: 'Mountain Adventure in Switzerland',
      description: 'Hiking through the Swiss Alps was a dream come true. The views were spectacular and the fresh mountain air was invigorating.',
      date_start: new Date('2024-05-20'),
      date_end: new Date('2024-05-27'),
      ubicacion: 'Interlaken, Switzerland',
      location_lat: 46.6863,
      location_lng: 7.8632,
      tags: ['mountains', 'hiking', 'nature', 'adventure'],
      images: [
        'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      is_favorite: true,
      is_public: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}