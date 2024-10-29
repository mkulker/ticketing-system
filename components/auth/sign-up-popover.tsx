"use client";

import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/react";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import { SmtpMessage } from "@/app/(auth-pages)/smtp-message";

export function SignUpPopover({ searchParams }: { searchParams: Message }) {
  return (
    <Popover placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
            <Button size="sm" variant={"default"}>
                Sign up
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            {(titleProps) => (
            <>
                <form className="flex flex-col min-w-64 max-w-64 mx-auto">
                <h1 className="text-2xl font-medium" {...titleProps}>Sign up</h1>
                <p className="text-sm text text-foreground">
                    Already have an account?{" "}
                    <Link className="text-primary font-medium underline" href="/sign-in">
                    Sign in
                    </Link>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="you@example.com" required />
                    <Label htmlFor="password">Password</Label>
                    <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                    />
                    <SubmitButton formAction={signUpAction} pendingText="Signing up...">
                    Sign up
                    </SubmitButton>
                    {/* <FormMessage message={searchParams} /> */}
                </div>
                </form>
                <SmtpMessage />
            </>
            )}
        </PopoverContent>
    </Popover>
  );
}

