import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/custom/navbar";
import AdminLogin from "./admin-login";
import Home from "./home";
import { ThemeProvider } from "./components/theme-provider";
import SnippetPage from "./snippet-page";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
// Separate component so we can use useLocation hook
const Layout = () => {
  const location = useLocation();

  // List all routes where NavBar should be hidden
  const hideNavBarOn = ["/admin-login", "/search-page"];
  const showNavBar = !hideNavBarOn.includes(location.pathname);

  return (
    <main className="min-h-screen w-full transition-colors duration-300">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />

      <div className="relative z-10">
        {showNavBar && <NavBar />} {/* conditionally render */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/snippet/:id" element={<SnippetPage />} />
        </Routes>
      </div>
    </main>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
