type ContainerHeaderProps = {
    children: React.ReactNode;
}

export function ContainerHeader({ children }: ContainerHeaderProps) {
    return (
        <div className="mx-auto max-w-[98rem] px-4 sm:px-6 lg:px-8 py-4">
            {children}
        </div>
    );
}
