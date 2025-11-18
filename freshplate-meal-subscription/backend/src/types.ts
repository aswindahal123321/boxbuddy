export type Role = "user" | "admin";

export interface UserRecord {
  pk: string; // USER#<id>
  sk: "PROFILE";
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  gsi1pk: string; // EMAIL#<email>
}

export interface OrderRecord {
  pk: string; // USER#<id>
  sk: string; // ORDER#<orderId>
  orderId: string;
  items: unknown;
  total: number;
  status: string;
  createdAt: string;
  gsi1pk: string; // ORDER#<orderId>
}

export interface SubscriptionRecord {
  pk: string; // USER#<id>
  sk: string; // SUBSCRIPTION#<id>
  subscriptionId: string;
  orderId: string;
  startDate: string;
  endDate: string;
}

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
