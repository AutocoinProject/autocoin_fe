import { Category, CategoryResponse, CreateCategoryRequest } from '@/types/category';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 카테고리 목록 조회
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
  if (!response.ok) {
    throw new Error('카테고리 목록을 가져오는데 실패했습니다.');
  }
  return response.json();
};

// 카테고리별 게시글 목록 조회
export const getPostsByCategory = async (
  categoryId: number,
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
): Promise<CategoryResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/posts/category/${categoryId}?page=${page}&size=${size}&sort=${sort}`
  );
  if (!response.ok) {
    throw new Error('카테고리별 게시글 목록을 가져오는데 실패했습니다.');
  }
  return response.json();
};

// 카테고리 생성 (관리자용)
export const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });

  if (!response.ok) {
    throw new Error('카테고리 생성에 실패했습니다.');
  }

  return response.json();
}; 