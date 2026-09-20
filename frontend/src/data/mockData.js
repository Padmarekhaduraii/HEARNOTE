// Initial mock lectures data
export const INITIAL_LECTURES = [
  {
    id: "lec-1",
    title: "Introduction to Artificial Intelligence",
    date: "September 20, 2026",
    duration: "48 minutes",
    transcript: [
      {
        id: "seg-1",
        speaker: "Prof. Marcus Vance",
        text: "Good morning everyone. Today we begin our foundational journey into Artificial Intelligence.",
        timestamp: "10:00 AM",
        confidence: 0.99
      },
      {
        id: "seg-2",
        speaker: "Prof. Marcus Vance",
        text: "Artificial intelligence is the simulation of human intelligence processes by computer systems and machines.",
        timestamp: "10:01 AM",
        confidence: 0.98
      },
      {
        id: "seg-3",
        speaker: "Prof. Marcus Vance",
        text: "Machine learning is a major subset of artificial intelligence where algorithms learn patterns directly from data rather than explicit programming rules.",
        timestamp: "10:03 AM",
        confidence: 0.97
      },
      {
        id: "seg-4",
        speaker: "Student (Sarah)",
        text: "Professor, how do neural networks relate to standard machine learning?",
        timestamp: "10:05 AM",
        confidence: 0.95
      },
      {
        id: "seg-5",
        speaker: "Prof. Marcus Vance",
        text: "Great question, Sarah. Neural networks are inspired by the biological structure of the human brain. Deep learning specifically utilizes multi-layered neural networks to solve complex perception problems.",
        timestamp: "10:06 AM",
        confidence: 0.98
      },
      {
        id: "seg-6",
        speaker: "Prof. Marcus Vance",
        text: "To summarize this first unit: AI is the broad umbrella, Machine Learning is the data-driven technique, and Deep Learning is the deep neural architecture.",
        timestamp: "10:10 AM",
        confidence: 0.99
      }
    ],
    notes: {
      summary: "An introduction to foundational concepts in AI, outlining the distinctions between broad Artificial Intelligence, data-driven Machine Learning, and brain-inspired Deep Neural Networks.",
      keyTopics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Deep Learning Architectures"],
      keyPoints: [
        "AI enables machines to simulate human intelligence and reasoning.",
        "Machine Learning is a subset of AI that extracts patterns from data without explicit manual rules.",
        "Deep Learning uses layered neural networks modeled loosely after biological brains.",
        "Supervised, unsupervised, and reinforcement learning form the 3 primary ML paradigms."
      ],
      definitions: [
        {
          term: "Artificial Intelligence (AI)",
          definition: "The simulation of human cognitive functions and problem-solving abilities by computerized systems."
        },
        {
          term: "Machine Learning (ML)",
          definition: "A subset of AI focused on training statistical models on data to make predictions or decisions."
        },
        {
          term: "Neural Network",
          definition: "A computational architecture composed of interconnected nodes (neurons) organized in layers to process information."
        }
      ],
      questions: [
        "What is machine learning and how does it differ from traditional rule-based software?",
        "How do biological neural connections relate to artificial deep neural layers?",
        "In what classroom or real-world scenarios is deep learning preferred over basic regression?"
      ]
    }
  },
  {
    id: "lec-2",
    title: "Assistive Technology & Human-Computer Interaction",
    date: "September 18, 2026",
    duration: "52 minutes",
    transcript: [
      {
        id: "seg-201",
        speaker: "Dr. Elena Rostova",
        text: "Welcome to Assistive Technology in HCI. Our focus today is designing multimodal interfaces for sensory accessibility.",
        timestamp: "02:00 PM",
        confidence: 0.99
      },
      {
        id: "seg-202",
        speaker: "Dr. Elena Rostova",
        text: "For deaf and hard-of-hearing students, auditory notifications can cause severe exclusion if visual alternatives are absent.",
        timestamp: "02:04 PM",
        confidence: 0.98
      },
      {
        id: "seg-203",
        speaker: "Dr. Elena Rostova",
        text: "Real-time speech-to-text systems must prioritize low latency, clear visual speaker attribution, and non-auditory status cues.",
        timestamp: "02:09 PM",
        confidence: 0.97
      }
    ],
    notes: {
      summary: "Exploration of accessible multimodal interaction principles, emphasizing low-latency visual captioning and non-auditory state indicators for deaf and hard-of-hearing users.",
      keyTopics: ["Accessibility in HCI", "Multimodal Interfaces", "Visual Indicators", "Real-Time Captioning"],
      keyPoints: [
        "Auditory cues must always have visual equivalents with high visual salience.",
        "Latency in live transcription directly affects classroom participation for hard-of-hearing students.",
        "Speaker identification and high text contrast significantly reduce cognitive load."
      ],
      definitions: [
        {
          term: "Multimodal Interaction",
          definition: "Providing multiple distinct sensory input and output channels such as visual, auditory, and haptic feedback."
        },
        {
          term: "Visual Salience",
          definition: "The distinct subjective perceptual quality which makes some items in the UI stand out from their neighbors and immediately grab attention."
        }
      ],
      questions: [
        "Why is color alone insufficient for communicating system status in accessible software?",
        "How does transcription latency impact a deaf student's ability to participate in live discussions?"
      ]
    }
  },
  {
    id: "lec-3",
    title: "Data Structures: Balanced Trees & Hash Tables",
    date: "September 15, 2026",
    duration: "65 minutes",
    transcript: [
      {
        id: "seg-301",
        speaker: "Prof. Alan Turing",
        text: "Today we will analyze worst-case vs average-case complexity in binary search trees and hash maps.",
        timestamp: "11:15 AM",
        confidence: 0.98
      },
      {
        id: "seg-302",
        speaker: "Prof. Alan Turing",
        text: "AVL trees guarantee logarithmic lookup time by enforcing self-balancing after each insertion or deletion.",
        timestamp: "11:22 AM",
        confidence: 0.97
      }
    ],
    notes: {
      summary: "Comparison of balanced binary search trees (AVL, Red-Black) with hash tables for optimal search, insertion, and memory trade-offs.",
      keyTopics: ["AVL Trees", "Binary Search Trees", "Hash Collisions", "Big-O Analysis"],
      keyPoints: [
        "Unbalanced BSTs can degenerate into linked lists with O(N) worst-case time.",
        "AVL rotations maintain height balance to guarantee O(log N) operations.",
        "Hash tables offer expected O(1) time but require collision resolution mechanisms."
      ],
      definitions: [
        {
          term: "Balance Factor",
          definition: "The difference in height between the left and right subtrees of a given node in an AVL tree."
        },
        {
          term: "Hash Collision",
          definition: "A scenario where two distinct keys produce the identical hash index within an array table."
        }
      ],
      questions: [
        "When would you choose an AVL tree over a standard hash table in memory-constrained environments?",
        "What are the 4 fundamental tree rotations used to restore AVL balance?"
      ]
    }
  }
];

// Progressive simulation script for Live Lecture
export const LIVE_SIMULATION_SCRIPT = [
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "Welcome back everyone. Today we are exploring the frontiers of Artificial Intelligence and Machine Learning.",
    confidence: 0.99,
    delaySeconds: 2,
    partialNotes: {
      summary: "The lecture begins with an introduction to Artificial Intelligence and Machine Learning fundamentals.",
      keyTopics: ["Artificial Intelligence", "Foundations of Computing"],
      keyPoints: [
        "AI enables computational systems to simulate cognitive problem-solving.",
        "Modern systems focus on learning representations from structured and unstructured data."
      ],
      definitions: [
        {
          term: "Artificial Intelligence",
          definition: "The simulation of human intelligence in machines programmed to think and learn."
        }
      ],
      questions: [
        "What constitutes artificial intelligence in modern computing?"
      ]
    }
  },
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "Artificial intelligence is the simulation of human intelligence in machines.",
    confidence: 0.98,
    delaySeconds: 4,
    partialNotes: null
  },
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "Machine learning is a subset of artificial intelligence that allows software to improve from experience without being explicitly programmed.",
    confidence: 0.97,
    delaySeconds: 4,
    partialNotes: {
      summary: "Prof. Davis defines AI and explains how Machine Learning acts as its primary data-driven engine.",
      keyTopics: ["Artificial Intelligence", "Machine Learning", "Data Representations"],
      keyPoints: [
        "AI is the overarching field of intelligent agents.",
        "Machine learning is a subset of artificial intelligence.",
        "ML systems replace hardcoded heuristic rules with pattern recognition learned from data."
      ],
      definitions: [
        {
          term: "Artificial Intelligence",
          definition: "The simulation of human intelligence in machines programmed to think and learn."
        },
        {
          term: "Machine Learning",
          definition: "A subset of AI focused on training models on data rather than writing explicit algorithmic rules."
        }
      ],
      questions: [
        "What is machine learning?",
        "How does AI differ from traditional rule-based programming?"
      ]
    }
  },
  {
    speaker: "Student 1 (Alex)",
    text: "Professor, how does deep learning fit into this hierarchy?",
    confidence: 0.96,
    delaySeconds: 5,
    partialNotes: null
  },
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "Excellent question, Alex. Neural networks are inspired by the structure of the human brain, and deep learning is a specialized branch of machine learning utilizing multiple interconnected layers.",
    confidence: 0.99,
    delaySeconds: 4,
    partialNotes: {
      summary: "Discussion transitions from classical ML to Deep Learning and brain-inspired Neural Networks.",
      keyTopics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Deep Learning"],
      keyPoints: [
        "AI enables machines to perform tasks associated with human intelligence.",
        "Machine learning is a subset of AI.",
        "Neural networks are inspired by the structure of the human brain.",
        "Deep learning uses multiple neural layers to extract hierarchical features from raw data."
      ],
      definitions: [
        {
          term: "Artificial Intelligence",
          definition: "The simulation of human intelligence in machines programmed to think and learn."
        },
        {
          term: "Machine Learning",
          definition: "A subset of AI focused on training models on data rather than writing explicit algorithmic rules."
        },
        {
          term: "Neural Network",
          definition: "Computational model composed of nodes in layers, loosely modeled after biological neurons."
        },
        {
          term: "Deep Learning",
          definition: "A subset of machine learning based on multi-layered artificial neural networks."
        }
      ],
      questions: [
        "What is machine learning?",
        "How does AI differ from traditional programming?",
        "Why do multi-layer neural networks excel at perceptual tasks like computer vision?"
      ]
    }
  },
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "Consider computer vision and speech recognition. Traditional rule-based programming completely failed at these tasks because human sensory processing cannot be captured by static if-else statements.",
    confidence: 0.98,
    delaySeconds: 5,
    partialNotes: null
  },
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "With deep learning, the network learns low-level edge features in early layers, textural shapes in intermediate layers, and holistic object representations in the deeper layers.",
    confidence: 0.98,
    delaySeconds: 4,
    partialNotes: {
      summary: "Comprehensive overview of AI hierarchy, comparing rule-based limitations with multi-layered deep representation learning.",
      keyTopics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Feature Hierarchies", "Computer Vision"],
      keyPoints: [
        "AI enables machines to perform tasks associated with human intelligence.",
        "Machine learning is a subset of AI.",
        "Neural networks are inspired by the structure of the human brain.",
        "Early neural layers detect primitive edges, intermediate layers capture textures, and deeper layers represent semantic objects.",
        "Sensory tasks like speech recognition require continuous representation learning rather than static if-else logic."
      ],
      definitions: [
        {
          term: "Artificial Intelligence",
          definition: "The simulation of human intelligence in machines programmed to think and learn."
        },
        {
          term: "Machine Learning",
          definition: "A subset of AI focused on training models on data rather than writing explicit algorithmic rules."
        },
        {
          term: "Neural Network",
          definition: "Computational model composed of nodes in layers, loosely modeled after biological neurons."
        },
        {
          term: "Feature Hierarchy",
          definition: "The progressive abstraction of representations from raw low-level pixels to high-level semantic concepts."
        }
      ],
      questions: [
        "What is machine learning?",
        "How does AI differ from traditional programming?",
        "How do early and deep layers in a convolutional neural network differ in feature abstraction?"
      ]
    }
  },
  {
    speaker: "Student 2 (Maya)",
    text: "Does this mean training data quality is more critical than the specific neural model choice?",
    confidence: 0.95,
    delaySeconds: 4,
    partialNotes: null
  },
  {
    speaker: "Speaker 1 (Prof. Davis)",
    text: "Precisely, Maya. In modern AI, data curation and objective evaluation metrics represent over eighty percent of practical engineering success.",
    confidence: 0.99,
    delaySeconds: 4,
    partialNotes: null
  }
];
