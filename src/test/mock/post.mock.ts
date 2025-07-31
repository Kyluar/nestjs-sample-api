import { Post } from '@prisma/client'

export const createPostData: Post = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  authorUuid: '123e4567-e89b-12d3-a456-426614174001',
  title: 'Create Post Data',
  content: 'Created Post content',
  published: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const publishedMockPosts: Post[] = [
  {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    authorUuid: '123e4567-e89b-12d3-a456-426614174001',
    title: 'First Published Post',
    content: 'This is a published post content',
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426614174004',
    authorUuid: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Second Published Post',
    content: 'Another published post content',
    published: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]

export const draftMockPosts: Post[] = [
  {
    uuid: '123e4567-e89b-12d3-a456-426614174002',
    authorUuid: '123e4567-e89b-12d3-a456-426614174003',
    title: 'First Draft Post',
    content: 'This is a draft post content',
    published: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426614174005',
    authorUuid: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Second Draft Post',
    content: 'Another draft post content',
    published: false,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
]

export const mixedMockPosts: Post[] = [...publishedMockPosts, ...draftMockPosts]
