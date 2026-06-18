import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Plans from "@/pages/Plans";
import Gifts from "@/pages/Gifts";
import Customize from "@/pages/Customize";
import Employees from "@/pages/Employees";
import Logistics from "@/pages/Logistics";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import Inventory from "@/pages/Inventory";
import Reports from "@/pages/Reports";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/create" element={<Plans />} />
        <Route path="/plans/:id" element={<Plans />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/gifts/:id" element={<Gifts />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/customize/:id" element={<Customize />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<Customers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/compare" element={<Suppliers />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/unclaimed" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}
