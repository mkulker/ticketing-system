"use client";

import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/react";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignInPopover({ searchParams }: { searchParams: Message }) {
  return (
    <Popover placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
            <Button size="sm" variant={"outline"}>
                Sign in
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            {(titleProps) => (
            <div className="px-1 py-2 w-full">
                <form className="flex-1 flex flex-col min-w-64">
                <h1 className="text-2xl font-medium" {...titleProps}>Sign in</h1>
                <p className="text-sm text-foreground">
                    Don't have an account?{" "}
                    <Link className="text-foreground font-medium underline" href="/sign-up">
                    Sign up
                    </Link>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="you@example.com" required />
                    <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        className="text-xs text-foreground underline"
                        href="/forgot-password"
                    >
                        Forgot Password?
                    </Link>
                    </div>
                    <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                    />
                    <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                    Sign in
                    </SubmitButton>
                    {/* <FormMessage message={searchParams} /> */}
                </div>
                </form>
            </div>
            )}
        </PopoverContent>
    </Popover>
  );
}

