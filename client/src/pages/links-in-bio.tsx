import React from "react";
import {Link, useParams} from "react-router-dom";
import {useGetPageQuery} from "../app/services/page";
import {getSiteUrl} from "../Utils/getSiteUrl";
import classNames from "classnames";
import VisitLinkButton from "../components/visit-link-button";
import {motion} from "framer-motion";
import {BiChevronRight} from "react-icons/bi";


const LinksInBio = () => {
    const {slug} = useParams();
    const {data, isLoading} = useGetPageQuery({id: slug});

    const getBackgroundColor = () => {
        if (data?.backgroundType === "image") {
            return {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data?.backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }
        }

        if (data?.backgroundType === 'gradient'){
            return {background: data?.backgroundGradient}
        }

        return {backgroundColor: data?.backgroundColor}
    };

    return (
        <main
            className="bg-black"
            style={{...getBackgroundColor(), color: data?.textColor}}
        >
            <div
                className="min-h-screen flex flex-col items-center justify-start px-6 py-16 md:py-24 max-w-2xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="flex flex-col items-center text-center mb-12"
                >
                    <div className="relative mb-6">
                        <div
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 p-1">
                            <img
                                src="https://picsum.photos/seed/profile/400/400"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <motion.div
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            transition={{delay: 0.5, type: "spring"}}
                            className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black"
                        />
                    </div>

                    <h1 className="text-4xl text-white md:text-5xl font-serif font-bold tracking-tight mb-2">
                        @{data?.user.username}
                    </h1>
                    <p className="text-white/60 text-sm md:text-base font-light tracking-wide max-w-xs md:max-w-md">
                        {data?.description}
                    </p>

                    <div className="mt-2 flex gap-2">
                        {data?.links?.map(({_id: link, category}: any) => {
                            if (category === "social")
                                return (
                                    <div
                                        key={link._id}
                                        className="w-[50px] h-[50px] rounded-full border overflow-hidden group block  bg-white/5  border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                        <Link to={link.short} target="_blank">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                                                    link.longUrl
                                                )}`}
                                            />
                                        </Link>
                                    </div>
                                );
                        })}
                    </div>
                </motion.div>

                <div className="w-full space-y-4 mb-12">
                    {!isLoading && data?.links?.map(({_id: link, name, category}: {
                        _id: any,
                        name: string,
                        category: string
                    }, index: number) => {
                        if (category === "website" || category === "marketing") {
                            console.log(name);
                            return (
                                <VisitLinkButton key={link._id} url={link}>
                                    <motion.div
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.1 * index + 0.3}}
                                        style={{
                                            backgroundColor: `${data?.accentColor}08`,
                                            borderColor: `${data.accentColor}15`,
                                        }}
                                        className="group block w-full p-4 rounded-2xl border hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="p-2 rounded-xl transition-colors"
                                                    style={{backgroundColor: `${data.backgroundColor}10`}}
                                                >
                                                    <img
                                                        className="w-full h-full"
                                                        src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(link?.longUrl)}`}
                                                        alt="Favicon"
                                                    />
                                                </div>
                                                <div className="text-left">
                                                    <h3
                                                        className="font-medium"
                                                        style={{color: data.accentColor}}
                                                    >
                                                        {name}
                                                    </h3>
                                                    <p
                                                        className="text-xs opacity-40 group-hover:opacity-60 transition-colors"
                                                        style={{color: data.textColor}}
                                                    >
                                                        Redux toolkit for managing state in React applications.
                                                    </p>
                                                </div>
                                            </div>
                                            <BiChevronRight
                                                className="w-5 h-5 opacity-20 group-hover:opacity-60 transition-transform group-hover:translate-x-1"
                                                style={{color: data.accentColor}}
                                            />
                                        </div>
                                    </motion.div>
                                </VisitLinkButton>
                            )
                        }
                    })}
                </div>

                <motion.footer
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 1}}
                    className="mt-auto pt-8 border-t border-white/5 w-full text-center"
                >
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium">
                        © 2026 {data?.user?.username} — Built with SneekInk
                    </p>
                </motion.footer>
            </div>
        </main>
    );
};

export default LinksInBio;
