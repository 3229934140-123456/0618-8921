import { create } from 'zustand';
import type {
  PurchasePlan,
  Gift,
  Supplier,
  Quotation,
  Employee,
  Customer,
  DesignDraft,
  InventoryItem,
  StockRecord,
  LogisticsOrder,
  TodoItem,
  FestivalCountdown,
  GiftRecord,
  PlanGift,
  PlanStatus,
  DesignStatus,
} from '../types';
import { mockPlans } from '../data/mockPlans';
import { mockGifts } from '../data/mockGifts';
import { mockSuppliers, mockQuotations } from '../data/mockSuppliers';
import { mockEmployees } from '../data/mockEmployees';
import { mockCustomers } from '../data/mockCustomers';
import {
  mockDesignDrafts,
  mockInventory,
  mockStockRecords,
  mockLogistics,
  mockTodos,
  mockFestivals,
} from '../data/mockMisc';

interface AppState {
  plans: PurchasePlan[];
  gifts: Gift[];
  suppliers: Supplier[];
  quotations: Quotation[];
  employees: Employee[];
  customers: Customer[];
  designDrafts: DesignDraft[];
  inventory: InventoryItem[];
  stockRecords: StockRecord[];
  logistics: LogisticsOrder[];
  todos: TodoItem[];
  festivals: FestivalCountdown[];
  notifications: string[];

  addPlan: (plan: PurchasePlan) => void;
  updatePlan: (id: string, updates: Partial<PurchasePlan>) => void;
  updatePlanStatus: (id: string, status: PlanStatus) => void;

  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addGiftRecord: (customerId: string, record: GiftRecord) => void;

  addSupplier: (supplier: Supplier) => void;

  addDesignDraft: (draft: DesignDraft) => void;
  updateDesignDraft: (id: string, updates: Partial<DesignDraft>) => void;

  addInventoryItem: (item: InventoryItem) => void;
  updateInventory: (id: string, updates: Partial<InventoryItem>) => void;
  addStockRecord: (record: StockRecord) => void;

  syncEmployeesToSupplier: () => string[];
  remindUnclaimed: (names: string[]) => string[];

  addNotification: (msg: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  plans: [...mockPlans],
  gifts: [...mockGifts],
  suppliers: [...mockSuppliers],
  quotations: [...mockQuotations],
  employees: [...mockEmployees],
  customers: [...mockCustomers],
  designDrafts: [...mockDesignDrafts],
  inventory: [...mockInventory],
  stockRecords: [...mockStockRecords],
  logistics: [...mockLogistics],
  todos: [...mockTodos],
  festivals: [...mockFestivals],
  notifications: [],

  addPlan: (plan) =>
    set((state) => ({ plans: [plan, ...state.plans] })),

  updatePlan: (id, updates) =>
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  updatePlanStatus: (id, status) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              progress:
                status === 'approved' ? 50 :
                status === 'shipping' ? 70 :
                status === 'completed' ? 100 :
                status === 'pending' ? 20 : p.progress,
            }
          : p
      ),
    })),

  addCustomer: (customer) =>
    set((state) => ({ customers: [customer, ...state.customers] })),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  addGiftRecord: (customerId, record) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId
          ? {
              ...c,
              giftRecords: [...c.giftRecords, record],
              totalGiftValue: c.totalGiftValue + record.giftValue,
            }
          : c
      ),
    })),

  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [supplier, ...state.suppliers] })),

  addDesignDraft: (draft) =>
    set((state) => ({ designDrafts: [draft, ...state.designDrafts] })),

  updateDesignDraft: (id, updates) =>
    set((state) => ({
      designDrafts: state.designDrafts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  addInventoryItem: (item) =>
    set((state) => ({ inventory: [...state.inventory, item] })),

  updateInventory: (id, updates) =>
    set((state) => ({
      inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  addStockRecord: (record) =>
    set((state) => {
      const gift = state.inventory.find((i) => i.giftId === record.giftId);
      const newInventory = state.inventory.map((i) => {
        if (i.giftId === record.giftId) {
          const qty =
            record.type === 'in'
              ? i.quantity + record.quantity
              : Math.max(0, i.quantity - record.quantity);
          return { ...i, quantity: qty, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') };
        }
        return i;
      });
      return { inventory: newInventory, stockRecords: [record, ...state.stockRecords] };
    }),

  syncEmployeesToSupplier: () => {
    const synced = get()
      .employees.filter((e) => e.addressComplete)
      .map((e) => e.name);
    return synced;
  },

  remindUnclaimed: (names) => {
    return names;
  },

  addNotification: (msg) =>
    set((state) => ({ notifications: [msg, ...state.notifications].slice(0, 20) })),

  clearNotifications: () => set({ notifications: [] }),
}));
