import type { ReactNode } from 'react';

export interface PropRow {
  name: string;
  /** Type signature, or (for CSS variables) the default value. */
  type?: string;
  default?: string;
  required?: boolean;
  description: ReactNode;
}

interface PropsTableProps {
  rows: PropRow[];
  /** Override the default column headers. */
  labels?: { name?: string; type?: string; default?: string };
  /** Show the Type column. Defaults to true. */
  showType?: boolean;
  /** Show the Default column. Defaults to true. */
  showDefault?: boolean;
}

export const PropsTable = ({
  rows,
  labels,
  showType = true,
  showDefault = true,
}: PropsTableProps) => {
  const nameLabel = labels?.name ?? 'Prop';
  const typeLabel = labels?.type ?? 'Type';
  const defaultLabel = labels?.default ?? 'Default';

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/50 text-left">
            <th className="px-4 py-2.5 font-semibold">{nameLabel}</th>
            {showType ? (
              <th className="px-4 py-2.5 font-semibold">{typeLabel}</th>
            ) : null}
            {showDefault ? (
              <th className="px-4 py-2.5 font-semibold">{defaultLabel}</th>
            ) : null}
            <th className="px-4 py-2.5 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-border align-top">
              <td className="px-4 py-2.5 whitespace-nowrap">
                <code className="font-mono text-xs text-primary">
                  {row.name}
                </code>
                {row.required ? (
                  <span className="ml-1 text-xs text-destructive">*</span>
                ) : null}
              </td>
              {showType ? (
                <td className="px-4 py-2.5">
                  {row.type ? (
                    <code className="font-mono text-xs text-muted-foreground break-words">
                      {row.type}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              ) : null}
              {showDefault ? (
                <td className="px-4 py-2.5">
                  {row.default ? (
                    <code className="font-mono text-xs text-muted-foreground">
                      {row.default}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              ) : null}
              <td className="px-4 py-2.5 text-muted-foreground">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
