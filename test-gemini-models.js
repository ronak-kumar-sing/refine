/**
 * Test script to check which Gemini models work with the API key
 */

const API_KEY = 'Use_Your_API_key';

const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash-exp',
  'gemini-exp-1206',
  'gemini-exp-1114',
  'gemini-pro'
];

async function testModel(model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Test'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 10
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, message: 'Working ✅' };
    } else {
      const error = await response.json();
      return { 
        success: false, 
        message: error.error?.message || `Error ${response.status}` 
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function testAllModels() {
  console.log('🧪 Testing Gemini Models with API Key\n');
  console.log('API Key:', API_KEY.substring(0, 20) + '...\n');
  
  const results = [];
  
  for (const model of MODELS) {
    process.stdout.write(`Testing ${model.padEnd(30)} ... `);
    const result = await testModel(model);
    console.log(result.message);
    
    results.push({
      model,
      success: result.success,
      message: result.message
    });
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Summary:');
  console.log('='.repeat(60));
  
  const working = results.filter(r => r.success);
  const notWorking = results.filter(r => !r.success);
  
  console.log(`\n✅ Working Models (${working.length}):`);
  working.forEach(r => console.log(`   - ${r.model}`));
  
  if (notWorking.length > 0) {
    console.log(`\n❌ Not Working (${notWorking.length}):`);
    notWorking.forEach(r => console.log(`   - ${r.model}: ${r.message}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${working.length}/${MODELS.length} models working`);
}

testAllModels();
