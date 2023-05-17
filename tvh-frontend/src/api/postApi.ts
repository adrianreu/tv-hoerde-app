import { api } from 'src/boot/axios';
import {
  StrapiGeneral,
  StrapiImage,
  StrapiMetaPagination,
} from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData, mapStrapiRequestData, toStrapiPagination } from './strapiMapper';
import { User } from './authApi';

export interface Post extends StrapiGeneral {
  text: string;
  title: string;
  author?: User;
  images: StrapiImage[];
}

export interface PostRequest {
  text: string;
  title: string;
  author?: number;
}

interface PostsSearch {
  posts: Post[];
  pagination: StrapiMetaPagination
}

export async function getPosts(page: number, pageSize: number): Promise<PostsSearch> {
  const { data } = await api.get('/api/posts/', {
    params: {
      pagination: {
        page,
        pageSize,
        withCount: true,
      },
      populate: '*',
      sort: ['createdAt:desc'],
    },
  });

  return {
    posts: mapStrapiData(data?.data) || [],
    pagination: {
      ...data.meta.pagination,
    },
  };
}

export async function getPost(id: number | string): Promise<Post> {
  const { data } = await api.get(`/api/posts/${id}`, {
    params: {
      populate: '*',
    },
  });

  return mapStrapiData(data?.data);
}

export async function createPost(post: PostRequest, images: File[]): Promise<Post> {
  const { data } = await api.post('/api/posts', {
    data: post,
  });
  const newPost = mapStrapiData(data.data);
  newPost.images = [];
  await Promise.all(images.map(async (image) => {
    const form = new FormData();
    form.append('files', image);
    form.append('refId', newPost.id);
    form.append('ref', 'api::post.post');
    form.append('field', 'images');
    const uploadedImage = await api.post('http://127.0.0.1:9123/api/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    newPost.images.push(uploadedImage);
  }));
  return newPost;
}
