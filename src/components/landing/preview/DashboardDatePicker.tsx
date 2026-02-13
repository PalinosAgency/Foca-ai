
import React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DashboardDatePickerProps = React.HTMLAttributes<HTMLDivElement>;

export function DashboardDatePicker({ className }: DashboardDatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal bg-white border-slate-200 hover:bg-slate-50 text-slate-900",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {date ? (
                            <span className="truncate">{format(date, "P", { locale: ptBR })}</span>
                        ) : (
                            <span className="truncate">Selecione uma data</span>
                        )}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
