/*
  questions.js
  Exports `QUESTIONS` array: list of question objects.
  Each question:
  {
    id: Number,
    category: String,
    difficulty: 'Easy'|'Medium'|'Hard',
    question: String,
    options: [String,...],
    correctAnswer: index (0-based)
  }
*/
const QUESTIONS = [
  // 1
  { id:1, category:"Prompt Engineering", difficulty:"Easy",
    question:"Which prompt is most specific and likely to produce a useful answer?",
    options:["Explain AI","Explain Artificial Intelligence to a beginner with three real-world examples.","AI?","Tell me everything."],
    correctAnswer:1
  },
  // 2
  { id:2, category:"AI Fundamentals", difficulty:"Easy",
    question:"What is a dataset in machine learning?",
    options:["A programming language","A collection of training examples","A GPU","A cloud service"],
    correctAnswer:1
  },
  // 3
  { id:3, category:"Machine Learning", difficulty:"Medium",
    question:"Which algorithm is typically used for classification tasks?",
    options:["Linear Regression","K-Means Clustering","Logistic Regression","PCA"],
    correctAnswer:2
  },
  // 4
  { id:4, category:"Generative AI", difficulty:"Medium",
    question:"A generative model is primarily used to:",
    options:["Store data","Generate new data similar to training data","Only classify images","Encrypt data"],
    correctAnswer:1
  },
  // 5
  { id:5, category:"Responsible AI", difficulty:"Easy",
    question:"Which practice helps reduce bias in ML models?",
    options:["Ignoring edge cases","Using diverse and representative data","Overfitting the model","Using only synthetic data"],
    correctAnswer:1
  },
  // 6
  { id:6, category:"Critical Thinking", difficulty:"Medium",
    question:"If an AI provides an unexpected answer, the best first step is to:",
    options:["Trust it regardless","Investigate data and prompt used","Delete the model","Change random hyperparameters"],
    correctAnswer:1
  },
  // 7
  { id:7, category:"Prompt Engineering", difficulty:"Medium",
    question:"Which technique helps the model follow step-by-step instructions?",
    options:["Chain-of-thought prompting","Random prompting","Short prompts only","No instruction"],
    correctAnswer:0
  },
  // 8
  { id:8, category:"AI Fundamentals", difficulty:"Medium",
    question:"Supervised learning requires:",
    options:["Labeled data","A blockchain","A web server","Unlabeled data only"],
    correctAnswer:0
  },
  // 9
  { id:9, category:"Machine Learning", difficulty:"Hard",
    question:"Regularization helps to:",
    options:["Increase model size","Reduce overfitting","Remove training data","Improve color contrast"],
    correctAnswer:1
  },
  //10
  { id:10, category:"Generative AI", difficulty:"Easy",
    question:"Which model type often generates text?",
    options:["CNN","RNN/Large Language Model","SVM","KNN"],
    correctAnswer:1
  },
  //11
  { id:11, category:"Responsible AI", difficulty:"Medium",
    question:"GDPR mainly concerns:",
    options:["Pricing","Data protection and privacy","Model size","Deployment speed"],
    correctAnswer:1
  },
  //12
  { id:12, category:"Critical Thinking", difficulty:"Easy",
    question:"A good evaluation metric should be:",
    options:["Related to the business goal","Random","Expensive","Hidden"],
    correctAnswer:0
  },
  //13
  { id:13, category:"AI Productivity", difficulty:"Easy",
    question:"Using AI to summarize long documents is an example of:",
    options:["Degrading quality","AI productivity tool","Model training","Data collection"],
    correctAnswer:1
  },
  //14
  { id:14, category:"Prompt Engineering", difficulty:"Hard",
    question:"Few-shot prompting helps by:",
    options:["Providing examples to the model","Reducing memory","Speeding the CPU","Encrypting prompts"],
    correctAnswer:0
  },
  //15
  { id:15, category:"Machine Learning", difficulty:"Medium",
    question:"Cross-validation is used to:",
    options:["Tune hyperparameters and estimate performance","Deploy models","Collect data","Scale databases"],
    correctAnswer:0
  },
  //16
  { id:16, category:"Generative AI", difficulty:"Medium",
    question:"Fine-tuning a pre-trained model typically:",
    options:["Requires no data","Adapts the model to a specific task","Removes model capabilities","Breaks the license"],
    correctAnswer:1
  },
  //17
  { id:17, category:"Responsible AI", difficulty:"Hard",
    question:"Model interpretability is important for:",
    options:["Faster GPU","Understanding decisions and compliance","Lower accuracy","Hiding biases"],
    correctAnswer:1
  },
  //18
  { id:18, category:"Critical Thinking", difficulty:"Hard",
    question:"Correlation vs causation: if two metrics move together you should:",
    options:["Assume causation","Investigate further before concluding causation","Ignore the relationship","Remove metrics"],
    correctAnswer:1
  },
  //19
  { id:19, category:"AI Fundamentals", difficulty:"Hard",
    question:"Overfitting occurs when a model:",
    options:["Generalizes well","Performs well on training but poorly on new data","Is deployed","Has larger batch size"],
    correctAnswer:1
  },
  //20
  { id:20, category:"Prompt Engineering", difficulty:"Easy",
    question:"When asking for a code example, you should:",
    options:["Ask for specifics and constraints","Send no context","Only say 'code'","Ask for images"],
    correctAnswer:0
  },
  //21
  { id:21, category:"Generative AI", difficulty:"Hard",
    question:"Sampling temperature controls:",
    options:["How deterministic or random generated outputs are","The model size","The data labeling","The training rate"],
    correctAnswer:0
  },
  //22
  { id:22, category:"AI Productivity", difficulty:"Medium",
    question:"Prompt templates that save time are examples of:",
    options:["Manual overload","Productivity patterns","Data poisoning","Latency issues"],
    correctAnswer:1
  },
  //23
  { id:23, category:"Responsible AI", difficulty:"Medium",
    question:"Privacy-preserving ML can include:",
    options:["Differential privacy and federated learning","Publicly share raw user data","Always use single server training","Ignore regulations"],
    correctAnswer:0
  },
  //24
  { id:24, category:"Machine Learning", difficulty:"Easy",
    question:"Feature engineering helps by:",
    options:["Creating meaningful input signals for models","Reducing compute power only","Removing the need for data","Increasing noise"],
    correctAnswer:0
  },
  //25
  { id:25, category:"Critical Thinking", difficulty:"Easy",
    question:"When results disagree with expectation, you should:",
    options:["Check assumptions and data","Blame the tool","Delete results","Publish immediately"],
    correctAnswer:0
  },
  //26
  { id:26, category:"AI Fundamentals", difficulty:"Medium",
    question:"An epoch in training refers to:",
    options:["A pass through the entire training dataset","A compute node","A model architecture","A deployment stage"],
    correctAnswer:0
  },
  //27
  { id:27, category:"Prompt Engineering", difficulty:"Medium",
    question:"Specifying output format in a prompt helps by:",
    options:["Constraining results and aiding parsing","Increasing ambiguity","Making model slower","Reducing tokens"],
    correctAnswer:0
  },
  //28
  { id:28, category:"Generative AI", difficulty:"Easy",
    question:"Which is a safety concern for generative models?",
    options:["Producing harmful or misleading content","Faster inference","Higher accuracy","Lower latency"],
    correctAnswer:0
  },
  //29
  { id:29, category:"AI Productivity", difficulty:"Hard",
    question:"Integrating AI into workflows requires:",
    options:["User experience design and change management","Only more servers","Only more data","Only higher accuracy"],
    correctAnswer:0
  },
  //30
  { id:30, category:"Responsible AI", difficulty:"Hard",
    question:"Auditing ML systems involves:",
    options:["Reviewing data, code, and decisions for fairness and compliance","Only running tests","Only making the model bigger","Only adding more features"],
    correctAnswer:0
  }
];