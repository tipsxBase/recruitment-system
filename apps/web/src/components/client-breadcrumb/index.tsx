"use client";

import { Fragment } from "react";
import { useBaseStore } from "../base-layout/BaseProvider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const ClientBreadcrumb = () => {
  const { breadcrumbs } = useBaseStore();
  console.log("breadcrumbs", breadcrumbs);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          if (index === breadcrumbs.length - 1) {
            return (
              <BreadcrumbItem key={item.key}>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          } else {
            if (item.path) {
              return (
                <Fragment key={item.key}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={item.path}>
                      {item.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </Fragment>
              );
            } else {
              return (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    {item.name}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              );
            }
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ClientBreadcrumb;
