import React from 'react';
import { useGetUserLimitsQuery } from '../app/services/user';
import { useAppSelector } from '../app/hook';
import { selectCurrentUser } from '../features/auth/authslice';

const LinkLimitsDisplay = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: limits, isLoading } = useGetUserLimitsQuery(undefined, {
    skip: !user?.user?.username || user.user.username === "Guest"
  });

  if (isLoading || !limits) return null;

  const { current, limit, remaining } = limits.limits.links;
  const percentage = (current / limit) * 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Link Usage</h3>
        <span className="text-xs text-gray-500">{limits.plan.name} Plan</span>
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{current} of {limit} links used</span>
        <span className="text-sm text-gray-500">{remaining} remaining</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            percentage > 90 ? 'bg-red-500' : 
            percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage > 90 && (
        <p className="text-xs text-red-600 mt-2">
          You're approaching your link limit. Consider upgrading your plan.
        </p>
      )}
    </div>
  );
};

export default LinkLimitsDisplay;