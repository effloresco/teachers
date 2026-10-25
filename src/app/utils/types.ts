export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export type SortField = 'full_name' | 'course' | 'age' | 'b_day' | 'b_date' | 'country' | 'gender';
export type SortOrder = 'asc' | 'desc';
export type SearchField = 'name' | 'full_name' | 'note' | 'age';