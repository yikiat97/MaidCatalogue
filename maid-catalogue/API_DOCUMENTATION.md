# MaidCatalogue API Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Base Configuration](#base-configuration)
3. [Authentication](#authentication)
4. [Catalogue Endpoints](#catalogue-endpoints)
5. [Admin Endpoints](#admin-endpoints)
6. [User Endpoints](#user-endpoints)
7. [Data Models](#data-models)
8. [Integration Guide](#integration-guide)
9. [Error Handling](#error-handling)

## API Overview

The MaidCatalogue API is a RESTful service for managing domestic helpers/maids listings and recommendations. It features:

- Cookie-based authentication with session management
- Role-based access control (Customer: 131, Admin: various)
- File upload support for maid images
- Comprehensive filtering and search capabilities
- Recommendation system with token-based linking

**Base Technology Stack:**
- React frontend with Material-UI components
- Cookie-based authentication
- S3 integration for file uploads
- RESTful API architecture

## Base Configuration

### Environment Configuration

```javascript
const ENVIRONMENTS = {
  development: {
    API_BASE_URL: 'http://localhost:3000',
    API_PORT: 3000,
    NODE_ENV: 'development',
  },
  staging: {
    API_BASE_URL: 'https://yikiat.com',
    API_PORT: 3000,
    NODE_ENV: 'staging',
  },
  production: {
    API_BASE_URL: 'https://yikiat.com',
    API_PORT: 3000,
    NODE_ENV: 'production',
  }
};
```

### API Configuration Helper

```javascript
const API_CONFIG = {
  BASE_URL: currentEnv.API_BASE_URL,
  
  // Helper functions
  buildUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
  buildUrlWithParams: (endpoint, params) => {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },
  buildImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_CONFIG.BASE_URL}${imagePath}`;
  }
};
```

## Authentication

### User Authentication Endpoints

#### 1. User Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    password: 'password123' 
  }),
  credentials: 'include'
});
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Frontend Implementation Notes:**
- After successful login, the frontend automatically calls `/api/user/auth/simple-callback` to verify authentication
- The frontend then calls `/api/user/auth/callback` to check for recommendation tokens
- Supports comprehensive error handling for different HTTP status codes (401, 403, 404, 429, 500+)
- Handles redirect logic for recommendation links stored in localStorage

#### 2. User Registration
**Endpoint:** `POST /api/auth/signup`

**Request:**
```javascript
fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 131 // Customer role (131 = Employer)
  }),
  credentials: 'include'
});
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully"
}
```

**Frontend Implementation Notes:**
- After successful signup, the frontend automatically logs in the user
- Supports role selection (131 for employers, 'helper' for helpers)
- Includes comprehensive form validation (name, email format, password strength, terms agreement)
- Automatically handles recommendation token association after signup

#### 3. Check Authentication Status
**Endpoint:** `GET /api/auth/profile`

**Request:**
```javascript
fetch('/api/auth/profile', {
  credentials: 'include'
});
```

**Response (Authenticated):**
```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": 131
  }
}
```

#### 4. Logout
**Endpoint:** `POST /api/auth/logout`

**Request:**
```javascript
fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

#### 5. Password Reset
**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```javascript
fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    email: 'user@example.com' 
  })
});
```

**Response:**
```json
{
  "success": true,
  "message": "Reset password link has been sent to your email"
}
```

**Endpoint:** `POST /api/auth/reset-password`

**Request:**
```javascript
fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'reset_token_here',
    newPassword: 'newpassword123'
  })
});
```

**Frontend Implementation Notes:**
- Password reset page validates token from URL parameters
- Includes comprehensive password strength validation (8+ chars, uppercase, lowercase, numbers)
- Shows password strength indicator with visual feedback
- Handles token expiration and invalid token scenarios

#### 6. Authentication Callbacks
**Endpoint:** `POST /api/user/auth/callback`

Used for associating recommendation tokens with authenticated users. Called after login/signup to check for stored recommendation tokens.

**Request:**
```javascript
fetch('/api/user/auth/callback', {
  method: 'POST',
  credentials: 'include'
});
```

**Response:**
```json
{
  "success": true,
  "redirectTo": "/recommend",
  "message": "Recommendation associated with user"
}
```

**Endpoint:** `POST /api/user/auth/simple-callback`

Simple authentication verification endpoint. Called immediately after login to verify session.

**Request:**
```javascript
fetch('/api/user/auth/simple-callback', {
  method: 'POST',
  credentials: 'include'
});
```

**Response:**
```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": 131
  }
}
```

**Frontend Implementation Notes:**
- Both callbacks are called in sequence after successful login
- Used for recommendation token association workflow
- Handles redirect logic based on stored recommendation URLs
- Graceful fallback if callbacks fail

### Admin Authentication Endpoints

#### 1. Admin Login
**Endpoint:** `POST /api/admin/auth/login`

**Request:**
```javascript
fetch('/api/admin/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    email: 'admin@example.com', 
    password: 'admin_password' 
  }),
  credentials: 'include'
});
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Admin login successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid admin credentials"
}
```

**Frontend Implementation Notes:**
- After successful login, the frontend automatically calls `/api/admin/auth/callback` to verify admin authentication
- Supports comprehensive error handling for different HTTP status codes (401, 403, 404, 429, 500+)
- Specific error messages for admin access (e.g., "Access denied. You do not have admin privileges.")
- Redirects to `/admin` dashboard upon successful authentication

#### 2. Admin Callback
**Endpoint:** `POST /api/admin/auth/callback`

Used to verify admin authentication status after login.

**Request:**
```javascript
fetch('/api/admin/auth/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include'
});
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Frontend Implementation Notes:**
- Called immediately after successful admin login
- Returns admin user data for session management
- Used to verify admin privileges before accessing admin dashboard





## Catalogue Endpoints

### 1. Get All Maids with Pagination
**Endpoint:** `GET /api/catalogue/maids`
**URL:** `/api/catalogue/maids?page=1&limit=20`

**Parameters:**
- `page` (required): Page number (string)
- `limit` (required): Items per page (string, default: "20")

**Request:**
```javascript
fetch('/api/catalogue/maids?page=1&limit=20', {
  credentials: 'include'
});
```

**Response:**
```json
{
    "maids": [
        {
            "id": 15,
            "name": "jane",
            "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/0eceac2a-d1db-4faf-a39b-f15b781b597c.jpg",
            "country": "Indonesia",
            "height": 160,
            "weight": 55,
            "salary": 800,
            "loan": 0,
            "DOB": "1992-05-05T00:00:00.000Z",
            "skills": [
                "Cooking"
            ],
            "languages": [
                "English"
            ],
            "type": [
                "New/Fresh"
            ],
            "isActive": true,
            "isEmployed": false,
            "supplier": "ID-3"
        },
        {
            "id": 12,
            "name": "qwe",
            "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/de7cb2cd-3304-41ea-ba86-bfd3fd6f0896.png",
            "country": "Indonesia",
            "height": 160,
            "weight": 55,
            "salary": 500,
            "loan": 1000,
            "DOB": "2000-02-26T00:00:00.000Z",
            "skills": [
                "Cooking"
            ],
            "languages": [
                "English"
            ],
            "type": [
                "Transfer"
            ],
            "isActive": true,
            "isEmployed": false,
            "supplier": "ID-1"
        },
        {
            "id": 9,
            "name": "trolling",
            "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/1d7c203b-88b2-49aa-8454-6783130a42a2.jpg",
            "country": "Indonesia",
            "height": 150,
            "weight": 50,
            "salary": 700,
            "loan": 1000,
            "DOB": "1997-02-26T00:00:00.000Z",
            "skills": [
                "Housekeeping"
            ],
            "languages": [
                "English"
            ],
            "type": [
                "Ex-Taiwan"
            ],
            "isActive": true,
            "isEmployed": false,
            "supplier": "ID-3"
        },
        {
            "id": 8,
            "name": "Mark lim",
            "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/38a4446c-2d29-4c5e-a02d-893ad88ef00c.png",
            "country": "Myanmar",
            "height": 160,
            "weight": 55,
            "salary": 700,
            "loan": 2000,
            "DOB": "2000-01-23T00:00:00.000Z",
            "skills": [
                "Housekeeping"
            ],
            "languages": [
                "English"
            ],
            "type": [
                "Transfer"
            ],
            "isActive": true,
            "isEmployed": true,
            "supplier": "ID-1"
        },
        {
            "id": 7,
            "name": "Janice",
            "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/558468f7-b3f8-44fd-9914-5525445d18bb.png",
            "country": "Indonesia",
            "height": 165,
            "weight": 59,
            "salary": 500,
            "loan": 200,
            "DOB": "1973-05-16T00:00:00.000Z",
            "skills": [
                "Housekeeping",
                "Cooking",
                "Childcare",
                "Elderly Care",
                "Dog(s)",
                "Cat(s)"
            ],
            "languages": [
                "Chinese"
            ],
            "type": [
                "Transfer",
                "Ex-Singapore"
            ],
            "isActive": true,
            "isEmployed": false,
            "supplier": "ID-3"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 1,
        "totalCount": 5,
        "hasNext": false,
        "hasPrev": false
    }
}
```

**Frontend Implementation Notes:**
- Uses `API_CONFIG.buildUrlWithParams()` for query parameter handling
- Parameters are passed as strings ("1", "20")
- Supports pagination with append functionality for infinite scroll
- Returns array of maid objects directly in `data.maids`

### 2. Get Top Maids
**Endpoint:** `GET /api/catalogue/top-maids`
**URL:** `/api/catalogue/top-maids`

**Request:**
```javascript
fetch('/api/catalogue/top-maids', {
  credentials: 'include'
});
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Maria Santos",
    "imageUrl": "/images/maid1.jpg",
    "country": "Philippines",
    "height": 160,
    "weight": 55,
    "salary": 600,
    "loan": 5000,
    "DOB": "1990-05-15T00:00:00.000Z",
    "skills": ["Cooking", "Cleaning", "Child Care"],
    "type": ["Domestic Helper"],
    "isActive": true,
    "isEmployed": false,
    "supplier": "ABC Agency"
  }
]
```

**Frontend Implementation Notes:**
- Used in HelperProfilesSection component on homepage
- Returns array of maid objects directly
- No pagination parameters needed
- Used to display featured/top-rated maids

### 3. Get User Favorites
**Endpoint:** `GET /api/catalogue/user/favorites`
**URL:** `/api/catalogue/user/favorites`

**Request:**
```javascript
fetch('/api/catalogue/user/favorites', {
  credentials: 'include'
});
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Maria Santos",
    "imageUrl": "/images/maid1.jpg",
    "country": "Philippines",
    "salary": 600,
    "loan": 5000,
    "skills": ["Cooking", "Cleaning", "Child Care"],
    "languages": ["English", "Filipino"],
    "type": ["Domestic Helper"],
    "isEmployed": false,
    "maidDetails": {
      "description": "Experienced domestic helper",
      "englishRating": 4,
      "chineseRating": 3,
      "dialectRating": 2,
      "restDay": "Sunday"
    }
  }
]
```

**Frontend Implementation Notes:**
- Returns array of favorited maid objects
- Used in Shortlisted page and Catalogue page
- Requires authentication (credentials: 'include')
- get userid from jwt

### 4. Add Maid to Favorites
**Endpoint:** `POST /api/catalogue/user/favorites/{maidId}`
**URL:** `/api/catalogue/user/favorites/123` (example with maidId=123)

**Request:**
```javascript
fetch('/api/catalogue/user/favorites/123', {
  method: 'POST',
  credentials: 'include'
});
```

**Response:**
```json
{
  "message": "Added to favorites successfully"
}
```

### 5. Remove Maid from Favorites
**Endpoint:** `DELETE /api/catalogue/user/favorites/{maidId}`
**URL:** `/api/catalogue/user/favorites/123` (example with maidId=123)

**Request:**
```javascript
fetch('/api/catalogue/user/favorites/123', {
  method: 'DELETE',
  credentials: 'include'
});
```

**Response:**
```json
{
  "message": "Removed from favorites successfully"
}
```

**Frontend Implementation Notes:**
- Both add/remove operations use the same endpoint with different HTTP methods
- Used in MaidCard component for favorite toggle functionality
- Requires authentication (credentials: 'include')
- Updates local state immediately on success

### 6. Get Single Maid by ID
**Endpoint:** `GET /api/catalogue/maids/{id}`
**URL:** `/api/catalogue/maids/123` (example with id=123)

**Request:**
```javascript
fetch('/api/catalogue/maids/123', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'
});
```

**Response:**
```json
{
    "id": 7,
    "name": "Janice",
    "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/558468f7-b3f8-44fd-9914-5525445d18bb.png",
    "country": "Indonesia",
    "height": 165,
    "weight": 59,
    "Religion": "Christian",
    "salary": 500,
    "loan": 200,
    "DOB": "1973-05-16T00:00:00.000Z",
    "maritalStatus": "Single",
    "NumChildren": 2,
    "skills": [
        "Housekeeping",
        "Cooking",
        "Childcare",
        "Elderly Care",
        "Dog(s)",
        "Cat(s)"
    ],
    "type": [
        "Transfer",
        "Ex-Singapore"
    ],
    "isEmployed": false,
    "supplier": "ID-3",
    "maidDetails": {
        "description": "this maid the best",
        "englishRating": 0,
        "chineseRating": 3,
        "dialectRating": 0,
        "restDay": 2,
        "highestEducation": "Bachelor's Degree",
        "religion": "",
        "employmentHistory": ""
    },
    "employmentDetails": [
        {
            "country": "Singapore",
            "startDate": "2025-08-14T00:00:00.000Z",
            "endDate": "2025-08-15T00:00:00.000Z",
            "employerDescription": "2 kids 1 child",
            "noOfFamilyMember": 2,
            "mainJobScope": "sleep",
            "reasonOfLeaving": "tires"
        }
    ]
}
```

**Frontend Implementation Notes:**
- Used in MaidDetails page to display full maid information
- Supports both authenticated and unauthenticated access
- If 401 error, automatically retries without credentials for public access
- Returns detailed maid information including maidDetails and employmentDetails
- Only returns active maids (isActive: true)






## Admin Endpoints

### 1. Get All Maids (Admin)
**Endpoint:** `GET /api/admin/maids`

**Request:**
```javascript
fetch('/api/admin/maids', {
  credentials: 'include'
});
```

### 2. Create New Maid
**Endpoint:** `POST /api/admin/maid`

**Request:**
```javascript
const formData = new FormData();
formData.append('name', 'New Maid Name');
formData.append('country', 'Philippines');
formData.append('salary', '600');
formData.append('imageFile', imageFile); // File object

fetch('/api/admin/maid', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

### 3. Update Maid
**Endpoint:** `PUT /api/admin/maid/:id`

**Request:**
```javascript
fetch(`/api/admin/maid/${maidId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Name',
    salary: 650,
    // ... other maid data
  }),
  credentials: 'include'
});
```

### 4. Delete Maid
**Endpoint:** `DELETE /api/admin/maid/:id`

**Request:**
```javascript
fetch(`/api/admin/maid/${maidId}`, {
  method: 'DELETE',
  credentials: 'include'
});
```

### 5. Search Maids
**Endpoint:** `GET /api/admin/maids/search`

**Parameters:**
- `q`: Search query
- `country`: Filter by country
- `skills`: Filter by skills
- `salary_min`: Minimum salary
- `salary_max`: Maximum salary

**Request:**
```javascript
fetch('/api/admin/maids/search?q=maria&country=Philippines&salary_min=500', {
  credentials: 'include'
});
```

### 6. Get All Users (Admin)
**Endpoint:** `GET /api/admin/users`

**Request:**
```javascript
fetch('/api/admin/users', {
  credentials: 'include'
});
```

### 7. Generate Recommendation Link
**Endpoint:** `POST /api/admin/generate-link`

**Request:**
```javascript
fetch('/api/admin/generate-link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 123,
    maidIds: [1, 2, 3],
    expiresIn: '7d' // optional
  }),
  credentials: 'include'
});
```

**Response:**
```json
{
  "link": "https://yikiat.com/recommend?token=abc123xyz",
  "token": "abc123xyz",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### 8. Delete User Recommendation
**Endpoint:** `DELETE /api/admin/users/:userId/recommendation`

**Request:**
```javascript
fetch(`/api/admin/users/${userId}/recommendation`, {
  method: 'DELETE',
  credentials: 'include'
});
```

## User Endpoints

### 1. Get User Recommendations (Admin)
**Endpoint:** `GET /api/user/recommendation/user/{userId}`
**URL:** `/api/user/recommendation/user/123` (example with userId=123)

Used by admin to load recommendations for a specific user.

**Request:**
```javascript
fetch('/api/user/recommendation/user/123', {
  credentials: 'include'
});
```

### 2. Access Recommended Maids
**Endpoint:** `GET /api/user/recommended/{token}`
**URL:** `/api/user/recommended/abc123xyz` (example with token=abc123xyz)

OR

**Endpoint:** `GET /api/user/recommended/`
**URL:** `/api/user/recommended` (Without token)

**Request:**
```javascript
fetch('/api/user/recommended/abc123xyz', {
  credentials: 'include'
});
```

**Response:**
```json
[
    {
        "id": 9,
        "name": "trolling",
        "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/1d7c203b-88b2-49aa-8454-6783130a42a2.jpg",
        "country": "Indonesia",
        "height": 150,
        "weight": 50,
        "Religion": "Muslim",
        "loan": 1000,
        "salary": 700,
        "DOB": "1997-02-26T00:00:00.000Z",
        "maritalStatus": "Married",
        "NumChildren": 2,
        "skills": [
            "Housekeeping"
        ],
        "type": [
            "Ex-Taiwan"
        ],
        "isActive": true,
        "isEmployed": false,
        "supplier": "ID-3"
    },
    {
        "id": 7,
        "name": "Janice",
        "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/558468f7-b3f8-44fd-9914-5525445d18bb.png",
        "country": "Indonesia",
        "height": 165,
        "weight": 59,
        "Religion": "Christian",
        "loan": 200,
        "salary": 500,
        "DOB": "1973-05-16T00:00:00.000Z",
        "maritalStatus": "Single",
        "NumChildren": 2,
        "skills": [
            "Housekeeping",
            "Cooking",
            "Childcare",
            "Elderly Care",
            "Dog(s)",
            "Cat(s)"
        ],
        "type": [
            "Transfer",
            "Ex-Singapore"
        ],
        "isActive": true,
        "isEmployed": false,
        "supplier": "ID-3"
    },
    {
        "id": 12,
        "name": "qwe",
        "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/de7cb2cd-3304-41ea-ba86-bfd3fd6f0896.png",
        "country": "Indonesia",
        "height": 160,
        "weight": 55,
        "Religion": "Christian",
        "loan": 1000,
        "salary": 500,
        "DOB": "2000-02-26T00:00:00.000Z",
        "maritalStatus": "Single",
        "NumChildren": 1,
        "skills": [
            "Cooking"
        ],
        "type": [
            "Transfer"
        ],
        "isActive": true,
        "isEmployed": false,
        "supplier": "ID-1"
    },
    {
        "id": 8,
        "name": "Mark lim",
        "imageUrl": "https://bucket-fnnhd3.s3.ap-southeast-1.amazonaws.com/maid-photos/38a4446c-2d29-4c5e-a02d-893ad88ef00c.png",
        "country": "Myanmar",
        "height": 160,
        "weight": 55,
        "Religion": "Muslim",
        "loan": 2000,
        "salary": 700,
        "DOB": "2000-01-23T00:00:00.000Z",
        "maritalStatus": "Single",
        "NumChildren": 3,
        "skills": [
            "Housekeeping"
        ],
        "type": [
            "Transfer"
        ],
        "isActive": true,
        "isEmployed": true,
        "supplier": "ID-1"
    }
]
```

**Frontend Implementation Notes:**
- Used in Recommend page to display recommended maids
- Token is passed as path parameter, not query parameter
- with token is when admin generate link to pass to user to recommend list of maid
- without token is recommeded maid tag to user already
- note that if user is not login, user click on generated recommeded link, it will show list recoo maid, and when user login it will be tag to user by token
- Returns array of maid objects directly
- Supports both authenticated and unauthenticated access

### 3. Get User Favorites
**Endpoint:** `GET /api/user/favorites`
**URL:** `/api/user/favorites`

**Request:**
```javascript
fetch('/api/user/favorites', {
  credentials: 'include'
});
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Maria Santos",
    "imageUrl": "/images/maid1.jpg",
    "country": "Philippines",
    "salary": 600,
    "loan": 5000,
    "skills": ["Cooking", "Cleaning", "Child Care"],
    "languages": ["English", "Filipino"],
    "type": ["Domestic Helper"],
    "isEmployed": false,
    "maidDetails": {
      "description": "Experienced domestic helper",
      "englishRating": 4,
      "chineseRating": 3,
      "dialectRating": 2,
      "restDay": "Sunday"
    }
  }
]
```

**Frontend Implementation Notes:**
- Used in Recommend page to get user's current favorites
- Returns array of favorited maid objects
- Requires authentication (credentials: 'include')

## Data Models

### Maid Entity
```typescript
interface Maid {
  id: number;
  name: string;
  imageUrl: string;
  country: string;
  salary: number;
  loan: number;
  DOB: string; // ISO date format
  height: number; // in cm
  weight: number; // in kg
  Religion: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  NumChildren: number;
  skills: string[];
  languages: string[];
  type: string[]; // e.g., ["Domestic Helper", "Nanny"]
  isActive: boolean;
  isEmployed: boolean;
  employmentHistory: EmploymentRecord[];
  maidDetails: MaidDetails;
}

interface EmploymentRecord {
  employer: string;
  duration: string;
  duties: string;
  reason: string;
}

interface MaidDetails {
  experience: string;
  specialty: string;
  availability: string;
  additionalNotes?: string;
}
```

### User Entity
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: number; // 131 = Customer, other values for admin roles
  createdAt: string;
  updatedAt: string;
}
```

### Authentication Response
```typescript
interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  redirectTo?: string;
}
```

### Pagination Response
```typescript
interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## Integration Guide

### 1. Setting up Authentication

```javascript
class MaidCatalogueAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.isAuthenticated = false;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        // Call simple callback to verify authentication
        const callbackResponse = await fetch(`${this.baseURL}/api/user/auth/simple-callback`, {
          method: 'POST',
          credentials: 'include'
        });

        if (callbackResponse.ok) {
          this.isAuthenticated = true;
          return await callbackResponse.json();
        }
      }

      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async checkAuthStatus() {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/profile`, {
        credentials: 'include'
      });

      if (response.ok) {
        this.isAuthenticated = true;
        return await response.json();
      }

      this.isAuthenticated = false;
      return null;
    } catch (error) {
      this.isAuthenticated = false;
      return null;
    }
  }
}
```

### 2. Fetching Maids with Filtering

```javascript
async function fetchMaidsWithFilter(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.country) params.append('country', filters.country);
  if (filters.salary_min) params.append('salary_min', filters.salary_min);
  if (filters.salary_max) params.append('salary_max', filters.salary_max);

  const response = await fetch(`/api/catalogue/maids?${params}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch maids');
  }

  return await response.json();
}

// Usage
const maids = await fetchMaidsWithFilter({
  page: 1,
  limit: 20,
  country: 'Philippines',
  salary_min: 500,
  salary_max: 800
});
```

### 3. Handling Recommendations

```javascript
async function handleRecommendationLink(token) {
  try {
    // First, check if user is authenticated
    const authStatus = await fetch('/api/auth/profile', {
      credentials: 'include'
    });

    if (authStatus.ok) {
      // User is authenticated, associate recommendation
      const callbackResponse = await fetch('/api/user/auth/callback', {
        method: 'POST',
        credentials: 'include'
      });

      if (callbackResponse.ok) {
        console.log('Recommendation associated with user');
      }
    }

    // Fetch recommended maids using token
    const response = await fetch(`/api/user/recommended?token=${token}`, {
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();
    }

    throw new Error('Failed to fetch recommendations');
  } catch (error) {
    console.error('Recommendation handling error:', error);
    throw error;
  }
}
```

### 4. Managing Favorites

```javascript
class FavoritesManager {
  async addToFavorites(maidId) {
    const response = await fetch('/api/user/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maidId: maidId,
        action: 'add'
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }

    return await response.json();
  }

  async removeFromFavorites(maidId) {
    const response = await fetch('/api/user/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maidId: maidId,
        action: 'remove'
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to remove from favorites');
    }

    return await response.json();
  }

  async getFavorites() {
    const response = await fetch('/api/user/favorites', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    return await response.json();
  }
}
```

### 5. File Upload for Maid Images

```javascript
async function createMaidWithImage(maidData, imageFile) {
  const formData = new FormData();
  
  // Add all maid data to form
  Object.keys(maidData).forEach(key => {
    if (Array.isArray(maidData[key])) {
      maidData[key].forEach(item => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, maidData[key]);
    }
  });

  // Add image file
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }

  const response = await fetch('/api/admin/maid', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to create maid');
  }

  return await response.json();
}
```

## Error Handling

### Common HTTP Status Codes

- **200**: Success
- **201**: Created successfully
- **400**: Bad Request - Invalid data provided
- **401**: Unauthorized - Not authenticated
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **429**: Too Many Requests - Rate limited
- **500**: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
```

### Client-Side Error Handling Pattern

```javascript
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include'
    });

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      // Redirect to login or show auth error
      window.location.href = '/login';
      return null;
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

### Validation Errors

The API returns validation errors with specific field information:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters",
    "DOB": "Maid must be at least 18 years old"
  }
}
```

### Rate Limiting

The API implements rate limiting. When exceeded:

```json
{
  "success": false,
  "message": "Too many requests. Please wait before trying again.",
  "retryAfter": 300
}
```

## Security Considerations

1. **Authentication**: All sensitive endpoints require authentication via cookies
2. **CORS**: Configured for specific domains
3. **File Uploads**: Images are validated for type and size
4. **Rate Limiting**: Prevents abuse of endpoints
5. **Input Validation**: All inputs are validated server-side
6. **Session Management**: Secure cookie-based sessions

## Testing Examples

### Testing Authentication Flow

```javascript
// Test login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
  credentials: 'include'
});

// Test profile access
const profileResponse = await fetch('/api/auth/profile', {
  credentials: 'include'
});

// Test logout
const logoutResponse = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

### Testing Maid Operations

```javascript
// Get maids with pagination
const maidsResponse = await fetch('/api/catalogue/maids?page=1&limit=10', {
  credentials: 'include'
});

// Search maids
const searchResponse = await fetch('/api/admin/maids/search?q=maria&country=Philippines', {
  credentials: 'include'
});

// Create new maid (admin only)
const formData = new FormData();
formData.append('name', 'Test Maid');
formData.append('country', 'Philippines');

const createResponse = await fetch('/api/admin/maid', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

This documentation provides a comprehensive overview of the MaidCatalogue API for integration purposes. All endpoints use cookie-based authentication and follow RESTful conventions. The system supports role-based access with customers (role 131) and various admin roles.