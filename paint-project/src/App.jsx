import "./App.css";
import Controls from "./controls/Controls";
import { BrushProvider } from "./state/BrushContext";

function App() {
  return (
    <>
      <BrushProvider>
        <Controls />
      </BrushProvider>
    </>
  );
}

export default App;
