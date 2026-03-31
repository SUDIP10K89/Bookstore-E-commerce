'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Warehouse, Home } from "lucide-react";
import { useParams } from "next/navigation";

const trackingEvents = [
    { status: 'Order Confirmed', date: '2023-11-20', location: 'Booksville, BK', icon: <CheckCircle className="h-5 w-5"/> },
    { status: 'Processed at Warehouse', date: '2023-11-21', location: 'Booksville Warehouse', icon: <Warehouse className="h-5 w-5"/> },
    { status: 'Shipped', date: '2023-11-21', location: 'Booksville, BK', icon: <Truck className="h-5 w-5"/> },
    { status: 'Out for Delivery', date: '2023-11-22', location: 'Your City, YC', icon: <Truck className="h-5 w-5"/> },
    { status: 'Delivered', date: '2023-11-22', location: 'Your Address', icon: <Home className="h-5 w-5"/> },
];

// In a real app, you would fetch order details based on the ID.
const getOrderStatusInfo = (orderId: string) => {
    // Mocking different statuses for different orders
    const lastDigit = parseInt(orderId.slice(-1));
    if (lastDigit <= 1 || (lastDigit > 3 && lastDigit <= 5)) {
      return { status: 'Delivered', activeIndex: 4, estimated: 'Delivered on Nov 22, 2023' };
    }
    if (lastDigit <= 3 || (lastDigit > 5 && lastDigit <= 8)) {
      return { status: 'Shipped', activeIndex: 2, estimated: 'Estimated Delivery: Nov 24, 2023' };
    }
    return { status: 'Processing', activeIndex: 0, estimated: 'Estimated Delivery: Nov 25, 2023' };
};

export default function TrackingPage() {
    const params = useParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
    const { status, activeIndex, estimated } = getOrderStatusInfo(orderId);
    
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Track Your Order</CardTitle>
                        <CardDescription>{estimated}</CardDescription>
                        <div className="flex justify-between items-center text-muted-foreground pt-2 text-sm">
                            <span>Order ID: <span className="font-semibold text-foreground">{orderId}</span></span>
                            <span>Status: <span className="font-semibold text-foreground">{status}</span></span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6">
                            {/* The vertical line */}
                            <div className="absolute left-[35px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                            
                            <div className="space-y-10">
                                {trackingEvents.map((event, index) => (
                                    <div key={index} className="flex items-start gap-6 relative">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full z-10 ${index <= activeIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {event.icon}
                                        </div>
                                        <div className={`pt-1 ${index > activeIndex ? 'opacity-50' : ''}`}>
                                            <p className="font-semibold">{event.status}</p>
                                            <p className="text-sm text-muted-foreground">{event.date}</p>
                                            <p className="text-sm text-muted-foreground">{event.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
