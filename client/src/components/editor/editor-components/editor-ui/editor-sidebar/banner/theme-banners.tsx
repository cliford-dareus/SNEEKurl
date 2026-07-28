import { BannerTheme } from "../../../../../../hooks/use-editor";

const banners = [
    {
        id: "1",
        name: "",
        backgroundGradient: "linear-gradient(135deg, #090e1a 0%, #0c102b 100%)",
        backgroundSize: null,
        backgroundColor: "",
        textColor: "",
        accentColor: "",

    },
    {
        id: "2",
        name: "",
        backgroundGradient: `repeating-linear-gradient(
            135deg,
            #232526 0px,
            #232526 20px,
            #23252699 30px,
            #414345 70px
        )`,
        backgroundSize: null,
        backgroundColor: "",
        textColor: "",
        accentColor: "",
    }, {
        id: "3",
        name: "",
        backgroundGradient: `radial-gradient(
            25% 25% at 25% 25%,
            #180a22 99%,
            rgba(0, 0, 0, 0) 101%
        ) 40px 40px / calc(2 * 40px)
            calc(2 * 40px),
            radial-gradient(
            25% 25% at 25% 25%,
            var(--c1) 99%,
            rgba(0, 0, 0, 0) 101%
        ) 0 0 / calc(2 * 40px) calc(2 * 40px),
            radial-gradient(50% 50%, #5b42f3 98%, rgba(0, 0, 0, 0)) 0 0 / 40px
            40px,
            repeating-conic-gradient(#5b42f3 0 50%, #180a22 0 100%)
            calc(0.5 * 40px) 0 / calc(2 * 40px) 40px`,
        backgroundSize: null,
        backgroundColor: "",
        textColor: "",
        accentColor: "",
    },
    {
        id: "4",
        name: "",
        backgroundGradient: `radial-gradient(black 55%, #0000),
            /* radial-gradient(black 55%, #0000), */
            linear-gradient(135deg, red, orange, yellow, lime, cyan, blue, indigo, deeppink)`,
        backgroundSize: "100% 0.5%, contain",
        backgroundColor: "",
        textColor: "",
        accentColor: "",
    },
    {
        id: "5",
        name: "",
        backgroundGradient: `var(--dot) var(--ts),
            var(--dot) var(--ts),
            radial-gradient(circle at 90% 100%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 65% 100%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 40% 100%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 15% 100%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 90% 12.5%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 65% 25%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 40% 37.5%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            radial-gradient(circle at 15% 50%, #c71175 0 calc(var(--sz) * 0.78), transparent calc(var(--sz) * 0.78 + 1px) 100%) var(--ts),
            var(--p1) var(--ts), var(--p1) var(--ts),
            var(--p2) var(--ts), var(--p2) var(--ts),
            var(--p3) var(--ts), var(--p3) var(--ts),
            var(--p4) var(--ts), var(--p4) var(--ts),
            var(--p5) var(--ts), var(--p5) var(--ts),
            var(--p6) var(--ts), var(--p6) var(--ts),
            var(--p7) var(--ts), var(--p7) var(--ts),
            var(--p8) var(--ts), var(--p8) var(--ts),
            linear-gradient(-45deg, transparent 0 32.25%, #0002 50%, #000 77.5%) var(--ts),
            linear-gradient(-45deg, transparent 0 32.25%, #000 60%) var(--ts),
            repeating-linear-gradient(90deg, var(--c0) 0 5%, var(--c1) 0 25%) var(--ts)`,
        backgroundSize: null,
        backgroundColor: "",
        textColor: "",
        accentColor: "",
    }
] as BannerTheme[];

export default banners;
