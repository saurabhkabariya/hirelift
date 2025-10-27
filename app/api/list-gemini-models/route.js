import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY not found' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List available models
    const models = await genAI.listModels();
    
    const availableModels = models.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods
    }));

    return Response.json({
      success: true,
      totalModels: availableModels.length,
      models: availableModels
    });

  } catch (error) {
    console.error('Error listing models:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}