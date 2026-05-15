"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  Calendar,
  BarChart3,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Total Customers",
    value: "247",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Repeat Customers",
    value: "34%",
    change: "+5%",
    icon: TrendingUp,
  },
  {
    title: "Messages Sent",
    value: "1,847",
    change: "+28%",
    icon: MessageSquare,
  },
  {
    title: "Calls Made",
    value: "892",
    change: "+15%",
    icon: Phone,
  },
]

const monthlyData = [
  { month: "Jan", customers: 45, followups: 120 },
  { month: "Feb", customers: 52, followups: 135 },
  { month: "Mar", customers: 48, followups: 142 },
  { month: "Apr", customers: 61, followups: 158 },
  { month: "May", customers: 55, followups: 145 },
  { month: "Jun", customers: 67, followups: 172 },
]

const topCustomers = [
  { name: "Rajesh Kumar", visits: 12, spent: "$850" },
  { name: "Priya Sharma", visits: 10, spent: "$720" },
  { name: "Amit Patel", visits: 8, spent: "$650" },
  { name: "Sneha Gupta", visits: 7, spent: "$580" },
  { name: "Vikram Singh", visits: 6, spent: "$520" },
]

export default function AnalyticsPage() {
  const maxCustomers = Math.max(...monthlyData.map((d) => d.customers))
  const maxFollowups = Math.max(...monthlyData.map((d) => d.followups))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-white/50 mt-1">Track your business performance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-blue-500/10`}>
                  <stat.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <ArrowUpRight className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-white/50">{stat.title}</p>
              </div>
            </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{data.month}</span>
                    <span className="text-white/50">{data.customers} customers</span>
                  </div>
                  <div className="h-6 bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(data.customers / maxCustomers) * 100}%` }}
                    />
                    <div
                      className="absolute top-0 h-full bg-green-500/50 rounded-full transition-all duration-500"
                      style={{ width: `${(data.followups / maxFollowups) * 100}%`, opacity: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-white/50">New Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-white/50">Follow-ups</span>
              </div>
            </div>
          </CardContent>
        </motion.div>

        {/* Top Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{customer.name}</p>
                      <p className="text-xs text-white/50">{customer.visits} visits</p>
                    </div>
                  </div>
                  <Badge variant="outline">{customer.spent}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </motion.div>
      </div>

      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <CardHeader>
          <CardTitle>Follow-up Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-4xl font-bold text-green-400">89%</p>
              <p className="text-white/50 mt-2">This Month</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-4xl font-bold text-blue-400">85%</p>
              <p className="text-white/50 mt-2">Last Month</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-4xl font-bold text-purple-400">+4%</p>
              <p className="text-white/50 mt-2">Improvement</p>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </div>
  )
}