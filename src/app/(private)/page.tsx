import { Hop } from "lucide-react";

export default function Home() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden lg:block">
      <Hop className="text-[#474747] h-60 w-60" />
      <div className="mt-5 flex flex-col items-center justify-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-heading">
          Messenger
        </h3>
        <p className="leading-7 text-[#C2C2C2]">Let&#39;s start!</p>
      </div>
    </div>
  );
}
