export const SubcriptionOptions = [
    {
        id: "subcription_1",
        name: "Free",
        price: 0,
        perks: [
            "lorem ipsum dolor sit amet",
            "lorem ipsum dolor",
            "ipsum dolor",
            "ipsum dolor",
        ],
        popular: false,
        cta: "Start for free",
    },
    {
        id: "subcription_2",
        name: "Pro",
        price: 10,
        perks: [
            "lorem ipsum dolor sit amet",
            "lorem ipsum dolor",
            "ipsum dolor",
            "ipsum dolor",
        ],
        popular: true,
        cta: "Start with pro",
    },
    {
        id: "subcription_3",
        name: "Premium",
        price: 20,
        perks: [
            "lorem ipsum dolor sit amet",
            "lorem ipsum dolor",
            "ipsum dolor",
            "lorem ipsum dolor sit amet",
            "ipsum dolor",
            "lorem ipsum dolor",
        ],
        popular: false,
        cta: "Start with premium",
    },
];

export  const SIDEBAR_LINKS = [
    {
        id: 1,
        name: 'Overview',
        slug: '/links'
    },
    {
        id: 2,
        name: 'Link In Bio',
        slug: '/link-in-bio'
    },
    {
        id: 3,
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