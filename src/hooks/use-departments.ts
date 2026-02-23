import { useEffect, useState } from "react";
import { getDepartments } from "@/lib/api";
import { DepartmentModel } from "@/lib/types";

export function useDepartments() {
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const data = await getDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch departments");
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      const data = await getDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch departments");
    } finally {
      setIsLoading(false);
    }
  };

  return { departments, isLoading, error, refetch };
}
