export const prerender = false;

import type { APIRoute } from 'astro';
import { db, Trips, eq } from 'astro:db';

export const POST: APIRoute = async ({ params, cookies }) => {
  try {
    const tripId = parseInt(params.id!);
    const sessionCookie = cookies.get('session');
    
    if (!sessionCookie) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get current trip
    const [trip] = await db.select().from(Trips).where(eq(Trips.id, tripId));
    
    if (!trip) {
      return new Response('Trip not found', { status: 404 });
    }

    // Toggle favorite status
    const newFavoriteStatus = !trip.is_favorite;
    
    await db.update(Trips)
      .set({ 
        is_favorite: newFavoriteStatus,
        updated_at: new Date()
      })
      .where(eq(Trips.id, tripId));

    // Return updated favorite button
    return new Response(`
      <button class="btn btn-ghost btn-sm" 
              hx-post="/api/trips/${tripId}/favorite" 
              hx-target="this" 
              hx-swap="outerHTML">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${newFavoriteStatus ? 'text-red-500 fill-current' : 'text-gray-400'}" fill="${newFavoriteStatus ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        ${newFavoriteStatus ? 'Favorited' : 'Add to Favorites'}
      </button>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    return new Response('Error updating favorite', { status: 500 });
  }
};