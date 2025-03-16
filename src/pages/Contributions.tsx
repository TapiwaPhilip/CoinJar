
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contributions = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-md">
        <Card className="bordered-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-soft-blue/30 to-white border-b border-divider">
            <h2 className="text-2xl font-semibold">Set Up Contribution</h2>
            <p className="text-sm text-muted-foreground">Configure your monthly contribution details</p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form className="space-y-5">
              <div className="bordered-section pb-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">Monthly Contribution Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50"
                      className="pl-8 border border-divider focus:border-primary/50"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Regular monthly amount to contribute</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-date" className="text-sm font-medium">Payment Date</Label>
                <Select>
                  <SelectTrigger className="border border-divider focus:border-primary/50">
                    <SelectValue placeholder="Select payment date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st of each month</SelectItem>
                    <SelectItem value="15">15th of each month</SelectItem>
                    <SelectItem value="28">28th of each month</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Choose when the contribution is withdrawn</p>
              </div>
              
              <div className="highlighted-content mt-6">
                <p className="text-sm">Funds will be pooled and sent to the recipient at the end of each month.</p>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="border-t border-divider bg-soft-gray/30 p-6">
            <Button type="submit" className="w-full">
              Set Up Contribution
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Contributions;
