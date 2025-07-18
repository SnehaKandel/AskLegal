const axios = require('axios');

async function testOllama() {
  try {
    console.log('🤖 Testing Ollama Directly\n');

    // Test 1: Check if Ollama is running
    console.log('1. Checking Ollama status...');
    try {
      const statusResponse = await axios.get('http://localhost:11434/api/tags');
      console.log('✅ Ollama is running');
      console.log('   Available models:', statusResponse.data.models?.map(m => m.name).join(', '));
    } catch (error) {
      console.log('❌ Ollama is not running:', error.message);
      return;
    }

    // Test 2: Test simple generation with llama3.2
    console.log('\n2. Testing simple generation with llama3.2...');
    try {
      const genResponse = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2',
        prompt: 'Say hello in one word.',
        stream: false
      });
      console.log('✅ Generation working');
      console.log('   Response:', genResponse.data.response);
    } catch (error) {
      console.log('❌ Generation failed:', error.response?.data || error.message);
    }

    // Test 3: Test embedding
    console.log('\n3. Testing embedding...');
    try {
      const embedResponse = await axios.post('http://localhost:11434/api/embeddings', {
        model: 'nomic-embed-text',
        prompt: 'test text'
      });
      console.log('✅ Embedding working');
      console.log('   Embedding length:', embedResponse.data.embedding?.length || 0);
    } catch (error) {
      console.log('❌ Embedding failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 Ollama Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOllama(); 