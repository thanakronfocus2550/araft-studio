import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
  ],
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Project Title', 
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Exterior', value: 'Exterior' },
          { title: 'Interior', value: 'Interior' },
          { title: 'Exhibition', value: 'Exhibition' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ 
      name: 'year', 
      title: 'Project Year', 
      type: 'string',
      group: 'content',
    }),
    defineField({ 
      name: 'location', 
      title: 'Location', 
      type: 'string',
      group: 'content',
    }),
    defineField({ 
      name: 'area', 
      title: 'Total Area (sq.m.)', 
      type: 'string',
      group: 'content',
    }),
    defineField({ 
      name: 'concept', 
      title: 'Design Concept', 
      type: 'text',
      group: 'content',
    }),
    
    defineField({ 
      name: 'image', 
      title: 'Main Image (รูปหน้าปก)', 
      type: 'image', 
      group: 'media',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery (ลงรูปได้หลายรูป)',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: {
        layout: 'grid', 
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
})