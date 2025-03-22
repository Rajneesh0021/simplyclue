import { ChallengeProvider } from "./context/ChallengeContext";
import Home from "./pages/Home";

function App() {
  return (
    <ChallengeProvider>

      <Home />

    </ChallengeProvider>

  );
}

export default App;
