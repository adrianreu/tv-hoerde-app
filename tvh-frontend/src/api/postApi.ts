import { api } from 'src/boot/axios';
import {
  StrapiGeneral,
  StrapiImage,
  StrapiMetaPagination,
  StrapiUser,
} from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData, toStrapiPagination } from './strapiMapper';

export interface Post extends StrapiGeneral {
  text: string;
  title: string;
  author?: StrapiUser;
  images: StrapiImage[];
}

interface PostsSearch {
  posts: Post[];
  pagination: StrapiMetaPagination
}

export async function getPosts(page: number, pageSize: number): Promise<PostsSearch> {
  const { data } = await api.get('/api/posts/', {
    params: {
      ...toStrapiPagination(page, pageSize),
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
