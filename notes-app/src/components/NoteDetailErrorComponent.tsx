import { ErrorComponent } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';

export function NoteDetailErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}