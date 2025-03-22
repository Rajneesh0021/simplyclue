export interface Frequency {
    id: string;
    name: string;
    status: "Pending" | "Completed" | "Missed";
  }
  
  export interface Challenge {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Completed";
    frequency: "Daily" | "Weekly" | "Days";
    selectedDays: string[];
    frequencies: Frequency[];
  }
  