import { api } from 'src/boot/axios';
import {
  StrapiGeneral,
  StrapiImage,
  StrapiMetaPagination,
} from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData, mapStrapiRequestData, toStrapiPagination } from './strapiMapper';
import { User } from './authApi';
import { Team } from './teamApi';

export interface Post extends StrapiGeneral {
  text: string;
  title: string;
  author?: User;
  relatedTeam?: Team;
  images: StrapiImage[];
}

export interface PostRequest {
  text: string;
  title: string;
  author?: number;
  relatedTeam?: number;
}

interface PostsSearch {
  posts: Post[];
  pagination: StrapiMetaPagination
}

export async function getPosts(
  page: number,
  pageSize: number,
  searchQuery?: string,
  teamFilter?: number,
): Promise<PostsSearch> {
  const { data } = await api.get('/api/posts/', {
    params: {
      pagination: {
        page,
        pageSize,
        withCount: true,
      },
      populate: '*',
      filters: {
        $or: [
          {
            title: {
              $containsi: searchQuery,
            },
          },
          {
            text: {
              $containsi: searchQuery,
            },
          },
        ],
        relatedTeam: {
          id: {
            $eq: teamFilter,
          },
        },
      },
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
      populate: {
        relatedTeam: '*',
        author: '*',
        images: '*',
      },
    },
  });

  return mapStrapiData(data?.data);
}

export async function deletePost(id: number | string) {
  await api.delete(`/api/posts/${id}`);
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

export async function updatePost(id: number | string, post: PostRequest): Promise<Post> {
  const { data } = await api.put(`/api/posts/${id}`, {
    data: {
      ...post,
      id: undefined,
    },
  });
  return mapStrapiData(data.data);
}
