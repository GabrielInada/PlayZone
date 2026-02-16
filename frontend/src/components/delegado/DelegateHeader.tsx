type Props = {
    title: string;
};

export default function DelegateHeader({ title }: Props) {
    return (
        <header className="border-b border-gray-200 pb-3">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </header>
    );
}
