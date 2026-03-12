import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle, Package, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getFosterParentsPending,
  getInventoryQuantityonHand,
  getAnimalConditionSeverity
} from "@/api/employeeDashboard"
import { getOrders } from "@/api/order"

export default function Dashboard() {
  const [pendingCount, setPendingCount] = useState(0)
  const [lowInventoryCount, setLowInventoryCount] = useState(0)
  const [highSeverityCount, setHighSeverityCount] = useState(0)
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          pendingData,
          inventoryData,
          severityData,
          ordersData
        ] = await Promise.all([
          getFosterParentsPending(),
          getInventoryQuantityonHand(),
          getAnimalConditionSeverity(),
          getOrders()
        ])

        setPendingCount(pendingData.status)
        setLowInventoryCount(inventoryData.quantityOnHand)
        setHighSeverityCount(severityData.animalSeverity)

        // Count orders where orderComplete is false (pending)
        const pending = ordersData.filter(
          (order: { orderComplete: boolean | null }) => !order.orderComplete
        )
        setPendingOrdersCount(pending.length)

      } catch (error) {
        console.error("Error fetching dashboard counts:", error)
      }
    }

    fetchCounts()
  }, [])

  const stats = [
    {
      title: "Foster Parents Pending",
      count: pendingCount,
      description: "Applications waiting for approval",
      icon: Users,
      manage: "/employee-foster-parents-page",
    },
    {
      title: "Low Inventory Items",
      count: lowInventoryCount,
      description: "Supplies running below threshold",
      icon: Package,
      manage: "/employee-inventory-page",
    },
    {
      title: "High Severity Pets",
      count: highSeverityCount,
      description: "Pets requiring urgent attention",
      icon: AlertTriangle,
      manage: "/employee-pets-page",
    },
    {
      title: "Pending Orders",
      count: pendingOrdersCount,
      description: "Supply orders awaiting approval",
      icon: ShoppingCart,
      manage: "/employee-orders-page",
    },
  ]
  return (
    <div className="bg-muted/40 rounded-2xl p-4">
      <div className="max-w-6xl mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full md:grid-rows-2">
          {stats.map((item) => {
            const Icon = item.icon
            return (

              <Card key={item.title} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-5 flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="destructive" className="text-base px-3 py-1 rounded-xl">
                      {item.count}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <Button variant="outline" className="rounded-xl mt-4" onClick={() => navigate(item.manage)}>
                    Manage
                  </Button>
                </CardContent>
              </Card>

            )
          })}
        </div>
      </div>
    </div>
  )
}
