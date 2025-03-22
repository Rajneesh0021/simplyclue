import { createContext, useState, useEffect, ReactNode } from "react";

// Define the structure of a challenge
interface Frequency {
  id: string;
  name: string;
  status: "Pending" | "Completed" | "Missed";
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed"; 
  frequency: "Daily" | "Weekly" | "Days";
  selectedDays?: string[];
  frequencies: Frequency[];
}

interface ChallengeContextProps {
  challenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (challenge: Challenge) => void;
  deleteChallenge: (id: string) => void;
}

export const ChallengeContext = createContext<ChallengeContextProps | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // ✅ Load challenges from localStorage when app starts
  useEffect(() => {
    const storedChallenges = localStorage.getItem("challenges");
    if (storedChallenges) {
      setChallenges(JSON.parse(storedChallenges));
    }
  }, []);

  // ✅ Save challenges to localStorage whenever they change
  useEffect(() => {
    if (challenges.length > 0) {
      localStorage.setItem("challenges", JSON.stringify(challenges));
    }
  }, [challenges]);

  const addChallenge = (challenge: Challenge) => {
    setChallenges((prev) => {
      const updatedChallenges = [...prev, challenge];
      localStorage.setItem("challenges", JSON.stringify(updatedChallenges)); // ✅ Save immediately
      return updatedChallenges;
    });
  };

  const updateChallenge = (updatedChallenge: Challenge) => {
    setChallenges((prev) => {
      const updatedChallenges = prev.map((challenge) =>
        challenge.id === updatedChallenge.id ? updatedChallenge : challenge
      );
      localStorage.setItem("challenges", JSON.stringify(updatedChallenges)); // ✅ Save immediately
      return updatedChallenges;
    });
  };

  const deleteChallenge = (id: string) => {
    setChallenges((prev) => {
      const updatedChallenges = prev.filter((challenge) => challenge.id !== id);
      localStorage.setItem("challenges", JSON.stringify(updatedChallenges)); // ✅ Save immediately
      return updatedChallenges;
    });
  };

  return (
    <ChallengeContext.Provider value={{ challenges, addChallenge, updateChallenge, deleteChallenge }}>
      {children}
    </ChallengeContext.Provider>
  );
};
