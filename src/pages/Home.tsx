import { useContext, useState } from "react";
import { ChallengeContext } from "../context/ChallengeContext";
import ChallengeItem from "../components/ChallengeItem";
import ChallengeForm from "../components/ChallengeForm";

const Home = () => {
  const challengeCtx = useContext(ChallengeContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editChallenge, setEditChallenge] = useState(null);
  const [filterStatus, setFilterStatus] = useState<"Active" | "Completed" | "All">("All"); // ✅ Default to "All"

  if (!challengeCtx) {
    return <p className="text-red-500">Error: Challenge context not found.</p>;
  }

  // Handle Edit
  const handleEdit = (challenge: any) => {
    setEditChallenge(challenge);
    setIsFormOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    
      challengeCtx.deleteChallenge(id);
    
  };
  

  // Sorting function: Active → Completed → Missed
  const sortChallenges = (challenges: any[]) => {
    return challenges.sort((a, b) => {
      return a.status === "Active" ? -1 : b.status === "Active" ? 1 : 0;
    });
  };
  

  // Filter and sort challenges
  const filteredChallenges = sortChallenges(
    filterStatus === "All" ? challengeCtx.challenges : challengeCtx.challenges.filter(challenge => challenge.status === filterStatus)
  );

  return (
    <div className="p-6 min-h-screen bg-[#121212] text-[#E0E0E0]">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-center">Challenge Tracker</h1>
  
      {/* Filter & Add Challenge Row */}
      <div className="flex justify-between items-center mb-6">
        {/* Filter Dropdown */}
        <select
          className="bg-[#1E1E1E] border border-[#333] p-2 rounded text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "Active" | "Completed" | "All")}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
  
        {/* Add Challenge Button */}
        <button
          className="bg-[#3B82F6] text-white px-5 py-2 rounded-lg shadow-lg hover:bg-[#2563EB] transition"
          onClick={() => {
            setEditChallenge(null);
            setIsFormOpen(true);
          }}
        >
          + Add Challenge
        </button>
      </div>
  
      {/* Challenge List */}
      <div className="space-y-4">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeItem key={challenge.id} challenge={challenge} onUpdate={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No challenges found.</p>
        )}
      </div>
  
      {/* Challenge Form */}
      {isFormOpen && <ChallengeForm onClose={() => setIsFormOpen(false)} challengeToEdit={editChallenge} />}
    </div>
  );
  
};

export default Home;
