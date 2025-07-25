import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    if (value === undefined || value === null) {
      return value as string | null | undefined;
    }

    return String(value).trim();
  });
}
