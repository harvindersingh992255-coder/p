"use client"

import React, { createContext, useContext, useState, useMemo } from 'react';

export type UserPlan = 'Free' | 'Premium' | 'Super';

interface PlanContextType {
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  isPlanSufficient: (requiredPlan: string) => boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [userPlan, setUserPlan] = useState<UserPlan>('Free');

  const isPlanSufficient = (requiredPlan: string) => {
    if (requiredPlan === 'Free') return true;
    if (requiredPlan === 'Premium' && (userPlan === 'Premium' || userPlan === 'Super')) return true;
    if (requiredPlan === 'Super' && userPlan === 'Super') return true;
    return false;
  };

  const value = useMemo(() => ({
    userPlan,
    setUserPlan,
    isPlanSufficient
  }), [userPlan]);

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
