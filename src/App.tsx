import MultiGateUI from "./components/MultiGateUI";
import { useGateAccess } from "./hooks/useGateAccess";

function App() {
  useGateAccess();
  return <MultiGateUI />;
}

export default App;
