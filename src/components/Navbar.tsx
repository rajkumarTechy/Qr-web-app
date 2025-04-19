import { useAuth } from "./Context/AuthContext";

const Navbar = () => {
  const { fullName } = useAuth();

  return (
    <div>
      <header className="flex  border-b border-gray-300 py-3 px-4 sm:px-10 bg-white h-16 tracking-wide relative z-50">
        <div className="flex flex-row max-w-screen-xl mx-auto w-full justify-end">
          <div className="w-10 h-10 cursor-pointer rounded-full bg-black flex items-center justify-center">
            <h1 className="text-white uppercase font-semibold">
              {fullName.trim().split(" ").length === 1
                ? fullName.trim().charAt(0)
                : fullName.trim().split(" ")[0].charAt(0) +
                  fullName.trim().split(" ").slice(-1)[0].charAt(0)}
            </h1>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
