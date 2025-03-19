
import { CheckCircle2, Clock, AlertCircle, Filter } from "lucide-react";
import React from "react";
import { CoinJar } from "@/types/dashboard";

// Status icon functions
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'processing':
      return <Clock className="w-5 h-5 text-amber-500" />;
    case 'pending':
    default:
      return <AlertCircle className="w-5 h-5 text-gray-400" />;
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'processing':
      return 'Processing';
    case 'pending':
    default:
      return 'Pending';
  }
};

// Filter function for CoinJars
export const filterJarsByStatus = (jars: CoinJar[], status: string | null) => {
  if (!status || status === 'all') {
    return jars;
  }
  
  return jars.filter(jar => jar.delivery_status === status);
};
