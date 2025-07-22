// Cold Email and LinkedIn DM Templates

export const GENERAL_TEMPLATES = {
  email: [
    {
      id: 'general-email-1',
      name: 'Professional Introduction',
      type: 'email',
      subject: 'Exploring {role} Opportunities at {companyName}',
      template: `Subject: Exploring {role} Opportunities at {companyName}

Dear {hrName},

I hope this email finds you well. My name is {userName}, and I'm a passionate {userRole} with {experience} of experience in {skills}.

I've been following {companyName}'s innovative work in {industry}, particularly {specificProject}. Your company's commitment to {companyValues} aligns perfectly with my professional values and career aspirations.

I would love to discuss how my background in {expertise} could contribute to your team's success. I'm particularly interested in the {role} position and would appreciate the opportunity to learn more about current or upcoming openings.

Would you be available for a brief 15-minute conversation next week? I'm happy to work around your schedule.

Thank you for your time and consideration.

Best regards,
{userName}
{userEmail}
{userPhone}
{linkedinProfile}`
    },
    {
      id: 'general-email-2',
      name: 'Value-Focused Approach',
      type: 'email',
      subject: 'How I Can Help {companyName} Achieve {specificGoal}',
      template: `Subject: How I Can Help {companyName} Achieve {specificGoal}

Hello {hrName},

I'm {userName}, a {userRole} specializing in {skillArea}. I've been researching companies that are making a real impact in {industry}, and {companyName} stands out for {uniqueStrength}.

In my {experience} of experience, I've helped previous employers:
• {achievement1}
• {achievement2}
• {achievement3}

I believe these skills could be valuable for your {role} position. I'd love to discuss how I can contribute to {companyName}'s continued growth and success.

Could we schedule a brief call to explore potential opportunities? I'm excited about the possibility of joining your innovative team.

Looking forward to hearing from you.

Best,
{userName}
{contactInfo}`
    },
    {
      id: 'general-email-3',
      name: 'Referral Request',
      type: 'email',
      subject: 'Seeking Guidance for {role} Opportunities at {companyName}',
      template: `Subject: Seeking Guidance for {role} Opportunities at {companyName}

Dear {hrName},

I hope you're having a great day! I'm {userName}, an aspiring {userRole} with a strong passion for {fieldOfInterest}.

I've been impressed by {companyName}'s work in {specificArea} and would love to learn more about opportunities within your organization, particularly for {role} positions.

I'm not necessarily asking for a job right now, but I would greatly appreciate any guidance you could provide about:
• Skills most valued for {role} positions at {companyName}
• The application process and timeline
• Any advice for someone looking to join your team

If you have 10-15 minutes for a brief conversation, I'd be incredibly grateful for your insights.

Thank you for considering my request.

Warm regards,
{userName}
{userEmail}
{linkedinProfile}`
    }
  ],
  linkedin: [
    {
      id: 'general-linkedin-1',
      name: 'LinkedIn Connection Request',
      type: 'linkedin',
      template: `Hi {hrName},

I'm a {userRole} passionate about {industry} and impressed by {companyName}'s innovative approach to {specificArea}. 

Would love to connect and learn more about opportunities in {role} positions at your organization.

Best regards,
{userName}`
    },
    {
      id: 'general-linkedin-2',
      name: 'LinkedIn Follow-up Message',
      type: 'linkedin',
      template: `Hi {hrName},

Thank you for connecting! I'm {userName}, a {userRole} with {experience} of experience in {skillArea}.

I've been following {companyName}'s growth and am particularly interested in {role} opportunities. Your team's work on {projectArea} is truly inspiring.

Would you be open to a brief conversation about potential opportunities? I'd love to learn more about how I could contribute to your team's success.

Looking forward to hearing from you!

Best,
{userName}`
    },
    {
      id: 'general-linkedin-3',
      name: 'LinkedIn Informational Interview',
      type: 'linkedin',
      template: `Hi {hrName},

I hope you're doing well! I'm {userName}, a {userRole} passionate about {fieldOfInterest}.

I came across your profile and was impressed by your work at {companyName}. I'd love to learn more about your experience and the culture at your company.

Would you be open to a brief 15-minute informational interview? I'm particularly interested in learning about {role} opportunities and what makes {companyName} a great place to work.

Thank you for considering!

Best regards,
{userName}`
    },
    {
      id: 'general-linkedin-4',
      name: 'LinkedIn Warm Introduction',
      type: 'linkedin',
      template: `Hi {hrName},

I'm {userName}, a {userRole} with a passion for {skillArea}. I've been researching companies that align with my values and career goals, and {companyName} stood out.

Your {specificAchievement} caught my attention - it's exactly the kind of innovative work I want to be part of.

I'd love to connect and learn more about opportunities at {companyName}, particularly in {role} positions.

Looking forward to connecting!

{userName}`
    }
  ]
};

export const ROLE_SPECIFIC_TEMPLATES = {
  // Frontend/React Developer Templates
  'Frontend Developer': {
    email: [
      {
        id: 'frontend-email-1',
        name: 'Frontend Expertise Showcase',
        type: 'email',
        subject: 'Frontend Developer Ready to Enhance {companyName}\'s User Experience',
        template: `Subject: Frontend Developer Ready to Enhance {companyName}'s User Experience

Hello {hrName},

I'm {userName}, a passionate Frontend Developer with {experience} of experience creating engaging, responsive web applications using React, JavaScript, and modern CSS frameworks.

I've been exploring {companyName}'s platform and was impressed by {specificFeature}. I noticed some opportunities to enhance user engagement and performance, particularly in {improvementArea}.

My recent projects include:
• Built a {projectType} that increased user engagement by {percentage}%
• Optimized application performance resulting in {performanceGain}% faster load times
• Implemented responsive designs that improved mobile user experience

I'd love to discuss how my expertise in {techStack} could help {companyName} continue delivering exceptional user experiences. Are you currently hiring for Frontend Developer positions?

Best regards,
{userName}
Portfolio: {portfolioLink}
GitHub: {githubProfile}`
      }
    ],
    linkedin: [
      {
        id: 'frontend-linkedin-1',
        name: 'Frontend Skills Highlight',
        type: 'linkedin',
        template: `Hi {hrName},

Frontend Developer here with expertise in React, TypeScript, and modern CSS. Love what {companyName} is building!

Noticed your tech stack includes {techStack} - that's exactly what I've been working with. Would love to discuss Frontend opportunities at your company.

Check out my recent project: {projectLink}

Best,
{userName}`
      }
    ]
  },

  // Backend Developer Templates
  'Backend Developer': {
    email: [
      {
        id: 'backend-email-1',
        name: 'Backend Architecture Focus',
        type: 'email',
        subject: 'Backend Developer - Scalable Solutions for {companyName}',
        template: `Subject: Backend Developer - Scalable Solutions for {companyName}

Dear {hrName},

I'm {userName}, a Backend Developer specializing in {techStack} with {experience} of experience building scalable, high-performance systems.

I've been researching {companyName} and am impressed by your growth trajectory. As you scale, I imagine backend performance and reliability become increasingly critical.

My experience includes:
• Designed microservices architecture handling {userVolume}+ users
• Optimized database queries reducing response time by {percentage}%
• Implemented CI/CD pipelines improving deployment efficiency by {improvement}%

I'd love to discuss how I can help {companyName} build robust backend systems that support your continued growth. Are there any Backend Developer openings on your team?

Looking forward to connecting.

Best,
{userName}
GitHub: {githubProfile}
LinkedIn: {linkedinProfile}`
      }
    ],
    linkedin: [
      {
        id: 'backend-linkedin-1',
        name: 'Backend Architecture Expert',
        type: 'linkedin',
        template: `Hi {hrName},

Backend Developer with expertise in {techStack} and scalable system design. Impressed by {companyName}'s technical challenges!

Built systems handling {userVolume}+ users with {improvement}% performance gains. Would love to discuss Backend opportunities at your company.

Best,
{userName}
GitHub: {githubProfile}`
      }
    ]
  },

  // Data Scientist Templates
  'Data Scientist': {
    email: [
      {
        id: 'datascience-email-1',
        name: 'Data-Driven Insights',
        type: 'email',
        subject: 'Data Scientist - Turning {companyName}\'s Data into Actionable Insights',
        template: `Subject: Data Scientist - Turning {companyName}'s Data into Actionable Insights

Hello {hrName},

I'm {userName}, a Data Scientist with {experience} of experience in machine learning, statistical analysis, and data visualization.

I've been following {companyName}'s journey and see tremendous potential in leveraging data science to {businessGoal}. Your work in {industryArea} presents fascinating opportunities for predictive modeling and optimization.

Recent achievements include:
• Developed ML models that improved {businessMetric} by {percentage}%
• Created data pipelines processing {dataVolume} of data daily
• Built predictive analytics reducing {costArea} by {savings}%

I'd love to explore how data science could drive {companyName}'s next phase of growth. Are you looking for Data Scientists to join your team?

Best regards,
{userName}
Portfolio: {portfolioLink}
Kaggle: {kaggleProfile}`
      }
    ],
    linkedin: [
      {
        id: 'datascience-linkedin-1',
        name: 'Data Science Impact',
        type: 'linkedin',
        template: `Hi {hrName},

Data Scientist passionate about turning data into business value. Love {companyName}'s data-driven approach!

Built ML models improving {businessMetric} by {percentage}%. Excited about potential Data Science opportunities at your company.

Portfolio: {portfolioLink}

Best,
{userName}`
      }
    ]
  },

  // DevOps Engineer Templates
  'DevOps Engineer': {
    email: [
      {
        id: 'devops-email-1',
        name: 'Infrastructure Excellence',
        type: 'email',
        subject: 'DevOps Engineer - Streamlining {companyName}\'s Development Pipeline',
        template: `Subject: DevOps Engineer - Streamlining {companyName}'s Development Pipeline

Dear {hrName},

I'm {userName}, a DevOps Engineer with {experience} of experience in cloud infrastructure, automation, and continuous deployment.

As {companyName} continues to scale, I imagine maintaining efficient development workflows and reliable infrastructure becomes increasingly important. I specialize in creating seamless CI/CD pipelines and robust cloud architectures.

My expertise includes:
• Reduced deployment time from {oldTime} to {newTime} using {tools}
• Implemented monitoring systems achieving {uptime}% uptime
• Automated infrastructure provisioning saving {timeHours} hours weekly

I'd love to discuss how I can help {companyName} optimize your development and deployment processes. Are there any DevOps opportunities available?

Looking forward to hearing from you.

Best,
{userName}
LinkedIn: {linkedinProfile}
GitHub: {githubProfile}`
      }
    ],
    linkedin: [
      {
        id: 'devops-linkedin-1',
        name: 'DevOps Automation Expert',
        type: 'linkedin',
        template: `Hi {hrName},

DevOps Engineer focused on automation and scalability. Impressed by {companyName}'s infrastructure challenges!

Reduced deployment times by {percentage}% and achieved {uptime}% uptime. Would love to discuss DevOps opportunities at your company.

Best,
{userName}`
      }
    ]
  },
  // Mobile App Developer Templates
  'Mobile App Developer': {
    email: [
      {
        id: 'mobile-email-1',
        name: 'Mobile Development Expertise',
        type: 'email',
        subject: 'Mobile App Developer - Building Next-Gen Apps for {companyName}',
        template: `Subject: Mobile App Developer - Building Next-Gen Apps for {companyName}

Hello {hrName},

I'm {userName}, a Mobile App Developer with {experience} of experience creating high-performance native and cross-platform applications.

I've been following {companyName}'s mobile presence and see great potential to enhance user engagement through {improvementArea}. Mobile-first approach is crucial in today's market.

My expertise includes:
• Developed {projectType} app with {downloadCount}+ downloads
• Optimized app performance achieving {performanceMetric}% faster load times
• Implemented features that increased user retention by {percentage}%

I'd love to discuss how I can help {companyName} deliver exceptional mobile experiences. Are you currently expanding your mobile development team?

Best regards,
{userName}
App Store: {appStoreLink}
GitHub: {githubProfile}`
      }
    ],
    linkedin: [
      {
        id: 'mobile-linkedin-1',
        name: 'Mobile App Showcase',
        type: 'linkedin',
        template: `Hi {hrName},

Mobile App Developer with expertise in {techStack}. Really impressed by {companyName}'s mobile strategy!

Just launched: {appLink} - would love to discuss mobile opportunities at your company.

Best,
{userName}`
      }
    ]
  },

  // Product Manager Templates
  'Product Manager': {
    email: [
      {
        id: 'pm-email-1',
        name: 'Product Strategy Focus',
        type: 'email',
        subject: 'Product Manager - Driving Growth at {companyName}',
        template: `Subject: Product Manager - Driving Growth at {companyName}

Dear {hrName},

I'm {userName}, a Product Manager with {experience} of experience driving product strategy and growth at scale.

I've been researching {companyName} and am impressed by your product's {productStrength}. I see opportunities to accelerate growth through {growthStrategy}.

My track record includes:
• Led product initiatives that increased {metric} by {percentage}%
• Managed cross-functional teams of {teamSize}+ people
• Launched {productCount} successful products with {userBase}+ users

I'd love to discuss how I can help {companyName} achieve your product vision. Are there Product Manager opportunities on your team?

Looking forward to connecting.

Best,
{userName}
LinkedIn: {linkedinProfile}`
      }
    ],
    linkedin: [
      {
        id: 'pm-linkedin-1',
        name: 'Product Strategy Focus',
        type: 'linkedin',
        template: `Hi {hrName},

Product Manager passionate about user-centered product development. Love {companyName}'s product vision!

Led initiatives increasing {metric} by {percentage}% with {userBase}+ users. Excited about Product Manager opportunities at your company.

Best,
{userName}`
      }
    ]
  },

  // Full Stack Developer Templates
  'Full Stack Developer': {
    email: [
      {
        id: 'fullstack-email-1',
        name: 'End-to-End Development',
        type: 'email',
        subject: 'Full Stack Developer - Complete Solutions for {companyName}',
        template: `Subject: Full Stack Developer - Complete Solutions for {companyName}

Hello {hrName},

I'm {userName}, a Full Stack Developer with {experience} of experience building complete web applications from concept to deployment.

Your company's growth in {industryArea} is impressive. I specialize in creating scalable solutions that can grow with your business needs.

Recent projects include:
• Built {projectType} handling {userVolume}+ concurrent users
• Developed full-stack applications using {techStack}
• Reduced development time by {percentage}% through {optimization}

I'd love to discuss how my end-to-end development skills could benefit {companyName}. Are you hiring Full Stack Developers?

Best regards,
{userName}
Portfolio: {portfolioLink}
GitHub: {githubProfile}`
      }
    ],
    linkedin: [
      {
        id: 'fullstack-linkedin-1',
        name: 'Full Stack Expertise',
        type: 'linkedin',
        template: `Hi {hrName},

Full Stack Developer with expertise in {techStack}. Impressed by {companyName}'s technical innovation!

Built applications handling {userVolume}+ users. Would love to discuss Full Stack opportunities at your company.

Portfolio: {portfolioLink}

Best,
{userName}`
      }
    ]
  },

  // Machine Learning Engineer Templates
  'Machine Learning Engineer': {
    email: [
      {
        id: 'ml-email-1',
        name: 'ML Innovation Focus',
        type: 'email',
        subject: 'ML Engineer - AI Solutions for {companyName}',
        template: `Subject: ML Engineer - AI Solutions for {companyName}

Dear {hrName},

I'm {userName}, a Machine Learning Engineer specializing in {mlSpecialty} with {experience} of experience.

{companyName}'s work in {industryArea} presents fascinating opportunities for AI/ML applications. I'm particularly interested in how ML could enhance {businessArea}.

My experience includes:
• Developed ML models achieving {accuracy}% accuracy
• Deployed production systems processing {dataVolume} daily
• Improved {businessMetric} by {percentage}% using {mlTechnology}

I'd love to explore how machine learning could drive {companyName}'s next phase of innovation. Are there ML Engineer positions available?

Best,
{userName}
Kaggle: {kaggleProfile}
Research: {researchLink}`
      }
    ],
    linkedin: [
      {
        id: 'ml-linkedin-1',
        name: 'ML Engineering Excellence',
        type: 'linkedin',
        template: `Hi {hrName},

ML Engineer passionate about AI innovation. Excited by {companyName}'s potential for ML applications!

Built ML models with {accuracy}% accuracy processing {dataVolume} daily. Would love to discuss ML opportunities at your company.

Best,
{userName}`
      }
    ]
  },

  // React Developer Templates (specialized Frontend)
  'React Developer': {
    email: [
      {
        id: 'react-email-1',
        name: 'React Expertise Focus',
        type: 'email',
        subject: 'React Developer - Building Dynamic UIs for {companyName}',
        template: `Subject: React Developer - Building Dynamic UIs for {companyName}

Hello {hrName},

I'm {userName}, a specialized React Developer with {experience} of experience creating performant, user-friendly web applications.

I've been following {companyName} and am particularly impressed by your focus on {techArea}. Your commitment to user experience aligns perfectly with my passion for building intuitive React applications.

My recent React achievements include:
• Built responsive applications using React, {stateManagement}, and {cssFramework}
• Optimized performance reducing bundle size by {percentage}%
• Implemented modern patterns like {reactPattern} and {designPattern}

I'd love to discuss how my React expertise could contribute to {companyName}'s frontend development goals. Are there any React Developer positions available?

Best regards,
{userName}
Portfolio: {portfolioLink}
GitHub: {githubProfile}`
      }
    ],
    linkedin: [
      {
        id: 'react-linkedin-1',
        name: 'React Skills Highlight',
        type: 'linkedin',
        template: `Hi {hrName},

I'm {userName}, a React Developer passionate about creating exceptional user experiences with modern JavaScript.

I've been researching {companyName} and am excited about your innovative approach to {productArea}. Your tech stack and user-focused culture would be an ideal environment for my React skills.

I specialize in React, {techStack}, and have experience with {frameworks}. I'd love to explore React Developer opportunities at {companyName}.

Looking forward to connecting!

{userName}`
      }
    ]
  },

  // UI/UX Designer Templates
  'UI/UX Designer': {
    email: [
      {
        id: 'uiux-email-1',
        name: 'Design Experience Focus',
        type: 'email',
        subject: 'UI/UX Designer - Creating Exceptional User Experiences for {companyName}',
        template: `Subject: UI/UX Designer - Creating Exceptional User Experiences for {companyName}

Dear {hrName},

I'm {userName}, a UI/UX Designer with {experience} of experience in user-centered design, prototyping, and creating intuitive digital experiences.

I've been following {companyName} and am impressed by your commitment to {designPhilosophy}. Your focus on user experience and innovative design solutions perfectly aligns with my design approach.

My design expertise includes:
• Led design projects that improved user engagement by {percentage}%
• Created design systems serving {userBase}+ users
• Proficient in {designTools} and user research methodologies

I'd love to discuss how my design skills can help {companyName} create even better user experiences. Are there UI/UX Designer openings available?

Best regards,
{userName}
Portfolio: {portfolioLink}
Dribbble: {dribbbleProfile}`
      }
    ],
    linkedin: [
      {
        id: 'uiux-linkedin-1',
        name: 'Design Portfolio Showcase',
        type: 'linkedin',
        template: `Hi {hrName},

I'm {userName}, a UI/UX Designer passionate about creating user experiences that delight and convert.

I've been researching {companyName} and love your approach to {designArea}. Your product design philosophy resonates with my belief in user-centered design.

I specialize in {designSpecialty} and would love to explore how I could contribute to your design team. Are there UI/UX Designer opportunities at {companyName}?

Excited to connect!

{userName}
Portfolio: {portfolioLink}`
      }
    ]
  }
};

// Popular roles from the company search page
export const POPULAR_ROLES = [
  "Full Stack Developer",
  "Frontend Developer", 
  "Backend Developer",
  "React Developer",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "Product Manager"
];

// Get templates for a specific role
export const getTemplatesForRole = (role) => {
  // Check if role has specific templates
  if (ROLE_SPECIFIC_TEMPLATES[role]) {
    return {
      roleSpecific: ROLE_SPECIFIC_TEMPLATES[role],
      general: GENERAL_TEMPLATES
    };
  }
  
  // Return general templates for non-specific roles
  return { general: GENERAL_TEMPLATES };
};

// Get all available templates
export const getAllTemplates = () => {
  return {
    general: GENERAL_TEMPLATES,
    roleSpecific: ROLE_SPECIFIC_TEMPLATES
  };
};
