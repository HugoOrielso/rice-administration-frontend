import Image from "next/image";
import Link from "next/link";

export function SimpleHeader() {
    return (
        <div className="w-full bg-white border-b shadow-sm py-4 px-6 flex items-center">
            <Link href="/" className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                    <Image
                        src="/assets/logo.png"
                        alt="Logo Andina Group"
                        fill
                        priority
                        sizes="56px"
                        className="object-contain"
                    />
                </div>
                <div>
                    <p className="text-lg font-extrabold tracking-tight text-(--color-brand-green)">
                        Andina group & Capital S.A.S
                    </p>
                    <p className="text-sm text-slate-500">
                        Tradición, calidad y confianza
                    </p>
                </div>
            </Link>
        </div>
    );
}

