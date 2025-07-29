import { defineDb, defineTable, column,NOW } from "astro:db";
export const tags=['parque','helado','chiky']

const Trips = defineTable({
  columns: {
    id:column.number({primaryKey:true}),
    title: column.text(),
    date_start: column.text({default:NOW}),
    date_end: column.text({default:NOW}),
    description: column.text({optional:true}),
    images:column.json({optional:true}),
    tags: column.json(),
    ubicacion: column.text({optional:true})
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {Trips},
});
