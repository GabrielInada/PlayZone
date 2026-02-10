type ContainerHeaderProps = { children: React.ReactNode };

export function ContainerHeader({ children }: ContainerHeaderProps) {
    return (
        <div className="mx-auto max-w-[98rem] px-6 sm:px-8 lg:px-50">
            {children}
        </div>
    );
}