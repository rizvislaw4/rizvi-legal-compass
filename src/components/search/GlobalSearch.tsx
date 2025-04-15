
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  title: string;
  type: "case" | "client" | "invoice";
  subtitle?: string;
  route: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const performSearch = async (search: string) => {
    setLoading(true);
    try {
      // Search cases
      const { data: cases } = await supabase
        .from('cases')
        .select('id, title, client:profiles!cases_client_id_fkey(full_name)')
        .ilike('title', `%${search}%`)
        .limit(5);

      // Search clients
      const { data: clients } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('full_name', `%${search}%`)
        .limit(5);

      // Search invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, amount, case_id, cases!invoices_case_id_fkey(title)')
        .ilike('id', `%${search}%`)
        .limit(5);

      const formattedResults: SearchResult[] = [
        ...(cases?.map(c => ({
          id: c.id,
          title: c.title,
          type: 'case' as const,
          subtitle: `Client: ${c.client?.full_name}`,
          route: `/cases?id=${c.id}`
        })) || []),
        ...(clients?.map(c => ({
          id: c.id,
          title: c.full_name,
          type: 'client' as const,
          subtitle: c.email,
          route: `/clients?id=${c.id}`
        })) || []),
        ...(invoices?.map(i => ({
          id: i.id,
          title: `Invoice ${i.id}`,
          type: 'invoice' as const,
          subtitle: `Case: ${i.cases?.title}`,
          route: `/billing?invoice=${i.id}`
        })) || [])
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cases, clients, invoices..."
          onValueChange={performSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {loading && <CommandItem disabled>Searching...</CommandItem>}
          {results.length > 0 && (
            <>
              <CommandGroup heading="Cases">
                {results
                  .filter((r) => r.type === "case")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => {
                        navigate(result.route);
                        setOpen(false);
                      }}
                    >
                      {result.title}
                      {result.subtitle && (
                        <span className="ml-2 text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Clients">
                {results
                  .filter((r) => r.type === "client")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => {
                        navigate(result.route);
                        setOpen(false);
                      }}
                    >
                      {result.title}
                      {result.subtitle && (
                        <span className="ml-2 text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Invoices">
                {results
                  .filter((r) => r.type === "invoice")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => {
                        navigate(result.route);
                        setOpen(false);
                      }}
                    >
                      {result.title}
                      {result.subtitle && (
                        <span className="ml-2 text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
