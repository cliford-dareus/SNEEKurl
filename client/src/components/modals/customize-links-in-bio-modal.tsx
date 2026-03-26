import Dialog, {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../ui/dialog";
import {getSiteUrl} from "../../Utils/getSiteUrl";
import React from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {motion} from "framer-motion";
import {
    BsGithub,
    BsGlobe,
    BsInstagram,
    BsLink,
    BsLinkedin, BsMailbox2,
    BsPalette,
    BsPlus,
    BsSave,
    BsTrash2,
    BsTwitter, BsTwitterX
} from "react-icons/bs";
import Button from "../ui/button";
import Input from "../ui/Input";
import {toast} from "react-toastify";
import {useCustomizePageMutation, useUpdatePageMutation} from "../../app/services/page";

export interface PageProps {
    _id: string;
    title: string;
    description: string;
    isPublic: boolean;
    slug: string;
    links: any;
    user: any;
    backgroundType: 'solid' | 'gradient' | 'image';
    backgroundColor: string;
    backgroundGradient: string;
    backgroundImageUrl: string;
    themeColor: string;
    accentColor: string;
    textColor: string;
}

type Props = {
    customizePageOpen: boolean;
    setCustomizePageOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: PageProps;
}

const ICON_MAP = {
    globe: <BsGlobe className="w-5 h-5"/>,
    github: <BsGithub className="w-5 h-5"/>,
    linkedin: <BsLinkedin className="w-5 h-5"/>,
    twitter: <BsTwitter className="w-5 h-5"/>,
    instagram: <BsInstagram className="w-5 h-5"/>,
    mail: <BsMailbox2 className="w-5 h-5"/>
};

const CustomizeLinksInBioModal = ({customizePageOpen, setCustomizePageOpen, data}: Props) => {
    const [customizePage] = useCustomizePageMutation();
    const [backgroundType, setBackgroundType] = React.useState<'solid' | 'gradient' | 'image'>(data?.backgroundType);
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Partial<PageProps>>({
        defaultValues: {
            backgroundType: data?.backgroundType,
            backgroundColor: data?.backgroundColor,
            backgroundGradient: data?.backgroundGradient,
            backgroundImageUrl: data?.backgroundImageUrl,
            themeColor: data?.themeColor,
            accentColor: data?.accentColor,
            textColor: data?.textColor,
        }
    });

    const savePage: SubmitHandler<Partial<PageProps>> = async (custom: Partial<PageProps>) => {
        try {
            await customizePage({
                id: data._id,
                backgroundType: backgroundType,
                backgroundColor: custom.backgroundColor,
                backgroundGradient: custom.backgroundGradient,
                backgroundImageUrl: custom.backgroundImageUrl,
                themeColor: custom.themeColor,
                accentColor: custom.accentColor,
                textColor: custom.textColor,
            }).unwrap();
            toast.success("Customization successfully...");
            setCustomizePageOpen(false);
            reset();
        } catch (error) {
            toast.error("Customization failed...");
            console.log(error);
        }
    };

    return (
        <Dialog open={customizePageOpen} onOpenChange={setCustomizePageOpen}>
            <DialogContent size="lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 200 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                fill="currentColor"
                            />
                        </svg>
                        <div>
                            <DialogTitle>Customize Page</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Customize your Page
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 py-4">
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className=""
                    />
                    <motion.div
                        initial={{x: "100%"}}
                        animate={{x: 0}}
                        exit={{x: "100%"}}
                        transition={{type: "spring", damping: 25, stiffness: 200}}
                        className="w-full  border-l border-white/10 z-50"
                    >
                        <form onSubmit={handleSubmit(savePage)}>
                            {/* Appearance Settings */}
                            <section className="mb-10">
                                <div className="flex items-center gap-2 mb-4 uppercase text-[10px] font-bold tracking-widest">
                                    <BsPalette className="w-3 h-3"/>
                                    Appearance
                                </div>
                                <div className="space-y-6">
                                    {/* Background Type */}
                                    <div>
                                        <label className="block text-xs mb-2 ml-1 uppercase font-bold">Background Type</label>
                                        <div className="grid grid-cols-3 gap-2 px-1">
                                            {(['solid', 'gradient', 'image'] as const).map((type) => (
                                                <Button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setBackgroundType(type)}
                                                    classnames={`py-2 rounded-lg text-xs font-medium border transition-all ${
                                                        data?.backgroundType === type
                                                            ? 'bg-red-500 text-black border-white'
                                                            : 'text-zinc-500 border-zinc-200 hover:border-zinc-300'
                                                    }`}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Background Value */}
                                    {backgroundType === 'solid' && (
                                        <div>
                                            <label className="block text-xs  mb-1 ml-1">Background Color</label>
                                            <Controller
                                                name="backgroundColor"
                                                control={control}
                                                render={({field}) => (
                                                    <div className="flex gap-3 items-center">
                                                        <Input
                                                            type="color"
                                                            className="w-20 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                                                            {...field}
                                                        />
                                                        <span
                                                            className="text-sm font-mono opacity-60 uppercase">{data?.backgroundColor}</span>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {backgroundType === 'gradient' && (
                                        <div>
                                            <label className="block text-xs mb-1 ml-1">Gradient CSS</label>
                                            <Controller
                                                name="backgroundGradient"
                                                control={control}
                                                render={({field}) => (
                                                    <Input
                                                        type="text"
                                                        {...field}
                                                        placeholder="linear-gradient(...)"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-white/30"
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}

                                    {backgroundType === 'image' && (
                                        <div>
                                            <label className="block text-xs mb-1 ml-1">Background Image URL</label>
                                            <Controller
                                                name="backgroundImageUrl"
                                                control={control}
                                                render={({field}) => (
                                                    <Input
                                                        type="text"
                                                        {...field}
                                                        placeholder="https://images.unsplash.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-white/30"
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Accent & Text Colors */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-1 ml-1">Accent Color</label>
                                            <Controller
                                                name="accentColor"
                                                control={control}
                                                render={({field}) => (
                                                <div className="flex gap-3 items-center">
                                                    <Input
                                                        type="color"
                                                        {...field}
                                                        className="w-20 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                                                    />
                                                    <span
                                                        className="text-xs font-mono opacity-60 uppercase">{data?.accentColor}</span>
                                                </div>
                                            )}
                                           />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-400 mb-1 ml-1">Text Color</label>
                                            <Controller
                                                name="textColor"
                                                control={control}
                                                render={({field}) => (
                                                <div className="flex gap-3 items-center">
                                                    <Input
                                                        type="color"
                                                        {...field}
                                                        className="w-20 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                                                    />
                                                    <span
                                                        className="text-xs font-mono opacity-60 uppercase">{data?.textColor}</span>
                                                </div>
                                            )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Profile Settings */}
                            {/*<section className="mb-10">*/}
                            {/*    <div*/}
                            {/*        className="flex items-center gap-2 mb-4 uppercase text-[10px] font-bold tracking-widest">*/}
                            {/*        /!*<BsUser className="w-3 h-3"/>*!/*/}
                            {/*        Profile*/}
                            {/*    </div>*/}
                            {/*    <div className="space-y-4">*/}
                            {/*        <div>*/}
                            {/*            <label className="block text-xs text-zinc-400 mb-1 ml-1">Name</label>*/}
                            {/*            <input*/}
                            {/*                type="text"*/}
                            {/*                value={data?.name}*/}
                            {/*                // onChange={(e) => setData(prev => ({...prev, name: e.target.value}))}*/}
                            {/*                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-white/30 transition-colors"*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <label className="block text-xs text-zinc-400 mb-1 ml-1">Bio</label>*/}
                            {/*            <textarea*/}
                            {/*                value={data?.bio}*/}
                            {/*                // onChange={(e) => setData(prev => ({...prev, bio: e.target.value}))}*/}
                            {/*                rows={3}*/}
                            {/*                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-white/30 transition-colors resize-none"*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <label className="block text-xs text-zinc-400 mb-1 ml-1">Avatar URL</label>*/}
                            {/*            <input*/}
                            {/*                type="text"*/}
                            {/*                value={data?.avatarUrl}*/}
                            {/*                // onChange={(e) => setData(prev => ({...prev, avatarUrl: e.target.value}))}*/}
                            {/*                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-white/30 transition-colors"*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <label className="block text-xs text-zinc-400 mb-1 ml-1">Status Dot*/}
                            {/*                Color</label>*/}
                            {/*            <div className="flex gap-3 items-center">*/}
                            {/*                <input*/}
                            {/*                    type="color"*/}
                            {/*                    value={data?.themeColor}*/}
                            {/*                    // onChange={(e) => setData(prev => ({*/}
                            {/*                    //     ...prev,*/}
                            {/*                    //     themeColor: e.target.value*/}
                            {/*                    // }))}*/}
                            {/*                    className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"*/}
                            {/*                />*/}
                            {/*                <span*/}
                            {/*                    className="text-sm font-mono opacity-60 uppercase">{data?.themeColor}</span>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</section>*/}

                            {/* Links Settings */}
                            {/*<section className="mb-10">*/}
                            {/*    <div className="flex items-center justify-between mb-4">*/}
                            {/*        <div*/}
                            {/*            className="flex items-center gap-2 text-zinc-400 uppercase text-[10px] font-bold tracking-widest">*/}
                            {/*            <BsLink className="w-3 h-3"/>*/}
                            {/*            Links*/}
                            {/*        </div>*/}
                            {/*        <button*/}
                            {/*            // onClick={handleAddLink}*/}
                            {/*            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors"*/}
                            {/*        >*/}
                            {/*            <BsPlus className="w-3 h-3"/>*/}
                            {/*            Add Link*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*    <div className="space-y-6">*/}
                            {/*        {data?.links.map((link) => (*/}
                            {/*            <div key={link.id}*/}
                            {/*                 className="p-4 rounded-2xl bg-white/5 border border-white/10 relative group/item">*/}
                            {/*                <button*/}
                            {/*                    // onClick={() => handleRemoveLink(link.id)}*/}
                            {/*                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg"*/}
                            {/*                >*/}
                            {/*                    <BsTrash2 className="w-3 h-3 text-white"/>*/}
                            {/*                </button>*/}
                            {/*                <div className="space-y-3">*/}
                            {/*                    <div className="grid grid-cols-2 gap-3">*/}
                            {/*                        <div>*/}
                            {/*                            <label*/}
                            {/*                                className="block text-[10px] text-white/40 mb-1 ml-1 uppercase font-bold">Label</label>*/}
                            {/*                            <input*/}
                            {/*                                type="text"*/}
                            {/*                                value={link.name}*/}
                            {/*                                // onChange={(e) => handleUpdateLink(link.id, 'name', e.target.value)}*/}
                            {/*                                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm focus:outline-none focus:border-white/20"*/}
                            {/*                            />*/}
                            {/*                        </div>*/}
                            {/*                        <div>*/}
                            {/*                            <label*/}
                            {/*                                className="block text-[10px] text-white/40 mb-1 ml-1 uppercase font-bold">Icon</label>*/}
                            {/*                            <select*/}
                            {/*                                value={link.iconType}*/}
                            {/*                                // onChange={(e) => handleUpdateLink(link.id, 'iconType', e.target.value as any)}*/}
                            {/*                                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm focus:outline-none focus:border-white/20 appearance-none"*/}
                            {/*                            >*/}
                            {/*                                {Object.keys(ICON_MAP).map(type => (*/}
                            {/*                                    <option key={type} value={type}>{type}</option>*/}
                            {/*                                ))}*/}
                            {/*                            </select>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                    <div>*/}
                            {/*                        <label*/}
                            {/*                            className="block text-[10px] text-white/40 mb-1 ml-1 uppercase font-bold">URL</label>*/}
                            {/*                        <input*/}
                            {/*                            type="text"*/}
                            {/*                            value={link?.url}*/}
                            {/*                            // onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}*/}
                            {/*                            className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm focus:outline-none focus:border-white/20"*/}
                            {/*                        />*/}
                            {/*                    </div>*/}
                            {/*                    <div>*/}
                            {/*                        <label*/}
                            {/*                           className="block text-[10px] text-white/40 mb-1 ml-1 uppercase font-bold">Description</label>*/}
                            {/*                        <input*/}
                            {/*                            type="text"*/}
                            {/*                            value={link?.description}*/}
                            {/*                            // onChange={(e) => handleUpdateLink(link.id, 'description', e.target.value)}*/}
                            {/*                            className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm focus:outline-none focus:border-white/20"*/}
                            {/*                        />*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*</section>*/}

                            <button
                                // onClick={() => setIsEditing(false)}
                                className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <BsSave className="w-5 h-5"/>
                                Save Changes
                            </button>
                        </form>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default CustomizeLinksInBioModal;