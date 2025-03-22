import { useContext, useState } from "react";
import { ChallengeContext } from "../context/ChallengeContext";
import ConfirmModal from "./ConfirmModal"; // Import the modal

interface ChallengeItemProps {
  challenge: any;
  onUpdate: (challenge: any) => void;
  onDelete: (id: string) => void;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ challenge, onUpdate, onDelete }) => {
  const challengeCtx = useContext(ChallengeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete(challenge.id);
    setIsModalOpen(false);
  };
  // Handle updating the chip status
  const updateChipStatus = (chipId: string, status: "Completed" | "Missed") => {
    const updatedFrequencies = challenge.frequencies.map((chip: any) =>
      chip.id === chipId ? { ...chip, status } : chip
    );

    challengeCtx?.updateChallenge({
      ...challenge,
      frequencies: updatedFrequencies,
    });
  };

  // Toggle Challenge Status (Active ↔ Completed)
  const toggleChallengeStatus = () => {
    challengeCtx?.updateChallenge({
      ...challenge,
      status: challenge.status === "Active" ? "Completed" : "Active",
    });
  };

  // Calculate Progress
  const total = challenge.frequencies.length;
  const completed = challenge.frequencies.filter((chip: any) => chip.status === "Completed").length;
  const missed = challenge.frequencies.filter((chip: any) => chip.status === "Missed").length;
  const pending = total - (completed + missed); // Remaining as Pending

  const completedPercentage = (completed / total) * 100;
  const missedPercentage = (missed / total) * 100;
  const pendingPercentage = 100 - (completedPercentage + missedPercentage);

  return (
    <div className="border p-4 rounded-lg shadow-md">
      {/* Title & Status Dot Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{challenge.title}</h3>
        {/* Status Dot */}
        <div
          className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${challenge.status === "Active" ? "bg-green-500" : "bg-blue-500"
            }`}
          onClick={toggleChallengeStatus}
          title="Toggle status"
        ></div>
      </div>

      {/* Description & Date Row */}
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <p>{challenge.description}</p>
        <p className="text-gray-500 text-xs">
          {challenge.startDate} - {challenge.endDate}
        </p>
      </div>

      {/* Scrollable Frequency Chips */}
      <div className="flex gap-2 mt-2 overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-1">
        {challenge.frequencies.map((chip: any) => (
          <div key={chip.id} className="relative">
            <button
              className={`px-3 py-1 text-xs rounded-full cursor-pointer border`}
              style={{
                backgroundColor:
                  chip.status === "Completed"
                    ? "#22c55e" // Green
                    : chip.status === "Missed"
                      ? "#ef4444" // Red
                      : "#d1d5db", // Gray
                color: chip.status !== "Pending" ? "white" : "black",
              }}
            >
              {chip.name}
            </button>
            <select
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={chip.status}
              onChange={(e) => updateChipStatus(chip.id, e.target.value as "Completed" | "Missed")}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        ))}
      </div>


      {/* Progress Bar */}
      <div className="w-full bg-gray-300 h-4 rounded-lg mt-3 relative flex overflow-hidden">
        {completedPercentage > 0 && (
          <div
            className="h-full bg-green-500"
            style={{
              width: `${completedPercentage}%`,
              borderTopLeftRadius: "0.5rem",
              borderBottomLeftRadius: "0.5rem",
            }}
          ></div>
        )}
        {missedPercentage > 0 && (
          <div className="h-full bg-red-500" style={{ width: `${missedPercentage}%` }}></div>
        )}
        {pendingPercentage > 0 && (
          <div
            className="h-full bg-gray-400"
            style={{
              width: `${pendingPercentage}%`,
              borderTopRightRadius: "0.5rem",
              borderBottomRightRadius: "0.5rem",
            }}
          ></div>
        )}
      </div>


      {/* Actions */}
      <div className="flex justify-between mt-3">
        <button onClick={() => onUpdate(challenge)} className="text-blue-500">
          Edit
        </button>
        <button onClick={handleDelete} className="text-red-500">
          Delete
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ChallengeItem;
