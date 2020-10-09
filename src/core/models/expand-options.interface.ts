export interface IExpandOptions {
  // The keyword specified in the query parameter 'expand'
  key?: string;

  // The column name which maps to the 'pk' column of the foreign key's table
  pkMapFieldName?: string;

  // The name of the foreign key's table
  skValue?: string;

  // The property name included in the response body
  targetProperty?: string;

  // indicates the type of the results
  mode?: 'single' | 'array';
}