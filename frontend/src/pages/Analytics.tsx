
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Users, FileText, MessageSquare, Scale, BookOpen } from "lucide-react";

// Mock data for legal analytics
const constitutionUsageData = [
  { month: "Jan", queries: 120, articles: 45 },
  { month: "Feb", queries: 180, articles: 62 },
  { month: "Mar", queries: 240, articles: 78 },
  { month: "Apr", queries: 190, articles: 55 },
  { month: "May", queries: 320, articles: 89 },
  { month: "Jun", queries: 410, articles: 102 }
];

const legalCategoriesData = [
  { name: "Constitutional Law", value: 35, color: "#8B5CF6" },
  { name: "Civil Rights", value: 25, color: "#06B6D4" },
  { name: "Criminal Law", value: 20, color: "#10B981" },
  { name: "Administrative Law", value: 12, color: "#F59E0B" },
  { name: "Others", value: 8, color: "#EF4444" }
];

const documentAccessData = [
  { day: "Mon", uploads: 12, downloads: 45, views: 234 },
  { day: "Tue", uploads: 8, downloads: 52, views: 187 },
  { day: "Wed", uploads: 15, downloads: 38, views: 298 },
  { day: "Thu", uploads: 11, downloads: 47, views: 267 },
  { day: "Fri", uploads: 19, downloads: 63, views: 345 },
  { day: "Sat", uploads: 6, downloads: 29, views: 156 },
  { day: "Sun", uploads: 4, downloads: 21, views: 123 }
];

const userEngagementData = [
  { time: "00:00", users: 12 },
  { time: "04:00", users: 8 },
  { time: "08:00", users: 45 },
  { time: "12:00", users: 78 },
  { time: "16:00", users: 92 },
  { time: "20:00", users: 56 },
  { time: "23:59", users: 23 }
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

  const StatCard = ({ title, value, change, icon: Icon, description }: any) => (
    <Card className="card-glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-asklegal-text/80">{title}</CardTitle>
        <Icon className="h-4 w-4 text-asklegal-purple" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-asklegal-heading">{value}</div>
        <p className="text-xs text-asklegal-text/60">
          <span className={`${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          {' '}{description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-asklegal-heading mb-2">Legal Analytics Dashboard</h1>
          <p className="text-asklegal-text/70">Comprehensive insights into legal document usage and user engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{animationDelay: "0.1s"}}>
          <StatCard
            title="Total Queries"
            value="1,462"
            change={12.5}
            icon={MessageSquare}
            description="from last month"
          />
          <StatCard
            title="Active Users"
            value="324"
            change={8.2}
            icon={Users}
            description="from last week"
          />
          <StatCard
            title="Documents"
            value="89"
            change={-2.1}
            icon={FileText}
            description="from last month"
          />
          <StatCard
            title="Constitution Articles"
            value="431"
            change={15.3}
            icon={Scale}
            description="accessed this month"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in" style={{animationDelay: "0.2s"}}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glassmorphism">
                <CardHeader>
                  <CardTitle className="text-asklegal-heading">Constitution Usage Trends</CardTitle>
                  <CardDescription className="text-asklegal-text/70">Monthly queries and articles accessed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={constitutionUsageData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="queries"
                          stackId="1"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="articles"
                          stackId="1"
                          stroke="#06B6D4"
                          fill="#06B6D4"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="card-glassmorphism">
                <CardHeader>
                  <CardTitle className="text-asklegal-heading">Legal Categories Distribution</CardTitle>
                  <CardDescription className="text-asklegal-text/70">Query distribution by legal category</CardDescription>
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
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {legalCategoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
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
                <CardDescription className="text-asklegal-text/70">Weekly document uploads, downloads, and views</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={documentAccessData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="uploads" fill="#10B981" />
                      <Bar dataKey="downloads" fill="#F59E0B" />
                      <Bar dataKey="views" fill="#EF4444" />
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
                <CardDescription className="text-asklegal-text/70">Active users throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
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
                <Card key={category.name} className="card-glassmorphism">
                  <CardHeader>
                    <CardTitle className="text-asklegal-heading flex items-center gap-2">
                      <BookOpen className="h-5 w-5" style={{ color: category.color }} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-asklegal-heading mb-2">{category.value}%</div>
                    <div className="w-full bg-asklegal-form-border/20 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${category.value}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    <p className="text-sm text-asklegal-text/70 mt-2">
                      {Math.round((category.value / 100) * 1462)} queries this month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
