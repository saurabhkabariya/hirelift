import JobNotAvailable from '@/components/JobNotAvailable';

export const metadata = {
  title: 'Job Not Found - HireLift',
  description: 'This job posting is no longer available. Browse other opportunities on HireLift.',
};

export default function NotFound() {
  return <JobNotAvailable jobId="unknown" />;
}