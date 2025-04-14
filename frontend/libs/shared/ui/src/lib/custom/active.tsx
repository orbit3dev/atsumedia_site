'use client';

import React from 'react';
import { CheckCircle2, MinusCircle } from 'lucide-react';

interface ActiveProps {
  active: boolean;
}

export function Active({ active }: ActiveProps) {

	return (
    <div className="w-full flex justify-center">
      {active ? <div
        className="h-[22px] px-4 space-x-2 flex items-center text-green-600">
        <CheckCircle2 size={18} className="mr-1"/> 有效
      </div> : <div className="h-[22px] px-4 space-x-2 flex items-center text-gray-400">
        <MinusCircle size={18} className="mr-1"/> 无效
      </div>}
    </div>
	);
}
