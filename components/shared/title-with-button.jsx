"use client";

import Link from "next/link";
import { Button } from "antd";
import { PlusIcon } from "lucide-react";

export default function TitleWithButton({
  title,
  buttonText,
  href = "",
  onClick = () => {},
  icon = true,
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between md:gap-0 ${
        buttonText && "gap-4"
      }`}
    >
      <h2 className="text-lg font-semibold text-primary md:text-2xl xl:text-3xl">
        {title}
      </h2>
      <div className="hidden w-fit sm:block">
        {buttonText ? (
          href ? (
            <Link href={href}>
              <Button
                type="primary"
                icon={icon && <PlusIcon size={16} className="text-white" />}
              >
                {buttonText}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onClick}
              type="primary"
              icon={icon && <PlusIcon />}
            >
              {buttonText}
            </Button>
          )
        ) : null}
      </div>
      <div className="block w-fit sm:hidden">
        {buttonText ? (
          href ? (
            <Link href={href}>
              <Button size="small" type="primary" icon={icon && <PlusIcon />}>
                {buttonText}
              </Button>
            </Link>
          ) : (
            <Button
              size="small"
              onClick={onClick}
              type="primary"
              icon={icon && <PlusIcon />}
            >
              {buttonText}
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
}
