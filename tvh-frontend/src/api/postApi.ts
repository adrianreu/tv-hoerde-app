import { api } from 'src/boot/axios';
import {
  StrapiGeneral,
  StrapiImage,
  StrapiPagination,
  StrapiUser,
} from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData } from './strapiMapper';

export interface Post extends StrapiGeneral {
  id: number;
  text: string;
  title: string;
  author?: StrapiUser;
  images: StrapiImage[];
}

interface PostsSearch {
  posts: Post[];
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  }
}

export async function getPosts(pagination: StrapiPagination): Promise<PostsSearch> {
  const { data } = await api.get('/api/posts/', {
    params: {
      ...pagination,
      populate: '*',
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
