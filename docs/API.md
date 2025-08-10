# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check if the API is healthy
- **Response**: 
  ```json
  {
    "success": true,
    "message": "API is healthy",
    "timestamp": "2025-08-10T11:00:00.000Z"
  }
  ```

### Prompts

#### Get All Prompts
- **GET** `/prompts`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Results per page (default: 20, max: 100)
  - `search` (string): Search term for title, description, or content
  - `categoryId` (number): Filter by category ID
  - `tags` (string[]): Filter by tag names
  - `isTemplate` (boolean): Filter by template status
  - `isFavorite` (boolean): Filter by favorite status
  - `sortBy` (string): Sort by field (title, created_at, updated_at, usage_count)
  - `sortOrder` (string): Sort order (ASC, DESC)

#### Get Prompt by ID
- **GET** `/prompts/:id`
- **Response**: Single prompt with tags and variables

#### Create Prompt
- **POST** `/prompts`
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "description": "string (optional)",
    "categoryId": "number (optional)",
    "tags": "string[] (optional)",
    "isTemplate": "boolean (optional)",
    "isFavorite": "boolean (optional)",
    "variables": [
      {
        "name": "string",
        "description": "string (optional)",
        "defaultValue": "string (optional)",
        "variableType": "text|number|boolean|select",
        "options": "string[] (optional)",
        "required": "boolean (optional)"
      }
    ]
  }
  ```

#### Update Prompt
- **PUT** `/prompts/:id`
- **Body**: Same as create prompt + optional `changeLog`

#### Delete Prompt
- **DELETE** `/prompts/:id`

#### Get Prompt Versions
- **GET** `/prompts/:id/versions`

#### Get Specific Version
- **GET** `/prompts/:id/versions/:version`

#### Batch Delete
- **POST** `/prompts/batch/delete`
- **Body**: `{ "ids": [1, 2, 3] }`

#### Export Prompts
- **GET** `/prompts/export/json`
- **Query Parameters**: Same as get all prompts

### Categories

#### Get All Categories
- **GET** `/categories`
- **Query Parameters**: `page`, `limit`, `search`

#### Get Category by ID
- **GET** `/categories/:id`

#### Create Category
- **POST** `/categories`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string (optional)",
    "color": "string (optional, hex color)"
  }
  ```

#### Update Category
- **PUT** `/categories/:id`

#### Delete Category
- **DELETE** `/categories/:id`

### Tags

#### Get All Tags
- **GET** `/tags`

#### Get Popular Tags
- **GET** `/tags/popular?limit=20`

#### Get Tag by ID
- **GET** `/tags/:id`

#### Create Tag
- **POST** `/tags`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string (optional)"
  }
  ```

#### Update Tag
- **PUT** `/tags/:id`

#### Delete Tag
- **DELETE** `/tags/:id`

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15-minute window per IP address
- Rate limit headers included in responses

## CORS
- Configured for `http://localhost:3000` in development
- Supports credentials and all standard HTTP methods