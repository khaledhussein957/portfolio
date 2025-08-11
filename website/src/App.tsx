import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { usePortfolioStore } from "./store/backendStore";

const Home = lazy(() => import("./pages/Home"));
const NetworkErrorPage = lazy(() => import("./pages/NetworkErrorPage"));

function App() {
  const { networkError } = usePortfolioStore();

  // if network error is true, return NetworkErrorPage
  if (networkError) return <NetworkErrorPage />;
  return (
    <Suspense
      fallback={
        <div>
          Loading...
        </div>
      }
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
