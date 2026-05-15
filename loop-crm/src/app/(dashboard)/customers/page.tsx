"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  Calendar,
  Edit2,
  Trash2,
  X,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn, formatDate, getStatusColor } from "@/lib/utils"
import { useCustomers, Customer } from "@/lib/hooks/use-customers"
import { useToast } from "@/lib/hooks/use-toast"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function CustomersPage() {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    phone: "",
    product_service: "",
    notes: "",
    next_followup: "",
    status: "active" as "active" | "pending" | "inactive",
  })

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.product_service?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === "all" || customer.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [customers, searchQuery, filterStatus])

  const handleAddCustomer = async () => {
    const { error } = await addCustomer({
      full_name: newCustomer.full_name,
      phone: newCustomer.phone,
      product_service: newCustomer.product_service || null,
      notes: newCustomer.notes || null,
      next_followup: newCustomer.next_followup ? new Date(newCustomer.next_followup).toISOString() : null,
      status: newCustomer.status,
      last_contacted: new Date().toISOString(),
    })

    if (error) {
      addToast({ title: "Failed to add customer", description: error.message, variant: "error" })
    } else {
      addToast({ title: "Customer added!", variant: "success" })
      setShowAddModal(false)
      setNewCustomer({ full_name: "", phone: "", product_service: "", notes: "", next_followup: "", status: "active" })
    }
  }

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return

    const { error } = await updateCustomer(selectedCustomer.id, {
      full_name: selectedCustomer.full_name,
      phone: selectedCustomer.phone,
      product_service: selectedCustomer.product_service,
      notes: selectedCustomer.notes,
      next_followup: selectedCustomer.next_followup,
      status: selectedCustomer.status,
    })

    if (error) {
      addToast({ title: "Failed to update customer", description: error.message, variant: "error" })
    } else {
      addToast({ title: "Customer updated!", variant: "success" })
      setShowEditModal(false)
      setSelectedCustomer(null)
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    const { error } = await deleteCustomer(id)

    if (error) {
      addToast({ title: "Failed to delete customer", description: error.message, variant: "error" })
    } else {
      addToast({ title: "Customer deleted", variant: "success" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-white/50 mt-1">Manage your customer database</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "pending", "inactive"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Customer List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="cursor-pointer hover:bg-white/5 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    {/* Top Row - Avatar and Name */}
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                          {customer.full_name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">{customer.full_name}</h3>
                        <p className="text-sm text-white/50 truncate">{customer.product_service || "No product"}</p>
                      </div>
                    </div>

                    {/* Status - visible on mobile */}
                    <div className="flex items-center justify-between md:hidden">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <p className="text-xs text-white/40">
                        Next: {customer.next_followup ? formatDate(customer.next_followup) : "Not set"}
                      </p>
                    </div>

                    {/* Actions - Larger touch targets */}
                  <div className="flex gap-2">
                    <div onClick={(e) => e.stopPropagation()}>
                      <WhatsAppButton
                        phone={customer.phone}
                        customerName={customer.full_name}
                        product={customer.product_service || undefined}
                      />
                    </div>
                    <a
                      href={`tel:${customer.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCustomer(customer)
                        setShowEditModal(true)
                      }}
                      className="p-2.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCustomer(customer.id)
                      }}
                      className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </AnimatePresence>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50">No customers found</p>
            {searchQuery && (
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Name *</label>
              <Input
                placeholder="Customer name"
                value={newCustomer.full_name}
                onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Phone *</label>
              <Input
                placeholder="+91 98765 43210"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Product/Service</label>
              <Input
                placeholder="What did they purchase?"
                value={newCustomer.product_service}
                onChange={(e) => setNewCustomer({ ...newCustomer, product_service: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Next Follow-up</label>
              <Input
                type="date"
                value={newCustomer.next_followup}
                onChange={(e) => setNewCustomer({ ...newCustomer, next_followup: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Status</label>
              <select
                className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-white/10 text-white"
                value={newCustomer.status}
                onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value as "active" | "pending" | "inactive" })}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer} disabled={!newCustomer.full_name || !newCustomer.phone}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Name *</label>
                <Input
                  value={selectedCustomer.full_name}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Phone *</label>
                <Input
                  value={selectedCustomer.phone}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Product/Service</label>
                <Input
                  value={selectedCustomer.product_service || ""}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, product_service: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Status</label>
                <select
                  className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-white/10 text-white"
                  value={selectedCustomer.status}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, status: e.target.value as "active" | "pending" | "inactive" })}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); setSelectedCustomer(null) }}>Cancel</Button>
            <Button onClick={handleUpdateCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}