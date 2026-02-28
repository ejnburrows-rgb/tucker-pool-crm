import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalSection {
    heading: string;
    content: string;
}

interface LegalModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    lastUpdated?: string;
    sections: LegalSection[];
}

export default function LegalModal({
    open,
    onOpenChange,
    title,
    lastUpdated,
    sections,
}: LegalModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111111] border-white/[0.06] text-[#F5F5F5] max-w-2xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                    {lastUpdated && (
                        <p className="text-[#A1A1AA] text-sm mt-1">
                            Last updated: {lastUpdated}
                        </p>
                    )}
                </DialogHeader>
                <ScrollArea className="max-h-[65vh] pr-4">
                    <div className="space-y-6 pb-4">
                        {sections.map((section, index) => (
                            <div key={index}>
                                <h3 className="text-[#F5F5F5] font-semibold text-base mb-2">
                                    {section.heading}
                                </h3>
                                <p className="text-[#A1A1AA] text-sm leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
