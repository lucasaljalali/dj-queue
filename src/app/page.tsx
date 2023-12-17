import { rankingData } from "../../public/fakeRanking";
import Ranking from "./components/Ranking";

export default function Home() {
  return (
    <main>
      <Ranking data={rankingData} />
    </main>
  );
}
