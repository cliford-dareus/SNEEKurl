import { useState } from "react";
import { BannerTheme, useEditor } from "../../../../../../hooks/use-editor";
import banners from "./theme-banners";

const ThemeBanner = () => {
    const { dispatch } = useEditor();

    const handleThemeChange = (selectedTheme: BannerTheme) => {
        dispatch({ type: "SET_THEME", payload: { theme: selectedTheme } });
    };

    return (
        <div className="grid grid-cols-2 gap-2 mt-2">
            {banners.map((data) => (
                <div key={data.id} className="relative w-full h-32 rounded-md flex flex-col justify-between overflow-hidden cursor-pointer border hover:border-primary"
                    style={{
                        background: data?.backgroundGradient,
                        backgroundSize: data.backgroundSize ? data.backgroundSize : '',
                    }}
                    onClick={() => handleThemeChange(data)}
                >
                    {/* Ambient Glowing Blobs to emulate modern SaaS mesh layout inside photo */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-90 select-none">
                        <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[130%] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.35)_0%,transparent_70%)] blur-2xl animate-pulse" />
                        <div className="absolute top-[10%] right-[-10%] w-[70%] h-[120%] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.5)_0%,transparent_60%)] blur-3xl opacity-80" />
                        <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.35)_0%,transparent_70%)] blur-2xl" />
                    </div>

                    {/* Curved Wave Mask Transition (Convex Shape matching image) */}
                    <div
                        className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-[0] pointer-events-none z-10 transition-colors duration-500"
                        style={{ fill: data?.backgroundColor }}
                    >
                        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-full h-[25px] md:h-[55px]">
                            <path d="M0,120 Q720,20 1440,120 L1440,120 L0,120 Z" />
                        </svg>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default ThemeBanner;
