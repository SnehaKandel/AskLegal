
# Backend Integration Guide for AskLegal.io

## Project Overview
This document provides a technical blueprint for building a custom backend that will integrate with the existing AskLegal.io frontend. The backend will handle authentication, user management, news scraping, and other core functionalities currently mocked in the frontend.

## System Architecture

### High-Level Architecture
```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  React Frontend   │────►│   REST API Layer  │────►│  Database Layer   │
│                   │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
                                   │                          ▲
                                   │                          │
                                   ▼                          │
                          ┌───────────────────┐               │
                          │                   │               │
                          │  External APIs    │───────────────┘
                          │  (News Sources)   │
                          │                   │
                          └───────────────────┘
```

### Technology Stack Recommendation
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB (for flexible schema) or PostgreSQL (for relational data)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **News Scraping**: Cheerio or Puppeteer
- **Caching**: Redis (for caching news data)

## Database Schema

### Users Collection/Table
```json
{
  "id": "string (uuid)",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "string (user/admin)",
  "status": "string (active/inactive)",
  "lastActive": "datetime",
  "profileData": {
    "phone": "string",
    "district": "string"
  },
  "notificationPreferences": {
    "email": "boolean",
    "sms": "boolean",
    "news": "boolean",
    "updates": "boolean"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### News Collection/Table
```json
{
  "id": "string (uuid)",
  "title": "string",
  "source": "string",
  "url": "string",
  "publishedAt": "datetime",
  "summary": "string",
  "content": "string",
  "language": "string (en/ne)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user"
}
```
- **Response**: `201 Created` with user object (excluding password)

#### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "role": "string (user/admin)"
}
```
- **Response**: `200 OK` with JWT token and user object

#### 3. Token Refresh
- **Endpoint**: `POST /api/auth/refresh`
- **Request Body**: 
```json
{
  "refreshToken": "string"
}
```
- **Response**: `200 OK` with new JWT token

#### 4. Logout
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK`

### User Management Endpoints

#### 1. Get User Profile
- **Endpoint**: `GET /api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK` with user profile data

#### 2. Update User Profile
- **Endpoint**: `PUT /api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "name": "string",
  "phone": "string",
  "district": "string"
}
```
- **Response**: `200 OK` with updated user profile

#### 3. Change Password
- **Endpoint**: `PUT /api/users/password`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```
- **Response**: `200 OK`

#### 4. Update Notification Settings
- **Endpoint**: `PUT /api/users/notifications`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "email": "boolean",
  "sms": "boolean",
  "news": "boolean",
  "updates": "boolean"
}
```
- **Response**: `200 OK` with updated notification settings

### Admin Endpoints

#### 1. Get All Users
- **Endpoint**: `GET /api/admin/users`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string
- **Response**: `200 OK` with array of users and pagination data

#### 2. Get User Details
- **Endpoint**: `GET /api/admin/users/:userId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK` with user details

#### 3. Activate/Deactivate User
- **Endpoint**: `PUT /api/admin/users/:userId/status`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "status": "string (active/inactive)"
}
```
- **Response**: `200 OK` with updated user

#### 4. Delete User
- **Endpoint**: `DELETE /api/admin/users/:userId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `204 No Content`

### News Endpoints

#### 1. Get All News
- **Endpoint**: `GET /api/news`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `language`: string (en/ne)
- **Response**: `200 OK` with array of news articles and pagination data

#### 2. Fetch Latest News (Trigger Scraping)
- **Endpoint**: `POST /api/news/refresh`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK` with refreshed news data

## Authentication Flow

### User Authentication
1. User enters email/password on the login page
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates credentials, generates JWT token
4. Frontend stores token in localStorage
5. User is redirected to homepage or redirectURL

### Admin Authentication
1. Admin selects "Admin" role on login page
2. Frontend sends credentials with admin role to `/api/auth/login`
3. Backend validates admin credentials, generates JWT token
4. Frontend stores token in localStorage
5. Admin is redirected to admin dashboard

### Authorization
1. Protected routes in frontend check for token existence
2. API requests include token in Authorization header
3. Backend middleware validates token for each protected endpoint
4. Role-based middleware ensures only admins can access admin endpoints

## Backend Implementation Plan

### Phase 1: Setup & Authentication
1. Initialize Node.js/Express project
2. Implement database connection (MongoDB/PostgreSQL)
3. Create authentication controllers and middleware
4. Implement JWT generation and validation
5. Create user model with password hashing
6. Set up routes for login, register, refresh token

### Phase 2: User Management
1. Implement user profile endpoints
2. Create password change functionality
3. Add notification preference management
4. Build admin user management endpoints

### Phase 3: News System
1. Set up news model
2. Create news scraping service using Cheerio/Puppeteer
3. Implement caching layer with Redis
4. Build news API endpoints
5. Set up scheduled job for automatic news refresh

### Phase 4: Testing & Security
1. Write unit tests for critical paths
2. Implement rate limiting
3. Add input validation
4. Set up error handling middleware
5. Configure CORS properly
6. Perform security audit

## Frontend Integration

To integrate the custom backend with the existing frontend:

### 1. Update Authentication Logic

Current mock login function in `Login.tsx`:
```javascript
// Replace this
setTimeout(() => {
  setIsLoading(false);
  
  const mockUserData = {
    id: '1',
    name: 'User',
    email: formData.email,
    role: formData.role,
  };
  
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(mockUserData));
  
  // Redirect based on role
  if (formData.role === 'admin') {
    navigate('/admin');
  } else {
    navigate('/');
  }
}, 1000);
```

Replace with:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password,
    role: formData.role
  }),
})
.then(response => response.json())
.then(data => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    if (data.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
    
    toast({
      title: "Successfully logged in",
      description: data.user.role === 'admin' 
        ? "Welcome, Administrator" 
        : "Welcome to AskLegal.io",
    });
  } else {
    setErrors({
      email: 'Invalid credentials',
    });
  }
})
.catch(error => {
  console.error('Login error:', error);
  toast({
    title: "Login failed",
    description: "There was an error logging in. Please try again.",
    variant: "destructive",
  });
})
.finally(() => {
  setIsLoading(false);
});
```

### 2. Update User Management in Admin Dashboard

Replace the mock data and functions in `Admin.tsx` with API calls:

```javascript
useEffect(() => {
  // Check if user is logged in and is admin
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (user && user.role === 'admin') {
    fetchUsers();
  }
}, [user, toast]);
```

### 3. Update News Fetching in News Page

Replace the mock news fetching with API calls:

```javascript
const fetchNews = async () => {
  setLoading(true);
  
  try {
    const response = await fetch('/api/news?language=en');
    if (response.ok) {
      const data = await response.json();
      setNews(data.news);
      setLastFetched(new Date());
      
      toast({
        title: "News Updated",
        description: "New articles have been retrieved.",
      });
    } else {
      throw new Error('Failed to fetch news');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    toast({
      title: "Error",
      description: "Failed to fetch news. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
```

## Security Considerations

### 1. Password Storage
- NEVER store plain text passwords
- Use bcrypt with sufficient salt rounds (10+)
- Implement password complexity requirements

### 2. JWT Management
- Use short-lived access tokens (15-60 minutes)
- Implement refresh token rotation
- Store sensitive data in httpOnly, secure cookies

### 3. API Security
- Implement rate limiting for authentication endpoints
- Use HTTPS for all communications
- Add input validation for all endpoints
- Implement proper CORS configuration

### 4. Authorization
- Always validate user permissions server-side
- Use middleware for role-based access control
- Validate token on every protected request

## Deployment Considerations

### Environment Setup
- Use environment variables for configuration
- Create separate environments (development, staging, production)
- Never commit secrets to version control

### Scalability
- Consider horizontal scaling for the API layer
- Implement caching for frequently accessed data
- Optimize database queries with proper indexing

### Monitoring
- Set up logging for API requests and errors
- Implement health check endpoints
- Consider using APM tools (New Relic, Datadog)

## Development Timeline

- **Week 1**: Project setup, authentication system
- **Week 2**: User management, admin functionality
- **Week 3**: News system, caching
- **Week 4**: Testing, security, frontend integration

## Conclusion

This document provides a comprehensive blueprint for developing a custom backend that integrates seamlessly with the existing AskLegal.io frontend. The outlined architecture, API endpoints, and integration steps will enable developers to build a secure, scalable, and maintainable backend system that meets all the specified requirements.

By following this guide, developers should be able to replace the current mock data and functionality with real, persistent data storage and processing, while maintaining the current user interface and experience.
