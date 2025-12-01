'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlan, UserPlan } from '@/hooks/use-plan';
import { useToast } from '@/hooks/use-toast';
import { Check, Gem } from 'lucide-react';

const plans = [
  {
    name: 'Free' as UserPlan,
    price: '₹0',
    pricePeriod: '/ month',
    description: 'Get started with the basics. Perfect for occasional practice.',
    features: [
      '5 AI-powered interviews per month',
      'Basic performance feedback',
      'Access to question bank',
    ],
    cta: 'Current Plan',
    isPrimary: false,
  },
  {
    name: 'Premium' as UserPlan,
    price: '₹149',
    pricePeriod: '/ month',
    description: 'Unlock your full potential with advanced features and unlimited practice.',
    features: [
      'Unlimited interviews',
      'Advanced performance analytics',
      'Body language analysis',
      'AI Resume Analyzer',
      'Priority support',
    ],
    cta: 'Go Premium',
    isPrimary: true,
  },
  {
    name: 'Super' as UserPlan,
    price: '₹249',
    pricePeriod: '/ month',
    description: 'For professionals who want personalized coaching and every advantage.',
    features: [
      'All Premium features',
      'Personalized career coaching sessions',
      'Custom interview scenarios',
      'Live mock interviews with experts',
    ],
    cta: 'Get Super',
    isPrimary: false,
  },
];

export default function PricingPage() {
  const { userPlan, setUserPlan } = usePlan();
  const { toast } = useToast();

  const handleUpgrade = (planName: UserPlan) => {
    setUserPlan(planName);
    toast({
      title: 'Plan Updated!',
      description: `You are now on the ${planName} plan.`,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <Gem className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Flexible Plans for Your Career Goals</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Start for free, then upgrade to unlock your full potential.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col transform hover:-translate-y-2 transition-transform duration-300 ${plan.isPrimary && userPlan !== plan.name ? 'border-primary ring-2 ring-primary shadow-lg shadow-primary/20' : 'hover:shadow-xl'} ${userPlan === plan.name ? 'border-accent' : ''}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-4xl font-bold">
                {plan.price}<span className="text-lg font-normal text-muted-foreground">{plan.pricePeriod}</span>
              </p>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                size="lg" 
                className="w-full" 
                variant={plan.isPrimary ? 'default' : 'outline'}
                onClick={() => handleUpgrade(plan.name)}
                disabled={userPlan === plan.name}
              >
                {userPlan === plan.name ? 'Current Plan' : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
