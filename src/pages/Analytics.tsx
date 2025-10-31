
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Users, FileText, MessageSquare, Scale, BookOpen, Calendar, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// More accurate Nepali legal context data
const constitutionUsageData = [
  { month: "Baisakh", queries: 450, articles: 89, nepaliMonth: "April-May" },
  { month: "Jestha", queries: 520, articles: 112, nepaliMonth: "May-June" },
  { month: "Ashadh", queries: 380, articles: 95, nepaliMonth: "June-July" },
  { month: "Shrawan", queries: 610, articles: 145, nepaliMonth: "July-August" },
  { month: "Bhadra", queries: 720, articles: 168, nepaliMonth: "August-September" },
  { month: "Ashwin", queries: 890, articles: 203, nepaliMonth: "September-October" }
];

const legalCategoriesData = [
  { 
    name: "Constitutional Law", 
    nameNepali: "संवैधानिक कानून",
    value: 28, 
    color: "#8B5CF6",
    queries: 1230,
    description: "Questions related to Nepal's Constitution"
  },
  { 
    name: "Civil Rights", 
    nameNepali: "नागरिक अधिकार",
    value: 22, 
    color: "#06B6D4",
    queries: 967,
    description: "Fundamental rights and freedoms"
  },
  { 
    name: "Criminal Law", 
    nameNepali: "फौजदारी कानून",
    value: 18, 
    color: "#10B981",
    queries: 792,
    description: "Crime and punishment related laws"
  },
  { 
    name: "Property Law", 
    nameNepali: "सम्पत्ति कानून",
    value: 15, 
    color: "#F59E0B",
    queries: 660,
    description: "Land and property rights"
  },
  { 
    name: "Family Law", 
    nameNepali: "पारिवारिक कानून",
    value: 12, 
    color: "#EF4444",
    queries: 528,
    description: "Marriage, divorce and children"
  },
  { 
    name: "Others", 
    nameNepali: "अन्य",
    value: 5, 
    color: "#8E44AD",
    queries: 220,
    description: "Other legal topics"
  }
];

const documentAccessData = [
  { day: "Sunday", dayNepali: "आइतवार", uploads: 8, downloads: 34, views: 156, activeUsers: 45 },
  { day: "Monday", dayNepali: "सोमवार", uploads: 22, downloads: 67, views: 298, activeUsers: 89 },
  { day: "Tuesday", dayNepali: "मंगलवार", uploads: 18, downloads: 55, views: 234, activeUsers: 76 },
  { day: "Wednesday", dayNepali: "बुधवार", uploads: 25, downloads: 72, views: 345, activeUsers: 102 },
  { day: "Thursday", dayNepali: "बिहिवार", uploads: 20, downloads: 58, views: 267, activeUsers: 83 },
  { day: "Friday", dayNepali: "शुक्रवार", uploads: 35, downloads: 89, views: 412, activeUsers: 134 },
  { day: "Saturday", dayNepali: "शनिवार", uploads: 12, downloads: 41, views: 189, activeUsers: 62 }
];

const userEngagementData = [
  { time: "06:00", users: 23, timeNepali: "6 AM" },
  { time: "09:00", users: 67, timeNepali: "9 AM" },
  { time: "12:00", users: 134, timeNepali: "12 PM" },
  { time: "15:00", users: 156, timeNepali: "3 PM" },
  { time: "18:00", users: 189, timeNepali: "6 PM" },
  { time: "21:00", users: 98, timeNepali: "9 PM" },
  { time: "00:00", users: 45, timeNepali: "Midnight" }
];

const topDocumentsData = [
  { name: "Constitution of Nepal 2072", type: "Constitution", downloads: 2340, views: 12500 },
  { name: "Citizenship Act 2063", type: "Act", downloads: 1890, views: 9800 },
  { name: "Muluki Criminal Code 2074", type: "Code", downloads: 1650, views: 8900 },
  { name: "Local Government Operation Act 2074", type: "Act", downloads: 1420, views: 7600 },
  { name: "Labor Act 2074", type: "Act", downloads: 1280, views: 6800 }
];

const chartConfig = {
  queries: { label: "Queries", color: "#8B5CF6" },
  articles: { label: "Articles", color: "#06B6D4" },
  uploads: { label: "Uploads", color: "#10B981" },
  downloads: { label: "Downloads", color: "#F59E0B" },
  views: { label: "Views", color: "#EF4444" },
  users: { label: "Active Users", color: "#8B5CF6" }
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("6months");
  const [showNepali, setShowNepali] = useState(false);

  const StatCard = ({ title, value, change, icon: Icon, description, subtitle }: any) => (
    <Card className="card-glassmorphism hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-asklegal-text/80">{title}</CardTitle>
        <Icon className="h-4 w-4 text-asklegal-purple group-hover:scale-110 transition-transform" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-asklegal-heading">{value}</div>
        {subtitle && <div className="text-sm text-asklegal-text/60 mb-1">{subtitle}</div>}
        <p className="text-xs text-asklegal-text/60">
          <span className={`${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          {' '}{description}
        </p>
      </CardContent>
    </Card>
  );

  const handleCategoryClick = (data: any) => {
    setSelectedCategory(data.name);
  };

  const resetCategorySelection = () => {
    setSelectedCategory(null);
  };

  const handleExportData = () => {
    console.log("Exporting analytics data...");
    // Simulate export functionality
    const data = {
      constitution_usage: constitutionUsageData,
      categories: legalCategoriesData,
      documents: documentAccessData,
      engagement: userEngagementData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-analytics-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-asklegal-heading">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'queries' && ' queries'}
              {entry.dataKey === 'articles' && ' articles'}
              {entry.dataKey === 'downloads' && ' downloads'}
              {entry.dataKey === 'views' && ' views'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="mb-8 animate-fade-in flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-asklegal-heading mb-2">
              Legal Analytics Dashboard
            </h1>
            <p className="text-asklegal-text/70">
              Comprehensive insights into legal document usage and user engagement
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowNepali(!showNepali)}
            >
              {showNepali ? 'English' : 'नेपाली'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{animationDelay: "0.1s"}}>
          <StatCard
            title="Total Queries"
            value="4,397"
            subtitle="Legal Questions Asked"
            change={18.5}
            icon={MessageSquare}
            description="from last month"
          />
          <StatCard
            title="Active Users"
            value="789"
            subtitle="Monthly Active Users"
            change={12.3}
            icon={Users}
            description="from last week"
          />
          <StatCard
            title="Legal Documents"
            value="234"
            subtitle="Available Documents"
            change={8.7}
            icon={FileText}
            description="from last month"
          />
          <StatCard
            title="Constitution Articles"
            value="812"
            subtitle="Articles Accessed"
            change={25.4}
            icon={Scale}
            description="this month"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in" style={{animationDelay: "0.2s"}}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glassmorphism">
                <CardHeader>
                  <CardTitle className="text-asklegal-heading">Constitution Usage Trends</CardTitle>
                  <CardDescription className="text-asklegal-text/70">
                    Monthly queries and articles accessed ({timeRange === '6months' ? '6 months' : timeRange})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={constitutionUsageData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey={showNepali ? "nepaliMonth" : "month"} 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <ChartTooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="queries"
                          stackId="1"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.6}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="articles"
                          stackId="1"
                          stroke="#06B6D4"
                          fill="#06B6D4"
                          fillOpacity={0.6}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="card-glassmorphism">
                <CardHeader>
                  <CardTitle className="text-asklegal-heading flex items-center justify-between">
                    Legal Category Distribution
                    {selectedCategory && (
                      <Button variant="outline" size="sm" onClick={resetCategorySelection}>
                        Show All
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription className="text-asklegal-text/70">
                    Distribution of queries by legal category
                    {selectedCategory && (
                      <div className="mt-2 p-2 bg-asklegal-purple/10 rounded text-sm">
                        Selected: {selectedCategory}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={legalCategoriesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          onClick={handleCategoryClick}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          className="cursor-pointer"
                        >
                          {legalCategoriesData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke={selectedCategory === entry.name ? "#000" : "none"}
                              strokeWidth={selectedCategory === entry.name ? 2 : 0}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
                                  <p className="font-medium text-asklegal-heading">{data.name}</p>
                                  <p className="text-sm text-asklegal-text/70">{showNepali ? data.nameNepali : data.name}</p>
                                  <p className="text-sm">{data.queries} queries ({data.value}%)</p>
                                  <p className="text-xs text-asklegal-text/60 mt-1">{data.description}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="card-glassmorphism">
              <CardHeader>
                <CardTitle className="text-asklegal-heading">Document Activity</CardTitle>
                <CardDescription className="text-asklegal-text/70">
                  Weekly document uploads, downloads and views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={documentAccessData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey={showNepali ? "dayNepali" : "day"} />
                      <YAxis />
                      <ChartTooltip content={<CustomTooltip />} />
                      <Bar dataKey="uploads" fill="#10B981" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="downloads" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="views" fill="#EF4444" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="card-glassmorphism">
              <CardHeader>
                <CardTitle className="text-asklegal-heading">User Engagement</CardTitle>
                <CardDescription className="text-asklegal-text/70">
                  Active users throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey={showNepali ? "timeNepali" : "time"} />
                      <YAxis />
                      <ChartTooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {legalCategoriesData.map((category, index) => (
                <Card key={category.name} className="card-glassmorphism hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-asklegal-heading flex items-center gap-2">
                      <BookOpen className="h-5 w-5" style={{ color: category.color }} />
                      <div>
                        <div>{category.name}</div>
                        <div className="text-sm font-normal text-asklegal-text/60">{showNepali ? category.nameNepali : category.name}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-asklegal-heading mb-2">{category.value}%</div>
                    <div className="w-full bg-asklegal-form-border/20 rounded-full h-2 mb-3">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${category.value}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    <p className="text-sm text-asklegal-text/70 mb-2">
                      {category.queries} queries this month
                    </p>
                    <p className="text-xs text-asklegal-text/60">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <Card className="card-glassmorphism">
              <CardHeader>
                <CardTitle className="text-asklegal-heading">Popular Documents</CardTitle>
                <CardDescription className="text-asklegal-text/70">
                  Most viewed and downloaded legal documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDocumentsData.map((doc, index) => (
                    <div key={doc.name} className="flex items-center justify-between p-4 bg-asklegal-form-bg/50 rounded-lg hover:bg-asklegal-form-bg/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-asklegal-purple/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-asklegal-purple">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-asklegal-heading">{doc.name}</h4>
                          <p className="text-sm text-asklegal-text/60">{doc.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-asklegal-heading">{doc.downloads.toLocaleString()} downloads</div>
                        <div className="text-xs text-asklegal-text/60">{doc.views.toLocaleString()} views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
