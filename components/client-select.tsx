'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import type { Client } from '@/types/database';

interface ClientSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelectClient?: (client: Client) => void;
  modal?: boolean;
}

export function ClientSelect({
  value,
  onChange,
  onSelectClient,
  modal = false,
}: ClientSelectProps) {
  const t = useTranslations('common');
  const tPayments = useTranslations('payments');
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  // Fetch clients when search changes or on mount
  React.useEffect(() => {
    let active = true;

    const fetchClients = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('limit', '50');
        if (debouncedSearch) {
          params.set('q', debouncedSearch);
        }
        params.set('active', 'true');

        const res = await fetch(`/api/clients?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        if (active) {
          setClients(data);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchClients();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  // Sync selectedClient state
  React.useEffect(() => {
    if (!value) {
      setSelectedClient(null);
      return;
    }
    const found = clients.find((c) => c.id === value);
    if (found) {
      setSelectedClient(found);
    }
  }, [value, clients]);

  const handleSelect = (client: Client) => {
    setSelectedClient(client);
    onChange?.(client.id);
    onSelectClient?.(client);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 font-normal"
        >
          {selectedClient ? (
            <span className="truncate">
              {selectedClient.name} - ${selectedClient.monthly_rate}/mo
            </span>
          ) : (
            <span className="text-muted-foreground">{tPayments('selectClient')}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t('search')}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!loading && clients.length === 0 && (
              <CommandEmpty>{t('noResults')}</CommandEmpty>
            )}
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.id}
                  onSelect={() => handleSelect(client)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.address} • ${client.monthly_rate}/mo
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
