import { ComponentType } from 'react';

export interface Parameter {
  name: string;
  type: 'query' | 'path' | 'header';
  description: string;
  required?: boolean;
  autocomplete?: string;
  enum?: string[];
  default?: string | number;
}

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  longDescription?: string;
  parameters?: Parameter[];
  requestBody?: any;
  responses?: any;
}

export interface Category {
  name: string;
  icon: ComponentType;
  endpoints: Endpoint[];
}

export interface ApiSource {
  name: string;
  baseUrl: string;
  icon: ComponentType;
  categories: Category[];
}

// Response types for API calls
export interface APIResponse {
  dados: any[];
  links?: {
    self: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  }[];
}

// Search request/response types
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