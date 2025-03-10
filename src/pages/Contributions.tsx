
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <Card className="p-6 glass-card">
          <h2 className="text-2xl font-semibold mb-6">Set Up Contribution</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monthly Contribution Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">€</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="50"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st of each month</SelectItem>
                  <SelectItem value="15">15th of each month</SelectItem>
                  <SelectItem value="28">28th of each month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Set Up Contribution
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contributions;

