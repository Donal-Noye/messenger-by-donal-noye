import Link from "next/link";

export function BottomLink({
  text,
  linkText,
  url,
}: {
  text: string;
  linkText: string;
  url: string;
}) {
  return (
    <p className="text-primary/50">
      {text}{" "}
      <Link href={url} className="font-medium text-link hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
