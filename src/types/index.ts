export type PlanStatus = 'draft' | 'pending' | 'approved' | 'shipping' | 'completed';
export type GiftType = 'physical' | 'ecard' | 'custom';
export type GiftTier = 'standard' | 'premium' | 'luxury';
export type DesignStatus = 'pending' | 'approved' | 'rejected';
export type LogisticsStatus = 'shipped' | 'in_transit' | 'delivered' | 'exception';
export type CustomerLevel = 'A' | 'B' | 'C';

export interface PlanGift {
  giftId: string;
  giftName: string;
  tier: GiftTier;
  quantity: number;
  unitPrice: number;
  customized: boolean;
}

export interface PurchasePlan {
  id: string;
  name: string;
  festival: string;
  status: PlanStatus;
  budget: number;
  actualCost: number;
  createdAt: string;
  deadline: string;
  description: string;
  gifts: PlanGift[];
  employeeCount: number;
  progress: number;
}

export interface Gift {
  id: string;
  name: string;
  type: GiftType;
  category: string;
  price: number;
  supplierId: string;
  supplierName: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  customizable: boolean;
  rating: number;
  tags: string[];
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive';
  categories: string[];
  cooperateSince: string;
  quoteCount: number;
}

export interface Quotation {
  id: string;
  supplierId: string;
  supplierName: string;
  giftName: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  deliveryDays: number;
  minOrderQty: number;
  sampleAvailable: boolean;
  festival?: string;
  giftType?: string;
}

export interface Address {
  province: string;
  city: string;
  district: string;
  detail: string;
  zipCode: string;
  receiverName: string;
  receiverPhone: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  level: string;
  email: string;
  phone: string;
  address: Address | null;
  addressComplete: boolean;
  avatar: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  remindDays: number;
}

export interface GiftRecord {
  id: string;
  date: string;
  occasion: string;
  giftName: string;
  giftValue: number;
  feedback: string;
  feedbackRating: number;
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  birthday: string;
  importantDates: ImportantDate[];
  tags: string[];
  level: CustomerLevel;
  avatar: string;
  giftRecords: GiftRecord[];
  totalGiftValue: number;
}

export interface DesignDraft {
  id: string;
  planId: string;
  planName: string;
  version: string;
  status: DesignStatus;
  imageUrl: string;
  submitter: string;
  submitTime: string;
  reviewer?: string;
  reviewTime?: string;
  reviewComment?: string;
}

export interface InventoryItem {
  id: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  quantity: number;
  minThreshold: number;
  location: string;
  lastUpdated: string;
}

export interface StockRecord {
  id: string;
  type: 'in' | 'out';
  giftId: string;
  giftName: string;
  quantity: number;
  operator: string;
  reason: string;
  time: string;
}

export interface TrackingEvent {
  time: string;
  status: string;
  location: string;
  description: string;
}

export interface LogisticsOrder {
  id: string;
  planId: string;
  planName: string;
  trackingNumber: string;
  carrier: string;
  status: LogisticsStatus;
  recipientName: string;
  recipientAddress: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingHistory: TrackingEvent[];
}

export interface TodoItem {
  id: string;
  title: string;
  type: 'plan' | 'design' | 'delivery' | 'inventory';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  status: 'pending' | 'done';
}

export interface FestivalCountdown {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  icon: string;
}
