/**
 * Get list of available Gemini models from the API
 */

const API_KEY = 'AIzaSyBdMEBELnqVrz7RR3P2-BUkJ_mQjid115w';

async function listModels() {
  const endpoint = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
  
  try {
    console.log('📋 Fetching available Gemini models...\n');
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', error.error?.message);
      return;
    }
    
    const data = await response.json();
    
    if (!data.models || data.models.length === 0) {
      console.log('No models found');
      return;
    }
    
    console.log(`Found ${data.models.length} models:\n`);
    console.log('='.repeat(80));
    
    // Filter models that support generateContent
    const generateContentModels = data.models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    console.log(`\n✅ Models supporting generateContent (${generateContentModels.length}):\n`);
    
    generateContentModels.forEach(model => {
      const name = model.name.replace('models/', '');
      const displayName = model.displayName || name;
      const description = model.description || 'No description';
      
      console.log(`📌 ${name}`);
      console.log(`   Display Name: ${displayName}`);
      console.log(`   Description: ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`);
      console.log(`   Input Token Limit: ${model.inputTokenLimit || 'N/A'}`);
      console.log(`   Output Token Limit: ${model.outputTokenLimit || 'N/A'}`);
      console.log('');
    });
    
    // Test each model
    console.log('='.repeat(80));
    console.log('\n🧪 Testing each model:\n');
    
    for (const model of generateContentModels) {
      const modelName = model.name.replace('models/', '');
      process.stdout.write(`Testing ${modelName.padEnd(40)} ... `);
      
      const testResult = await testModel(modelName);
      console.log(testResult ? '✅ Working' : '❌ Failed');
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

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
            text: 'Hi'
          }]
        }],
        generationConfig: {
          maxOutputTokens: 5
        }
      })
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

listModels();
