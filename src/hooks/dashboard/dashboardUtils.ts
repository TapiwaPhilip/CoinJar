
import { CoinJar } from "@/types/dashboard";

export const enhanceJarsWithContributions = (
  jarsData: any[],
  contributions: any[]
) => {
  // Group contributions by jar ID
  const contributionsByJarId = contributions.reduce((acc, contrib) => {
    if (!acc[contrib.coinjar_id]) {
      acc[contrib.coinjar_id] = [];
    }
    acc[contrib.coinjar_id].push(contrib);
    return acc;
  }, {} as Record<string, any[]>);
  
  // Process each jar with its contributions
  return jarsData.map(jar => {
    const jarContributions = contributionsByJarId[jar.id] || [];
    
    // Calculate total contributions
    const totalAmount = jarContributions.reduce((sum, contribution) => {
      const amount = typeof contribution.amount === 'string' 
        ? parseFloat(contribution.amount) 
        : contribution.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Mock data for demo purposes - replace with real data in production
    const targetAmount = 100;
    const percentComplete = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
    const deliveryStatuses = ['pending', 'processing', 'delivered'];
    const randomStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
    
    return {
      ...jar,
      total_amount: totalAmount,
      target_amount: targetAmount,
      percent_complete: percentComplete,
      delivery_status: randomStatus as 'pending' | 'processing' | 'delivered',
      coinjar_contributions: jarContributions
    } as CoinJar;
  });
};
