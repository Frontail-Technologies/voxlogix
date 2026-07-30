"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ModuleSchemaRedirectPage() {
  const params = useParams<{ moduleId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/modules/${params.moduleId}`);
  }, [params.moduleId, router]);

  return null;
}