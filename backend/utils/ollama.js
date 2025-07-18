const axios = require('axios');
async function askOllama(context, question) {
  const systemPrompt = "You are an AI assistant. Only answer using the provided context.";
  const response = await axios.post('http://localhost:11434/api/chat', {
    model: "llama3.2:3b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
    ],
    stream: false
  });
  return response.data.message.content;
}
module.exports = { askOllama }; 