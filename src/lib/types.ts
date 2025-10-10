// Simplified types for server-side usage

export interface Parameter {
  name: string;
  type: 'query' | 'path' | 'header';
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Parameter[];
}

export interface Category {
  name: string;
  endpoints: Endpoint[];
}

export interface ApiSource {
  name: string;
  baseUrl: string;
  categories: Category[];
}

// Search types
export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  answer: string;
  data?: any;
  aiChoice?: {
    endpoint_id: string;
    parameters: Record<string, any>;
    explanation: string;
  };
  error?: string;
}