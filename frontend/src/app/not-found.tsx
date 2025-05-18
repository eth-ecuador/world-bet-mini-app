import { Page } from '@/components/PageLayout';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </Page.Main>
    </Page>
  );
} 