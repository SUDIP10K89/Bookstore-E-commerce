'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  cardName: z.string().min(1, 'Name on card is required'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cardCvc: z.string().length(3, 'CVC must be 3 digits'),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Order placed:', values);
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. Your books are on their way!',
    });
    clearCart();
    router.push('/');
  };
  
  if (cartItems.length === 0) {
    return null;
  }
  
  const shippingCost = 5.0;
  const totalWithShipping = cartTotal + shippingCost;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="order-2 lg:order-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="postalCode" render={({ field }) => (
                      <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm"><Lock className='w-3 h-3'/> Secure Payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <FormField control={form.control} name="cardName" render={({ field }) => (
                    <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem><FormLabel>Card Number</FormLabel><FormControl><div className="relative"><CreditCard className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' /><Input className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                      <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder='MM/YY' {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="cardCvc" render={({ field }) => (
                      <FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Place Order - ${totalWithShipping.toFixed(2)}
              </Button>
            </form>
          </Form>
        </div>

        <div className="order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map(({ book, quantity }) => (
                  <div key={book.id} className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        width={64}
                        height={96}
                        className="rounded-md object-cover"
                        data-ai-hint="book cover"
                      />
                      <Badge className="absolute -right-2 -top-2 rounded-full h-6 w-6 p-0 flex items-center justify-center">{quantity}</Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <p className="font-semibold">${(book.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalWithShipping.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
