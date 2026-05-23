'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PayPalSubscriptionButtonProps {
  planId: string; // e.g., 'P-5BC97589SB7542152NIIPEWI'
  containerId?: string;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  label?: 'subscribe' | 'checkout' | 'buynow' | 'paypal';
  style?: {
    shape?: 'rect' | 'pill';
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
    layout?: 'horizontal' | 'vertical';
  };
}

export function PayPalSubscriptionButton({
  planId,
  containerId = 'paypal-button-container',
  onSuccess,
  onError,
  label = 'subscribe',
  style = {
    shape: 'pill',
    color: 'gold',
    layout: 'horizontal',
  },
}: PayPalSubscriptionButtonProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if PayPal SDK is already loaded
    if ((window as any).paypal) {
      renderButton();
      return;
    }

    // Create and inject the PayPal SDK script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => {
      renderButton();
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      if (onError) {
        onError(new Error('Failed to load PayPal SDK'));
      }
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  const renderButton = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // Clear any existing buttons
    container.innerHTML = '';

    (window as any).paypal.Buttons({
      style: {
        shape: style.shape || 'pill',
        color: style.color || 'gold',
        layout: style.layout || 'horizontal',
        label: label,
      },
      createSubscription: function (data: any, actions: any) {
        return actions.subscription.create({
          plan_id: planId,
        });
      },
      onApprove: function (data: any, actions: any) {
        // data.subscriptionID contains the PayPal subscription ID
        console.log('Subscription approved:', data.subscriptionID);

        // Send subscription data to your backend to store in database
        fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paypal_subscription_id: data.subscriptionID,
            plan_id: planId,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              if (onSuccess) {
                onSuccess(data.subscriptionID);
              }
              // Redirect to dashboard
              router.push('/app/dashboard');
            } else {
              if (onError) {
                onError(result.error);
              }
            }
          })
          .catch((err) => {
            console.error('Error creating subscription:', err);
            if (onError) {
              onError(err);
            }
          });
      },
      onError: function (err: any) {
        console.error('PayPal error:', err);
        if (onError) {
          onError(err);
        }
      },
    }).render(container);
  };

  return <div ref={containerRef} id={containerId} className="paypal-button-container" />;
}
