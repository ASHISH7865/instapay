'use client';
import React, { useState, useEffect } from 'react';
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Wallet2 } from 'lucide-react';
import WalletPinModal from '@/components/modal/wallet-pin-modal';


const Wallet = () => {
    const INR_SYMBOL = "₹";
    const [balance, setBalance] = useState(1200.00);
    const [hideBalance, setHideBalance] = useState(true);

    return (
        <div className="flex flex-col p-4">
            <Breadcrumbs>
                <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
                <BreadcrumbItem href="/dashboard/Wallet">Wallet</BreadcrumbItem>
            </Breadcrumbs>

            <div className="mt-5">
                <p className="text-2xl font-bold">Wallet Dashboard</p>
            </div>
            <div className='flex gap-6'>
                <div className="mt-5" >
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Wallet2 size={24} />
                                Wallet Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                {hideBalance ? "****" : `${INR_SYMBOL} ${balance}`}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <WalletPinModal />
                        </CardFooter>
                    </Card>
                </div>
                <div className="mt-5">
                    <Button variant="outline" className="w-[300px] h-[200px]">
                        <Plus size={24} />
                        Add Money
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default Wallet;

