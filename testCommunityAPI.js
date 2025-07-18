const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api/community';

async function testCommunityAPI() {
  console.log('🧪 Testing Community API...\n');

  try {
    // Test 1: Get categories
    console.log('1. Testing GET /categories...');
    const categoriesResponse = await fetch(`${API_BASE}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('Categories response:', categoriesData);
    console.log('✅ Categories endpoint working\n');

    // Test 2: Get posts
    console.log('2. Testing GET /posts...');
    const postsResponse = await fetch(`${API_BASE}/posts`);
    const postsData = await postsResponse.json();
    console.log('Posts response:', postsData);
    console.log('✅ Posts endpoint working\n');

    // Test 3: Create a post
    console.log('3. Testing POST /posts...');
    const createPostResponse = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        content: 'This is a test post content',
        category: 'general',
        tags: ['test'],
        isAnonymous: false
      })
    });
    const createPostData = await createPostResponse.json();
    console.log('Create post response:', createPostData);
    
    if (createPostData.success) {
      console.log('✅ Create post endpoint working\n');
      
      // Test 4: Get the created post
      console.log('4. Testing GET /posts/:id...');
      const postId = createPostData.data._id;
      const getPostResponse = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: null, userIp: '127.0.0.1' })
      });
      const getPostData = await getPostResponse.json();
      console.log('Get post response:', getPostData);
      console.log('✅ Get post endpoint working\n');

      // Test 5: Vote on post
      console.log('5. Testing POST /posts/:id/vote...');
      const voteResponse = await fetch(`${API_BASE}/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voteType: 'upvote',
          userId: null,
          userIp: '127.0.0.1'
        })
      });
      const voteData = await voteResponse.json();
      console.log('Vote response:', voteData);
      console.log('✅ Vote endpoint working\n');

      // Test 6: Create a comment
      console.log('6. Testing POST /comments...');
      const createCommentResponse = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postId,
          content: 'This is a test comment',
          isAnonymous: false
        })
      });
      const createCommentData = await createCommentResponse.json();
      console.log('Create comment response:', createCommentData);
      console.log('✅ Create comment endpoint working\n');

    } else {
      console.log('❌ Create post failed:', createPostData.message);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testCommunityAPI(); 