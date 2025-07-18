# RAG Functionality Testing Guide

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 2. Create Admin User
```bash
node setupAdmin.js
```

### 3. Test RAG Functionality
```bash
node testRAG.js
```

## 🔐 Admin Credentials

### Default Admin User
- **Email**: `admin@asklegal.com`
- **Password**: `Admin123!`
- **Role**: `admin`

### Test Admin User
- **Email**: `testadmin@example.com`
- **Password**: `TestPass123!`
- **Role**: `admin`

## 🧪 Testing RAG Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@asklegal.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### 3. Test RAG Status
```bash
curl -X GET http://localhost:5000/api/rag/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test RAG Search
```bash
curl -X GET "http://localhost:5000/api/rag/search?query=What%20are%20the%20legal%20requirements%20for%20starting%20a%20business%20in%20Nepal?&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Test RAG Generate
```bash
curl -X POST http://localhost:5000/api/rag/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain the process of filing a lawsuit in Nepal",
    "context": "Focus on civil court procedures"
  }'
```

## 👥 User Management

### List All Users
```bash
node manageUsers.js list
```

### Create New User
```bash
# Create regular user
node manageUsers.js create "John Doe" "john@example.com" "password123"

# Create admin user
node manageUsers.js create "Admin User" "admin@example.com" "password123" admin
```

### Update User Role
```bash
# Make user admin
node manageUsers.js update-role "john@example.com" admin

# Make admin regular user
node manageUsers.js update-role "admin@example.com" user
```

### Update User Status
```bash
# Deactivate user
node manageUsers.js update-status "john@example.com" inactive

# Activate user
node manageUsers.js update-status "john@example.com" active
```

### Delete User
```bash
node manageUsers.js delete "john@example.com"
```

## 🔧 Available Roles

- **`user`**: Regular user with basic access
- **`admin`**: Administrator with full access to all features

## 📊 User Status Options

- **`active`**: User can log in and use the system
- **`inactive`**: User account is disabled

## 🧪 Automated Testing

### Run Complete Test Suite
```bash
node testRAG.js
```

This will:
1. Test the health endpoint
2. Login as admin
3. Test RAG status endpoint
4. Test RAG search endpoint
5. Test RAG generate endpoint

### Expected Test Results
```
🚀 Starting RAG Functionality Tests...

🏥 Testing Health endpoint...
✅ Health Response: {"status":"ok","timestamp":"..."}

🔐 Logging in as admin...
✅ Login successful

✅ RAG Status Response:
{
  "success": true,
  "status": "operational",
  "message": "RAG system is running",
  "timestamp": "..."
}

✅ RAG Search Response:
{
  "success": true,
  "message": "RAG search endpoint - implementation pending",
  "query": "What are the legal requirements...",
  "limit": 5
}

✅ RAG Generate Response:
{
  "success": true,
  "message": "RAG generation endpoint - implementation pending",
  "query": "Explain the process...",
  "context": "Focus on civil court procedures"
}

🎉 All tests completed!
```

## 🔍 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### RAG Functionality
- `GET /api/rag/status` - Check RAG system status
- `GET /api/rag/search` - Search for relevant documents
- `POST /api/rag/generate` - Generate response using RAG

### Admin Management
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:userId` - Get user details (admin only)
- `PUT /api/admin/users/:userId/status` - Update user status (admin only)
- `DELETE /api/admin/users/:userId` - Delete user (admin only)

### Health Check
- `GET /api/health` - Server health status

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **Redis Connection Error**
   - Ensure Redis server is running
   - Check Redis configuration

3. **Authentication Failed**
   - Verify email and password
   - Check if user account is active
   - Ensure correct role is specified

4. **RAG Endpoints Return "implementation pending"**
   - This is expected behavior for placeholder endpoints
   - Implement actual RAG functionality as needed

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check MongoDB connection
node -e "require('mongoose').connect('mongodb://localhost:27017/asklegal').then(() => console.log('MongoDB OK')).catch(console.error)"

# Check Redis connection
redis-cli ping
```

## 📝 Next Steps

1. **Implement Actual RAG Functionality**
   - Add vector database integration
   - Implement document embedding
   - Add LLM integration for response generation

2. **Add More Test Cases**
   - Test with different query types
   - Test error scenarios
   - Test rate limiting

3. **Enhance User Management**
   - Add bulk user operations
   - Add user activity logging
   - Add password reset functionality

4. **Security Enhancements**
   - Add input validation
   - Implement rate limiting
   - Add audit logging 

ollama pull llama2
ollama pull nomic-embed-text 
ollama list 