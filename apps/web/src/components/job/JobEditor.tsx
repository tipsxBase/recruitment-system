"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { createJob } from "@/services/JobService";
import { useJobStore } from "@/providers/job-store-provider";
import { JobEditorMode } from "@/stores/job-store";

const JobEditor = () => {
  const mode = useJobStore((store) => store.mode);
  const currentRow = useJobStore((store) => store.currentRow);
  const updateMode = useJobStore((store) => store.updateMode);
  const { toast } = useToast();

  const hasInitialValues =
    mode === JobEditorMode.Edit || mode === JobEditorMode.Copy;
  const form = useForm<CreateJobDto>({
    resolver: zodResolver(createJobSchema),
    defaultValues: hasInitialValues
      ? {
          name: currentRow.name,
          description: currentRow.description,
          status: currentRow.status,
        }
      : {
          name: "",
          description: "",
          status: "active",
        },
  });
  const title = mode === JobEditorMode.Create ? "添加岗位" : "编辑岗位";

  const onSubmit = async (values) => {
    if (mode === JobEditorMode.Edit) {
      // Update job
      toast({
        variant: "default",
        title: "提示2",
        description: "岗位添加成功2",
      });
      return;
    } else if (mode === JobEditorMode.Copy) {
      // Copy job
      return;
    } else if (mode === JobEditorMode.Create) {
      createJob(values).then(() => {
        toast({
          variant: "default",
          title: "提示",
          description: "岗位添加成功",
        });
        updateMode(null);
      });
    } else if (mode === JobEditorMode.View) {
    }
  };

  const onOpenChange = useCallback(() => {
    updateMode(null);
    form.reset();
  }, [form, updateMode]);

  useEffect(() => {
    if (mode === JobEditorMode.Edit || mode === JobEditorMode.Copy) {
      form.setValue("name", currentRow.name);
      form.setValue("description", currentRow.description);
      form.setValue("status", currentRow.status);
      toast({
        variant: "default",
        title: "提示",
        description: "岗位添加成功",
      });
    }
  }, [currentRow, form, mode]);

  return (
    <Dialog open={!!mode} onOpenChange={onOpenChange}>
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
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditor;
