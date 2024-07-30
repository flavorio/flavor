import { FormattedMessage, Link } from 'umi';
import { Button } from '@flavor/ui/shadcn';

export default function NotFoundPage(props: { title?: string }) {
  const { title } = props;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-6 bg-white text-center">
      <h1 data-testid="not-found-title" className="text-5xl text-black md:text-4xl lg:text-5xl">
        {title || 'Page Not Found'}
      </h1>
      <Button className="text-center text-xl no-underline hover:underline">
        <Link to={'/docs'}>
          <FormattedMessage id="actions.backToHome" />
        </Link>
      </Button>
    </div>
  );
}
