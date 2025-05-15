export interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  content: Category[];
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

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId: number | null;
} 