import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export interface ContentOption {
  caption: string;
  hashtags: string[];
}

export interface GeneratedContent {
  optionA: ContentOption;
  optionB: ContentOption;
  aiModel: string;
  responseTime: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openAIModel: ChatOpenAI;
  private googleModel: ChatGoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const openAIKey = this.configService.get<string>('ai.openai.apiKey');
    const googleKey = this.configService.get<string>('ai.google.apiKey');

    if (!openAIKey) {
      this.logger.warn('OpenAI API key not configured');
    }

    if (!googleKey) {
      this.logger.warn('Google AI API key not configured');
    }

    this.openAIModel = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.8,
      apiKey: openAIKey,
    });

    this.googleModel = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      temperature: 0.8,
      apiKey: googleKey,
    });
  }

  async generateContent(
    prompt: string,
    type: 'POST' | 'STORY',
  ): Promise<GeneratedContent> {
    const contentTypeContext =
      type === 'POST'
        ? 'an Instagram post with a longer, engaging caption'
        : 'an Instagram story with a short, catchy caption';

    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      You are a social media content expert specializing in Instagram.
      Create {contentType} based on this prompt: {prompt}

      IMPORTANT: Respond in the same language as the user's prompt. If the prompt is in Portuguese, respond in Portuguese. If it's in English, respond in English, etc.

      Generate the content in the following JSON format:
      {{
        "caption": "the caption text here",
        "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
      }}

      Guidelines:
      - For POSTS: Create engaging captions between 100-200 words with storytelling elements
      - For STORIES: Create short, punchy captions under 50 words
      - Include 5-10 relevant hashtags without the # symbol
      - Make the content engaging, authentic, and suitable for Instagram
      - Focus on creating value for the audience
      - ALWAYS use the same language as the input prompt for both caption and hashtags
      
      Return ONLY the JSON object, no additional text.
    `);

    const startTime = Date.now();

    try {
      // Try OpenAI first
      const optionA = await this.generateWithModel(
        this.openAIModel,
        promptTemplate,
        prompt,
        contentTypeContext,
        'Version A - Creative approach',
      );

      const optionB = await this.generateWithModel(
        this.openAIModel,
        promptTemplate,
        prompt,
        contentTypeContext,
        'Version B - Different angle',
      );

      const responseTime = Date.now() - startTime;
      return { optionA, optionB, aiModel: 'openai', responseTime };
    } catch (openAIError) {
      this.logger.warn(
        'OpenAI generation failed, falling back to Google AI',
        openAIError,
      );

      try {
        // Fallback to Google AI
        const optionA = await this.generateWithModel(
          this.googleModel,
          promptTemplate,
          prompt,
          contentTypeContext,
          'Version A - Creative approach',
        );

        const optionB = await this.generateWithModel(
          this.googleModel,
          promptTemplate,
          prompt,
          contentTypeContext,
          'Version B - Different angle',
        );

        const responseTime = Date.now() - startTime;
        return { optionA, optionB, aiModel: 'google', responseTime };
      } catch (googleError) {
        this.logger.error('Both AI providers failed', googleError);
        throw new Error('Failed to generate content with both AI providers');
      }
    }
  }

  private async generateWithModel(
    model: ChatOpenAI | ChatGoogleGenerativeAI,
    promptTemplate: ChatPromptTemplate,
    prompt: string,
    contentType: string,
    versionNote: string,
  ): Promise<ContentOption> {
    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    const fullPrompt = `${prompt} (${versionNote})`;
    const result = await chain.invoke({
      contentType,
      prompt: fullPrompt,
    });

    try {
      const parsed = JSON.parse(result) as {
        caption: string;
        hashtags: string[];
      };
      return {
        caption: parsed.caption,
        hashtags: parsed.hashtags || [],
      };
    } catch (parseError) {
      this.logger.error('Failed to parse AI response', parseError);
      // Fallback response
      return {
        caption: result,
        hashtags: [],
      };
    }
  }
}
