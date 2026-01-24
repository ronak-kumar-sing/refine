/**
 * Final test - verify the models work with the extension API format
 */

const API_KEY = 'AIzaSyBdMEBELnqVrz7RR3P2-BUkJ_mQjid115w';

const WORKING_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];

async function testModelWithPrompt(model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;
  
  const systemPrompt = "You are a text refinement assistant. Refine the following text to be professional:";
  const userText = "hey can u help me with this thing";
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userText}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const refinedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return { success: true, result: refinedText };
    } else {
      const error = await response.json();
      return { success: false, error: error.error?.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Gemini models with actual refinement prompt\n');
  console.log('Input text: "hey can u help me with this thing"\n');
  console.log('='.repeat(70));
  
  for (const model of WORKING_MODELS) {
    console.log(`\n📌 Testing: ${model}`);
    const result = await testModelWithPrompt(model);
    
    if (result.success) {
      console.log('✅ Success!');
      console.log('Output:', result.result);
    } else {
      console.log('❌ Failed:', result.error);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Test complete!');
}

runTests();
