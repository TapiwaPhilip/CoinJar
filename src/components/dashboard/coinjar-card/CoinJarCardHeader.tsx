
import { getStatusIcon } from "../DashboardUtils";
import { CoinJar } from "@/types/dashboard";

interface CoinJarCardHeaderProps {
  jar: CoinJar;
}

export const CoinJarCardHeader = ({ jar }: CoinJarCardHeaderProps) => {
  return (
    <div className="flex justify-between mb-3">
      <div>
        <h3 className="text-lg font-medium">{jar.name}</h3>
        <p className="text-sm text-muted-foreground">{jar.relationship}</p>
      </div>
      <div className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-full h-fit">
        {getStatusIcon(jar.delivery_status)}
        <span className="sr-only md:not-sr-only md:inline">{jar.delivery_status}</span>
      </div>
    </div>
  );
};
