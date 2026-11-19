import React from "react";
import {useAppSelector} from "../app/hook";
import {selectCurrentUser} from "../features/auth/authslice";
import {useGetUserLimitsQuery} from "../app/services/urlapi";

const LinkLimitsDisplay = () => {
    const user = useAppSelector(selectCurrentUser);
    const {data: limits, isLoading} = useGetUserLimitsQuery(undefined, {
        skip: !user?.user?.username || user.user.username === "Guest"
    });

    if (isLoading || !limits) return null;

    const {current, limit, remaining} = limits.limits.links;
    const percentage = (current / limit) * 100;

    return (
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-sidebar-foreground">Link Usage</h3>
                <span className="text-xs font-medium text-sidebar-primary">{limits.plan.name} Plan</span>
            </div>

            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-sidebar-foreground/60">{current} of {limit} links used</span>
                <span className="text-xs text-sidebar-foreground/60">{remaining} remaining</span>
            </div>

            <div className="w-full bg-sidebar-foreground/10 rounded-full h-1.5 overflow-hidden">
                <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        percentage > 90 ? 'bg-sidebar-primary' :
                            percentage > 70 ? 'bg-sidebar-primary/70' : 'bg-sidebar-foreground/30'
                    }`}
                    style={{width: `${percentage}%`}}
                />
            </div>

            {percentage > 90 && (
                <p className="text-xs text-sidebar-foreground/80 mt-2">
                    You're approaching your link limit. Consider upgrading your plan.
                </p>
            )}
        </div>
    );
};

export default LinkLimitsDisplay;
