import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import BillDetails from "./billDetails";
import { Bill } from "@/types/billType";

interface BillsTableProps {
  bills: Bill[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const BillsTable: React.FC<BillsTableProps> = ({
  bills,
  searchTerm,
  setSearchTerm,
}) => {
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="bg-white dark:bg-richBlack rounded-lg shadow-md">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-majorelleBlue" />
          <Input
            placeholder="Tìm theo mã hóa đơn hoặc tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-majorelleBlue20 focus:ring-majorelleBlue"
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-majorelleBlue20 dark:bg-majorelleBlue/10 hover:bg-majorelleBlue50 dark:hover:bg-majorelleBlue/20">
            <TableHead className="text-majorelleBlue font-semibold">
              Mã hóa đơn
            </TableHead>
            <TableHead className="text-majorelleBlue font-semibold">
              Khóa học
            </TableHead>
            <TableHead className="text-majorelleBlue font-semibold">
              Số tiền
            </TableHead>
            <TableHead className="text-majorelleBlue font-semibold">
              Ngày thanh toán
            </TableHead>
            <TableHead className="text-majorelleBlue font-semibold">
              Trạng thái
            </TableHead>
            <TableHead className="text-majorelleBlue font-semibold">
              Chi tiết
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <React.Fragment key={bill.id}>
                <TableRow
                  className="border-b border-majorelleBlue20 hover:bg-majorelleBlue/5 cursor-pointer"
                  onClick={() =>
                    setExpandedBillId(
                      expandedBillId === bill.id ? null : bill.id
                    )
                  }
                >
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.courseTitle}</TableCell>
                  <TableCell className="text-beautyGreen font-semibold">
                    {formatPrice(bill.amount)}
                  </TableCell>
                  <TableCell className="flex items-center gap-2 text-darkSilver dark:text-lightSilver">
                    <Calendar size={16} />
                    {new Date(bill.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        bill.status === "completed"
                          ? "bg-beautyGreen20 text-beautyGreen border-beautyGreen"
                          : "bg-redPigment/20 text-redPigment border-redPigment"
                      }`}
                    >
                      {bill.status === "completed" ? "Hoàn tất" : bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expandedBillId === bill.id ? (
                      <ChevronUp size={16} className="text-majorelleBlue" />
                    ) : (
                      <ChevronDown size={16} className="text-majorelleBlue" />
                    )}
                  </TableCell>
                </TableRow>
                {expandedBillId === bill.id && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-majorelleBlue/5 p-4">
                      <BillDetails bill={bill} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-darkSilver dark:text-lightSilver py-8"
              >
                Không tìm thấy hóa đơn nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BillsTable;
