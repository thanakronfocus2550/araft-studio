import { type SchemaTypeDefinition } from 'sanity'
import project from './project' // มั่นใจว่าคุณสร้างไฟล์ project.ts ไว้ในโฟลเดอร์เดียวกันแล้วนะครับ

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project],
}