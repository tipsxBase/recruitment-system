"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobDto, createJobSchema } from "@recruitment/schema";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { postRequest } from "@/lib/clientFetch";
import { useToast } from "@/hooks/use-toast";

export enum JobEditorMode {
  Create,
  Edit,
}

export interface JobEditorProps {
  mode: JobEditorMode;
}

const JobEditor = (props: JobEditorProps) => {
  const { mode } = props;
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<CreateJobDto>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  const title = mode === JobEditorMode.Create ? "添加岗位" : "编辑岗位";

  const onSubmit = async (values) => {
    postRequest("/api/job", values).then(() => {
      toast({
        variant: "default",
        description: "岗位添加成功",
      });
      setOpen(false);
    });
  };

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) {
        form.reset();
      }
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          添加岗位
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          id="job-form"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                <FormLabel className="col-span-1 text-right">
                  岗位名称
                </FormLabel>
                <FormControl>
                  <Input
                    className="col-span-5"
                    placeholder="岗位名称"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-5 col-start-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                <FormLabel className="col-span-1 text-right">
                  岗位状态
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="col-span-5">
                      <SelectValue placeholder="岗位状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="col-span-5 col-start-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                <FormLabel className="col-span-1 text-right">
                  岗位描述
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="col-span-5 resize-none"
                    placeholder="岗位描述"
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-5 col-start-2" />
              </FormItem>
            )}
          />
        </Form>
        <DialogFooter>
          <Button type="submit" form="job-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditor;
