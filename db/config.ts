import { defineDb, defineTable, column } from 'astro:db';

const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text({ unique: true }),
    password_hash: column.text(),
    avatar_url: column.text({ optional: true }),
    created_at: column.date({ default: new Date() }),
    updated_at: column.date({ default: new Date() })
  }
});

const Trips = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => Users.columns.id }),
    title: column.text(),
    description: column.text({ optional: true }),
    date_start: column.date(),
    date_end: column.date(),
    ubicacion: column.text({ optional: true }), // location_name
    location_lat: column.number({ optional: true }),
    location_lng: column.number({ optional: true }),
    tags: column.json({ optional: true }), // JSON array
    images: column.json({ optional: true }), // JSON array
    is_favorite: column.boolean({ default: false }),
    is_public: column.boolean({ default: false }),
    share_token: column.text({ unique: true, optional: true }),
    created_at: column.date({ default: new Date() }),
    updated_at: column.date({ default: new Date() })
  }
});

export default defineDb({
  tables: { Users, Trips }
});