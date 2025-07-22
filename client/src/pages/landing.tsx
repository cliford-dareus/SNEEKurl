import {
    Url,
    useGetGuestUrlQuery,
    useGetUrlQuery,
    useGetUrlsQuery,
} from "../app/services/urlapi";
import {
    LuArrowRight,
    LuBarChart3,
    LuCheck,
    LuClock,
    LuGlobe,
    LuLink2,
    LuMoreVertical,
    LuPalette,
    LuQrCode,
    LuShare2,
    LuShield,
    LuSmartphone,
    LuStar,
    LuTrendingUp,
    LuUsers,
} from "react-icons/lu";
import {ReactNode, useEffect, useRef, useState} from "react";
import {useAppSelector} from "../app/hook";
import BrowserShot from "../assets/706shots_so.webp";
import {Outlet} from "react-router-dom";
import {BiCustomize, BiShareAlt} from "react-icons/bi";
import {MdOutlineSwitchAccessShortcut} from "react-icons/md";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import {selectCurrentUser} from "../features/auth/authslice";
import HomeCreateLinkManager from "../features/url/urllandingmanager";
import VisitLinkButton from "../components/visit-link-button";
import classNames from "classnames";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";
import Portal from "../components/portal";
import {useUserPlan} from "../components/layout/layout";
import {useInView} from "framer-motion";
import ShareLinkModal from "../components/ui/modals/share-link-modal";
import {motion} from "framer-motion";
import Button from "../components/ui/button";
import { features, pricingPlans, stats, testimonials, useCases } from "../Utils/common";

const HomeLinkItem = ({
                          url,
                          isAuthenticated,
                          isFreePlan,
                      }: {
    url: Url;
    isAuthenticated: boolean;
    isFreePlan: boolean;
}) => {
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [shareActive, setShareActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        expires: false,
    });

    useEffect(() => {
        const updateTimeLeft = () => {
            const expiredTime = new Date(url.expired_in!).getTime();
            const timeLeftMs = expiredTime - Date.now();
            const timeLeftSeconds = Math.max(timeLeftMs / 1000, 0); // Prevent negative values
            const hours = Math.floor(timeLeftSeconds / 3600);
            const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
            setTimeLeft({hours, minutes, expires: Date.now() > expiredTime});
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div
                className={classNames(
                    timeLeft.expires ? "opacity-50" : "",
                    "flex items-center justify-between rounded-lg bg-base-300 px-4 py-2 h-[60px] w-full",
                )}
            >
                <div className="w-[80%]">
                    <div className="flex items-center gap-2">
                        <VisitLinkButton url={url}>
                            <div className="flex items-center gap-2 text-accent">
                                <LuLink2 size={18}/>
                                sneek.co/{url.short}
                            </div>
                        </VisitLinkButton>
                        <div className="ml-auto flex items-center gap-4">
                            <div
                                className="cursor-pointer hover:text-primary"
                                onClick={() => setShareActive(true)}
                            >
                                <LuShare2 size={18} />
                            </div>
                            <div className="">
                                <LuQrCode
                                    size={18}
                                    onClick={() => setOpen(true)}
                                    className="cursor-pointer hover:text-primary"
                                />
                            </div>

                            {!isAuthenticated && (
                                <TooltipProvider>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1">
                                            <LuClock size={18}/>
                                            {timeLeft.hours === 0 ? "" : `${timeLeft.hours} hours`}
                                            {timeLeft.minutes}m
                                        </div>
                                    </TooltipTrigger>
                                    <div className="relative">
                                        <Tooltip content="Tooltip content" direction="bottom"/>
                                    </div>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    <div className="text-left">
                        <p className="truncate text-xs">{url.longUrl}</p>
                    </div>
                </div>
                <div className="cursor-pointer flex items-center">
                    <LuMoreVertical
                        size={18}
                        onClick={() => (isAuthenticated ? setActive(true) : null)}
                    />
                </div>
            </div>

            <Portal>
                <EditQrModal
                    url={url}
                    setQrActive={setOpen}
                    editQrActive={open}
                />
                <ShareLinkModal
                    shareActive={shareActive}
                    setShareActive={setShareActive}
                    url={url}
                />
            </Portal>
        </>
    );
};

const Section = ({children}: { children: ReactNode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true});

    return (
        <div className="h-1/3 py-4" ref={ref}>
            <div
                style={{
                    transform: isInView ? "none" : "translateY(200px)",
                    opacity: isInView ? 1 : 0,
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
                className="sticky h-fit p-4 top-[30%] rounded-md flex items-center"
            >
                <h3 className="text-5xl font-medium">{children}</h3>
            </div>
        </div>
    );
};

const Landing = () => {
    const {plan} = useUserPlan();
    const isFreePlan = plan === "free";
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = user.user.username;
    const {data, isSuccess} = useGetUrlsQuery("limit=5");

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);
    const [activeFeature, setActiveFeature] = useState(0);
    const isHeroInView = useInView(heroRef, { once: true });
    const isFeaturesInView = useInView(featuresRef, { once: true });
    const isStatsInView = useInView(statsRef, { once: true });

    return (
        <>
            <section className="container mx-auto flex flex-col justify-center p-4 text-center">
                <div className="mt-28">
          <span className="rounded-full bg-primary px-4 py-1 text-white">
            +1k github
          </span>
                    <p className="mt-4 text-bold text-xl text-neutral dark:text-neutral-content">
                        Your shortcut to instant connections.
                    </p>
                    <h1 className="mx-auto text-7xl  max-w-[800px] dark:text-neutral-content">
                        Link small, connect big!
                    </h1>
                </div>

                <div className="mt-4">
                    <div className="mx-auto flex flex-col gap-4 max-w-[500px] w-full">
                        <div className="w-full">
                            <HomeCreateLinkManager
                                isAuthenticated={isAuthenticated}
                                isFreePlan={isFreePlan}
                            />
                        </div>
                        <div className="flex flex-col gap-2 max-w-[500px] mx-auto w-full">
                            {data?.urls
                                    .slice(0, 3)
                                    .map((url) => (
                                        <HomeLinkItem
                                            key={url._id}
                                            url={url}
                                            isAuthenticated={!!isAuthenticated}
                                            isFreePlan={isFreePlan}
                                        />
                                    ))
                               }
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-8">
                    <img className="" src={BrowserShot} alt="shot"/>
                </div>
            </section>

             <section ref={statsRef} className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <stat.icon className="text-primary" size={24} />
                        </div>
                        <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                        <div className="text-base-content/70">{stat.label}</div>
                    </motion.div>
                    ))}
                </motion.div>
                </div>
            </section>

            <section ref={featuresRef} className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Powerful Features</h2>
            <p className="text-xl text-base-content/80 max-w-2xl mx-auto">
              Everything you need to create, manage, and track your links with professional-grade tools.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Navigation */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={classNames(
                    "p-6 rounded-xl cursor-pointer transition-all duration-300",
                    activeFeature === index
                      ? "bg-primary text-white shadow-lg"
                      : "bg-base-100 hover:bg-base-300"
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={classNames(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      activeFeature === index ? "bg-white/20" : "bg-primary/10"
                    )}>
                      <feature.icon
                        size={24}
                        className={activeFeature === index ? "text-white" : "text-primary"}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className={classNames(
                        "mb-4",
                        activeFeature === index ? "text-white/90" : "text-base-content/70"
                      )}>
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className={classNames(
                              "px-3 py-1 rounded-full text-sm",
                              activeFeature === index
                                ? "bg-white/20 text-white"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Preview */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-base-100 rounded-2xl p-8 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                  {/* <features[activeFeature].icon size={80} className="text-primary/50" /> */}
                </div>
                <div className="mt-6">
                  <h4 className="text-2xl font-bold mb-3">{features[activeFeature].title}</h4>
                  <p className="text-base-content/70 mb-4">{features[activeFeature].description}</p>
                  <Button classnames="bg-primary text-white">
                    Try {features[activeFeature].title}
                    <LuArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
               {/* Use Cases Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Perfect for Every Use Case</h2>
            <p className="text-xl text-base-content/80 max-w-2xl mx-auto">
              From marketing campaigns to social media, Sneek adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-base-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <useCase.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-base-content/70 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <LuCheck className="text-success" size={16} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Loved by Thousands</h2>
            <p className="text-xl text-base-content/80">See what our users say about Sneek</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-base-100 rounded-xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <LuStar key={i} className="text-warning fill-current" size={16} />
                  ))}
                </div>
                <p className="text-base-content/80 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-base-content/70">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-base-content/80">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={classNames(
                  "relative rounded-xl p-8 border-2",
                  plan.popular
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-base-300 bg-base-100"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-base-content/70 mb-4">{plan.description}</p>
                  <div className="text-5xl font-bold mb-2">
                    ${plan.price}
                    <span className="text-lg font-normal text-base-content/70">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <LuCheck className="text-success" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  classnames={classNames(
                    "w-full",
                    plan.popular
                      ? "bg-primary text-white"
                      : "bg-base-300 text-base-content"
                  )}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Links?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who trust Sneek for their link management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button classnames="bg-white text-primary px-8 py-4 text-lg font-semibold">
                Start Free Trial
                <LuArrowRight className="ml-2" size={20} />
              </Button>
              <Button classnames="bg-transparent border-2 border-white text-white px-8 py-4 text-lg">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

            <Portal>
                <Outlet/>
            </Portal>
        </>
    );
};

export default Landing;
