import { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

// TODO: convert to return bool for success
async function copyToClipboard(text: string) {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(text);
  } else {
    document.execCommand("copy", true, text);
  }
}

export default function CopyButton({ copyText }: { copyText: string | undefined }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  const onClick = () => {
    setOpen(true);
    copyText && copyToClipboard(copyText);

    setTimeout(() => {
      setOpen(false)
      ref.current?.blur()
    }, 1600)
  }

  return <Tooltip open={open} onOpenChange={setOpen}>
    <TooltipTrigger asChild={true} onClick={onClick}>
      <button ref={ref} className="focus:border-sky-500 hover:bg-gray-50 stroke-gray-400 hover:shadow-sm rounded-md shadow-sm p-0.5 border border-gray-300 focus:outline-none focus:ring-sky-500 focus:ring-1">
        <svg className="w-8 group-hover:rotate-[-4deg] group-hover:stroke-sky-500" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.9975 10.7499L11.7475 10.7499C10.6429 10.7499 9.74747 11.6453 9.74747 12.7499L9.74747 21.2499C9.74747 22.3544 10.6429 23.2499 11.7475 23.2499L20.2475 23.2499C21.352 23.2499 22.2475 22.3544 22.2475 21.2499L22.2475 12.7499C22.2475 11.6453 21.352 10.7499 20.2475 10.7499L18.9975 10.7499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M17.9975 12.2499L13.9975 12.2499C13.4452 12.2499 12.9975 11.8022 12.9975 11.2499L12.9975 9.74988C12.9975 9.19759 13.4452 8.74988 13.9975 8.74988L17.9975 8.74988C18.5498 8.74988 18.9975 9.19759 18.9975 9.74988L18.9975 11.2499C18.9975 11.8022 18.5498 12.2499 17.9975 12.2499Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M13.7475 16.2499L18.2475 16.2499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.7475 19.2499L18.2475 19.2499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <g className="opacity-0">
            <path d="M15.9975 5.99988L15.9975 3.99988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M19.9975 5.99988L20.9975 4.99988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M11.9975 5.99988L10.9975 4.99988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </g>
        </svg>
      </button>
    </TooltipTrigger>
    <TooltipContent className="Tooltip">
      <div className="bg-slate-800 text-gray-50 rounded-md py-2 px-[0.875em]">
        <svg aria-hidden="true" width="16" height="6" viewBox="0 0 16 6" className="absolute top-full left-1/2 -mt-px -ml-2 text-slate-800">
          <path fillRule="evenodd" clipRule="evenodd" d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z" fill="currentColor">
          </path>
        </svg>
        <span className="block pb-[0.17em] text-sm">{copyText ? "Copied!" : "Nothing to copy!"}</span>
      </div>
    </TooltipContent>
  </Tooltip>
}