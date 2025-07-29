export const prerender = false;

import type { APIRoute } from 'astro';
import { db, Trips, eq } from 'astro:db';

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    const tripId = parseInt(params.id!);
    const field = params.field!;
    const sessionCookie = cookies.get('session');
    
    if (!sessionCookie) {
      return new Response('Unauthorized', { status: 401 });
    }

    const [trip] = await db.select().from(Trips).where(eq(Trips.id, tripId));
    
    if (!trip) {
      return new Response('Trip not found', { status: 404 });
    }

    // Return edit form based on field type
    if (field === 'title') {
      return new Response(`
        <form hx-put="/api/trips/${tripId}" hx-target="this" hx-swap="outerHTML">
          <input type="hidden" name="field" value="title">
          <input type="text" name="value" value="${trip.title}" 
                 class="input input-bordered w-full text-5xl font-bold bg-transparent text-white border-white"
                 hx-trigger="blur, keyup[key=='Enter']"
                 hx-put="/api/trips/${tripId}"
                 hx-include="closest form"
                 autofocus>
        </form>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (field === 'description') {
      return new Response(`
        <form hx-put="/api/trips/${tripId}" hx-target="this" hx-swap="outerHTML">
          <input type="hidden" name="field" value="description">
          <textarea name="value" 
                    class="textarea textarea-bordered w-full bg-base-100"
                    hx-trigger="blur"
                    hx-put="/api/trips/${tripId}"
                    hx-include="closest form"
                    autofocus>${trip.description || ''}</textarea>
        </form>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (field === 'ubicacion') {
      return new Response(`
        <form hx-put="/api/trips/${tripId}" hx-target="this" hx-swap="outerHTML">
          <input type="hidden" name="field" value="ubicacion">
          <input type="text" name="value" value="${trip.ubicacion || ''}" 
                 class="input input-bordered input-sm w-full"
                 hx-trigger="blur, keyup[key=='Enter']"
                 hx-put="/api/trips/${tripId}"
                 hx-include="closest form"
                 placeholder="Enter location..."
                 autofocus>
        </form>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (field === 'tags') {
      const tags = trip.tags as string[] || [];
      return new Response(`
        <form hx-put="/api/trips/${tripId}" hx-target="this" hx-swap="outerHTML">
          <input type="hidden" name="field" value="tags">
          <input type="text" name="value" value="${tags.join(', ')}" 
                 class="input input-bordered w-full"
                 hx-trigger="blur, keyup[key=='Enter']"
                 hx-put="/api/trips/${tripId}"
                 hx-include="closest form"
                 placeholder="Enter tags separated by commas..."
                 autofocus>
        </form>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Field not supported', { status: 400 });

  } catch (error) {
    console.error('Error getting edit form:', error);
    return new Response('Error loading edit form', { status: 500 });
  }
};