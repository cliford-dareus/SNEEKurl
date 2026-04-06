import React from "react";
import {useAppSelector} from "../app/hook";
import {selectCurrentUser} from "../features/auth/authslice";
import {useGetUserLimitsQuery} from "../app/services/urlapi";

const LinkLimitsDisplay = () => {
    const user = useAppSelector(selectCurrentUser);
    const {data: limits, isLoading} = useGetUserLimitsQuery(undefined, {
        skip: !user?.user?.username || user.user.username === "Guest"
    });
    console.log(!user?.user?.username);

    if (isLoading || !limits) return null;

    const {current, limit, remaining} = limits.limits.links;
    const percentage = (current / limit) * 100;

    return (
        <div className="bg-background rounded-lg p-4 shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-foreground">Link Usage</h3>
                <span className="text-xs text-primary">{limits.plan.name} Plan</span>
            </div>

            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-foreground/50">{current} of {limit} links used</span>
                <span className="text-sm text-foreground/50">{remaining} remaining</span>
            </div>

            <div className="w-full bg-background/30 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                        percentage > 90 ? 'bg-primary' :
                            percentage > 70 ? 'bg-accent' : 'bg-background/30'
                    }`}
                    style={{width: `${percentage}%`}}
                />
            </div>

            {percentage > 90 && (
                <p className="text-xs text-destructive mt-2">
                    You're approaching your link limit. Consider upgrading your plan.
                </p>
            )}
        </div>
    );
};

export default LinkLimitsDisplay;
