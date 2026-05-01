interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="heading-display text-3xl text-foreground md:text-4xl">{title}</h1>
      {description && <p className="mt-1.5 text-muted-foreground">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
