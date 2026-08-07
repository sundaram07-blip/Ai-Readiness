/**
 * AI Readiness Assessment - Questions Database
 * Question pool includes 30 questions across 6 categories
 */

const ASSESSMENT_QUESTIONS = [
  // ==================== PROMPT ENGINEERING ====================
  {
    id: 1,
    category: "Prompt Engineering",
    difficulty: "Easy",
    question: "What is a prompt in the context of AI models?",
    options: [
      "A command that tells a computer to start",
      "A text input that instructs an AI model on what task to perform",
      "A hidden parameter in machine learning",
      "A type of programming language"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    category: "Prompt Engineering",
    difficulty: "Easy",
    question: "Which technique involves providing examples to help an AI model understand a task?",
    options: [
      "Zero-shot learning",
      "Few-shot learning",
      "Multi-shot learning",
      "No-shot learning"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    category: "Prompt Engineering",
    difficulty: "Medium",
    question: "What is 'prompt chaining' used for?",
    options: [
      "Connecting multiple AI models in sequence to solve complex tasks",
      "Breaking down a complex problem into smaller, manageable steps",
      "Linking prompts across different platforms",
      "Creating multiple versions of the same prompt"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    category: "Prompt Engineering",
    difficulty: "Medium",
    question: "Which of the following is NOT a best practice in prompt engineering?",
    options: [
      "Being clear and specific",
      "Providing context",
      "Using vague language to test creativity",
      "Defining the desired output format"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    category: "Prompt Engineering",
    difficulty: "Hard",
    question: "What is 'temperature' in the context of AI model responses?",
    options: [
      "The physical temperature of the server",
      "A parameter controlling randomness and creativity in responses",
      "The time it takes to process a request",
      "The accuracy percentage of the model"
    ],
    correctAnswer: 1
  },

  // ==================== AI FUNDAMENTALS ====================
  {
    id: 6,
    category: "AI Fundamentals",
    difficulty: "Easy",
    question: "What does AI stand for?",
    options: [
      "Automated Internet",
      "Artificial Intelligence",
      "Advanced Integration",
      "Algorithmic Implementation"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    category: "AI Fundamentals",
    difficulty: "Easy",
    question: "Which of these is an example of narrow AI?",
    options: [
      "Artificial General Intelligence",
      "Super Intelligence",
      "ChatGPT trained for customer service",
      "An AI that can do everything a human can"
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    category: "AI Fundamentals",
    difficulty: "Medium",
    question: "What is supervised learning?",
    options: [
      "Learning where an AI is directly supervised by humans",
      "Learning where models are trained on labeled data",
      "Learning where models work only during office hours",
      "Learning that requires constant human intervention"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    category: "AI Fundamentals",
    difficulty: "Medium",
    question: "What is the primary difference between AI and traditional programming?",
    options: [
      "AI uses more code",
      "AI learns from data rather than following explicit instructions",
      "Traditional programming is faster",
      "AI only works with images"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    category: "AI Fundamentals",
    difficulty: "Hard",
    question: "What is overfitting in machine learning?",
    options: [
      "Training data that is too large",
      "A model performing perfectly on training data but poorly on new data",
      "Using too many AI models together",
      "A model that refuses to learn"
    ],
    correctAnswer: 1
  },

  // ==================== MACHINE LEARNING ====================
  {
    id: 11,
    category: "Machine Learning",
    difficulty: "Easy",
    question: "What is a neural network?",
    options: [
      "A computer network for AI applications",
      "A computational model inspired by biological neurons",
      "A type of social network for machines",
      "Software that connects to the internet"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    category: "Machine Learning",
    difficulty: "Easy",
    question: "What is the purpose of training data in machine learning?",
    options: [
      "To test if the model is working",
      "To teach the model patterns and relationships",
      "To speed up computations",
      "To reduce the model size"
    ],
    correctAnswer: 1
  },
  {
    id: 13,
    category: "Machine Learning",
    difficulty: "Medium",
    question: "What is cross-validation used for?",
    options: [
      "Validating data across different countries",
      "Checking if two models agree on predictions",
      "Evaluating model performance on different subsets of data",
      "Crossing validation rules between systems"
    ],
    correctAnswer: 2
  },
  {
    id: 14,
    category: "Machine Learning",
    difficulty: "Medium",
    question: "What does 'backpropagation' do in neural networks?",
    options: [
      "Sends data backwards through the network",
      "Calculates gradients to update weights during training",
      "Reverses the direction of data flow",
      "Prevents forward propagation"
    ],
    correctAnswer: 1
  },
  {
    id: 15,
    category: "Machine Learning",
    difficulty: "Hard",
    question: "What is the curse of dimensionality?",
    options: [
      "A problem with high-dimensional data where performance degrades",
      "A curse that prevents AI from working",
      "Too many dimensions in physical space",
      "A mathematical curse in formal logic"
    ],
    correctAnswer: 0
  },

  // ==================== RESPONSIBLE AI ====================
  {
    id: 16,
    category: "Responsible AI",
    difficulty: "Easy",
    question: "What is AI bias?",
    options: [
      "The preference of AI engineers",
      "Systematic errors in AI outcomes based on protected attributes",
      "A preference for one programming language",
      "The physical tilt of servers"
    ],
    correctAnswer: 1
  },
  {
    id: 17,
    category: "Responsible AI",
    difficulty: "Easy",
    question: "What does explainability mean in AI?",
    options: [
      "Explaining AI to non-technical people",
      "Making AI decisions understandable and interpretable",
      "Using AI to explain things",
      "Writing documentation for code"
    ],
    correctAnswer: 1
  },
  {
    id: 18,
    category: "Responsible AI",
    difficulty: "Medium",
    question: "Which is an ethical concern with AI?",
    options: [
      "AI models are too slow",
      "Privacy violations and data misuse",
      "AI models use too much electricity",
      "AI models are not colorful enough"
    ],
    correctAnswer: 1
  },
  {
    id: 19,
    category: "Responsible AI",
    difficulty: "Medium",
    question: "What is fairness in AI systems?",
    options: [
      "Treating all AI equally",
      "Ensuring AI decisions don't discriminate unfairly",
      "Fair pricing of AI services",
      "Distributing AI resources equally"
    ],
    correctAnswer: 1
  },
  {
    id: 20,
    category: "Responsible AI",
    difficulty: "Hard",
    question: "What is meant by 'transparency' in AI governance?",
    options: [
      "Making AI models see-through",
      "Clearly disclosing how AI systems work and make decisions",
      "Transparent AI servers",
      "Using clear water for cooling systems"
    ],
    correctAnswer: 1
  },

  // ==================== GENERATIVE AI ====================
  {
    id: 21,
    category: "Generative AI",
    difficulty: "Easy",
    question: "What is generative AI?",
    options: [
      "AI that generates electricity",
      "AI capable of creating new content like text, images, or code",
      "AI that generates random numbers",
      "AI for generating reports"
    ],
    correctAnswer: 1
  },
  {
    id: 22,
    category: "Generative AI",
    difficulty: "Easy",
    question: "Which of these is a generative AI model?",
    options: [
      "A spam filter",
      "ChatGPT",
      "An object detection system",
      "A recommendation algorithm"
    ],
    correctAnswer: 1
  },
  {
    id: 23,
    category: "Generative AI",
    difficulty: "Medium",
    question: "What is a Large Language Model (LLM)?",
    options: [
      "A model that learns large languages",
      "A neural network trained on massive text data to generate human-like responses",
      "A model for translating large documents",
      "A model that works with multiple programming languages"
    ],
    correctAnswer: 1
  },
  {
    id: 24,
    category: "Generative AI",
    difficulty: "Medium",
    question: "What is the transformer architecture?",
    options: [
      "An architecture for transforming data formats",
      "A neural network architecture using self-attention mechanisms",
      "A physical component in computers",
      "A design pattern for organizing code"
    ],
    correctAnswer: 1
  },
  {
    id: 25,
    category: "Generative AI",
    difficulty: "Hard",
    question: "What is fine-tuning in the context of generative AI?",
    options: [
      "Adjusting the physical settings of AI servers",
      "Training a pre-trained model on specific data for targeted tasks",
      "Improving the internet connection",
      "Tuning musical notes with AI"
    ],
    correctAnswer: 1
  },

  // ==================== CRITICAL THINKING ====================
  {
    id: 26,
    category: "Critical Thinking",
    difficulty: "Medium",
    question: "When should you NOT use AI for a task?",
    options: [
      "Never - AI should replace all human work",
      "When the task requires human judgment, creativity, or ethical decisions",
      "When the task is too simple",
      "Only on weekends"
    ],
    correctAnswer: 1
  },
  {
    id: 27,
    category: "Critical Thinking",
    difficulty: "Medium",
    question: "What is a potential limitation of AI models?",
    options: [
      "They can solve all problems",
      "They require high-quality training data and may not generalize beyond their training",
      "They have no limitations",
      "They only work with English"
    ],
    correctAnswer: 1
  },
  {
    id: 28,
    category: "Critical Thinking",
    difficulty: "Hard",
    question: "How should organizations approach AI implementation?",
    options: [
      "Deploy AI immediately without planning",
      "Never use AI",
      "Develop a strategy considering ethics, governance, and business impact",
      "Use AI randomly to see what happens"
    ],
    correctAnswer: 2
  },
  {
    id: 29,
    category: "Critical Thinking",
    difficulty: "Hard",
    question: "What is the relationship between data quality and AI performance?",
    options: [
      "Data quality doesn't matter",
      "Better data quality generally leads to better AI performance",
      "Only quantity of data matters, not quality",
      "AI works the same regardless of data quality"
    ],
    correctAnswer: 1
  },
  {
    id: 30,
    category: "Critical Thinking",
    difficulty: "Hard",
    question: "Which statement best describes responsible AI implementation?",
    options: [
      "Maximizing profit regardless of consequences",
      "Avoiding AI entirely",
      "Balancing innovation, ethics, transparency, and fairness",
      "Using AI without considering societal impact"
    ],
    correctAnswer: 2
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ASSESSMENT_QUESTIONS;
}
