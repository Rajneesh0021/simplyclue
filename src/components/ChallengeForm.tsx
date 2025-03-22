import { useState, useContext, useEffect } from "react";
import { ChallengeContext } from "../context/ChallengeContext";
import { Challenge } from "../types/challenge"; 

interface ChallengeFormProps {
  onClose: () => void;
  challengeToEdit?: any;
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ChallengeForm: React.FC<ChallengeFormProps> = ({ onClose, challengeToEdit }) => {
  const challengeCtx = useContext(ChallengeContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Days">("Daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    if (challengeToEdit) {
      setTitle(challengeToEdit.title);
      setDescription(challengeToEdit.description);
      setStartDate(challengeToEdit.startDate);
      setEndDate(challengeToEdit.endDate);
      setFrequency(challengeToEdit.frequency);
      setSelectedDays(challengeToEdit.selectedDays || []);
    }
  }, [challengeToEdit]);

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generateFrequencies = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let frequencies = [];

    if (frequency === "Daily") {
      while (start <= end) {
        frequencies.push({ id: start.toISOString(), name: start.toDateString(), status: "Pending" });
        start.setDate(start.getDate() + 1);
      }
    } else if (frequency === "Weekly") {
      let week = 1;
      while (start <= end) {
        frequencies.push({ id: `week-${week}`, name: `Week ${week}`, status: "Pending" });
        start.setDate(start.getDate() + 7);
        week++;
      }
    } else if (frequency === "Days") {
      while (start <= end) {
        const dayName = start.toLocaleDateString("en-US", { weekday: "long" });
        if (selectedDays.includes(dayName)) {
          frequencies.push({ id: start.toISOString(), name: start.toDateString(), status: "Pending" });
        }
        start.setDate(start.getDate() + 1);
      }
    }
    return frequencies;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newChallenge: Challenge = {
      id: challengeToEdit?.id || Date.now().toString(),
      title,
      description,
      startDate,
      endDate,
      status: "Active",
      frequency,
      selectedDays: frequency === "Days" ? selectedDays : [],
      frequencies: generateFrequencies().map(freq => ({ ...freq, status: "Pending" })),
    };

    if (challengeToEdit) {
      challengeCtx?.updateChallenge(newChallenge);
    } else {
      challengeCtx?.addChallenge(newChallenge);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#121212] bg-opacity-80 flex justify-center items-center p-4">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-lg text-[#E0E0E0]">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {challengeToEdit ? "Edit Challenge" : "Add Challenge"}
        </h2>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#333] bg-[#2D2D2D] p-2 rounded focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#333] bg-[#2D2D2D] p-2 rounded focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
  
          {/* Start & End Date */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-[#333] bg-[#2D2D2D] p-2 rounded focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
  
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-[#333] bg-[#2D2D2D] p-2 rounded focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-400">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as "Daily" | "Weekly" | "Days")}
              className="w-full border border-[#333] bg-[#2D2D2D] p-2 rounded focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Days">Days</option>
            </select>
          </div>
  
          {/* Selected Days as Chips */}
          {frequency === "Days" && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Selected Days</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {weekdays.map((day) => (
                  <span
                    key={day}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
                      selectedDays.includes(day)
                        ? "bg-blue-500 text-white border-[#3B82F6] hover:bg-blue-600"
                        : "bg-[#2D2D2D] text-gray-300 border-[#444] hover:bg-[#3B3B3B]"
                    }`}
                    onClick={() => toggleDaySelection(day)}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
  
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {challengeToEdit ? "Update Challenge" : "Add Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default ChallengeForm;
