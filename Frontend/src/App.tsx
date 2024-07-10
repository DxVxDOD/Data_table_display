import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { User } from "../../Backend/src/utils/types/user";
import "./App.css";
import ElectricityPrices from "./components/electricity_prices/ElectricityPrices";
import LoginForm from "./components/login/LoginForm";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const logged_user_JSON = window.localStorage.getItem("logged_in_user");
    if (logged_user_JSON !== null) {
      const logged_user = JSON.parse(logged_user_JSON);
      setUser(logged_user);
    }
  }, []);

  return (
    <main className="p-4 bg-zinc-100 h-screen">
      <Toaster />
      {user === null ? <LoginForm /> : <ElectricityPrices user={user} />}
    </main>
  );
}
