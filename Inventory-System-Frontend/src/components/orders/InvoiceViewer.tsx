
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Printer } from "lucide-react";
import type { Order, CompanyProfile } from '@/types';
import { Skeleton } from "../ui/skeleton";
import { TableRow, TableCell } from "../ui/table";
import { companyRepository } from "@/lib/company-repository";

interface InvoiceProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InvoiceViewer({
  order,
  open,
  onOpenChange,
}: InvoiceProps) {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (open) {
      const profile = companyRepository.get();
      setCompanyProfile(profile);
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoice = () => {
    // In a real application, this would generate a PDF for download
    console.log("Downloading invoice for order:", order?.id);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Invoice
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-white rounded-lg border" id="printable-invoice">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="text-muted-foreground">#{order.id}</p>
            </div>
            <div className="text-right">
              {companyProfile ? (
                <>
                  <h3 className="text-xl font-bold">{companyProfile.name}</h3>
                  {companyProfile.address.split('\n').map((line, i) => (
                    <p key={i} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                  <p className="text-sm text-muted-foreground">{companyProfile.phone}</p>
                </>
              ) : (
                <div className="space-y-1">
                    <Skeleton className="h-6 w-32 ml-auto" />
                    <Skeleton className="h-4 w-40 ml-auto" />
                    <Skeleton className="h-4 w-28 ml-auto" />
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-muted-foreground">Bill To:</h4>
              <p className="font-medium">{order.customer}</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-muted-foreground">
                Invoice Date:
              </h4>
              <p>{formatDate(order.date)}</p>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="py-2 px-4 text-left">Item</th>
                  <th className="py-2 px-4 text-right">Price</th>
                  <th className="py-2 px-4 text-center">Quantity</th>
                  <th className="py-2 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="space-y-2 p-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : order.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-right">
                      PHP {item.price.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-center">{item.quantity}</td>
                    <td className="py-2 px-4 text-right">
                      PHP {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="py-2 px-4 text-right font-medium">
                    Subtotal:
                  </td>
                  <td className="py-2 px-4 text-right">
                    PHP {order.total.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-right font-medium">
                    Tax (12%):
                  </td>
                  <td className="py-2 px-4 text-right">
                    PHP {(order.total * 0.12).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-right font-bold">
                    Total:
                  </td>
                  <td className="py-2 px-4 text-right font-bold">
                    PHP {(order.total * 1.12).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Payment Terms:</h4>
            <p className="text-sm text-muted-foreground">
              Payment is due within 15 days of invoice date.
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={printInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={downloadInvoice}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
