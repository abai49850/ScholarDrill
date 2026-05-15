import { createContext, useContext, ReactNode } from "react";

export interface FeatureFlags {
  examModes: boolean;
  curriculumPathways: boolean;
  parentDashboard: boolean;
  stateSpecificContent: boolean;
  gamification: boolean;
}

const defaultFlags: FeatureFlags = {
  examModes: true,
  curriculumPathways: true,
  parentDashboard: false, // In development
  stateSpecificContent: true,
  gamification: false, // Future expansion
};

const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export function FeatureFlagProvider({ children, flags = defaultFlags }: { children: ReactNode; flags?: FeatureFlags }) {
  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeatureFlags = () => useContext(FeatureFlagContext);
