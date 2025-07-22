import { LuBarChart3, LuGlobe, LuLink2, LuPalette, LuQrCode, LuShield, LuSmartphone, LuTrendingUp, LuUsers } from "react-icons/lu";

export const pricingPlans = [
    {
        id: "pricing_1",
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: ["5 links per month", "Basic analytics", "Standard QR codes", "Community support"],
      cta: "Get Started Free",
      popular: false
    },
    {
        id: "pricing_2",
      name: "Pro",
      price: 10,
      description: "For growing businesses",
      features: ["100 links per month", "Advanced analytics", "Custom QR codes", "Link-in-bio pages", "Priority support"],
      cta: "Start Pro Trial",
      popular: true
    },
    {
        id: "pricing_3",
      name: "Enterprise",
      price: 20,
      description: "For large organizations",
      features: ["1000 links per month", "Team collaboration", "White-label options", "API access", "Dedicated support"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  export const features = [
      {
        id: 1,
        icon: LuLink2,
        title: "Smart Link Shortening",
        description: "Transform long URLs into memorable, branded short links with custom aliases and bulk operations.",
        image: "/api/placeholder/600/400",
        benefits: ["Custom aliases", "Bulk shortening", "Brand consistency", "Easy sharing"]
      },
      {
        id: 2,
        icon: LuQrCode,
        title: "Dynamic QR Codes",
        description: "Generate beautiful, customizable QR codes that can be updated without reprinting.",
        image: "/api/placeholder/600/400",
        benefits: ["Custom designs", "Logo embedding", "Color customization", "High resolution"]
      },
      {
        id: 3,
        icon: LuBarChart3,
        title: "Advanced Analytics",
        description: "Get detailed insights into your link performance with real-time analytics and reporting.",
        image: "/api/placeholder/600/400",
        benefits: ["Real-time tracking", "Geographic data", "Device insights", "Click patterns"]
      },
      {
        id: 4,
        icon: LuUsers,
        title: "Link-in-Bio Pages",
        description: "Create stunning landing pages that showcase all your important links in one place.",
        image: "/api/placeholder/600/400",
        benefits: ["Custom themes", "Drag & drop", "Social integration", "Mobile optimized"]
      }
    ];

  export const stats = [
    { number: "10M+", label: "Links Created", icon: LuLink2 },
    { number: "500K+", label: "Active Users", icon: LuUsers },
    { number: "99.9%", label: "Uptime", icon: LuShield },
    { number: "150+", label: "Countries", icon: LuGlobe }
  ];

  export const useCases = [
              {
                icon: LuTrendingUp,
                title: "Marketing Campaigns",
                description: "Track campaign performance with detailed analytics and A/B testing capabilities.",
                features: ["UTM parameter support", "Campaign tracking", "Conversion analytics"]
              },
              {
                icon: LuSmartphone,
                title: "Social Media",
                description: "Optimize your social presence with link-in-bio pages and branded short links.",
                features: ["Instagram bio links", "Story links", "Social analytics"]
              },
              {
                icon: LuPalette,
                title: "Brand Management",
                description: "Maintain brand consistency with custom domains and branded QR codes.",
                features: ["Custom domains", "Brand colors", "Logo integration"]
              }
            ]

  export const testimonials = [
      {
        name: "Sarah Johnson",
        role: "Marketing Director",
        company: "TechCorp",
        avatar: "/api/placeholder/60/60",
        rating: 5,
        text: "Sneek has revolutionized how we manage our marketing campaigns. The analytics are incredible!"
      },
      {
        name: "Mike Chen",
        role: "Content Creator",
        company: "Independent",
        avatar: "/api/placeholder/60/60",
        rating: 5,
        text: "The link-in-bio feature is a game-changer. My engagement has increased by 300%!"
      },
      {
        name: "Emily Rodriguez",
        role: "Social Media Manager",
        company: "BrandCo",
        avatar: "/api/placeholder/60/60",
        rating: 5,
        text: "Custom QR codes with our branding look amazing. Professional and trackable!"
      }
    ];

export  const SIDEBAR_LINKS = [
    {
        id: 1,
        name: 'Overview',
        slug: '/overview',
    },
    {
        id: 2,
        name: 'Links',
        slug: '/links'
    },
    {
        id: 3,
        name: 'Link In Bio',
        slug: '/link-in-bio'
    },
    {
        id: 4,
        name: 'Setting',
        slug: '/setting',
        children: [
            {
                name: 'Profile',
                slug: 'setting',
            },
            {
                name: 'Subscription',
                slug: 'setting/subscription',
            }
        ]
    }
]

export const BLOCKS = [
    {
      id: 1,
      name: "Social Media Block",
      tag: "social",
    },
    {
      id: 2,
      name: "Website Block",
      tag: "website",
    },

    {
      id: 3,
      name: "Afilliate Marketing Block",
      tag: "marketing",
    },
  ];

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

export const CHART_DATA = [
    {
        "x": "January",
        "y": 0
    },
    {
        "x": "February",
        "y": 0
    },
    {
        "x": "March",
        "y": 0
    },
    {
        "x": "April",
        "y": 0
    },
    {
        "x": "May",
        "y": 0
    },
    {
        "x": "June",
        "y": 0
    },
    {
        "x": "July",
        "y": 0
    },
    {
        "x": "August",
        "y": 0
    },
    {
        "x": "September",
        "y": 0
    },
    {
        "x": "October",
        "y": 0
    },
    {
        "x": "November",
        "y": 0
    },
    {
        "x": "December",
        "y": 0
    }
];
