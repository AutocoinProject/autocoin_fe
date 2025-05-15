export interface Post {
  id: number;
  title: string;
  content: string;
  writer: string;
  categoryId: number;
  categoryName: string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  content: Post[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  writer?: string;
  categoryId?: number;
  file?: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  writer?: string;
  categoryId?: number;
  file?: File;
} 