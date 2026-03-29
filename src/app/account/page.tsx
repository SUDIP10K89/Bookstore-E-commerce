'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Book, Package, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const mockOrders = [
    { id: 'ORD001', date: '2023-10-26', total: 25.98, status: 'Delivered', items: ['To Kill a Mockingbird', '1984'] },
    { id: 'ORD002', date: '2023-11-15', total: 14.99, status: 'Shipped', items: ['The Hobbit'] },
    { id: 'ORD003', date: '2023-11-20', total: 18.00, status: 'Processing', items: ['Dune'] },
]

export default function AccountPage() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would also call a backend endpoint to invalidate the session.
    // For this example, we'll clear local storage and redirect.
    localStorage.clear();
    router.push('/login');
  };
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">My Account</h1>
        <p className="text-muted-foreground">Manage your account and view your order history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <User className="w-8 h-8" />
              <div>
                <CardTitle>Alex Doe</CardTitle>
                <CardDescription>alex.doe@example.com</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full"><User />Edit Profile</Button>
                <Button variant="outline" className="w-full"><MapPin />Manage Addresses</Button>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>Logout</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {mockOrders.map(order => (
                            <div key={order.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-primary">{order.id}</p>
                                        <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">{order.status}</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                                  <Book className="w-4 h-4"/>
                                  <span>{order.items.join(', ')}</span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                  <Button variant="secondary" size="sm">View Details</Button>
                                  {order.status !== 'Processing' && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/tracking/${order.id}`}>
                                        Track Package <Package />
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                                <Separator className="mt-6"/>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
