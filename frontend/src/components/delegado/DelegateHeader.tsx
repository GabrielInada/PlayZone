type Props = {
    title: string;
};

export default function DelegateHeader({ title }: Props) {
    return (
        <header>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">{title}</h1>
        </header>
    );
}
