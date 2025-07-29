export const prerender = false;

import type { APIRoute } from 'astro';
import { db, Trips, eq } from 'astro:db';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    const tripId = parseInt(params.id!);
    const sessionCookie = cookies.get('session');
    
    if (!sessionCookie) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const field = formData.get('field') as string;
    const value = formData.get('value') as string;

    // Handle different field types
    let processedValue: any = value;
    
    if (field === 'tags') {
      processedValue = value ? value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
    } else if (field === 'date_start' || field === 'date_end') {
      processedValue = new Date(value);
    }

    // Update the specific field
    const updateData: any = {
      [field]: processedValue,
      updated_at: new Date()
    };

    await db.update(Trips)
      .set(updateData)
      .where(eq(Trips.id, tripId));

    // Get updated trip for response
    const [updatedTrip] = await db.select().from(Trips).where(eq(Trips.id, tripId));

    // Return the updated field HTML based on field type
    if (field === 'title') {
      return new Response(`
        <h1 class="mb-5 text-5xl font-bold text-white drop-shadow-lg" 
            hx-get="/api/trips/${tripId}/edit/title" 
            hx-trigger="click" 
            hx-target="this" 
            hx-swap="outerHTML"
            style="cursor: pointer;">
          ${updatedTrip.title}
        </h1>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (field === 'description') {
      return new Response(`
        <p class="text-base leading-relaxed" 
           hx-get="/api/trips/${tripId}/edit/description" 
           hx-trigger="click" 
           hx-target="this" 
           hx-swap="outerHTML"
           style="cursor: pointer;">
          ${updatedTrip.description || 'Click to add description...'}
        </p>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (field === 'ubicacion') {
      return new Response(`
        <div class="stat-value text-sm" 
             hx-get="/api/trips/${tripId}/edit/ubicacion" 
             hx-trigger="click" 
             hx-target="this" 
             hx-swap="outerHTML"
             style="cursor: pointer;">
          ${updatedTrip.ubicacion || 'Click to add location...'}
        </div>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (field === 'tags') {
      const tags = updatedTrip.tags as string[] || [];
      return new Response(`
        <div class="flex flex-wrap gap-2 mt-6" 
             hx-get="/api/trips/${tripId}/edit/tags" 
             hx-trigger="click" 
             hx-target="this" 
             hx-swap="outerHTML"
             style="cursor: pointer;">
          ${tags.map(tag => `
            <div class="badge badge-primary badge-outline gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
              </svg>
              ${tag}
            </div>
          `).join('')}
          ${tags.length === 0 ? '<span class="text-gray-500">Click to add tags...</span>' : ''}
        </div>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Updated', { status: 200 });

  } catch (error) {
    console.error('Error updating trip:', error);
    return new Response('Error updating trip', { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const tripId = parseInt(params.id!);
    const sessionCookie = cookies.get('session');
    
    if (!sessionCookie) {
      return new Response('Unauthorized', { status: 401 });
    }

    await db.delete(Trips).where(eq(Trips.id, tripId));

    return new Response('', { 
      status: 200,
      headers: { 'HX-Trigger': 'tripDeleted' }
    });

  } catch (error) {
    console.error('Error deleting trip:', error);
    return new Response('Error deleting trip', { status: 500 });
  }
};