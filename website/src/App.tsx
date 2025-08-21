import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
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
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin h-10 w-10 text-gray-400 dark:text-gray-200" />
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
