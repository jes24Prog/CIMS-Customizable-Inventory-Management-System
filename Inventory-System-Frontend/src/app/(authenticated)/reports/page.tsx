
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileBarChart, Download, Filter, Calendar, User, DollarSign, 
  BarChart3, PieChart, LineChart, FileText,
  PhilippinePeso
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart as ReChartPie, Pie, Cell, LineChart as ReChartLine, Line
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { formatCurrency, exportToCSV, exportToPDF } from '@/utils/exportUtils';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { reportsRepository } from '@/lib/reports-repository';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsPage: React.FC = () => {
  const [overviewStats, setOverviewStats] = useState({ totalRevenue: 0, totalOrders: 0, activeCustomers: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const fetchOverviewStats = useCallback(() => {
    setIsStatsLoading(true);
    try {
      const data = reportsRepository.getOverview();
      if (data.overviewStats) {
        setOverviewStats(data.overviewStats);
      }
    } catch (error) {
       toast.error(`Failed to load overview statistics.`);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchReportData = useCallback(() => {
    setIsLoading(true);
    setReportData(null);
    try {
      let data;
      switch (reportType) {
        case 'overview':
          data = reportsRepository.getOverview();
          break;
        case 'stock':
          data = reportsRepository.getStock();
          break;
        case 'sales':
          data = reportsRepository.getSales();
          break;
        case 'financial':
          data = reportsRepository.getFinancial();
          break;
        default:
          throw new Error(`Invalid report type: ${reportType}`);
      }
      setReportData(data);
    } catch (error) {
      toast.error(`Failed to load ${reportType} report.`);
    } finally {
      setIsLoading(false);
    }
  }, [reportType]);


  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  useEffect(() => {
    fetchOverviewStats();

    const handleStorageChange = () => {
      fetchOverviewStats();
      fetchReportData();
    };

    window.addEventListener('cims-items-storage', handleStorageChange);
    window.addEventListener('cims-orders-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('cims-items-storage', handleStorageChange);
      window.removeEventListener('cims-orders-storage', handleStorageChange);
    };

  }, [fetchOverviewStats, fetchReportData]);

  const handleTabChange = (newType: string) => {
    setReportType(newType);
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-muted-foreground mt-1">
            Total: <span className="font-medium">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
  
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground mt-1">
            Revenue: <span className="font-medium">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
  
    return null;
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    let data;
    let filename;
    switch (reportType) {
      case 'stock':
        data = reportData.inventoryData;
        filename = 'inventory_report';
        break;
      case 'sales':
        data = reportData.salesTransactionData;
        filename = 'sales_report';
        break;
      case 'financial':
         data = reportData.salesData.map((item: any) => ({
          month: item.month,
          revenue: item.total
        }));
        filename = 'financial_report'
        break;
      default:
        data = reportData.topSellingItems;
        filename = 'overview_report';
    }
    if (data && data.length > 0) {
      exportToCSV(data, filename);
    } else {
      toast.info("No data available to export.");
    }
  };

  const handleExportPDF = () => {
    const elementId = `${reportType}-report`;
    exportToPDF(elementId, `${reportType}_report`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and generate inventory reports
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <div className="text-2xl font-bold">{isStatsLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(overviewStats.totalRevenue)}</div>
                {/* <p className="text-xs text-green-500 mt-1">↑ 12.5% from last period</p> */}
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PhilippinePeso className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <div className="text-2xl font-bold">{isStatsLoading ? <Skeleton className="h-8 w-10" /> : overviewStats.totalOrders}</div>
                {/* <p className="text-xs text-green-500 mt-1">↑ 10% from last period</p> */}
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <div className="text-2xl font-bold">{isStatsLoading ? <Skeleton className="h-8 w-10" /> : overviewStats.activeCustomers}</div>
                {/* <p className="text-xs text-green-500 mt-1">↑ 5% from last period</p> */}
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <User className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : !reportData ? (
          <Card className="mt-6 p-12 flex items-center justify-center">
            <p className="text-muted-foreground">Could not load report data.</p>
          </Card>
        ) : (
        <>
        <TabsContent value="overview" className="mt-6" id="overview-report">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportData.salesData && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={reportData.salesData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                        tickFormatter={(value) => `₱${value/1000}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="total"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>
                  Distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportData.categoryData && (
                <div className="h-80 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartPie>
                      <Pie
                        data={reportData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.categoryData.map((entry:any, index:number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend />
                    </ReChartPie>
                  </ResponsiveContainer>
                </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Items with highest sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topSellingItems && reportData.topSellingItems.map((item:any, index:number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(item.revenue)}</p>
                        <p className="text-xs text-muted-foreground">{item.sold} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Customers with highest order value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topCustomers && reportData.topCustomers.map((customer:any, index:number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.orders} orders</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(customer.spent)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="stock" className="mt-6">
          <Card id="stock-report">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock Inventory Report</CardTitle>
                <CardDescription>
                  Current inventory status and valuation
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Stock Level</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.inventoryData && reportData.inventoryData.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={item.stock > 30 ? "default" : item.stock > 10 ? "outline" : "destructive"}>
                            {item.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {reportData.inventoryData && (
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items: {reportData.inventoryData.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Stock Value: {formatCurrency(reportData.inventoryData.reduce((sum:number, item:any) => sum + item.value, 0))}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="mt-6">
          <Card id="sales-report">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Transactions Report</CardTitle>
                <CardDescription>
                  Recent sales transactions and revenue
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.from && !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="techstart">TechStart Inc</SelectItem>
                    <SelectItem value="global">Global Solutions</SelectItem>
                    <SelectItem value="modern">Modern Office</SelectItem>
                    <SelectItem value="city">City Schools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.salesTransactionData && reportData.salesTransactionData.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.item}</TableCell>
                        <TableCell className="text-center">{transaction.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {reportData.salesTransactionData && (
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions: {reportData.salesTransactionData.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Revenue: {formatCurrency(reportData.salesTransactionData.reduce((sum:number, item:any) => sum + item.total, 0))}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-6">
          <Card id="financial-report">
            <CardHeader>
              <CardTitle>Financial Summary Report</CardTitle>
              <CardDescription>
                Revenue, costs, and profit analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData.salesData && reportData.financialSummary && (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartLine
                        data={reportData.salesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `₱${value/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          name="Revenue"
                          stroke="hsl(var(--primary))"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          name="Costs"
                          stroke="hsl(var(--destructive))"
                        />
                      </ReChartLine>
                    </ResponsiveContainer>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(reportData.financialSummary.totalRevenue)}</div>
                      {/* <p className="text-xs text-green-500 mt-1">↑ 12.5% from last period</p> */}
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Costs</h3>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(reportData.financialSummary.totalCosts)}</div>
                      {/* <p className="text-xs text-red-500 mt-1">↑ 8.2% from last period</p> */}
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-muted-foreground">Net Profit</h3>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(reportData.financialSummary.netProfit)}</div>
                      {/* <p className="text-xs text-green-500 mt-1">↑ 18.7% from last period</p> */}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </>
        )}
      </Tabs>
    </div>
  );
};

export default ReportsPage;
