
import { RoadmapModule, ModuleStatus, DailyTask, QuizQuestion } from './types';

const generatePlaceholderDays = (month: number, startDay: number, count: number): DailyTask[] => {
  return Array.from({ length: count }, (_, i) => ({
    day: startDay + i,
    title: `Sequence ${month}.${startDay + i}: Tech Horizon`,
    objective: "Preparing for the next stage of development mastery.",
    conceptualWhy: "Technology is a stack. You must master the foundation to build the future.",
    funnyStory: "Dave the Accountant tried to build a database in Excel. He currently has 4 million rows and his laptop is actually hovering off the desk from the fan heat.",
    storyImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    practicalUsage: "Building high-performance data systems.",
    detailedTheory: [{ 
      title: "Data Sequence Alpha", 
      description: "Unit decoding in progress...", 
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" 
    }],
    resources: []
  }));
};

const generateMonth0Days = (): DailyTask[] => {
  return [
    {
      day: 1,
      title: "The Transistor: Silicon's First Breath",
      objective: "Understand the physical switch that acts as the 'atom' of computing.",
      conceptualWhy: "Everything starts with a physical 'Yes' or 'No'. Without the transistor, we are just smashing rocks together.",
      funnyStory: "Meet Silicon Sam, the bouncer at 'Club Electricity'. He only lets the party start if he gets a tiny high-five on his middle leg (The Base). Your phone has billions of Sams, and they never sleep.",
      storyImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      practicalUsage: "Understanding thermal throttling and physical CPU constraints. Every line of code eventually generates heat here.",
      detailedTheory: [
        {
          title: "The P-N Junction",
          description: "At its core, a transistor is a sandwich of doped silicon. By adding impurities (boron or phosphorus), we create regions with 'holes' (P-type) or extra electrons (N-type). The interface between these layers creates a depletion zone—a wall that blocks electricity until we apply a specific voltage to the gate.",
          imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Field-Effect Dynamics (MOSFET)",
          description: "Modern computing relies on the MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor). When you apply voltage to the Gate terminal, it creates an electric field that attracts charge carriers to a narrow channel beneath it. This turns the 'insulator' into a 'conductor' instantly, allowing bits to flow.",
          imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Lithographic Scaling",
          description: "We are currently manufacturing transistors at the 3nm scale—roughly the width of two strands of DNA. This requires Extreme Ultraviolet (EUV) lithography, where light is bounced off mirrors to 'print' circuits onto silicon wafers with atomic precision. This scaling is what drives Moore's Law.",
          imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "The Binary State Machine",
          description: "By combining these switches, we create stable states. A '1' represents a high voltage state (Gate Open), and a '0' represents low voltage (Gate Closed). This is the bridge between the physical world of electrons and the mathematical world of logic.",
          imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800"
        }
      ],
      resources: [
        { 
          type: 'video', label: 'How Transistors Work', url: 'https://www.youtube.com/watch?v=IcrBqCFLHIY', embedId: 'IcrBqCFLHIY', provider: 'Veritasium', difficulty: 'Beginner', duration: '8:15', thumbnail: 'https://img.youtube.com/vi/IcrBqCFLHIY/maxresdefault.jpg' 
        },
        {
          type: 'article', label: 'The History of the MOSFET', url: 'https://en.wikipedia.org/wiki/MOSFET', difficulty: 'Intermediate', provider: 'Technical History'
        }
      ],
      quiz: {
        question: "What is the primary role of the 'Base' or 'Gate' terminal in a transistor?",
        options: ["To store electricity permanently", "To act as the handle controlling current flow", "To convert heat into light", "To protect the chip from water"],
        correctIndex: 1,
        explanation: "The Gate terminal acts like a tap or handle. A small voltage at the Gate controls a much larger flow between the Source and Drain, acting as the fundamental switch."
      }
    },
    {
      day: 2,
      title: "Boolean Logic: The Grammar of Code",
      objective: "How logic gates (AND, OR, NOT) make complex decisions from simple states.",
      conceptualWhy: "Code logic is just electronic gates scaled up millions of times. If you can understand three gates, you can understand a supercomputer.",
      funnyStory: "Logic is like a strict parent. AND says: 'No dessert unless you finish your dinner AND wash the dishes.' OR is the cool aunt: 'You can have cake OR ice cream—either is fine!'",
      storyImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
      practicalUsage: "Writing efficient conditional statements. Bad logic in code leads to 'Heisenbugs' that disappear when you try to find them.",
      detailedTheory: [
        {
          title: "The Truth Table Matrix",
          description: "Every logic gate is defined by its Truth Table—a mathematical map of every possible input and its resulting output. This determinism is why computers are predictable. Whether it's a simple NOT gate (inverter) or a complex XOR (exclusive or), the truth table is the ultimate source of truth for the circuit.",
          imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "NAND: The Universal Builder",
          description: "The NAND gate (Not-AND) is called a 'Universal Gate'. Using only NAND gates, you can reconstruct any other logic gate (AND, OR, NOT, XOR). This is why flash memory is called 'NAND Flash'—it's built from millions of these universal units, capable of both logic and storage.",
          imageUrl: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "De Morgan's Laws",
          description: "In software engineering, simplifying logic saves CPU cycles. De Morgan's laws state that 'Not (A AND B)' is the same as '(Not A) OR (Not B)'. Understanding this allows compilers to optimize your 'if' statements into faster, more efficient hardware instructions.",
          imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Cascading Complexity",
          description: "Logic gates are combined into 'Combinational Logic' circuits like Adders and Multiplexers. An Adder uses XOR and AND gates to perform binary addition. Thousands of these adders combined create the Arithmetic Logic Unit (ALU), the beating heart of every CPU.",
          imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800"
        }
      ],
      resources: [
        { type: 'video', label: 'Logic Gates Explained', url: 'https://www.youtube.com/watch?v=gI-qXk7XojA', embedId: 'gI-qXk7XojA', provider: 'CrashCourse', difficulty: 'Intermediate', duration: '11:20', thumbnail: 'https://img.youtube.com/vi/gI-qXk7XojA/maxresdefault.jpg' },
        { type: 'interactive', label: 'Logic Gate Simulator', url: 'https://logic.ly/demo/', difficulty: 'Advanced', provider: 'Logicly' }
      ],
      quiz: {
        question: "Which logic gate returns TRUE only if both inputs are TRUE?",
        options: ["OR", "NOT", "XOR", "AND"],
        correctIndex: 3,
        explanation: "The AND gate requires both conditions to be met simultaneously to produce a high output (TRUE)."
      }
    },
    ...generatePlaceholderDays(0, 3, 28)
  ];
};

export const INITIAL_ROADMAP: RoadmapModule[] = [
  {
    id: 'm0',
    month: 0,
    title: 'The Silicon Soul: Architecture',
    description: 'Deconstruct the physical reality of computing.',
    conceptualWhy: 'Hardware is the stage; software is the play. You cannot master the performance without knowing the acoustics of the room.',
    funnyStory: 'Dave and the post-it notes.',
    practicalUsage: 'System performance.',
    topics: ['Transistors', 'Logic Gates', 'Binary'],
    skills: ['Architecture', 'Logic'],
    status: ModuleStatus.CURRENT,
    previewImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generateMonth0Days(),
    masteryProject: { title: 'Logic Lab', description: 'Build an 8-bit adder.' },
    resources: []
  }
];
