import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-muted/20 mt-12 py-8">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4">
        <p className="text-sm text-muted-foreground">Gold Tier Sponsors</p>
        <div className="rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/image.png"
            width={700}
            height={80}
            alt="Sponsors"
            className="object-contain"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BeaverHacks @ Oregon State University
        </p>
      </div>
    </footer>
  );
};
