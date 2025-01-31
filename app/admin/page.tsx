import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { HomeIcon, UserIcon, CalendarIcon, PlusCircleIcon, ListIcon, MailIcon } from 'lucide-react'
import Layout from '@/components/Layout'
import AdminLayout from '@/components/Adminlayout'

export default function AdminDashboard() {
  const navItems = [
    { title: 'Houses', icon: HomeIcon, links: [
      { title: 'View All Houses', href: '/admin/houses' },
      { title: 'Add New House', href: '/admin/houses/add' },
    ]},
    { title: 'Users', icon: UserIcon, links: [
      { title: 'View All Users', href: '/admin/users' },
      { title: 'Add New User', href: '/admin/users/add' },
    ]},
    { title: 'Bookings', icon: CalendarIcon, links: [
      { title: 'View All Bookings', href: '/admin/bookings' },
      { title: 'Add New Booking', href: '/admin/bookings/add' },
    ]},
    { title: 'Email', icon: MailIcon, links: [
      { title: 'Send Bulk Email', href: '/admin/email' },
    ]},
  ]

  return (
    <AdminLayout>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {navItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {item.links.map((link, linkIndex) => (
              <Link key={linkIndex} href={link.href}>
                <Button variant="ghost" className="w-full justify-start">
                  {link.title}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
    </AdminLayout>
  )
}

