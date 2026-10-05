/**
 * ZT Solutions - Centralized Site Content & Configuration
 * 
 * Edit this single file to update text, services, guarantees, case studies,
 * contact details, and FAQs across the entire landing page.
 */

export const siteContent = {
  brand: {
    name: "ZT Solutions",
    legalName: "Zero Trace Solutions",
    tagline: "High-Performance Software Engineering",
    originBadge: "ALEXANDRIA 2026 // ENGINEERING LABS",
    originDescription: "An elite engineering collective architecting production-grade digital systems and scalable cloud infrastructure with uncompromising technical precision.",
    contact: {
      email: "solutionzerotrace@gmail.com",
      whatsapp: "+20 155 654 8385",
      whatsappUrl: "https://wa.me/201556548385?text=Hello%20ZT%20Solutions,%20I%20would%20like%20to%20discuss%20a%20new%20project.",
      instagram: "https://www.instagram.com/zt.solutions?igsh=MW16bmFkbm0yM21sdA==",
      github: "https://github.com/ZeroTrace-Solutions",
      publicPackages: "https://github.com/orgs/ZeroTrace-Solutions/repositories?q=visibility%3Apublic+archived%3Afalse"
    }
  },

  hero: {
    badge: "// NEXT-GEN SOFTWARE ARCHITECTURE",
    headline: "We Engineer Digital Products That Scale Without Breaking.",
    headlineAr: "نطور أنظمة برمجية فائقة الأداء تنمو بثبات وموثوقية",
    description: "From custom full-stack SaaS and high-traffic web applications to scalable cloud backends. Designed with mathematical precision, transparent weekly milestones, and a 30-day post-delivery warranty.",
    descriptionAr: "من منصات SaaS المتكاملة والتطبيقات المخصصة إلى البنى السحابية القابلة للتوسع. نبتكر بأعلى معايير الدقة الهندسية، مع تسليمات مرحلية أسبوعية وضمان كامل بعد الإطلاق.",
    ctaPrimary: "Start Your Project",
    ctaPrimaryAr: "ابدأ مشروعك الآن",
    ctaSecondary: "Explore Live Systems",
    ctaSecondaryAr: "استكشف الأنظمة الحية"
  },

  stats: [
    {
      value: "100%",
      label: "Code & IP Ownership",
      labelAr: "ملكية الكود والبيانات بالكامل",
      subtext: "Full repository & keys handover"
    },
    {
      value: "<100ms",
      label: "Optimized Response Times",
      labelAr: "زمن استجابة فائق السرعة",
      subtext: "High-performance edge delivery"
    },
    {
      value: "Weekly",
      label: "Live Clickable Sprints",
      labelAr: "معاينات حية دورية أسبوعياً",
      subtext: "Test real progress continuously"
    },
    {
      value: "30 Days",
      label: "Post-Launch Warranty",
      labelAr: "ضمان شامل بعد التسليم",
      subtext: "Free bug fixes & tech support"
    }
  ],

  guarantees: [
    {
      id: "ownership",
      title: "100% Code & IP Ownership",
      titleAr: "ملكية تامة للكود والنظام",
      desc: "You own all source code, design assets, and cloud deployment keys. No proprietary lock-in, no hidden retention fees.",
      descAr: "تمتلك المشروع بالكامل فور التسليم: المستودع، الأكواد، قواعد البيانات، ومفاتيح الاستضافة. لا قيود أو رسوم احتجاز.",
      badge: "ZERO_LOCK_IN"
    },
    {
      id: "sprints",
      title: "Weekly Clickable Staging Links",
      titleAr: "مراحل تسليم أسبوعية شفافة",
      desc: "Never wait until the end to see your product. We ship live testable staging links every single sprint for immediate client feedback.",
      descAr: "لن تنتظر حتى نهاية المشروع لترى النتيجة؛ نوفر لك روابط تجريبية تفاعلية أسبوعية لاختبار كل ميزة أولاً بأول.",
      badge: "LIVE_STAGING"
    },
    {
      id: "warranty",
      title: "30-Day Post-Launch Warranty",
      titleAr: "ضمان 30 يوماً بعد الإطلاق",
      desc: "Our commitment continues after deployment. We provide 30 days of proactive bug resolution, monitoring, and team handover at zero extra charge.",
      descAr: "التزامنا يستمر بعد التسليم؛ نقدم 30 يوماً من الدعم الفني، ومراقبة الاستقرار، وحل أي ملاحظات لضمان راحة بالك.",
      badge: "100%_SATISFACTION"
    },
    {
      id: "security",
      title: "Zero-Trace Security & Stability",
      titleAr: "أمان متقدم وبنية لا تسرب البيانات",
      desc: "Automated CI/CD pipelines, isolated database architectures, and rigorous testing ensure your system handles high loads safely.",
      descAr: "حماية عزل البيانات، خطوط اختبار أوتوماتيكية، وبنى سحابية مهيأة للتعامل مع أحجام الزيارات العالية بكل سلاسة.",
      badge: "ZERO_DEFECTS"
    }
  ],

  process: [
    {
      step: "01",
      title: "Discovery & Architectural Blueprint",
      titleAr: "دراسة المتطلبات والمخطط الهندسي",
      desc: "We analyze your business goals, draft user journeys, and establish a fixed milestone scope with zero guesswork.",
      descAr: "ندرس احتياجات عملك بدقة، ونضع مخطط واجهات المستخدم والهيكل التقني وجدول التسليم الزمني المعتمد."
    },
    {
      step: "02",
      title: "Interactive Sprints & Staging",
      titleAr: "تطوير سريع واختبارات حية",
      desc: "We build features in agile iterations. You test live interactive builds every week on your private staging link.",
      descAr: "نطور النظام عبر جولات أسبوعية مرنة، مع توفير رابط تجريبي حي لتختبر التطور وتشارك ملاحظاتك."
    },
    {
      step: "03",
      title: "Security & Performance Hardening",
      titleAr: "تدقيق الأمان وفحص الأداء",
      desc: "Comprehensive load testing, mobile responsiveness audits, and vulnerability checks to guarantee flawless launch.",
      descAr: "اختبارات مكثفة للسرعة، وتوافق الشاشات، وأمان قواعد البيانات لضمان أعلى موثوقية عند الإطلاق."
    },
    {
      step: "04",
      title: "Production Deployment & Warranty",
      titleAr: "النشر على نطاقك وبدء الضمان",
      desc: "Live deployment on your domain or our managed cloud, full credential handover, and 30-day dedicated warranty support.",
      descAr: "إطلاق المنصة على نطاقك الخاص، وتسليم جميع المفاتيح والصلاحيات، وبدء فترة الضمان والدعم المباشر."
    }
  ],

  services: [
    {
      id: "saas",
      title: "Full-Stack SaaS Platforms",
      titleAr: "منصات SaaS والأنظمة السحابية",
      desc: "End-to-end web applications with role-based access, automated billing, real-time analytics, and modular microservices built with Spring Framework, NestJS, Python, and React.",
      descAr: "أنظمة برمجية متكاملة تتضمن إدارة الصلاحيات، بوابات الدفع الإلكتروني، لوحات تحكم تحليلية، وأداء فائق السرعة مبنية بواسطة Spring Framework و NestJS و Python و React.",
      tags: ["React", "NestJS", "Spring Framework", "Python", "Node.js", "PostgreSQL"]
    },
    {
      id: "custom-web",
      title: "Custom Web & E-Commerce",
      titleAr: "متاجر وتطبيقات ويب مخصصة",
      desc: "High-converting digital storefronts, 3D interactive product builders, and customized business management dashboards.",
      descAr: "متاجر ومواقع متقدمة، أدوات تخصيص وتصميم تفاعلية، ولوحات تحكم مخصصة لإدارة العمليات والمبيعات.",
      tags: ["Dynamic UI", "Tailored Commerce", "NestJS", "Python Automation", "Secure Payments"]
    },
    {
      id: "infrastructure",
      title: "High-Load Backends & Automation",
      titleAr: "بنى تحتية سحابية وأتمتة العمليات",
      desc: "Resilient REST & GraphQL APIs, automated background job queues, and self-healing cloud server configurations engineered with Spring Framework, Python, and NestJS.",
      descAr: "بناء واجهات برمجية APIs عالية الكفاءة، معالجة مهام أوتوماتيكية، وتجهيز خوادم سحابية ذاتية الحماية مدعومة بـ Spring Framework و Python و NestJS.",
      tags: ["Spring Framework", "Python", "NestJS", "Microservices", "PostgreSQL", "CI/CD"]
    }
  ],

  featuredProjects: [
    {
      id: "bayan",
      name: "Bayan",
      type: "Operations SaaS",
      subtitle: "Centers Management System",
      description: "An integrated management platform for educational centers handling expenses, instructors, student attendance, and workers from a unified dashboard.",
      descriptionAr: "نظام تشغيلي متكامل لإدارة المراكز التعليمية: الماليّات، الأساتذة، تسجيل الحضور للطلاب والكوادر عبر واجهة موحدة وسلسة.",
      status: "Production Ready",
      link: "https://bayan-edu.web.app/"
    },
    {
      id: "tayf",
      name: "Tayf",
      type: "Commerce SaaS",
      subtitle: "Design + Custom Garment Commerce",
      description: "An online custom garment studio and shopping platform allowing clients to design apparel, order custom cuts, or explore curated fashion creations.",
      descriptionAr: "منصة تجارة إلكترونية مبتكرة تتيح للمستخدمين تصميم الملابس حسب الطلب، والتسوق التفاعلي، وإدارة المتاجر الافتراضية.",
      status: "Interactive Studio",
      link: "https://tayf-custom.web.app/"
    },
    {
      id: "sostudy",
      name: "SOStudy",
      type: "EdTech Network",
      subtitle: "On-Demand Micro-Learning Support",
      description: "A fast-paced collaborative learning network where students publish complex concepts and instantly join 1-on-1 focus sessions with tutors.",
      descriptionAr: "شبكة تعليمية سريعة تسمح للطلاب بنشر المفاهيم غير الواضحة والدخول في جلسات فردية مباشرة مع مساعدين لحل العقبات سريعاً.",
      status: "Live Beta",
      link: "https://sostudy.web.app/"
    }
  ],

  faq: [
    {
      q: "Who owns the code and intellectual property once built?",
      qAr: "من يمتلك الأكواد وحقوق الملكية بعد اكتمال المشروع؟",
      a: "You own 100% of all intellectual property, source code repositories, databases, and deployment keys. We provide a full handover package with no recurring lock-in fees.",
      aAr: "أنت تمتلك 100% من جميع الأكواد، المستودعات، قواعد البيانات ومفاتيح الاستضافة فور انتهاء المشروع دون أي رسوم احتجاز خفية."
    },
    {
      q: "How do you ensure my project meets my exact vision?",
      qAr: "كيف تضمنون أن المشروع سينفذ تماماً كما أطمح؟",
      a: "We work with weekly testable staging links. You see and test actual working software at every step. Adjustments are addressed early in sprints so there are no surprises.",
      aAr: "نعمل عبر روابط تجريبية حية أسبوعية؛ تشاهد وتختبر البرنامج خطوة بخطوة وتشارك ملاحظاتك باستمرار لمنع أي مفاجآت عند التسليم النهائي."
    },
    {
      q: "What warranty or support do you offer after launching?",
      qAr: "ما هو الضمان والدعم الفني المقدم بعد الإطلاق؟",
      a: "Every project includes a 30-Day Post-Launch Warranty covering free bug resolution, stability monitoring, and team onboarding. Ongoing retainer options are also available.",
      aAr: "يتضمن كل مشروع ضماناً مجانياً لمدة 30 يوماً بعد الإطلاق يشمل حل أي مشكلات برمجية طارئة، ومراقبة استقرار الخوادم، وتدريب فريقك."
    },
    {
      q: "How soon can we kick off?",
      qAr: "كم يستغرق البدء في مشروع جديد؟",
      a: "Once we complete our initial 30-minute discovery call and agree on the milestone scope, our engineering team can typically begin within 3 to 5 business days.",
      aAr: "بمجرد عقد جلسة التعارف ودراسة المتطلبات واعتماد نطاق العمل، يبدأ فريقنا الهندسي العمل الفعلي خلال 3 إلى 5 أيام عمل."
    }
  ]
};

export default siteContent;
