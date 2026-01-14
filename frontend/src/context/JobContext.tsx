import { createContext, useRef, ReactNode } from "react";

interface JobSubscriptionState {
  activeSubscriptions: Set<string>;
  broadcastChannel: BroadcastChannel | null;
}

export const JobContext = createContext<JobSubscriptionState>({
  activeSubscriptions: new Set(),
  broadcastChannel: null,
});

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider = ({ children }: JobProviderProps): JSX.Element => {
  const activeSubscriptions = useRef<Set<string>>(new Set());
  const broadcastChannel = useRef<BroadcastChannel | null>(null);

  // Initialize global broadcast channel
  if (!broadcastChannel.current) {
    broadcastChannel.current = new BroadcastChannel('job_updates_global');
  }

  return (
    <JobContext.Provider 
      value={{ 
        activeSubscriptions: activeSubscriptions.current,
        broadcastChannel: broadcastChannel.current
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

