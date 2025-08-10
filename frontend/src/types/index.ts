export interface Category {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  usage_count?: number;
}

export interface TemplateVariable {
  id?: number;
  prompt_id?: number;
  name: string;
  description: string | null;
  default_value: string | null;
  variable_type: 'text' | 'number' | 'boolean' | 'select';
  options: string[] | null;
  required: boolean;
  created_at?: string;
}

export interface Prompt {
  id: number;
  title: string;
  content: string;
  description: string | null;
  category_id: number | null;
  category_name?: string;
  category_color?: string;
  version: number;
  is_template: boolean;
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  variables: TemplateVariable[];
}

export interface PromptVersion {
  id: number;
  prompt_id: number;
  version: number;
  title: string;
  content: string;
  description: string | null;
  change_log: string | null;
  created_at: string;
}

export interface CreatePromptData {
  title: string;
  content: string;
  description?: string;
  categoryId?: number | null;
  tags?: string[];
  isTemplate?: boolean;
  isFavorite?: boolean;
  variables?: Omit<TemplateVariable, 'id' | 'prompt_id' | 'created_at'>[];
}

export interface UpdatePromptData extends CreatePromptData {
  changeLog?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTagData {
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface PaginationData {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: T & {
    pagination: PaginationData;
  };
}

export interface PromptsResponse {
  prompts: Prompt[];
  pagination: PaginationData;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: PaginationData;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  tags?: string[];
  isTemplate?: boolean;
  isFavorite?: boolean;
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'usage_count';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ExportData {
  exportDate: string;
  version: string;
  prompts: {
    title: string;
    content: string;
    description: string | null;
    category: string | null;
    tags: string[];
    isTemplate: boolean;
    variables: TemplateVariable[];
    createdAt: string;
    updatedAt: string;
  }[];
}