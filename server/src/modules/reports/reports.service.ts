import { Injectable } from '@nestjs/common';
import {
  endOfDay,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { PrismaService } from 'src/prisma.service';

export interface DailyActivityRow {
  stt: number;
  savingsTypeName: string;
  totalDeposit: number;
  totalWithdrawal: number;
  difference: number;
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDailyActivity(date: string) {
    // TODO 1: Xác định khoảng thời gian (startDate, endDate) của tháng cần báo cáo
    const startDate = startOfDay(parseISO(date));
    const endDate = endOfDay(parseISO(date));

    // TODO 2: Query tất cả transaction trong khoảng thời gian đó
    const transactions = await this.prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        savingsBook: {
          include: {
            savingsType: true,
          },
        },
      },
      orderBy: {
        savingsBook: {
          savingsType: {
            name: 'asc',
          },
        },
      },
    });

    // TODO 3: Group by date + savingsType
    //         - Tổng Thu = sum amount của INITIAL_DEPOSIT + DEPOSIT
    //         - Tổng Chi = sum amount của WITHDRAWAL
    //         - Chênh Lệch = Tổng Thu - Tổng Chi
    const groupMap = new Map<string, DailyActivityRow>();

    for (const tx of transactions) {
      const savingsTypeName = tx.savingsBook.savingsType.name;

      if (!groupMap.has(savingsTypeName)) {
        groupMap.set(savingsTypeName, {
          stt: 0, // gán sau
          savingsTypeName,
          totalDeposit: 0,
          totalWithdrawal: 0,
          difference: 0,
        });
      }

      const row = groupMap.get(savingsTypeName);
      if (tx.type === 'INITIAL_DEPOSIT' || tx.type === 'DEPOSIT') {
        row.totalDeposit += tx.amount;
      } else if (tx.type === 'WITHDRAWAL') {
        row.totalWithdrawal += tx.amount;
      }

      row.difference = row.totalDeposit - row.totalWithdrawal;
    }

    // TODO 4: Flatten map thành array, sort theo date asc
    //         Thêm STT theo từng ngày (reset về 1 mỗi ngày mới)
    const rows = Array.from(groupMap.values()).map((row, index) => ({
      ...row,
      stt: index + 1,
    }));

    // TODO 5: Return
    return {
      date,
      rows,
    };
  }

  async getMonthlyBooks(savingsTypeId: number, month: number, year: number) {
    // TODO 1: Xác định startDate, endDate của tháng
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    // TODO 2: Query SavingsBook được mở trong tháng đó
    //         where: openDate trong khoảng, savingsTypeId khớp
    //         → group by ngày openDate → đếm số sổ mở mỗi ngày
    const openedBooks = await this.prisma.savingsBook.findMany({
      where: {
        savingsTypeId,
        openDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { savingsType: true },
    });

    // TODO 3: Query SavingsBook được đóng trong tháng đó
    //         where: closeDate trong khoảng, savingsTypeId khớp
    //         → group by ngày closeDate → đếm số sổ đóng mỗi ngày
    const closedBooks = await this.prisma.savingsBook.findMany({
      where: {
        savingsTypeId,
        closeDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { savingsType: true },
    });

    // TODO 4: Group by ngày
    const dayMap = new Map<string, { opened: number; closed: number }>();

    for (const book of openedBooks) {
      const day = format(book.openDate, 'yyyy-MM-dd');
      if (!dayMap.has(day)) dayMap.set(day, { opened: 0, closed: 0 });
      dayMap.get(day).opened += 1;
    }

    for (const book of closedBooks) {
      const day = format(book.closeDate, 'yyyy-MM-dd');
      if (!dayMap.has(day)) dayMap.set(day, { opened: 0, closed: 0 });
      dayMap.get(day).closed += 1;
    }

    // TODO 5: Gán STT, return kèm savingsTypeName + tháng
    const rows = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, { opened, closed }], index) => ({
        stt: index + 1,
        date: day,
        opened,
        closed,
        difference: opened - closed,
      }));

    const savingsType = await this.prisma.savingsType.findUnique({
      where: { id: savingsTypeId },
    });

    return {
      savingsTypeName: savingsType?.name,
      month,
      year,
      rows,
    };
  }
}
