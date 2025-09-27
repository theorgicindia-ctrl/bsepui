// Map backend Plan IDs to App Store product IDs
// Make sure productId matches exactly with App Store Connect
export const IAP_PRODUCTS = [
  {
    planId: 1, // backend Plan Id
    productId: "com.yourcompany.yourapp.plan.basic",
    type: "SUBSCRIPTION",
  },
  {
    planId: 2,
    productId: "com.yourcompany.yourapp.plan.premium",
    type: "SUBSCRIPTION",
  },
];
