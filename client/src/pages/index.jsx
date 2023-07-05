import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const Home = ({children}) => {
  return (
    <main className={`min-h-screen ${inter.className}`}>
      {/* {children} */}
    </main>
  );
};

export default Home;
