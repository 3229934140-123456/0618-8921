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
  UnclaimedItem,
  SyncStatus,
  SyncRecord,
  GiftFilterState,
  ReviewRecord,
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

const mockUnclaimedList: UnclaimedItem[] = [
  { id: 'u1', name: '张伟', dept: '技术部', gift: '端午臻品粽子礼盒', tier: 'premium', date: '2024-06-01', reason: '出差中', reminded: false, remindTime: null },
  { id: 'u2', name: '李娜', dept: '市场部', gift: '端午臻品粽子礼盒', tier: 'standard', date: '2024-06-01', reason: '请假', reminded: false, remindTime: null },
  { id: 'u3', name: '王芳', dept: '设计部', gift: '定制logo保温杯', tier: 'standard', date: '2024-06-02', reason: '地址不详', reminded: false, remindTime: null },
  { id: 'u4', name: '刘强', dept: '销售部', gift: '端午臻品粽子礼盒', tier: 'luxury', date: '2024-06-01', reason: '外派', reminded: false, remindTime: null },
  { id: 'u5', name: '陈静', dept: '人力资源部', gift: '定制logo保温杯', tier: 'premium', date: '2024-06-02', reason: '待领取', reminded: false, remindTime: null },
];

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
  unclaimedList: UnclaimedItem[];
  employeeSyncStatus: SyncStatus;
  employeeSyncHistory: SyncRecord[];
  giftFilterState: GiftFilterState;
  reviewRecords: ReviewRecord[];

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
  remindUnclaimed: (ids: string[]) => string[];
  remindSingleUnclaimed: (id: string) => boolean;

  setGiftFilterState: (state: GiftFilterState) => void;
  addReviewRecord: (record: ReviewRecord) => void;

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
  unclaimedList: [...mockUnclaimedList],
  employeeSyncStatus: {
    syncedCount: 0,
    lastSyncTime: null,
  },
  employeeSyncHistory: [],
  giftFilterState: {
    categoryFilter: '全部',
    typeFilter: 'all',
    searchKeyword: '',
    viewMode: 'grid',
  },
  reviewRecords: [
    {
      id: 'r1',
      planId: 'p1',
      reviewer: '李总监',
      time: '2024-05-20 14:30',
      content: '礼品方案符合预算，供应商资质齐全，建议通过。',
      status: 'approved',
    },
  ],

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
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newRecord: SyncRecord = {
      id: String(Date.now()),
      syncedCount: synced.length,
      syncTime: now,
    };
    set((state) => ({
      employeeSyncStatus: {
        syncedCount: synced.length,
        lastSyncTime: now,
      },
      employeeSyncHistory: [newRecord, ...state.employeeSyncHistory].slice(0, 10),
    }));
    return synced;
  },

  remindUnclaimed: (ids) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    set((state) => ({
      unclaimedList: state.unclaimedList.map((item) =>
        ids.includes(item.id)
          ? { ...item, reminded: true, remindTime: now }
          : item
      ),
    }));
    return ids;
  },

  remindSingleUnclaimed: (id) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    set((state) => ({
      unclaimedList: state.unclaimedList.map((item) =>
        item.id === id
          ? { ...item, reminded: true, remindTime: now }
          : item
      ),
    }));
    return true;
  },

  setGiftFilterState: (filterState) => {
    set({ giftFilterState: filterState });
  },

  addReviewRecord: (record) => {
    set((state) => ({ reviewRecords: [record, ...state.reviewRecords] }));
  },

  addNotification: (msg) =>
    set((state) => ({ notifications: [msg, ...state.notifications].slice(0, 20) })),

  clearNotifications: () => set({ notifications: [] }),
}));
