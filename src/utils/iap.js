import * as InAppPurchases from "expo-in-app-purchases";
import { IAP_PRODUCTS } from "../config/iapProducts";

/**
 * Connect to Apple IAP service
 */
export async function iapConnect() {
  await InAppPurchases.connectAsync();
}

/**
 * Disconnect from IAP service
 */
export async function iapDisconnect() {
  await InAppPurchases.disconnectAsync();
}

/**
 * Find a product from App Store by backend planId
 */
export async function iapGetProductByPlan(planId) {
  const mapping = IAP_PRODUCTS.find((p) => p.planId === planId);
  if (!mapping) throw new Error(`No IAP mapping found for planId ${planId}`);

  const { responseCode, results } = await InAppPurchases.getProductsAsync(
    [mapping.productId]
  );

  if (responseCode !== InAppPurchases.IAPResponseCode.OK) {
    throw new Error("Failed to load products from App Store.");
  }

  return results.find((r) => r.productId === mapping.productId);
}

/**
 * Set purchase listener
 * @param {*} onSuccess - callback when purchase is successful
 * @param {*} onFail - callback when purchase fails
 */
export function iapListen(onSuccess, onFail) {
  return InAppPurchases.setPurchaseListener(
    ({ responseCode, results, errorCode }) => {
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        results.forEach(async (purchase) => {
          if (!purchase.acknowledged) {
            onSuccess && onSuccess(purchase);
            await InAppPurchases.finishTransactionAsync(purchase, true);
          }
        });
      } else {
        onFail && onFail(errorCode || responseCode);
      }
    }
  );
}
