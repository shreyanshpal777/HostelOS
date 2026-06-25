import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { toast } from '@/components/ui/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: 'Reset link sent',
        description: 'Check your inbox for password reset instructions.',
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        icon={Mail}
        title="Check your email"
        subtitle="We sent a password reset link if an account exists for that address"
        footer={
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to login
          </Link>
        }
      >
        <p className="text-sm text-muted-foreground text-center">
          Did not receive it? Check spam or{' '}
          <button type="button" className="text-primary font-medium hover:underline" onClick={() => setSent(false)}>
            try again
          </button>
          .
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Mail}
      title="Forgot password"
      subtitle="Enter your email and we will send a reset link"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
