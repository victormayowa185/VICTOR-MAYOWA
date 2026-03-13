import { defineType, defineField } from 'sanity'
import { postSchema } from './post'
import { categorySchema } from './category'

// Your existing project schema (defined here, not imported)
export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'App', value: 'app' },
          { title: 'UI', value: 'ui' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      description: 'Link to the live project',
      validation: Rule => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
  ],
})

// Export all schemas together
export const schemaTypes = [projectSchema, postSchema, categorySchema]