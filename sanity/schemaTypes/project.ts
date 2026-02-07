import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'Residential' },
          { title: 'Commercial', value: 'Commercial' },
          { title: 'Renovation', value: 'Renovation' },
        ],
      },
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'image', title: 'Project Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'concept', title: 'Design Concept', type: 'text' }),
    defineField({ name: 'area', title: 'Total Area (sq.m.)', type: 'string' }),
  ],
})