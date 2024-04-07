import "./App.css";
import Paint from "./features/Paint/Paint";
import { BrushProvider } from "./state/BrushContext";

function App() {
  return (
    <>
      <BrushProvider>
        <Paint />
      </BrushProvider>
    </>
  );
}

export default App;
