
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

const generateMonth1Days = (): DailyTask[] => {
  return [
    {
      day: 1,
      title: "Kernel Genesis: The Ring 0 Authority",
      objective: "Master the concept of privilege levels and the kernel's role as the system's absolute ruler.",
      conceptualWhy: "In a computer, someone has to be the boss. The kernel is the god-protocol that manages every electron and memory cell.",
      funnyStory: "Think of the CPU like a high-end restaurant. You (the User App) are the customer. You can't just walk into the kitchen (Hardware) and start flipping burgers. You have to ask the Waiter (The Kernel) to do it for you. This is called a System Call.",
      storyImageUrl: "https://images.unsplash.com/photo-1518433278988-78ef99ea0524?auto=format&fit=crop&q=80&w=800",
      practicalUsage: "Optimizing application performance by understanding context switching and overhead.",
      detailedTheory: [
        {
          title: "Privilege Rings",
          description: "x86 architecture uses 'Rings' to enforce security. Ring 3 is where your browser and games live (User Mode). Ring 0 is the 'inner sanctum'Reserved for the Kernel. Moving between these rings requires a 'Trap' or 'Interrupt', which is a costly procedure for the CPU.",
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef0109556754?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "The System Call Interface",
          description: "Syscalls are the API of the OS. When you write `console.log` in JS, it eventually becomes a `write()` syscall. The CPU triggers a software interrupt, switches to Ring 0, and the kernel takes over to talk to the screen hardware.",
          imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800"
        }
      ],
      resources: [
        { type: 'video', label: 'What is an Operating System?', url: 'https://www.youtube.com/watch?v=26QPDBe-NB8', embedId: '26QPDBe-NB8', provider: 'PowerPoint', difficulty: 'Beginner', duration: '12:00', thumbnail: 'https://img.youtube.com/vi/26QPDBe-NB8/maxresdefault.jpg' }
      ],
      quiz: {
        question: "In which 'Ring' does the Operating System Kernel typically operate?",
        options: ["Ring 3", "Ring 1", "Ring 0", "The Outer Ring"],
        correctIndex: 2,
        explanation: "Ring 0 provides the highest level of privilege, allowing the kernel to execute restricted instructions and manage hardware directly."
      }
    },
    ...generatePlaceholderDays(1, 2, 29)
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
    status: ModuleStatus.COMPLETED,
    previewImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generateMonth0Days(),
    masteryProject: { title: 'Logic Lab', description: 'Build an 8-bit adder.' },
    resources: [],
    progress: 100
  },
  {
    id: 'm1',
    month: 1,
    title: 'The Binary Cathedral: Systems',
    description: 'Master the operating systems and kernel interfaces.',
    conceptualWhy: 'The OS is the traffic controller. Without it, every app would be fighting for the same memory like a digital bar fight.',
    funnyStory: 'The Waiter and the Burger.',
    practicalUsage: 'High-concurrency systems.',
    topics: ['Kernels', 'Syscalls', 'Memory Management'],
    skills: ['OS', 'Performance'],
    status: ModuleStatus.CURRENT,
    previewImage: 'https://images.unsplash.com/photo-1518433278988-78ef99ea0524?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generateMonth1Days(),
    masteryProject: { title: 'Kernel Bridge', description: 'Implement a basic shell.' },
    resources: [],
    progress: 3
  },
  {
    id: 'm2',
    month: 2,
    title: 'The Network Nexus: Protocols',
    description: 'Navigate the invisible highways of the internet.',
    conceptualWhy: 'Every request you make travels through layers of protocols. Understanding them is like reading the traffic signs of the digital freeway.',
    funnyStory: 'Bob the Packet.',
    practicalUsage: 'API design and debugging.',
    topics: ['TCP/IP', 'HTTP', 'DNS', 'WebSockets'],
    skills: ['Networking', 'Protocols'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1558494949-ef0109556754?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(2, 1, 30),
    masteryProject: { title: 'Protocol Pioneer', description: 'Build a TCP chat application.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm3',
    month: 3,
    title: 'The Data Forge: Databases',
    description: 'Master the art of persistent storage and data modeling.',
    conceptualWhy: 'Data is the new oil. But like oil, it needs refining. Databases are the refineries that turn raw information into actionable intelligence.',
    funnyStory: 'Sally and the 4 million rows.',
    practicalUsage: 'Building scalable data systems.',
    topics: ['SQL', 'NoSQL', 'Indexing', 'Normalization'],
    skills: ['Database', 'Optimization'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(3, 1, 30),
    masteryProject: { title: 'Data Architect', description: 'Design a normalized schema for an e-commerce platform.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm4',
    month: 4,
    title: 'The Frontend Frontier: HTML/CSS',
    description: 'Craft pixel-perfect interfaces from scratch.',
    conceptualWhy: 'The frontend is the handshake between human and machine. First impressions matter, and your UI is the face of your application.',
    funnyStory: 'The div that took 3 hours to center.',
    practicalUsage: 'Building responsive web interfaces.',
    topics: ['Semantic HTML', 'CSS Grid', 'Flexbox', 'Animations'],
    skills: ['Frontend', 'UI/UX'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(4, 1, 30),
    masteryProject: { title: 'Pixel Perfect', description: 'Clone a professional landing page.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm5',
    month: 5,
    title: 'The JavaScript Engine: Core Language',
    description: 'Master the language that powers the modern web.',
    conceptualWhy: 'JavaScript runs everywhere - browsers, servers, IoT devices. It is the lingua franca of the internet.',
    funnyStory: 'Why 0.1 + 0.2 !== 0.3.',
    practicalUsage: 'Building interactive applications.',
    topics: ['ES6+', 'Async/Await', 'Closures', 'Prototypes'],
    skills: ['JavaScript', 'Programming'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(5, 1, 30),
    masteryProject: { title: 'JS Mastery', description: 'Build a custom Promise implementation.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm6',
    month: 6,
    title: 'The React Revolution: Components',
    description: 'Build declarative UIs with the most popular frontend framework.',
    conceptualWhy: 'React changed how we think about UIs. Components are like LEGO blocks - simple pieces that combine into complex structures.',
    funnyStory: 'The developer who re-rendered the entire DOM.',
    practicalUsage: 'Building modern SPAs.',
    topics: ['Components', 'Hooks', 'State', 'Context'],
    skills: ['React', 'Frontend'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(6, 1, 30),
    masteryProject: { title: 'React Architect', description: 'Build a Kanban board from scratch.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm7',
    month: 7,
    title: 'The Node Nexus: Backend',
    description: 'Extend JavaScript to the server with Node.js.',
    conceptualWhy: 'Node.js brought JavaScript to the backend, enabling fullstack JavaScript development and real-time applications.',
    funnyStory: 'The event loop that never ended.',
    practicalUsage: 'Building REST APIs and microservices.',
    topics: ['Express', 'REST APIs', 'Middleware', 'Authentication'],
    skills: ['Node.js', 'Backend'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(7, 1, 30),
    masteryProject: { title: 'API Architect', description: 'Build a complete REST API with authentication.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm8',
    month: 8,
    title: 'The TypeScript Transformation',
    description: 'Add static typing to JavaScript for enterprise-grade code.',
    conceptualWhy: 'TypeScript catches bugs before they happen. It is like having a spell-checker for your logic.',
    funnyStory: 'The any that broke production.',
    practicalUsage: 'Writing maintainable, scalable code.',
    topics: ['Types', 'Interfaces', 'Generics', 'Decorators'],
    skills: ['TypeScript', 'Type Safety'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(8, 1, 30),
    masteryProject: { title: 'Type Master', description: 'Convert a JavaScript project to TypeScript.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm9',
    month: 9,
    title: 'The Testing Temple: Quality',
    description: 'Master the art of automated testing and TDD.',
    conceptualWhy: 'Untested code is broken code waiting to happen. Tests are your safety net against regression.',
    funnyStory: 'It works on my machine.',
    practicalUsage: 'Building reliable, bug-free applications.',
    topics: ['Unit Tests', 'Integration', 'E2E', 'TDD'],
    skills: ['Testing', 'Quality'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1576444356170-66073046b1bc?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(9, 1, 30),
    masteryProject: { title: 'Test Champion', description: 'Achieve 90% test coverage on a real project.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm10',
    month: 10,
    title: 'The DevOps Domain: CI/CD',
    description: 'Automate your deployment pipeline from commit to production.',
    conceptualWhy: 'DevOps bridges the gap between development and operations. Automation is the key to shipping fast and reliably.',
    funnyStory: 'The deploy that happened on Friday at 5pm.',
    practicalUsage: 'Continuous deployment and monitoring.',
    topics: ['Docker', 'GitHub Actions', 'AWS', 'Monitoring'],
    skills: ['DevOps', 'Cloud'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(10, 1, 30),
    masteryProject: { title: 'DevOps Engineer', description: 'Build a complete CI/CD pipeline.' },
    resources: [],
    progress: 0
  },
  {
    id: 'm11',
    month: 11,
    title: 'The Scale Summit: Architecture',
    description: 'Design systems that handle millions of users.',
    conceptualWhy: 'At scale, everything breaks. System design is the art of building resilient architectures that grow with demand.',
    funnyStory: 'The database that hit 100% CPU.',
    practicalUsage: 'Building production-ready systems.',
    topics: ['Load Balancing', 'Caching', 'Microservices', 'Queues'],
    skills: ['System Design', 'Architecture'],
    status: ModuleStatus.LOCKED,
    previewImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    dailySchedule: generatePlaceholderDays(11, 1, 30),
    masteryProject: { title: 'Scale Architect', description: 'Design a system for 1M+ users.' },
    resources: [],
    progress: 0
  }
];
