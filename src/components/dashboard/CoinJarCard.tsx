
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CoinJar } from "@/types/dashboard";
import { CoinJarCardHeader } from "./coinjar-card/CoinJarCardHeader";
import { CoinJarCardProgress } from "./coinjar-card/CoinJarCardProgress";
import { CoinJarCardStats } from "./coinjar-card/CoinJarCardStats";
import { CoinJarCardActions } from "./coinjar-card/CoinJarCardActions";

interface CoinJarCardProps {
  jar: CoinJar;
  showContribute?: boolean;
}

export const CoinJarCard = ({ jar, showContribute = false }: CoinJarCardProps) => {
  return (
    <Card className="h-full glass-card">
      <CardContent className="p-6">
        <CoinJarCardHeader jar={jar} />
        
        <CoinJarCardProgress 
          totalAmount={jar.total_amount}
          targetAmount={jar.target_amount}
          percentComplete={jar.percent_complete}
        />
        
        <CoinJarCardStats 
          createdAt={jar.created_at}
          contributionsCount={jar.coinjar_contributions?.length || 0}
        />
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <CoinJarCardActions jarId={jar.id} showContribute={showContribute} />
      </CardFooter>
    </Card>
  );
};
