import { ErrorComponent } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';

export function NotesErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}