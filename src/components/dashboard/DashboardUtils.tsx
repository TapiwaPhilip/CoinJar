
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import React from "react";

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
