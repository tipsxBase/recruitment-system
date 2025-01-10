"use client";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1, { message: "请输入用户名" }),
  password: z
    .string()
    .min(1, {
      message: "请输入密码",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(false);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      alert("登录失败");
    } else {
      router.push("/interview");
    }
  };

  return (
    <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
        <Card className="p-6">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">招聘系统</h1>
          </div>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <div className="flex items-center justify-between">
                          <FormLabel>密码</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-muted-foreground hover:opacity-75"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="mt-2" disabled={isLoading}>
                    Login
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
