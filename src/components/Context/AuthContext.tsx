import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Authprops {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  fullName: string;
  setName: (name: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<Authprops | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Components should be inside the auth provider");
  }
  return context;
};

export default function AuthProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setIsLoggedIn = async (value: boolean) => {
    setIsLoggedInState(value);
    localStorage.setItem("isLoggedIn", JSON.stringify(value));
  };

  const setName = (name: string) => {
    setAdminName(name);
    localStorage.setItem("fullName", name);
  };

  useEffect(() => {
    const loadState = () => {
      const storedLoggedIn = localStorage.getItem("isLoggedIn");
      const storedName = localStorage.getItem("fullName");

      if (storedLoggedIn !== null) {
        const parsed = JSON.parse(storedLoggedIn);
        setIsLoggedInState(parsed);
        if (storedName) setAdminName(storedName);

        if (!parsed) {
          navigate("/");
        }
      } else {
        navigate("/dashboard");
      }
      setLoading(false);
    };

    loadState();
  }, [navigate]);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        fullName: adminName,
        setName,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
