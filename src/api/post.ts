import { Post, PostResponse, CreatePostRequest, UpdatePostRequest } from '@/types/post';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 게시글 목록 조회 (페이징 포함)
export const getPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<PostResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/posts?page=${page}&size=${size}&sort=${sort}`
  );
  if (!response.ok) {
    throw new Error('게시글 목록을 가져오는데 실패했습니다.');
  }
  return response.json();
};

// 게시글 상세 조회
export const getPost = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`해당 ID의 게시글을 찾을 수 없습니다: ${id}`);
    }
    throw new Error('게시글을 가져오는데 실패했습니다.');
  }
  return response.json();
};

// 게시글 작성 (인증 필요)
export const createPost = async (postData: CreatePostRequest): Promise<Post> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  if (postData.writer) formData.append('writer', postData.writer);
  if (postData.categoryId) formData.append('categoryId', postData.categoryId.toString());
  if (postData.file) {
    if (postData.file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }
    formData.append('file', postData.file);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('게시글 작성에 실패했습니다.');
  }

  return response.json();
};

// 인증 없는 게시글 작성 (테스트용)
export const createPostNoAuth = async (postData: Partial<CreatePostRequest>): Promise<Post> => {
  const formData = new FormData();
  formData.append('title', postData.title || '테스트 제목');
  formData.append('content', postData.content || '테스트 내용');
  if (postData.categoryId) formData.append('categoryId', postData.categoryId.toString());
  if (postData.file) {
    if (postData.file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }
    formData.append('file', postData.file);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/posts/noauth`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('게시글 작성에 실패했습니다.');
  }

  return response.json();
};

// 게시글 수정
export const updatePost = async (id: number, postData: UpdatePostRequest): Promise<Post> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  const formData = new FormData();
  if (postData.title) formData.append('title', postData.title);
  if (postData.content) formData.append('content', postData.content);
  if (postData.writer) formData.append('writer', postData.writer);
  if (postData.categoryId) formData.append('categoryId', postData.categoryId.toString());
  if (postData.file) {
    if (postData.file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }
    formData.append('file', postData.file);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`해당 ID의 게시글을 찾을 수 없습니다: ${id}`);
    }
    throw new Error('게시글 수정에 실패했습니다.');
  }

  return response.json();
};

// 게시글 삭제
export const deletePost = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`해당 ID의 게시글을 찾을 수 없습니다: ${id}`);
    }
    throw new Error('게시글 삭제에 실패했습니다.');
  }
};

// 내 게시글 목록 조회 (페이징 포함)
export const getMyPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<PostResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/posts/my?page=${page}&size=${size}&sort=${sort}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('인증되지 않은 사용자입니다.');
    }
    throw new Error('내 게시글 목록을 가져오는데 실패했습니다.');
  }

  return response.json();
};

// 카테고리별 게시글 목록 조회 (페이징 포함)
export const getPostsByCategory = async (
  categoryId: number,
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<PostResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/posts/category/${categoryId}/page?page=${page}&size=${size}&sort=${sort}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`해당 ID의 카테고리를 찾을 수 없습니다: ${categoryId}`);
    }
    throw new Error('카테고리별 게시글 목록을 가져오는데 실패했습니다.');
  }

  return response.json();
}; 